<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use Database\Seeders\CatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CatalogAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CatalogSeeder::class);
    }

    public function test_admin_requires_an_authorized_account(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');
        $this->actingAs(User::factory()->create())->get('/admin')->assertForbidden();
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        foreach (['/admin', '/admin/productos', '/admin/productos/create', '/admin/categorias', '/admin/auditoria'] as $url) {
            $this->get($url)->assertOk();
        }
    }

    public function test_visibility_applies_to_detail_and_inquiries(): void
    {
        $product = Product::first();
        $this->get('/productos/'.$product->slug)->assertOk()->assertSee('property="og:image"', false);
        $product->category->update(['is_active' => false]);
        $this->get('/productos/'.$product->slug)->assertNotFound();
        $this->post('/consultas/productos/'.$product->id)->assertNotFound();
        $this->post('/catalogo/vistas', ['product_id' => $product->id])->assertNotFound();
    }

    public function test_whatsapp_contains_current_price_note_photo_and_link(): void
    {
        $product = Product::first();
        $product->update(['price' => 100000, 'promo_price' => 80000]);
        $response = $this->post('/consultas/pedido', [
            'items' => json_encode([['id' => $product->id, 'quantity' => 2, 'price' => 1]]),
            'note' => 'Lo quiero en negro',
        ])->assertRedirect();
        $location = rawurldecode($response->headers->get('Location'));
        $this->assertStringContainsString('https://wa.me/5491135879396', $location);
        $this->assertStringContainsString('$ 160.000', $location);
        $this->assertStringContainsString('Lo quiero en negro', $location);
        $this->assertStringContainsString('/productos/'.$product->slug, $location);
        $this->assertStringContainsString('Imagen: http', $location);
        $this->assertDatabaseHas('product_events', ['product_id' => $product->id, 'type' => 'consultation']);
        $product->update(['stock_status' => 'out']);
        $this->post('/consultas/pedido', ['items' => json_encode([['id' => $product->id, 'quantity' => 1]])])->assertStatus(422);
    }

    public function test_product_upload_validation_and_audited_lifecycle(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin);
        $existing = Product::first();
        $data = [
            'name' => 'Fogonero de prueba', 'category_id' => $existing->category_id,
            'short_description' => 'Producto de prueba', 'model' => 'GN-100',
            'measurements' => '80 x 80 cm', 'colors_variants' => 'Negro',
            'price' => 100000, 'promo_price' => 85000, 'stock_status' => 'ask',
            'is_active' => true, 'is_featured' => false,
            'primary_image' => new UploadedFile(public_path('images/logo.png'), 'foto.png', 'image/png', null, true),
        ];
        $this->post('/admin/productos', [...$data, 'promo_price' => 120000])->assertSessionHasErrors('promo_price');
        $this->post('/admin/productos', $data)->assertSessionHasNoErrors()->assertRedirect();
        $product = Product::where('name', 'Fogonero de prueba')->firstOrFail();
        Storage::disk('public')->assertExists($product->primary_image);
        $this->get('/media/'.$product->primary_image)->assertOk();
        $this->assertDatabaseHas('admin_audits', ['user_id' => $admin->id, 'entity_id' => $product->id, 'action' => 'created']);
        $this->patch('/admin/productos/'.$product->id.'/estado')->assertRedirect();
        $this->get('/productos/'.$product->slug)->assertNotFound();
        $this->delete('/admin/productos/'.$product->id)->assertRedirect();
        $this->assertSoftDeleted('products', ['id' => $product->id]);
        $this->patch('/admin/productos/'.$product->id.'/restaurar')->assertRedirect();
        $this->assertNotSoftDeleted('products', ['id' => $product->id]);
        $this->assertDatabaseHas('admin_audits', ['user_id' => $admin->id, 'entity_id' => $product->id, 'action' => 'restored']);
    }

    public function test_public_pages_record_visits_but_admin_browsing_does_not(): void
    {
        $this->get('/catalogo')->assertOk();
        $this->assertDatabaseCount('site_visits', 1);
        $this->actingAs(User::factory()->create(['is_admin' => true]))->get('/catalogo')->assertOk();
        $this->assertDatabaseCount('site_visits', 1);
        $this->assertDatabaseHas('site_visits', ['page_views' => 1]);
    }

    public function test_subcategory_assignment_and_hidden_subcategory_are_enforced(): void
    {
        $product = Product::first();
        $child = Category::create(['name' => 'Circular', 'slug' => 'circular', 'parent_id' => $product->category_id, 'is_active' => true]);
        $product->update(['subcategory_id' => $child->id]);
        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin)->put('/admin/categorias/'.$child->id, [
            'name' => 'Circulares', 'parent_id' => (string) $product->category_id, 'is_active' => true,
        ])->assertSessionHasNoErrors();
        $this->assertDatabaseHas('admin_audits', ['user_id' => $admin->id, 'entity_id' => (string) $child->id, 'action' => 'updated']);
        $child->update(['is_active' => false]);
        $this->get('/productos/'.$product->slug)->assertNotFound();
        $this->post('/consultas/productos/'.$product->id)->assertNotFound();
        $other = Category::whereNull('parent_id')->where('id', '!=', $product->category_id)->first();
        $this->put('/admin/productos/'.$product->id, [
            'name' => $product->name, 'category_id' => $other->id, 'subcategory_id' => $child->id,
            'short_description' => 'Descripción', 'price' => 5000, 'stock_status' => 'available',
            'is_active' => true, 'is_featured' => false,
        ])->assertSessionHasErrors('subcategory_id');
    }

    public function test_admin_login_and_logout(): void
    {
        $admin = User::factory()->create(['is_admin' => true, 'password' => bcrypt('TestPassword123!')]);
        $this->post('/admin/login', ['email' => $admin->email, 'password' => 'incorrect'])->assertSessionHasErrors('email');
        $this->assertGuest();
        $this->post('/admin/login', ['email' => $admin->email, 'password' => 'TestPassword123!'])->assertRedirect('/admin');
        $this->assertAuthenticatedAs($admin);
        $this->post('/admin/logout')->assertRedirect('/admin/login');
        $this->assertGuest();
    }
}
