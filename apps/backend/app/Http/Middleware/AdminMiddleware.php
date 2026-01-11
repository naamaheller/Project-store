<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {

        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        if ($request->user() && $request->user()->role === 'admin' && $request->user()->tokenCan('admin')) {
            return $next($request);
        } else {
            return response()->json([
                'message' => 'Forbidden - Admins only'
            ], 403);
        }
    }

}
