<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
        $products = $this->productService->getActiveProducts($request);

        return response()->json($products);
    }

    /**
     * retrieve a list of all products for admin users
     * GET /api/v1/admin/products
     */
    public function adminIndex(Request $request)
    {
        $products = $this->productService->getAllProductsForAdmin($request);

        return response()->json($products);
    }
}
