<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class CarImage extends Model
{
    use HasFactory;
   protected $fillable = [
        'car_id',
        'url',
        'is_cover',
    ];
    

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($image) {
            // Supprimer le fichier physique
            if ($image->url) {
                Storage::disk('public')->delete($image->url);
            }
        });
    }
    
    public function car()
    {
        return $this->belongsTo(Car::class);
    }
    public function isCover(): bool
    {
        return $this->is_cover;
    }
}
