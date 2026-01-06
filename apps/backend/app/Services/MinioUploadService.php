<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class MinioUploadService
{
    public function handle(?UploadedFile $file, ?string $existingPath): ?string
    {
        if (!$file) {
            return $existingPath;
        }

        if ($existingPath) {
            Storage::disk('minio')->delete($existingPath);
        }

        return Storage::disk('minio')->putFile('products', $file);
    }
}
