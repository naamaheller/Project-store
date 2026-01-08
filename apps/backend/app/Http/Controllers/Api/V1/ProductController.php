<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Exception;
use Http\Discovery\NotFoundException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Throwable;
use App\Services\ProductService;
use App\Services\MinioUploadService;
use function PHPUnit\Framework\throwException;


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

        $products = $this->productService->getActiveProducts($request);
        $products = $this->addImageUrls($products);
        return response()->json($products, 200);


    }
    public function adminIndex(Request $request)
    {

        $products = $this->productService->getAllProductsForAdmin($request);
        $products = $this->addImageUrls($products);
        return response()->json($products, 200);


    }
    public function adminAddProduct(Request $request)
    {

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
        $product->image_url = $product->img_url
            ? $this->minioUploadService->temporaryUrl($product->img_url)
            : null;
        return response()->json([
            'message' => 'Product added successfully',
            'product' => $product,
        ], 201);


    }
    public function getMaxPrice()
    {

        $maxPrice = $this->productService->getMaxPrice();
        return response()->json(['max_price' => $maxPrice], 200);


    }

    public function adminDeleteProduct(int $productId)
    {


        $this->productService->deleteProductByAdmin($productId);


        return response()->json([
            'message' => 'Product deleted successfully',
        ], 200);


    }

    public function adminEditProduct(int $productId, Request $request)
    {


        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'img_url' => 'nullable|string|max:2048',
            'is_active' => 'sometimes|boolean',
            'category_name' => 'nullable|string|max:255',
        ]);
        $product = $this->productService->editProductByAdmin($productId, $validated);

        if (!$product) {

            throw new ModelNotFoundException();
        }
        $product->image_url = $product->img_url
            ? $this->minioUploadService->temporaryUrl($product->img_url)
            : null;

        return response()->json([
            'message' => 'Product edited successfully',
            'product' => $product,
        ], 200);




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
