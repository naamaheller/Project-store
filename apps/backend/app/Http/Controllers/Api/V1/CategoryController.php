<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Throwable;


class CategoryController extends Controller
{
        private CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * retrieve a list of categories
     * GET /api/v1/categories
     */
    public function index(Request $request)
    {
        try {
            $categories = $this->categoryService->getAllCategories($request);
            return response()->json($categories, 200);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to fetch categories',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

}
