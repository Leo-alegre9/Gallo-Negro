<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'category_id', 'subcategory_id', 'slug', 'name', 'model',
        'short_description', 'measurements', 'colors_variants', 'material',
        'finish', 'price', 'promo_price', 'stock_status', 'primary_image',
        'tag', 'is_active', 'is_featured', 'is_demo', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'promo_price' => 'integer',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'is_demo' => 'boolean',
            'deleted_at' => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'subcategory_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order')->orderBy('id');
    }

    public function effectivePrice(): int
    {
        return $this->promo_price ?? $this->price;
    }

    public function scopeVisible($query)
    {
        return $query->where('is_active', true)
            ->whereHas('category', fn ($category) => $category->where('is_active', true))
            ->where(fn ($nested) => $nested->whereNull('subcategory_id')
                ->orWhereHas('subcategory', fn ($category) => $category->where('is_active', true)));
    }

    public static function imageUrl(?string $path): ?string
    {
        if (!$path) return null;
        $url = str_starts_with($path, '/') ? $path : '/media/'.$path;
        return implode('/', array_map('rawurlencode', explode('/', $url)));
    }

    public function catalogData(): array
    {
        $image = self::imageUrl($this->primary_image);
        $gallery = $this->images->pluck('path')->map(fn ($path) => self::imageUrl($path))->all();

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'url' => route('products.show', $this->slug),
            'name' => $this->name,
            'categoryId' => $this->category_id,
            'category' => $this->category?->name,
            'subcategoryId' => $this->subcategory_id,
            'subcategory' => $this->subcategory?->name,
            'model' => $this->model,
            'description' => $this->short_description,
            'size' => $this->measurements,
            'colorsVariants' => $this->colors_variants,
            'material' => $this->material,
            'finish' => $this->finish,
            'price' => $this->effectivePrice(),
            'compareAtPrice' => $this->promo_price !== null ? $this->price : null,
            'stockStatus' => $this->stock_status,
            'image' => $image,
            'absoluteImageUrl' => $image ? url($image) : null,
            'images' => array_values(array_unique([$image, ...$gallery])),
            'tag' => $this->tag,
            'isDemo' => $this->is_demo,
        ];
    }
}
