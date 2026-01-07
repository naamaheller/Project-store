<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Throwable;
use App\Services\ProductService;


class ProductController extends Controller
{
    private ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * retrieve a list of products
     * GET /api/v1/products
     */
    public function index(Request $request)
    {
        try {
        $products = $this->productService->getActiveProducts($request);
        return response()->json($products, 200);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to fetch products',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * retrieve a list of all products for admin users
     * GET /api/v1/admin/products
     */
    public function adminIndex(Request $request)
    {
         try {
            $products = $this->productService->getAllProductsForAdmin($request);
            return response()->json($products, 200);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to fetch admin products',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
    public function adminAddProduct(Request $request)
    {
        try {
            $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'is_active' => 'required|boolean',
            'category_name' => 'nullable|string|min:1|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'img_url' => 'nullable|string|max:2048',
    ]);
            if (!$request->filled('category_id') && !$request->filled('category_name')) {
                return response()->json(['message' => 'category_id or category_name is required'], 422);
                }
           
            $product = $this->productService->addProductByAdmin($data);
            
            return response()->json([
                'message' => 'Product added successfully',
                'product' => $product,
            ], 201);

        
        }catch (Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * get the maximum price of all products
     * GET /api/v1/products/max-price
     */
    public function getMaxPrice()
    {
        try {
            $maxPrice = $this->productService->getMaxPrice();
            return response()->json(['max_price' => $maxPrice], 200);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to fetch max price',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * delete a product by admin
     * DELETE /api/v1/admin/products/delete
     */
    public function adminDeleteProduct(int $productId)
    {
  
        try {
           $this->productService->deleteProductByAdmin($productId);
             

            return response()->json([
                'message' => 'Product deleted successfully',
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Product not found',
            ], 404);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to delete product',
            ], 500);
        }
    }
    /**
     * edit a product by admin
     * PUT /api/v1/admin/products/edit
     */
    public function adminEditProduct(int $productId, Request $request)
    {
    
        try {
              $validated = $request->validate([
                'name'          => 'sometimes|string|max:255',
                // 'slug'          => 'sometimes|string|max:255|unique:products,slug,' . $productId,
                'description'   => 'nullable|string',
                'price'         => 'sometimes|numeric|min:0',
                'stock'         => 'sometimes|integer|min:0',
                'img_url'       => 'nullable|string|max:2048',
                'is_active'     => 'sometimes|boolean',

                // // category handling
                // 'category_id'   => 'nullable|exists:categories,id',
                'category_name' => 'nullable|string|max:255',
            ]);
            $product= $this->productService->editProductByAdmin($productId, $validated);
            
            if (!$product) {
                
                throw new ModelNotFoundException();
            }
            return response()->json([
                'message' => 'Product edited successfully',
                'product' => $product,
            ], 200);

        
        }
        catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Product not found',
            ], 404);

        }
        catch (Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    
}
