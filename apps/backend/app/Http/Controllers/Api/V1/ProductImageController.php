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

    public function store(int $productId, Request $request)
    {
        $request->validate([
            'image' => ['required', 'image', 'max:5120'],
        ]);

        try {
            $product = Product::findOrFail($productId);

            $path = $this->minioUploadService->upload(
                $request->file('image'),
                $product->img_url
            );
            $product->update([
                'img_url' => $path,
            ]);

            $url = $this->minioUploadService->temporaryUrl($path);

            return response()->json([
                'message' => 'Image updated successfully',
                'productId' => $product->id,
                'path' => $path,
                'url' => $url,
            ], 201);


        } catch (ModelNotFoundException) {
            return response()->json(['message' => 'Product not found'], 404);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to update product image',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(int $productId)
    {
        try {
            $product = Product::findOrFail($productId);

            if ($product->img_url) {
                $this->minioUploadService->delete($product->img_url);
                $product->update(['img_url' => null]);
            }

            return response()->json([
                'message' => 'Image deleted successfully',
                'productId' => $product->id,
            ], 200);

        } catch (ModelNotFoundException) {
            return response()->json(['message' => 'Product not found'], 404);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to delete product image',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
