<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
   ->withMiddleware(function (Middleware $middleware): void {

    $middleware->priority([
        \App\Http\Middleware\CookieTokenToBearer::class,
        \Illuminate\Auth\Middleware\Authenticate::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ]);

    $middleware->alias([
        'cookieAuth' => \App\Http\Middleware\CookieTokenToBearer::class,
        'admin' => \App\Http\Middleware\AdminMiddleware::class,
        
    ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        // כל פעם ש-auth נכשל -> להחזיר 401 JSON ולא redirect
        // $exceptions->render(function (AuthenticationException $e, $request) {
        //     return response()->json(['message' => 'Unauthenticated'], 401);
        // });
    })
    ->create();
