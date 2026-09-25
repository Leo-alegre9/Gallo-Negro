<?php

use App\Http\Controllers\Admin\AuditController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\StatsController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\StorefrontController;
use Illuminate\Support\Facades\Route;

Route::get('/', [StorefrontController::class, 'home'])->name('home');
Route::get('/catalogo', [StorefrontController::class, 'catalog'])->name('catalog');
Route::get('/taller', [StorefrontController::class, 'workshop'])->name('workshop');
Route::get('/productos/{slug}', [StorefrontController::class, 'product'])->name('products.show');
Route::get('/media/{path}', [StorefrontController::class, 'media'])->where('path', '.*')->name('media.show');

Route::post('/catalogo/vistas', [StorefrontController::class, 'viewEvent'])->middleware('throttle:120,1')->name('products.view-event');
Route::post('/consultas/productos/{product}', [InquiryController::class, 'product'])->middleware('throttle:30,1')->name('inquiries.product');
Route::post('/consultas/pedido', [InquiryController::class, 'cart'])->middleware('throttle:20,1')->name('inquiries.cart');

Route::get('/admin/login', [AuthController::class, 'create'])->name('login');
Route::post('/admin/login', [AuthController::class, 'store'])->middleware('throttle:5,1')->name('admin.login');

Route::prefix('admin')->name('admin.')->middleware(['auth', 'can:admin'])->group(function () {
    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');
    Route::get('/', DashboardController::class)->name('dashboard');
    Route::get('/estadisticas', StatsController::class)->name('stats');
    Route::get('/auditoria', AuditController::class)->name('audit');
    Route::resource('categorias', CategoryController::class)->parameters(['categorias' => 'category'])->only(['index', 'store', 'update', 'destroy'])->names('categories');
    Route::patch('/productos/{product}/estado', [ProductController::class, 'setActive'])->name('products.status');
    Route::patch('/productos/{id}/restaurar', [ProductController::class, 'restore'])->name('products.restore');
    Route::resource('productos', ProductController::class)->parameters(['productos' => 'product'])->except(['show'])->names('products');
});
