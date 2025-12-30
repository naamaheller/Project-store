<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ProductController;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {

    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/user', fn (Request $request) => $request->user());

    Route::prefix('v1')->group(function () {
        Route::get('/products', [ProductController::class, 'index']);

        Route::get('/admin/products', [ProductController::class, 'adminIndex'])
            ->middleware('admin');
    });
});
