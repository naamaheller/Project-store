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

            return $this->buildFilteredQuery(
                $request->merge(['only_active' => false])
            )
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to fetch products',
                'error' => $e->getMessage(),
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

            $query = $this->buildFilteredQuery($request);

            return $query
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to fetch products',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    /*
     * only for admin users
     * delete a product
     */
    public function deleteProductByAdmin(int $productId)
    { 
        
        $product = Product::findOrFail($productId);
        $product->delete();
           
       
    }

    /*
     * only for admin users
     * edit a product
     */
    public function editProductByAdmin(int $productId)
    { 

        $product = Product::findOrFail($productId);
        $product->update($request->all());
        return $product;
    }

}