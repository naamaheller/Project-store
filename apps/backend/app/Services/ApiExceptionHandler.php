<?php

namespace App\Services;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class ApiExceptionHandler
{
    public function __construct(
        private ResponseFactory $responses,
        private ApiErrorFormatter $formatter,
        private ExceptionReporter $reporter,
        private array $config
    ) {}

    public function handle(Throwable $e, Request $request): JsonResponse
    {
        $rule = $this->matchRule($e);
        $logLevel = (string)($rule['log'] ?? 'warning');
        $logMessage = (string)($rule['log_message'] ?? 'API exception');

        [$status, $type, $message, $extraPayload, $extraLogContext] = $this->resolvePayload($e, $request, $rule);

        $this->reporter->report(
            e: $e,
            request: $request,
            level: $logLevel,
            message: $logMessage,
            context: $extraLogContext
        );

        $payload = $this->formatter->base(
            request: $request,
            type: $type,
            status: $status,
            message: $message
        );

        // Merge in parity fields like validation_errors / allowed_methods
        $payload = array_merge($payload, $extraPayload);

        return $this->responses->json($payload, $status);
    }

    private function matchRule(Throwable $e): array
    {
        $map = $this->config['map'] ?? [];
        foreach ($map as $class => $rule) {
            if ($e instanceof $class) {
                return $rule;
            }
        }

        return $this->config['default'] ?? [
            'status' => 500,
            'type' => 'Throwable',
            'message' => 'Server Error',
            'log' => 'warning',
            'log_message' => 'Unhandled exception',
        ];
    }

    /**
     * Returns: [status, type, message, extraPayload, extraLogContext]
     */
    private function resolvePayload(Throwable $e, Request $request, array $rule): array
    {
        $default = $this->config['default'] ?? [];

        $type = $this->getExceptionType($e, $rule, $default);

        // Validation (parity: validation_errors flattened list)
        if ($e instanceof ValidationException) {
            $errors = $this->flattenValidationErrors($e);

            $status = 422;
            $message = (string)($rule['message'] ?? 'The provided data is invalid.');

            return [
                $status,
                $type,
                $message,
                ['validation_errors' => $errors],
                ['errors' => $errors],
            ];
        }

        // Authentication (AuthenticationException OR AccessDeniedHttpException treated as 401)
        if ($e instanceof AuthenticationException || $e instanceof AccessDeniedHttpException) {
            $status = 401;
            $message = (string)($rule['message'] ?? 'Authentication required. Please provide valid credentials.');

            return [$status, $type, $message, [], []];
        }

        // AuthorizationException => 403
        if ($e instanceof AuthorizationException) {
            $status = 403;
            $message = (string)($rule['message'] ?? 'You do not have permission to perform this action.');

            return [$status, $type, $message, [], []];
        }

        // Not found: ModelNotFoundException / NotFoundHttpException
        if ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
            $status = 404;

            $message = $e instanceof ModelNotFoundException
                ? 'The requested resource was not found.'
                : "The requested endpoint '{$request->getRequestUri()}' was not found.";

            return [$status, $type, $message, [], []];
        }

        // Method not allowed: parity includes allowed_methods
        if ($e instanceof MethodNotAllowedHttpException) {
            $status = 405;
            $message = "The {$request->method()} method is not allowed for this endpoint.";
            $allowed = $e->getHeaders()['Allow'] ?? 'Unknown';

            return [
                $status,
                $type,
                $message,
                ['allowed_methods' => $allowed],
                [],
            ];
        }

        // QueryException: parity branching by MySQL error codes, log sql
        if ($e instanceof QueryException) {
            $sql = method_exists($e, 'getSql') ? $e->getSql() : null;
            $errorCode = $e->errorInfo[1] ?? null;

            $logContext = [];
            if ($sql) {
                $logContext['sql'] = $sql;
            }

            if ($errorCode === 1451) {
                return [
                    409,
                    $type,
                    'Cannot delete this resource because it is referenced by other records.',
                    [],
                    $logContext,
                ];
            }

            if ($errorCode === 1062) {
                return [
                    409,
                    $type,
                    'A record with this information already exists.',
                    [],
                    $logContext,
                ];
            }

            return [
                500,
                $type,
                'A database error occurred. Please try again later.',
                [],
                $logContext,
            ];
        }

        // HttpException: parity uses status code and message fallback
        if ($e instanceof HttpException) {
            $status = $e->getStatusCode();
            $message = $e->getMessage() ?: 'An HTTP error occurred.';

            return [$status, $type, $message, [], []];
        }

        // Default fallback
        $status = (int)($rule['status'] ?? $default['status'] ?? 500);
        $message = (string)($rule['message'] ?? $default['message'] ?? 'Server Error');

        return [$status, $type, $message, [], []];
    }

    private function getExceptionType(Throwable $e, array $rule, array $default): string
    {
        // Maintain parity with your original handler: class basename
        // (rule 'type' exists but we keep original behavior as source of truth)
        $className = basename(str_replace('\\', '/', get_class($e)));
        return $className;
    }

    private function flattenValidationErrors(ValidationException $e): array
    {
        $errors = [];
        foreach ($e->errors() as $field => $messages) {
            foreach ($messages as $message) {
                $errors[] = [
                    'field' => $field,
                    'message' => $message,
                ];
            }
        }
        return $errors;
    }
}
