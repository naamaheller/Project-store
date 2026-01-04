<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Throwable;
use App\Services\ProductService;
use Illuminate\Database\Eloquent\ModelNotFoundException;


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
            'category' => 'required|string|max:255',
            'img_url' => 'nullable|string|max:2048',
    ]);
           
            $this->productService->addProductByAdmin($data);
            return response()->json([
                'message' => 'Product added successfully',
            ], 201);

        }catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to add product',
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

        } catch (\Throwable $e) {
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
             $this->productService->editProductByAdmin($productId, $request);
            return response()->json([
                'message' => 'Product edited successfully',
            ], 200);

        
        }
        catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Product not found',
            ], 404);

        }
        catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to edit product',
            ], 500);
        }
    }
}
