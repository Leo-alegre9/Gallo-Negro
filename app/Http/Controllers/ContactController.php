<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessage as ContactMail;
use App\Models\ContactMessage;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Throwable;

class ContactController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        // Campo trampa: los bots lo completan, las personas no lo ven.
        if (filled($request->input('website'))) {
            return back()->with('success', 'Recibimos tu consulta.');
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160'],
            'phone' => ['nullable', 'string', 'max:40'],
            'topic' => ['required', Rule::in(array_keys(ContactMessage::TOPICS))],
            'product_id' => ['nullable', 'string', Rule::exists('products', 'id')],
            'message' => ['required', 'string', 'min:10', 'max:2000'],
        ], [], [
            'name' => 'nombre',
            'email' => 'correo',
            'phone' => 'teléfono',
            'topic' => 'motivo',
            'product_id' => 'producto',
            'message' => 'mensaje',
        ]);

        $product = $data['topic'] === 'producto' && !empty($data['product_id'])
            ? Product::visible()->find($data['product_id'])
            : null;

        $inquiry = ContactMessage::create([...$data, 'product_id' => $product?->id]);

        // La consulta ya quedó guardada en el panel; si el correo falla, no se pierde.
        try {
            Mail::to(config('services.contact.email'))->send(new ContactMail(
                name: $inquiry->name,
                email: $inquiry->email,
                phone: $inquiry->phone,
                topic: $inquiry->topicLabel(),
                body: $inquiry->message,
                productName: $product?->name,
                productUrl: $product ? route('products.show', $product->slug) : null,
            ));
        } catch (Throwable $exception) {
            report($exception);
        }

        return back()->with('success', '¡Gracias! Recibimos tu consulta y te respondemos a la brevedad.');
    }
}
