<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $categories = collect([
            ['name' => 'Fogoneros', 'slug' => 'fogoneros'],
            ['name' => 'Parrillas', 'slug' => 'parrillas'],
            ['name' => 'Estufas', 'slug' => 'estufas'],
        ])->mapWithKeys(fn ($item, $index) => [
            $item['slug'] => Category::firstOrCreate(['slug' => $item['slug']], [
                'name' => $item['name'], 'sort_order' => $index,
            ]),
        ]);

        $samples = [
            [
                'id' => 'fog-01', 'slug' => 'fogonero-encuentro', 'name' => 'Fogonero Encuentro',
                'category' => 'fogoneros', 'price' => 340000, 'promo_price' => 285000,
                'primary_image' => '/images/WhatsApp Image 2026-09-09 at 8.40.24 PM.jpeg',
                'gallery' => ['/images/3.jpeg', '/images/10.jpeg'],
                'measurements' => '80 cm de diámetro · 55 cm de alto', 'material' => 'Acero de 3 mm',
                'short_description' => 'Un lugar para reunirnos. Fogonero circular con parrilla desmontable y espacio para cocinar al disco.',
                'tag' => 'El favorito de la ronda', 'finish' => 'Acero con pátina natural',
            ],
            [
                'id' => 'par-01', 'slug' => 'parrilla-del-monte', 'name' => 'Parrilla del Monte',
                'category' => 'parrillas', 'price' => 275000, 'promo_price' => 235000,
                'primary_image' => '/images/7.jpeg', 'gallery' => ['/images/2.jpeg', '/images/4.jpeg'],
                'measurements' => '70 × 50 × 65 cm', 'material' => 'Acero de 3 mm',
                'short_description' => 'Líneas firmes, fuego abierto y todo a mano. Con emparrillado regulable para acompañar cada momento del asado.',
                'tag' => 'Hecho para el asado', 'finish' => 'Hierro negro y madera',
            ],
            [
                'id' => 'fog-02', 'slug' => 'fogonero-raiz', 'name' => 'Fogonero Raíz',
                'category' => 'fogoneros', 'price' => 198000, 'promo_price' => null,
                'primary_image' => '/images/WhatsApp Image 2026-09-09 at 8.40.23 PM.jpeg',
                'gallery' => ['/images/11.jpeg'], 'measurements' => '65 cm de diámetro · 50 cm de alto',
                'material' => 'Acero de 3 mm',
                'short_description' => 'Compacto y versátil, con parrilla circular y soporte para asador. Un compañero para las comidas al aire libre.',
                'finish' => 'Acero corten',
            ],
            [
                'id' => 'est-01', 'slug' => 'estufa-del-taller', 'name' => 'Estufa del Taller',
                'category' => 'estufas', 'price' => 175000, 'promo_price' => null,
                'primary_image' => '/images/1.jpeg', 'gallery' => ['/images/12.jpeg', '/images/5.jpeg'],
                'measurements' => '40 cm de diámetro · 90 cm de alto', 'material' => 'Hierro con acabado natural',
                'short_description' => 'El fuego también se disfruta despacio. Una pieza de carácter rústico para acompañar los encuentros en el exterior.',
                'finish' => 'Hierro trabajado a mano',
            ],
        ];

        foreach ($samples as $index => $sample) {
            $product = Product::firstOrCreate(['id' => $sample['id']], [
                'slug' => $sample['slug'],
                'name' => $sample['name'],
                'category_id' => $categories[$sample['category']]->id,
                'price' => $sample['price'],
                'promo_price' => $sample['promo_price'],
                'primary_image' => $sample['primary_image'],
                'measurements' => $sample['measurements'],
                'material' => $sample['material'],
                'short_description' => $sample['short_description'],
                'tag' => $sample['tag'] ?? null,
                'finish' => $sample['finish'],
                'stock_status' => 'available',
                'is_active' => true,
                'is_featured' => $index < 3,
                'is_demo' => true,
                'sort_order' => $index,
            ]);

            if ($product->images()->doesntExist()) {
                foreach ($sample['gallery'] as $position => $path) {
                    $product->images()->create(['path' => $path, 'sort_order' => $position]);
                }
            }
        }
    }
}
