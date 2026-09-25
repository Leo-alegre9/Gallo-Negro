<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Support\Audit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('estado', 'todos');
        $query = Product::withTrashed()->with(['category:id,name', 'subcategory:id,name']);
        if ($status === 'activos') $query->whereNull('deleted_at')->where('is_active', true);
        if ($status === 'baja') $query->whereNull('deleted_at')->where('is_active', false);
        if ($status === 'eliminados') $query->onlyTrashed();

        return Inertia::render('Admin/Products', [
            'products' => $query->orderByDesc('updated_at')->paginate(20)->withQueryString()->through(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category?->name,
                'subcategory' => $product->subcategory?->name,
                'price' => $product->price,
                'promoPrice' => $product->promo_price,
                'stockStatus' => $product->stock_status,
                'image' => Product::imageUrl($product->primary_image),
                'isActive' => $product->is_active,
                'isDemo' => $product->is_demo,
                'deletedAt' => $product->deleted_at?->toDateTimeString(),
            ]),
            'status' => $status,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/ProductForm', ['categories' => $this->categories()]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request, true);
        $product = DB::transaction(function () use ($request, $data) {
            $product = Product::create([
                ...$this->fields($request, $data),
                'id' => (string) Str::uuid(),
                'slug' => $this->uniqueSlug($data['name']),
                'primary_image' => $request->file('primary_image')->store('products', 'public'),
            ]);
            $this->syncGallery($request, $product, $data);
            Audit::record('created', $product, null, $this->snapshot($product));
            return $product;
        });

        return redirect()->route('admin.products.edit', $product)->with('success', 'Producto creado.');
    }

    public function edit(Product $product): Response
    {
        $product->load(['images', 'category', 'subcategory']);
        return Inertia::render('Admin/ProductForm', [
            'categories' => $this->categories(),
            'product' => [
                ...$product->toArray(),
                'primary_image_url' => Product::imageUrl($product->primary_image),
                'images' => $product->images->map(fn ($image) => [
                    'id' => $image->id, 'url' => Product::imageUrl($image->path),
                ])->all(),
            ],
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $data = $this->validated($request, false);
        DB::transaction(function () use ($request, $product, $data) {
            $before = $this->snapshot($product);
            $fields = $this->fields($request, $data);
            if ($request->hasFile('primary_image')) {
                $fields['primary_image'] = $request->file('primary_image')->store('products', 'public');
            }
            $product->update($fields);
            $this->syncGallery($request, $product, $data);
            Audit::record('updated', $product, $before, $this->snapshot($product));
        });

        return back()->with('success', 'Producto actualizado.');
    }

    public function setActive(Product $product): RedirectResponse
    {
        DB::transaction(function () use ($product) {
        $before = $this->snapshot($product);
        $product->update(['is_active' => !$product->is_active]);
        Audit::record($product->is_active ? 'reactivated' : 'deactivated', $product, $before, $this->snapshot($product));
        });
        return back()->with('success', $product->is_active ? 'Producto activado.' : 'Producto dado de baja.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        DB::transaction(function () use ($product) {
        $before = $this->snapshot($product);
        $product->delete();
        Audit::record('deleted', $product, $before, $this->snapshot($product));
        });
        return back()->with('success', 'Producto eliminado. Podés restaurarlo desde la lista.');
    }

    public function restore(string $id): RedirectResponse
    {
        $product = Product::onlyTrashed()->findOrFail($id);
        DB::transaction(function () use ($product) {
        $before = $this->snapshot($product);
        $product->restore();
        Audit::record('restored', $product, $before, $this->snapshot($product));
        });
        return back()->with('success', 'Producto restaurado.');
    }

    private function validated(Request $request, bool $creating): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'category_id' => ['required', 'integer', Rule::exists('categories', 'id')->whereNull('parent_id')],
            'subcategory_id' => ['nullable', 'integer', 'exists:categories,id'],
            'model' => ['nullable', 'string', 'max:160'],
            'short_description' => ['required', 'string', 'max:1500'],
            'measurements' => ['nullable', 'string', 'max:255'],
            'colors_variants' => ['nullable', 'string', 'max:255'],
            'material' => ['nullable', 'string', 'max:255'],
            'finish' => ['nullable', 'string', 'max:255'],
            'price' => ['required', 'integer', 'min:0'],
            'promo_price' => ['nullable', 'integer', 'min:0', 'lt:price'],
            'stock_status' => ['required', Rule::in(['available', 'ask', 'out'])],
            'tag' => ['nullable', 'string', 'max:100'],
            'is_active' => ['required', 'boolean'],
            'is_featured' => ['required', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'primary_image' => [$creating ? 'required' : 'nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'gallery_images' => ['nullable', 'array', 'max:12'],
            'gallery_images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'gallery_order' => ['sometimes', 'required', 'json'],
            'remove_images' => ['nullable', 'array'],
            'remove_images.*' => ['integer'],
        ]);

        if (!empty($data['subcategory_id']) && !Category::whereKey($data['subcategory_id'])
            ->where('parent_id', $data['category_id'])->exists()) {
            throw ValidationException::withMessages(['subcategory_id' => 'Elegí una subcategoría de la categoría seleccionada.']);
        }
        return $data;
    }

    private function fields(Request $request, array $data): array
    {
        return [
            'name' => $data['name'],
            'category_id' => $data['category_id'],
            'subcategory_id' => $data['subcategory_id'] ?? null,
            'model' => $data['model'] ?? null,
            'short_description' => $data['short_description'],
            'measurements' => $data['measurements'] ?? null,
            'colors_variants' => $data['colors_variants'] ?? null,
            'material' => $data['material'] ?? null,
            'finish' => $data['finish'] ?? null,
            'price' => $data['price'],
            'promo_price' => $data['promo_price'] ?? null,
            'stock_status' => $data['stock_status'],
            'tag' => $data['tag'] ?? null,
            'is_active' => $request->boolean('is_active'),
            'is_featured' => $request->boolean('is_featured'),
            'is_demo' => false,
            'sort_order' => $data['sort_order'] ?? 0,
        ];
    }

    private function syncGallery(Request $request, Product $product, array $data): void
    {
        $existing = $product->images()->get()->keyBy('id');
        $removed = array_map('intval', $data['remove_images'] ?? []);
        if (array_diff($removed, $existing->keys()->all())) {
            throw ValidationException::withMessages(['remove_images' => 'Solo podés quitar fotos de este producto.']);
        }
        $retained = $existing->except($removed);
        $files = array_values($request->file('gallery_images', []));
        $expected = [...$retained->keys()->map(fn ($id) => 'saved:'.$id)->all()];
        foreach ($files as $index => $file) $expected[] = 'new:'.$index;
        $order = isset($data['gallery_order']) ? json_decode($data['gallery_order'], true) : $expected;
        if (!is_array($order) || !array_is_list($order)
            || count($order) !== count($expected)
            || count(array_filter($order, 'is_string')) !== count($order)
            || count(array_unique($order, SORT_REGULAR)) !== count($order)
            || array_diff($order, $expected)) {
            throw ValidationException::withMessages(['gallery_order' => 'La galería cambió o el orden no es válido. Recargá la ficha y revisá las fotos.']);
        }
        $product->images()->whereIn('id', $removed)->delete();
        foreach ($order as $position => $token) {
            [$type, $id] = explode(':', $token, 2);
            if ($type === 'saved') {
                $retained[(int) $id]->update(['sort_order' => $position]);
            } else {
                $product->images()->create(['path' => $files[(int) $id]->store('products', 'public'), 'sort_order' => $position]);
            }
        }
    }

    private function snapshot(Product $product): array
    {
        return [...$product->getAttributes(), 'gallery' => $product->images()->orderBy('sort_order')->pluck('path')->all()];
    }

    private function categories(): array
    {
        return Category::whereNull('parent_id')
            ->with(['children' => fn ($query) => $query->orderBy('name')])
            ->orderBy('sort_order')->orderBy('name')->get()->map(fn ($category) => [
                'id' => $category->id, 'name' => $category->name.($category->is_active ? '' : ' (inactiva)'),
                'subcategories' => $category->children->map(fn ($child) => ['id' => $child->id, 'name' => $child->name.($child->is_active ? '' : ' (inactiva)')])->all(),
            ])->all();
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'producto';
        $slug = $base;
        for ($suffix = 2; Product::withTrashed()->where('slug', $slug)->exists(); $suffix++) $slug = $base.'-'.$suffix;
        return $slug;
    }
}
