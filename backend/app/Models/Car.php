<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\CarImage;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
class Car extends Model
{
    use HasFactory;
 protected $fillable = [
        'agency_id',
        'category',
        'brand',
        'model',
        'year',
        'transmission',
        'fuel',
        'seats',
        'doors',
        'price_per_day',
        'status',
        'available_from',
        'available_to',
        'additional_information',
    ];
    public function coverImage(): HasOne
    {
        return $this->hasOne(CarImage::class)->where('is_cover', true);
    }
   public function images():HasMany
   {
       return $this->hasMany(CarImage::class);
   }
   public function agency()
   {
       return $this->belongsTo(Agency::class);
   }    
}
