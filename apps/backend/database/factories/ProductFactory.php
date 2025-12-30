<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Category;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
         $name = $this->faker->words(3, true);

    return [
        'name' => $name,
        'slug' => Str::slug($name),
        'description' => $this->faker->sentence(),
        'price' => $this->faker->randomFloat(2, 10, 5000),
        'img_url' => $this->faker->imageUrl(640, 480, 'products'),
        'stock' => $this->faker->numberBetween(0, 100),
        'is_active' => $this->faker->boolean(90),
         'category_id' => Category::inRandomOrder()->first()->id, 
    ];
    }
}
