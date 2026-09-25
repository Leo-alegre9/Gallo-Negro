<?php

namespace App\Support;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StorefrontData
{
    public static function products()
    {
        return Product::visible()
            ->with(['category', 'subcategory', 'images'])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    public static function categories(): array
    {
        return Category::query()->whereNull('parent_id')->where('is_active', true)
            ->with(['children' => fn ($query) => $query->where('is_active', true)->orderBy('sort_order')->orderBy('name')])
            ->orderBy('sort_order')->orderBy('name')->get()
            ->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'subcategories' => $category->children->map(fn ($child) => [
                    'id' => $child->id, 'name' => $child->name, 'slug' => $child->slug,
                ])->all(),
            ])->all();
    }

    public static function recordVisit(Request $request): void
    {
        if ($request->user()?->is_admin) return;
        $visitorHash = hash_hmac('sha256', $request->session()->getId(), config('app.key'));
        $visitDate = now()->toDateString();
        DB::table('site_visits')->insertOrIgnore([
            'visit_date' => $visitDate,
            'visitor_hash' => $visitorHash,
            'page_views' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('site_visits')->where('visit_date', $visitDate)->where('visitor_hash', $visitorHash)->increment('page_views');
    }
}
