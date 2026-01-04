<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Middleware\CookieTokenToBearer;
use App\Http\Controllers\Api\V1\CategoryController;

Route::prefix('v1')->group(function () {
    // public
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);

    // protected - cookie -> bearer -> passport(guard api)
    Route::middleware([CookieTokenToBearer::class, 'auth:api'])->group(function () {

        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::get(
            '/user',
            fn(Request $request) =>
            $request->user('api')?->only(['id', 'name', 'email', 'role'])
        );


        Route::get('/products', [ProductController::class, 'index']);

        Route::get('/admin/products', [ProductController::class, 'adminIndex']);
        Route::get('/categories', [CategoryController::class, 'index']);
    });
});
