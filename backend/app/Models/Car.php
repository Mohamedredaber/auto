<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\CarImage;
use App\Models\Agency;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Storage;

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
        'description',
        'version',
        'additional_information',
    ];
    
    /**
     * Supprimer les fichiers physiques avant la suppression du modèle
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($car) {
            // Supprimer tous les fichiers d'images associés
            foreach ($car->images as $image) {
                Storage::disk('public')->delete($image->url);
            }
        });
    }

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
   public function bookings()
   {
       return $this->hasMany(Booking::class);
   }
}
