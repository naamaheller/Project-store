<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Middleware\CookieTokenToBearer;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\ProductImageController;

Route::prefix('v1')->group(function () {


    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);


    Route::middleware([CookieTokenToBearer::class, 'auth:api'])->group(function () {

        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::get(
            '/user',
            fn(Request $request) =>
            $request->user('api')?->only(['id', 'name', 'email', 'role'])
        );

        Route::get('/products', [ProductController::class, 'index']);
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::get('/products/max-price', [ProductController::class, 'getMaxPrice']);


        Route::middleware('permission:manage products')->group(function () {

            Route::post(
                '/admin/products/add',
                [ProductController::class, 'adminAddProduct']
            );

            Route::get(
                '/admin/products',
                [ProductController::class, 'adminIndex']
            );

            Route::put(
                '/admin/products/edit/{productId}',
                [ProductController::class, 'adminEditProduct']
            );

            Route::delete(
                '/admin/products/delete/{productId}',
                [ProductController::class, 'adminDeleteProduct']
            );

            Route::post(
                '/admin/products/{productId}/image',
                [ProductImageController::class, 'store']
            );

            Route::delete(
                '/admin/products/{productId}/image',
                [ProductImageController::class, 'destroy']
            );
            
        });
    });
});
Route::get('/test/401', fn () => abort(401, 'Unauthenticated'));
Route::get('/test/403', fn () => abort(403, 'Forbidden'));
Route::get('/test/404', fn () => abort(404, 'Not Found'));
Route::get('/test/500', fn () => throw new Exception('Boom'));
