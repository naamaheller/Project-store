<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ImageUploadService
{
    public function handle(?UploadedFile $file, ?string $url): ?string
    {
        if ($file) {
            $upload = Cloudinary::upload(
                $file->getRealPath(),
                ['folder' => 'products']
            );

            return $upload->getSecurePath();
        }

        return $url;
    }
}