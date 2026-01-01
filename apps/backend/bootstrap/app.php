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

        // חשוב: בפרויקט API לא לעשות redirect אף פעם
        $middleware->redirectGuestsTo(fn() => null);

        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,

            // מומלץ גם להגדיר, למקרה שמשתמשים בשם הזה במקום Class
            'cookieAuth' => \App\Http\Middleware\CookieTokenToBearer::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        // כל פעם ש-auth נכשל -> להחזיר 401 JSON ולא redirect
        $exceptions->render(function (AuthenticationException $e, $request) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        });
    })
    ->create();
