<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'img_url',
        'stock',
        'is_active',
        'category_id',
    ];

    // קשר לקטגוריה
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
