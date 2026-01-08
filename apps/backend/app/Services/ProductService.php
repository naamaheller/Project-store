<?php

namespace App\Services;
use Throwable;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

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

            return $this->buildFilteredQuery(
                $request->merge(['only_active' => false])
            )
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

       
    }

    /**
     * only for regular users
     * only active products in stock 
     */
    public function getActiveProducts(Request $request)
    {
        
            $perPage = $request->input('per_page', 15);
            $perPage = min($perPage, 100);

            $query = $this->buildFilteredQuery($request);

            return $query
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

        
    }
    /**
     * only for admin users
     * add a new product
     * 
     */
    public function addProductByAdmin(array $data)
    {
        return DB::transaction(function () use ($data) {
        $categoryName = trim((string)($data['category_name'] ?? ''));

        if ($categoryName !== '') {
            $category = Category::firstOrCreate(
                ['slug' => Str::slug($categoryName)],
                ['name' => ucfirst($categoryName)]
            );

            $data['category_id'] = $category->id;
        }
        unset($data['category_name']);


        $slug = Str::slug($data['name']);

        if (Product::where('slug', $slug)->exists()) {
            $slug .= '-' . uniqid();
        }
        $data['slug'] = $slug;
        //create produuct and return it with category relation
        return Product::create($data)->fresh(['category']);
       

        });
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
     * also category if needed
     */
    public function editProductByAdmin(int $productId, array $data): Product
    {   

        $product = Product::query()->findOrFail($productId);

       
        $categoryName = trim((string) Arr::get($data, 'category_name', ''));
        if ($categoryName !== '') {
            $category = Category::query()->firstOrCreate(
                ['name' => $categoryName],
                ['slug' => Str::slug($categoryName)]
            );
            $data['category_id'] = $category->id;
        }

        unset($data['category_name']);
        $data['slug'] = Str::slug($data['name'] ?? $product->name);

       

        
        $allowed = [
            'name',
            'slug',
            'description',
            'price',
            'stock',
            'img_url',
            'is_active',
            'category_id',
        ];

        $product->update(Arr::only($data, $allowed));

        return $product->fresh(['category']);
   
    }

    /*`
     * get max price of products
     */
    public function getMaxPrice()
    {
        try {
            return Product::max('price');

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to fetch max price',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

}