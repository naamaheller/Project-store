<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         Product::create([
            'name' => 'Phone',
            'slug' => 'phone',
            'description' => 'Smart phone',
            'price' => 1999,
            'img_url' => 'https://example.com/phone.jpg',
            'stock' => 10,
            'is_active' => true,
            'category_id' => 1,
        ]);

    }
}
