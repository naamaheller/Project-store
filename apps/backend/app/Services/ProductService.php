<?php 

namespace App\Services;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductService
{
     /**
     * only for admin users
     * get all products with no restrictions
     */
    public function getAllProductsForAdmin(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $perPage = min($perPage, 100);
        
        return Product::orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * only for regular users
     * only active products in stock
     */
    public function getActiveProducts(Request $request)
    {
         $perPage = $request->input('per_page', 15);
         $perPage = min($perPage, 100);

         return Product::where('is_active', true)
            ->where('stock', '>', 0)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }
}