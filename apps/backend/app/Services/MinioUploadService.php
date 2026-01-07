<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class MinioUploadService
{
    public function upload(?UploadedFile $file, ?string $existingPath): ?string
    {
        if (!$file) {
            return $existingPath;
        }

        $this->delete($existingPath);

        return Storage::disk('minio')->putFile('products', $file);
    }
    public function delete(?string $path): void
    {
        if (!$path || $this->isExternalUrl($path)) {
            return;
        }

        try {
            Storage::disk('minio')->delete($path);
        } catch (\Throwable $e) {
            logger()->warning('Failed to delete image from MinIO', [
                'path' => $path,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function isExternalUrl(string $path): bool
    {
        return str_starts_with($path, 'http://')
            || str_starts_with($path, 'https://');
    }

    public function temporaryUrl(?string $path): ?string
    {
        if (!$path || $this->isExternalUrl($path)) {
            return $path;
        }

        return Storage::disk('minio')->temporaryUrl(
            $path,
            now()->addMinutes((int) env('TEMP_URL_LIFETIME', 30))
        );
    }

}
