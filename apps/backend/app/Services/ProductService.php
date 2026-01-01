<?php 

namespace App\Services;
use Throwable;

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
        try {
        $perPage = $request->input('per_page', 15);
        $perPage = min($perPage, 100);
        
        return Product::orderBy('created_at', 'desc')->paginate($perPage);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to fetch products',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * only for regular users
     * only active products in stock 
     */
    public function getActiveProducts(Request $request)
    {
        try {
         $perPage = $request->input('per_page', 15);
         $perPage = min($perPage, 100);

         return Product::where('is_active', true)
            ->where('stock', '>', 0)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to fetch products',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}