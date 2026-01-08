<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return [
    /*
    |--------------------------------------------------------------------------
    | Exception map (order matters)
    |--------------------------------------------------------------------------
    | Each rule:
    | - status: int|null (null means "derive from exception when possible")
    | - type: string
    | - message: string|null (null means "derive from exception message or fallback")
    | - log: 'none'|'debug'|'info'|'notice'|'warning'|'error'|'critical'|'alert'|'emergency'
    */
    'map' => [
        AuthenticationException::class => [
            'status' => 401,
            'type' => 'AuthenticationException',
            'message' => 'Authentication required. Please provide valid credentials.',
            'log' => 'warning',
            'log_message' => 'Authentication failed',
        ],

        AccessDeniedHttpException::class => [
            'status' => 401, // matches your current behavior (treated as authentication)
            'type' => 'AccessDeniedHttpException',
            'message' => 'Authentication required. Please provide valid credentials.',
            'log' => 'warning',
            'log_message' => 'Authentication failed',
        ],

        AuthorizationException::class => [
            'status' => 403,
            'type' => 'AuthorizationException',
            'message' => 'You do not have permission to perform this action.',
            'log' => 'warning',
            'log_message' => 'Authorization failed',
        ],

        ValidationException::class => [
            'status' => 422,
            'type' => 'ValidationException',
            'message' => 'The provided data is invalid.',
            'log' => 'warning',
            'log_message' => 'Validation failed',
        ],

        ModelNotFoundException::class => [
            'status' => 404,
            'type' => 'ModelNotFoundException',
            'message' => null, // resolved dynamically
            'log' => 'warning',
            'log_message' => 'Resource not found',
        ],

        NotFoundHttpException::class => [
            'status' => 404,
            'type' => 'NotFoundHttpException',
            'message' => null, // resolved dynamically
            'log' => 'warning',
            'log_message' => 'Resource not found',
        ],

        MethodNotAllowedHttpException::class => [
            'status' => 405,
            'type' => 'MethodNotAllowedHttpException',
            'message' => null, // resolved dynamically
            'log' => 'warning',
            'log_message' => 'Method not allowed',
        ],

        HttpException::class => [
            'status' => null,   // derive from getStatusCode()
            'type' => 'HttpException',
            'message' => null,  // derive from exception message or fallback
            'log' => 'warning',
            'log_message' => 'HTTP exception occurred',
        ],

        QueryException::class => [
            'status' => null, // resolved dynamically by error code
            'type' => 'QueryException',
            'message' => null,
            'log' => 'warning',
            'log_message' => 'Database query failed',
        ],
    ],

    'default' => [
        'status' => 500,
        'type' => 'Throwable',
        'message' => 'Server Error',
        'log' => 'warning',
        'log_message' => 'Unhandled exception',
    ],
];
