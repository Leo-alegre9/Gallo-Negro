<?php

namespace Tests\Feature;

use App\Mail\ContactMessage;
use App\Models\Product;
use Database\Seeders\CatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactFormTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_form_sends_an_email_to_the_store(): void
    {
        $this->seed(CatalogSeeder::class);
        Mail::fake();
        $product = Product::visible()->first();

        $this->from('/')->post('/consultas/contacto', [
            'name' => 'Ana Gómez',
            'email' => 'ana@example.com',
            'phone' => '11 5555-5555',
            'topic' => 'producto',
            'product_id' => $product->id,
            'message' => 'Quisiera saber si tienen stock y cuánto demora el envío.',
        ])->assertRedirect('/')->assertSessionHas('success');

        Mail::assertSent(ContactMessage::class, function (ContactMessage $mail) use ($product) {
            return $mail->hasTo('ventas@gallonegroba.com.ar')
                && $mail->hasReplyTo('ana@example.com')
                && $mail->productName === $product->name;
        });
    }

    public function test_contact_form_validates_required_fields(): void
    {
        Mail::fake();

        $this->from('/')->post('/consultas/contacto', ['topic' => 'otro', 'email' => 'no-es-correo'])
            ->assertSessionHasErrors(['name', 'email', 'message']);

        Mail::assertNothingSent();
    }

    public function test_contact_form_ignores_bots(): void
    {
        Mail::fake();

        $this->from('/')->post('/consultas/contacto', [
            'name' => 'Bot', 'email' => 'bot@example.com', 'topic' => 'otro',
            'message' => 'Mensaje automático de prueba', 'website' => 'http://spam.test',
        ])->assertRedirect('/');

        Mail::assertNothingSent();
    }
}
