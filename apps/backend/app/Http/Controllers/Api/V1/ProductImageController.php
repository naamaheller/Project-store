<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\MinioUploadService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Throwable;

class ProductImageController extends Controller
{
    private MinioUploadService $minioUploadService;

    public function __construct(MinioUploadService $minioUploadService)
    {
        $this->minioUploadService = $minioUploadService;
    }

    // POST /api/v1/admin/products/{productId}/image
    public function store(int $productId, Request $request)
    {
        $request->validate([
            'image' => ['required', 'image', 'max:5120'], // עד 5MB
        ]);

        try {
            $product = Product::findOrFail($productId);

            // מעלה תמונה חדשה, ואם יש ישנה - מוחק אותה
            $path = $this->minioUploadService->handle(
                $request->file('image'),
                $product->img_url // שומר אצלך "path" בתוך img_url
            );

            $product->update([
                'img_url' => $path,
            ]);

            return response()->json([
                'message' => 'Image updated successfully',
                'productId' => $product->id,
                'path' => $path,
            ], 201);

        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Product not found'], 404);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to update product image',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // DELETE /api/v1/admin/products/{productId}/image
    public function destroy(int $productId)
    {
        try {
            $product = Product::findOrFail($productId);

            if ($product->img_url) {
                // מוחק מה-MinIO
                $this->minioUploadService->handle(null, $product->img_url);

                // מאפס ב-DB
                $product->update(['img_url' => null]);
            }

            return response()->json([
                'message' => 'Image deleted successfully',
                'productId' => $product->id,
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Product not found'], 404);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to delete product image',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
