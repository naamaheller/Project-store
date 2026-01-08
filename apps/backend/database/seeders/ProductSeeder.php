<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::truncate();

        $products = Product::factory()->count(25)->create()->values();

        $assetsDir = database_path('seeders/assets/products');

        foreach ($products as $i => $product) {
            $n = str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT);

            $localJpg = $assetsDir . DIRECTORY_SEPARATOR . "{$n}.jpg";
            $localPng = $assetsDir . DIRECTORY_SEPARATOR . "{$n}.png";

            $localFile = file_exists($localJpg) ? $localJpg : (file_exists($localPng) ? $localPng : null);
            if (!$localFile) {
                continue;
            }

            $ext = pathinfo($localFile, PATHINFO_EXTENSION);
            $pathInMinio = "products/seed/{$n}.{$ext}";

            Storage::disk('minio')->put($pathInMinio, file_get_contents($localFile));

            $product->update([
                'img_url' => $pathInMinio,
            ]);
        }
    }
}
