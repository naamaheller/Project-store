<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $categories = [
        'Electronics',
        'Phones',
        'Laptops',
        'Accessories',
        'Home Appliances',
        'Gaming',
        'Fashion',
        'Shoes',
        'Beauty',
        'Sports',
        ];

        $name = array_shift($categories) ?? $this->faker->unique()->word();

        return [
            'name' => ucfirst($name),
            'slug' => Str::slug($name),
        ];
    }
}
