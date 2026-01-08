<?php

namespace App\Services;

use Illuminate\Http\Request;
use Psr\Log\LoggerInterface;
use Throwable;

class ExceptionReporter
{
    public function __construct(private LoggerInterface $logger) {}

    public function report(
        Throwable $e,
        Request $request,
        string $level,
        string $message,
        array $context = []
    ): void {
        if ($level === 'none') {
            return;
        }

        $logContext = array_merge([
            'exception' => get_class($e),
            'message'   => $e->getMessage(),
            'file'      => $e->getFile(),
            'line'      => $e->getLine(),
            'url'       => $request->fullUrl(),
            'method'    => $request->method(),
            'ip'        => $request->ip(),
        ], $context);

        if (!method_exists($this->logger, $level)) {
            $level = 'warning';
        }

        $this->logger->{$level}($message, $logContext);
    }
}
