<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Throwable;
use App\Services\ProductService;
use App\Services\MinioUploadService;


class ProductController extends Controller
{
    private ProductService $productService;
    private MinioUploadService $minioUploadService;

    public function __construct(
        ProductService $productService,
        MinioUploadService $minioUploadService
    ) {
        $this->productService = $productService;
        $this->minioUploadService = $minioUploadService;
    }
    public function index(Request $request)
    {
        try {
            $products = $this->productService->getActiveProducts($request);
            $products = $this->addImageUrls($products);
            return response()->json($products, 200);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to fetch products',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function adminIndex(Request $request)
    {
        try {
            $products = $this->productService->getAllProductsForAdmin($request);
            $products = $this->addImageUrls($products);

            return response()->json($products, 200);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to fetch admin products',
                'error' => $e->getMessage(),
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

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to add product',
            ], 500);
        }
    }
    public function getMaxPrice()
    {
        try {
            $maxPrice = $this->productService->getMaxPrice();
            return response()->json(['max_price' => $maxPrice], 200);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to fetch max price',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

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

    public function adminEditProduct(int $productId, Request $request)
    {

        try {
            $this->productService->editProductByAdmin($productId, $request);
            return response()->json([
                'message' => 'Product edited successfully',
            ], 200);


        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Product not found',
            ], 404);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to edit product',
            ], 500);
        }
    }
    private function addImageUrls($result)
    {
        if (is_object($result) && method_exists($result, 'getCollection')) {
            $result->getCollection()->transform(function ($p) {
                $p->image_url = $p->img_url
                    ? $this->minioUploadService->temporaryUrl($p->img_url)
                    : null;
                return $p;
            });

            return $result;
        }

        if (is_object($result) && method_exists($result, 'transform')) {
            $result->transform(function ($p) {
                $p->image_url = $p->img_url
                    ? $this->minioUploadService->temporaryUrl($p->img_url)
                    : null;
                return $p;
            });

            return $result;
        }

        return $result;
    }


}
