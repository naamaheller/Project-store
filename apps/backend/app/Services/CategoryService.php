<?php

namespace App\Services;
use Throwable;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryService
{
    public function getAllCategories(Request $request)
    {
        try {

            return Category::orderBy('created_at', 'desc')->get();

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to fetch categories',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}