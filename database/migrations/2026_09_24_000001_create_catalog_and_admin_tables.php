<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_admin')->default(false);
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->restrictOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->string('id', 36)->primary();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->foreignId('subcategory_id')->nullable()->constrained('categories')->restrictOnDelete();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('model')->nullable();
            $table->text('short_description');
            $table->string('measurements')->nullable();
            $table->string('colors_variants')->nullable();
            $table->string('material')->nullable();
            $table->string('finish')->nullable();
            $table->unsignedBigInteger('price');
            $table->unsignedBigInteger('promo_price')->nullable();
            $table->string('stock_status', 32)->default('available');
            $table->string('primary_image');
            $table->string('tag')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_demo')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->softDeletes();
            $table->timestamps();
            $table->index(['is_active', 'sort_order']);
        });

        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->string('product_id', 36);
            $table->foreign('product_id')->references('id')->on('products')->cascadeOnDelete();
            $table->string('path');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('product_events', function (Blueprint $table) {
            $table->id();
            $table->string('product_id', 36)->nullable();
            $table->foreign('product_id')->references('id')->on('products')->nullOnDelete();
            $table->string('type', 32);
            $table->timestamp('created_at')->useCurrent();
            $table->index(['product_id', 'type', 'created_at']);
        });

        Schema::create('site_visits', function (Blueprint $table) {
            $table->id();
            $table->date('visit_date');
            $table->char('visitor_hash', 64);
            $table->unsignedInteger('page_views')->default(1);
            $table->timestamps();
            $table->unique(['visit_date', 'visitor_hash']);
        });

        Schema::create('admin_audits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action', 40);
            $table->string('entity_type', 80);
            $table->string('entity_id', 36)->nullable();
            $table->json('before')->nullable();
            $table->json('after')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->index(['entity_type', 'entity_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_audits');
        Schema::dropIfExists('site_visits');
        Schema::dropIfExists('product_events');
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
        Schema::table('users', fn (Blueprint $table) => $table->dropColumn('is_admin'));
    }
};
