<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactMessagesAdminTest extends TestCase
{
    use RefreshDatabase;

    private function inquiry(array $attributes = []): ContactMessage
    {
        return ContactMessage::create([
            'name' => 'Ana Gómez', 'email' => 'ana@example.com', 'topic' => 'otro',
            'message' => 'Quisiera saber los tiempos de entrega.', ...$attributes,
        ]);
    }

    public function test_inquiries_from_the_form_are_saved_even_if_mail_fails(): void
    {
        Mail::shouldReceive('to')->andThrow(new \RuntimeException('SMTP caído'));

        $this->from('/')->post('/consultas/contacto', [
            'name' => 'Ana Gómez', 'email' => 'ana@example.com', 'topic' => 'medida',
            'message' => 'Necesito una parrilla de 1,20 m.',
        ])->assertRedirect('/')->assertSessionHas('success');

        $this->assertDatabaseHas('contact_messages', ['email' => 'ana@example.com', 'topic' => 'medida', 'read_at' => null]);
    }

    public function test_only_admins_can_see_inquiries(): void
    {
        $this->get('/admin/consultas')->assertRedirect('/admin/login');
        $this->actingAs(User::factory()->create())->get('/admin/consultas')->assertForbidden();
    }

    public function test_admin_can_list_filter_mark_and_delete_inquiries(): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        $unread = $this->inquiry();
        $this->inquiry(['name' => 'Leída', 'read_at' => now()]);

        $this->get('/admin/consultas')->assertOk()->assertInertia(fn ($page) => $page
            ->component('Admin/Messages')
            ->has('messages.data', 2)
            ->where('counts.unread', 1)
            ->where('unreadMessages', 1));

        $this->get('/admin/consultas?filtro=sin-leer')->assertInertia(fn ($page) => $page->has('messages.data', 1)->where('messages.data.0.id', $unread->id));

        $this->patch("/admin/consultas/{$unread->id}", ['read' => true])->assertRedirect();
        $this->assertNotNull($unread->fresh()->read_at);

        $this->patch("/admin/consultas/{$unread->id}", ['read' => false]);
        $this->assertNull($unread->fresh()->read_at);

        $this->delete("/admin/consultas/{$unread->id}")->assertRedirect();
        $this->assertModelMissing($unread);
    }
}
