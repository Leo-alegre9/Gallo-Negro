<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StatsController extends Controller
{
    private const RANGES = [7, 30, 90];

    public function __invoke(Request $request): Response
    {
        $days = (int) $request->query('rango', 30);
        if (!in_array($days, self::RANGES, true)) $days = 30;

        $since = now()->subDays($days - 1)->startOfDay();
        $until = now()->endOfDay();
        $prevSince = now()->subDays($days * 2 - 1)->startOfDay();
        $prevUntil = now()->subDays($days)->endOfDay();

        $dates = collect(range(0, $days - 1))->map(fn ($offset) => $since->copy()->addDays($offset)->toDateString());

        $visits = DB::table('site_visits')
            ->whereBetween('visit_date', [$since->toDateString(), $until->toDateString()])
            ->select('visit_date')->selectRaw('COUNT(*) AS visitors')->selectRaw('SUM(page_views) AS page_views')
            ->groupBy('visit_date')->get()->keyBy('visit_date');

        $events = DB::table('product_events')
            ->whereBetween('created_at', [$since, $until])
            ->selectRaw('DATE(created_at) AS day')
            ->selectRaw("SUM(CASE WHEN type = 'view' THEN 1 ELSE 0 END) AS views")
            ->selectRaw("SUM(CASE WHEN type = 'consultation' THEN 1 ELSE 0 END) AS consultations")
            ->groupBy('day')->get()->keyBy('day');

        $audits = DB::table('admin_audits')
            ->whereBetween('created_at', [$since, $until])
            ->selectRaw('DATE(created_at) AS day')->selectRaw('COUNT(*) AS total')
            ->groupBy('day')->get()->keyBy('day');

        $visitsSeries = $dates->map(fn ($date) => [
            'date' => $date,
            'visitors' => (int) ($visits[$date]->visitors ?? 0),
            'pageViews' => (int) ($visits[$date]->page_views ?? 0),
        ])->values();

        $eventsSeries = $dates->map(fn ($date) => [
            'date' => $date,
            'views' => (int) ($events[$date]->views ?? 0),
            'consultations' => (int) ($events[$date]->consultations ?? 0),
        ])->values();

        $activitySeries = $dates->map(fn ($date) => [
            'date' => $date,
            'total' => (int) ($audits[$date]->total ?? 0),
        ])->values();

        $totals = [
            'visitors' => (int) $visits->sum('visitors'),
            'pageViews' => (int) $visits->sum('page_views'),
            'views' => (int) $events->sum('views'),
            'consultations' => (int) $events->sum('consultations'),
        ];

        $prevVisitors = (int) DB::table('site_visits')->whereBetween('visit_date', [$prevSince->toDateString(), $prevUntil->toDateString()])->count();
        $prevPageViews = (int) DB::table('site_visits')->whereBetween('visit_date', [$prevSince->toDateString(), $prevUntil->toDateString()])->sum('page_views');
        $prevViews = (int) DB::table('product_events')->where('type', 'view')->whereBetween('created_at', [$prevSince, $prevUntil])->count();
        $prevConsultations = (int) DB::table('product_events')->where('type', 'consultation')->whereBetween('created_at', [$prevSince, $prevUntil])->count();

        $rate = $totals['views'] > 0 ? round($totals['consultations'] / $totals['views'] * 100, 1) : 0;
        $prevRate = $prevViews > 0 ? round($prevConsultations / $prevViews * 100, 1) : 0;

        $delta = fn (int $current, int $previous) => $previous > 0
            ? round(($current - $previous) / $previous * 100, 1)
            : ($current > 0 ? 100.0 : 0.0);

        $kpis = [
            ['label' => 'Visitantes', 'value' => $totals['visitors'], 'delta' => $delta($totals['visitors'], $prevVisitors)],
            ['label' => 'Páginas vistas', 'value' => $totals['pageViews'], 'delta' => $delta($totals['pageViews'], $prevPageViews)],
            ['label' => 'Consultas iniciadas', 'value' => $totals['consultations'], 'delta' => $delta($totals['consultations'], $prevConsultations)],
            ['label' => 'Tasa de conversión', 'value' => $rate, 'suffix' => '%', 'delta' => round($rate - $prevRate, 1), 'isRate' => true],
        ];

        $topProducts = DB::table('product_events')
            ->join('products', 'products.id', '=', 'product_events.product_id')
            ->whereBetween('product_events.created_at', [$since, $until])
            ->select('products.id', 'products.name')
            ->selectRaw("SUM(CASE WHEN product_events.type = 'view' THEN 1 ELSE 0 END) AS views")
            ->selectRaw("SUM(CASE WHEN product_events.type = 'consultation' THEN 1 ELSE 0 END) AS consultations")
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('consultations')->orderByDesc('views')->limit(8)->get();

        $byCategory = DB::table('product_events')
            ->join('products', 'products.id', '=', 'product_events.product_id')
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->whereBetween('product_events.created_at', [$since, $until])
            ->select('categories.id', 'categories.name')
            ->selectRaw("SUM(CASE WHEN product_events.type = 'view' THEN 1 ELSE 0 END) AS views")
            ->selectRaw("SUM(CASE WHEN product_events.type = 'consultation' THEN 1 ELSE 0 END) AS consultations")
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('consultations')->orderByDesc('views')->limit(8)->get();

        $stockStatusLabels = ['available' => 'Disponible', 'ask' => 'Consultar disponibilidad', 'out' => 'Sin stock'];
        $stockStatus = Product::query()->whereNull('deleted_at')
            ->select('stock_status')->selectRaw('COUNT(*) AS total')->groupBy('stock_status')->get()
            ->map(fn ($row) => ['key' => $row->stock_status, 'label' => $stockStatusLabels[$row->stock_status] ?? $row->stock_status, 'total' => (int) $row->total]);

        $catalogStatus = [
            ['key' => 'active', 'label' => 'Activos', 'total' => Product::where('is_active', true)->count()],
            ['key' => 'inactive', 'label' => 'De baja', 'total' => Product::where('is_active', false)->count()],
            ['key' => 'deleted', 'label' => 'Eliminados', 'total' => Product::onlyTrashed()->count()],
        ];

        return Inertia::render('Admin/Stats', [
            'range' => $days,
            'kpis' => $kpis,
            'visitsSeries' => $visitsSeries,
            'eventsSeries' => $eventsSeries,
            'activitySeries' => $activitySeries,
            'topProducts' => $topProducts,
            'byCategory' => $byCategory,
            'stockStatus' => $stockStatus,
            'catalogStatus' => $catalogStatus,
        ]);
    }
}
