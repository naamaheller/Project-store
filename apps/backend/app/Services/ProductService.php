<?php

namespace App\Services;
use Throwable;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

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
    /**
     * only for admin users
     * add a new product
     * protected $fillable = [
     *   'name',
     *   'slug',
     *   'description',
     *   'price',
     *   'img_url',
     *   'stock',
     *   'is_active',
     *   'category_id',
     *];
     */
    public function addProductByAdmin(array $data)
    {
        return DB::transaction(function () use ($data) {

        $categoryName = trim($data['category']);

        $category = Category::firstOrCreate(
            ['slug' => Str::slug($categoryName)],
            ['name' => ucfirst($categoryName)]
        );

        $slug = Str::slug($data['name']);

        if (Product::where('slug', $slug)->exists()) {
            $slug .= '-' . uniqid();
        }
        
        return Product::create([
            'name' => $data['name'],
            'slug' => $slug,
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'stock' => $data['stock'],
            'is_active' => $data['is_active'],
            'img_url' => $data['img_url'] ?? null,
            'category_id' => $category->id,
        ]);
    });
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
    public function editProductByAdmin(int $productId, Request $request)
    { 

        $product = Product::findOrFail($productId);
        $product->update($request->all());
        return $product;
    }

}