<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarImage extends Model
{
    use HasFactory;
   protected $fillable = [
        'car_id',
        'url',
        'is_cover',
    ];
    
    public function car()
    {
        return $this->belongsTo(Car::class);
    }
    public function isCover(): bool
    {
        return $this->is_cover;
    }
}
