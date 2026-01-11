<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use RuntimeException;

class ProductExportService
{
    public function exportProductsToS3(): array
    {
        $products = Product::with('category')->orderBy('created_at')->get();

        if ($products->isEmpty()) {
            throw new RuntimeException('No products found');
        }

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setRightToLeft(true);

        $headers = [
            'A1' => 'ID',
            'B1' => 'שם מוצר',
            'C1' => 'מחיר',
            'D1' => 'קטגוריה',
            'E1' => 'פעיל',
            'F1' => 'כמות במלאי',
            'G1' => 'נוצר בתאריך',
        ];

        foreach ($headers as $cell => $text) {
            $sheet->setCellValue($cell, $text);
        }

        $row = 2;
        foreach ($products as $product) {
            $sheet->setCellValue("A{$row}", $product->id);
            $sheet->setCellValue("B{$row}", $product->name);
            $sheet->setCellValue("C{$row}", $product->price);
            $sheet->setCellValue("D{$row}", $product->category?->name ?? '—');
            $sheet->setCellValue("E{$row}", $product->is_active ? 'כן' : 'לא');
            $sheet->setCellValue("F{$row}", $product->stock);
            $sheet->setCellValue("G{$row}", $product->created_at?->format('d/m/Y H:i'));
            $row++;
        }

        foreach (range('A', 'G') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        $fileName = 'products_' . now()->format('Y-m-d_H-i-s') . '.xlsx';
        $localDir = storage_path('app/products');

        if (!is_dir($localDir)) {
            mkdir($localDir, 0755, true);
        }

        $localPath = $localDir . '/' . $fileName;

        (new Xlsx($spreadsheet))->save($localPath);

        $remotePath = 'exports/products/' . $fileName;

        Storage::disk('minio')->put(
            $remotePath,
            file_get_contents($localPath),
            'private'
        );

        unlink($localPath);

        $url = Storage::disk('minio')->temporaryUrl(
            $remotePath,
            now()->addMinutes(5)
        );

        return [
            'path' => $remotePath,
            'url' => $url,
        ];
    }
}
