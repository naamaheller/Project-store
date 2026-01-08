<?php

namespace App\Services;

use Illuminate\Http\Request;

class ApiErrorFormatter
{
    /**
     * Base payload used across all API errors.
     * You can extend this later (JSON:API, etc.) without touching the dispatcher logic.
     */
    public function base(Request $request, string $type, int $status, string $message): array
    {
        return [
            'type'      => $type,
            'status'    => $status,
            'message'   => $message,
            'timestamp' => now()->toISOString(),
        ];
    }
}
