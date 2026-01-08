<?php

use App\Services\ApiExceptionHandler;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

use Illuminate\Http\Request;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
   ->withMiddleware(function (Middleware $middleware): void {
    $middleware->throttleApi('60,1');

    $middleware->priority([
        \App\Http\Middleware\CookieTokenToBearer::class,
        \App\Http\Middleware\Authenticate::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ]);

    $middleware->alias([
        'auth' => \App\Http\Middleware\Authenticate::class,
        'cookieAuth' => \App\Http\Middleware\CookieTokenToBearer::class,
        'admin' => \App\Http\Middleware\AdminMiddleware::class,    
        
   
        
    ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        // כל פעם ש-auth נכשל -> להחזיר 401 JSON ולא redirect
        // $exceptions->render(function (AuthenticationException $e, $request) {
        //     return response()->json(['message' => 'Unauthenticated'], 401);
        // });
       $exceptions->render(function (Throwable $e, Request $request) {
    return app(ApiExceptionHandler::class)->handle($e, $request);
});
    })
    ->create();
