<?php

namespace Database\Factories;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */


use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = Product::class;
    protected static int $index = 0;

    private array $products = [
        // Electronics
        ['name' => 'Wireless Bluetooth Headphones', 'category' => 'electronics', 'price' => [150, 600]],
        ['name' => 'Smart Fitness Watch', 'category' => 'electronics', 'price' => [300, 1200]],
        ['name' => 'USB-C Fast Charging Adapter', 'category' => 'electronics', 'price' => [50, 150]],
        ['name' => 'Portable Power Bank 20000mAh', 'category' => 'electronics', 'price' => [200, 500]],
        ['name' => 'Noise Cancelling Over-Ear Headphones', 'category' => 'electronics', 'price' => [400, 1500]],
        ['name' => 'Mechanical Gaming Keyboard', 'category' => 'electronics', 'price' => [300, 900]],
        ['name' => 'Wireless Ergonomic Mouse', 'category' => 'electronics', 'price' => [120, 400]],
        ['name' => '27-Inch Full HD Monitor', 'category' => 'electronics', 'price' => [800, 2000]],
        ['name' => 'Smart LED Desk Lamp', 'category' => 'electronics', 'price' => [100, 350]],

        // Clothes
        ['name' => 'Classic Cotton T-Shirt', 'category' => 'clothes', 'price' => [50, 120]],
        ['name' => 'Slim Fit Denim Jeans', 'category' => 'clothes', 'price' => [180, 450]],
        ['name' => 'Premium Zip Hoodie', 'category' => 'clothes', 'price' => [200, 500]],
        ['name' => 'Casual Running Sneakers', 'category' => 'clothes', 'price' => [300, 800]],
        ['name' => 'Lightweight Summer Jacket', 'category' => 'clothes', 'price' => [250, 650]],
        ['name' => 'Wool Knit Sweater', 'category' => 'clothes', 'price' => [220, 600]],
        ['name' => 'Leather Belt – Black', 'category' => 'clothes', 'price' => [80, 200]],
        ['name' => 'Relaxed Fit Jogger Pants', 'category' => 'clothes', 'price' => [150, 350]],

        // Food
        ['name' => 'Organic Arabica Coffee Beans', 'category' => 'food', 'price' => [40, 120]],
        ['name' => 'Dark Chocolate Bar 70%', 'category' => 'food', 'price' => [10, 25]],
        ['name' => 'Extra Virgin Olive Oil', 'category' => 'food', 'price' => [35, 90]],
        ['name' => 'Natural Honey Jar', 'category' => 'food', 'price' => [25, 70]],
        ['name' => 'Italian Pasta – Penne', 'category' => 'food', 'price' => [8, 20]],
        ['name' => 'Gourmet Tomato Sauce', 'category' => 'food', 'price' => [12, 30]],
        ['name' => 'Roasted Almonds Pack', 'category' => 'food', 'price' => [20, 60]],
        ['name' => 'Herbal Green Tea Box', 'category' => 'food', 'price' => [15, 45]],
    ];

     public function definition(): array
    {
        $product = $this->products[self::$index++ % count($this->products)];

        $category = Category::firstOrCreate(
            ['slug' => $product['category']],
            ['name' => ucfirst($product['category'])]
        );

        return [
            'name'        => $product['name'],
            'slug'        => Str::slug($product['name']),
            'description' => fake()->sentence(12),
            'price'       => fake()->randomFloat(2, $product['price'][0], $product['price'][1]),
            'img_url'     => fake()->imageUrl(640, 480, 'product'),
            'stock'       => fake()->numberBetween(0, 100),
            'is_active'   => fake()->boolean(85),
            'category_id' => $category->id,
        ];
    }
}

