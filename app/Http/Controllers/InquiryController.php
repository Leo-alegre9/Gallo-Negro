<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class InquiryController extends Controller
{
    public function product(Request $request, Product $product): RedirectResponse
    {
        $data = $request->validate(['note' => ['nullable', 'string', 'max:500']]);
        abort_unless(Product::visible()->whereKey($product->id)->exists(), 404);
        $product->load('category');

        DB::table('product_events')->insert(['product_id' => $product->id, 'type' => 'consultation', 'created_at' => now()]);
        $message = implode("\n", array_filter([
            'Hola Gallo Negro, quiero consultar por este producto:',
            $product->name.($product->model ? ' · '.$product->model : ''),
            'Precio: '.$this->money($product->effectivePrice()),
            'Ficha: '.route('products.show', $product->slug),
            'Imagen: '.url(Product::imageUrl($product->primary_image)),
            !empty($data['note']) ? 'Mi consulta: '.$data['note'] : null,
        ]));

        return $this->toWhatsApp($message);
    }

    public function cart(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'items' => ['required', 'json'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);
        $items = json_decode($data['items'], true);
        Validator::make(['items' => $items], [
            'items' => ['required', 'array', 'min:1', 'max:30'],
            'items.*.id' => ['required', 'string', 'distinct', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ])->validate();

        $products = Product::visible()->whereIn('id', collect($items)->pluck('id'))
            ->where('stock_status', '!=', 'out')->get()->keyBy('id');
        abort_unless($products->count() === count($items), 422);

        $lines = ['Hola Gallo Negro, quiero consultar por este pedido:', ''];
        $total = 0;
        foreach ($items as $item) {
            $product = $products[$item['id']];
            $subtotal = $product->effectivePrice() * $item['quantity'];
            $total += $subtotal;
            $lines[] = $item['quantity'].' × '.$product->name.' — '.$this->money($subtotal);
            $lines[] = 'Ficha: '.route('products.show', $product->slug);
            $lines[] = 'Imagen: '.url(Product::imageUrl($product->primary_image));
            $lines[] = '';
            DB::table('product_events')->insert(['product_id' => $product->id, 'type' => 'consultation', 'created_at' => now()]);
        }
        $lines[] = 'Total estimado: '.$this->money($total);
        if (!empty($data['note'])) $lines[] = 'Mi consulta: '.$data['note'];
        $lines[] = '¿Me confirman disponibilidad y opciones de entrega?';

        return $this->toWhatsApp(implode("\n", $lines));
    }

    private function money(int $value): string
    {
        return '$ '.number_format($value, 0, ',', '.');
    }

    private function toWhatsApp(string $message): RedirectResponse
    {
        $number = config('services.whatsapp.number');
        abort_unless(preg_match('/^\d{8,15}$/', $number ?? ''), 503);
        return redirect()->away('https://wa.me/'.$number.'?text='.rawurlencode($message));
    }
}
