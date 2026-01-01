<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CookieTokenToBearer
{
    public function handle(Request $request, Closure $next)
    {
        // אם כבר יש Authorization header — לא נוגעים
        if (!$request->headers->has('Authorization')) {
            $token = $request->cookie('access_token');

            if ($token) {
                $request->headers->set('Authorization', 'Bearer ' . $token);
            }
        }
        \Log::info('cookieAuth debug', [
            'cookie_token_exists' => (bool) $request->cookie('access_token'),
            'cookie_token_first10' => substr((string) $request->cookie('access_token'), 0, 10),
            'auth_header' => $request->header('Authorization'),
        ]);

        return $next($request);
    }
}
