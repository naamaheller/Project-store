<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\CategoryController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/admin/products', [ProductController::class, 'adminIndex'])->middleware(['auth:sanctum', 'admin']);
    Route::get('/categories', [CategoryController::class, 'index']);

});
