<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\Authenticate;
use App\Http\Middleware\CookieTokenToBearer;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use Laravel\Sanctum\Http\Middleware\CheckForAnyScope;
use Laravel\Sanctum\Http\Middleware\CheckScopes;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;

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
            CookieTokenToBearer::class,
            Authenticate::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);

        $middleware->alias([
            'auth' => Authenticate::class,
            'cookieAuth' => CookieTokenToBearer::class,
            'admin' => AdminMiddleware::class,
            'scopes' => CheckScopes::class,
            'scope' => CheckForAnyScope::class,

            'permission' => PermissionMiddleware::class,
            'role' => RoleMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,

        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        // כל פעם ש-auth נכשל -> להחזיר 401 JSON ולא redirect
        $exceptions->render(function (AuthenticationException $e, $request) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        });
    })
    ->create();
