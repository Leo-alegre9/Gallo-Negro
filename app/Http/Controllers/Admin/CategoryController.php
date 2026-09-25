<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Support\Audit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Categories', [
            'categories' => Category::with('parent:id,name')->withCount('children')
                ->orderBy('parent_id')->orderBy('sort_order')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['slug'] = $this->uniqueSlug($data['name']);
        DB::transaction(function () use ($data) {
            $category = Category::create($data);
            Audit::record('created', $category, null, $category->toArray());
        });
        return back()->with('success', 'Categoría creada.');
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $data = $this->validated($request, $category);
        if ($category->parent_id !== ($data['parent_id'] ?? null)
            && ($category->children()->exists() || $category->products()->withTrashed()->exists()
                || Product::withTrashed()->where('subcategory_id', $category->id)->exists())) {
            return back()->withErrors(['parent_id' => 'No se puede mover una categoría que ya tiene productos o subcategorías.']);
        }
        DB::transaction(function () use ($category, $data) {
            $before = $category->toArray();
            $category->update($data);
            Audit::record('updated', $category, $before, $category->fresh()->toArray());
        });
        return back()->with('success', 'Categoría actualizada.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($category->children()->exists() || $category->products()->withTrashed()->exists()
            || Product::withTrashed()->where('subcategory_id', $category->id)->exists()) {
            return back()->withErrors(['category' => 'La categoría tiene productos o subcategorías. Primero movelos a otra categoría.']);
        }
        DB::transaction(function () use ($category) {
            $before = $category->toArray();
            $category->delete();
            Audit::record('deleted', $category, $before, null);
        });
        return back()->with('success', 'Categoría eliminada.');
    }

    private function validated(Request $request, ?Category $current = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'parent_id' => ['nullable', 'integer', Rule::exists('categories', 'id')->whereNull('parent_id')],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ]);
        if ($current && (int) ($data['parent_id'] ?? 0) === $current->id) {
            throw ValidationException::withMessages(['parent_id' => 'Una categoría no puede ser su propia subcategoría.']);
        }
        $data['sort_order'] = $data['sort_order'] ?? 0;
        $data['parent_id'] = empty($data['parent_id']) ? null : (int) $data['parent_id'];
        return $data;
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'categoria';
        $slug = $base;
        for ($suffix = 2; Category::where('slug', $slug)->exists(); $suffix++) $slug = $base.'-'.$suffix;
        return $slug;
    }
}
