<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\ProductExportService;
use Illuminate\Http\JsonResponse;

class ProductExportController extends Controller
{
    public function export(ProductExportService $service): JsonResponse
    {
        try {
            $result = $service->exportProductsToS3();

            return response()->json([
                'message' => 'Export ready',
                'url' => $result['url'],
            ]);
            
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Export failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
