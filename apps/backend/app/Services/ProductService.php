<?php 

namespace App\Services;

use App\Models\Product;

class ProductService
{
     /**
     * only for admin users
     * get all products with no restrictions
     */
    public function getAllProductsForAdmin()
    {
        return Product::orderBy('created_at', 'desc')->get();
    }

    /**
     * only for regular users
     * only active products in stock
     */
    public function getActiveProducts()
    {
        return Product::where('is_active', true)
            ->where('stock', '>', 0)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}