<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Support\StorefrontData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StorefrontController extends Controller
{
    public function home(Request $request): Response
    {
        StorefrontData::recordVisit($request);
        $products = StorefrontData::products();

        return Inertia::render('Store', [
            'products' => $products->map->catalogData()->all(),
            'featured' => $products->where('is_featured', true)->take(3)->map->catalogData()->values()->all(),
            'whatsapp' => config('services.whatsapp.number'),
        ]);
    }

    public function catalog(Request $request): Response
    {
        StorefrontData::recordVisit($request);

        return Inertia::render('Catalog', [
            'products' => StorefrontData::products()->map->catalogData()->all(),
            'categories' => StorefrontData::categories(),
            'whatsapp' => config('services.whatsapp.number'),
        ]);
    }

    public function workshop(Request $request): Response
    {
        StorefrontData::recordVisit($request);

        return Inertia::render('Workshop', [
            'products' => StorefrontData::products()->map->catalogData()->all(),
            'whatsapp' => config('services.whatsapp.number'),
        ]);
    }

    public function product(Request $request, string $slug): Response
    {
        $product = Product::visible()->where('slug', $slug)
            ->with(['category', 'subcategory', 'images'])->firstOrFail();
        StorefrontData::recordVisit($request);
        DB::table('product_events')->insert(['product_id' => $product->id, 'type' => 'view', 'created_at' => now()]);

        return Inertia::render('ProductDetail', [
            'product' => $product->catalogData(),
            'products' => StorefrontData::products()->map->catalogData()->all(),
            'whatsapp' => config('services.whatsapp.number'),
        ])->withViewData(['productMeta' => $product->catalogData()]);
    }

    public function viewEvent(Request $request): \Illuminate\Http\Response
    {
        $data = $request->validate(['product_id' => ['required', 'string', 'exists:products,id']]);
        $product = Product::visible()->whereKey($data['product_id'])->firstOrFail();
        DB::table('product_events')->insert(['product_id' => $product->id, 'type' => 'view', 'created_at' => now()]);
        return response()->noContent();
    }

    public function media(string $path)
    {
        abort_if(str_contains($path, '..') || !str_starts_with($path, 'products/'), 404);
        abort_unless(Storage::disk('public')->exists($path), 404);
        return Storage::disk('public')->response($path);
    }
}
