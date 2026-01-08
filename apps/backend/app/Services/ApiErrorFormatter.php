<?php

namespace App\Services;

use Illuminate\Http\Request;

class ApiErrorFormatter
{
    public function base(Request $request, string $type, int $status, string $message): array
    {
        return [
            'type' => $type,
            'status' => $status,
            'message' => $message,
            'timestamp' => now()->toISOString(),
        ];
    }
}
