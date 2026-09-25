<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $since = now()->subDays(29)->toDateString();
        $popular = DB::table('product_events')
            ->join('products', 'products.id', '=', 'product_events.product_id')
            ->select('products.id', 'products.name', 'products.slug')
            ->selectRaw("SUM(CASE WHEN product_events.type = 'view' THEN 1 ELSE 0 END) AS views")
            ->selectRaw("SUM(CASE WHEN product_events.type = 'consultation' THEN 1 ELSE 0 END) AS consultations")
            ->groupBy('products.id', 'products.name', 'products.slug')
            ->orderByDesc('consultations')->orderByDesc('views')->limit(10)->get();

        return Inertia::render('Admin/Dashboard', [
            'summary' => [
                'activeProducts' => Product::where('is_active', true)->count(),
                'inactiveProducts' => Product::where('is_active', false)->count(),
                'deletedProducts' => Product::onlyTrashed()->count(),
                'visitorsToday' => DB::table('site_visits')->where('visit_date', now()->toDateString())->count(),
                'visitors30Days' => DB::table('site_visits')->where('visit_date', '>=', $since)->count(),
                'pageViews30Days' => DB::table('site_visits')->where('visit_date', '>=', $since)->sum('page_views'),
                'consultations30Days' => DB::table('product_events')->where('type', 'consultation')->where('created_at', '>=', now()->subDays(30))->count(),
            ],
            'dailyVisits' => DB::table('site_visits')->where('visit_date', '>=', $since)
                ->select('visit_date')->selectRaw('COUNT(*) AS visitors')->selectRaw('SUM(page_views) AS page_views')
                ->groupBy('visit_date')->orderBy('visit_date')->get(),
            'popular' => $popular,
        ]);
    }
}
