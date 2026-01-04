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

    private function buildFilteredQuery(Request $request)
    {
        $query = Product::with('category');

        if ($request->boolean('only_active', true)) {
            $query->where('is_active', true)
                ->where('stock', '>', 0);
        }

        if ($request->filled('categories')) {
            $query->whereIn('category_id', $request->categories);
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->filled('search')) {
            $search = trim($request->search);

            $words = preg_split('/\s+/', $search);

            $query->where(function ($q) use ($words) {
                foreach ($words as $word) {
                    $q->where(function ($qq) use ($word) {
                        $qq->where('name', 'like', "%{$word}%")
                            ->orWhere('description', 'like', "%{$word}%")
                            ->orWhere('slug', 'like', "%{$word}%");

                    });
                }
            });
        }


        return $query;
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