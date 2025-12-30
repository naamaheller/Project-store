<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    protected function redirectTo($request)
    {
        // בקשות API לא עושות redirect אף פעם
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }

        // אם זה WEB – אפשר להחזיר route('login') אם יש לך כזה
        return route('login');
    }
}
