<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agency extends Model
{
    use HasFactory;
    protected $fillable = [
        'agency_name',
        'city',
        'address',
        'latitude',
        'longitude',
        'time_start',
        'time_end',
        'is_verified',
        'logo',
        'accounts_social',
    ];
    

    protected $casts = [
        'is_verified'     => 'boolean',
        'accounts_social' => 'array',
        'latitude'        => 'float',
        'longitude'       => 'float',
    ];
    public function cars()
    {
        return $this->hasMany(Car::class);
    }
    public function users()
    {
        return $this->hasMany(User::class, 'agency_id');
    }
    public function admin(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(User::class, 'agency_id');
    }

    // URL publique du logo
    public function getLogoUrlAttribute(): ?string
    {
        return $this->logo ? asset("storage/{$this->logo}") : null;
    }
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
    public function clients(){
        return $this->hasManyThrough(User::class, Booking::class, 'agency_id', 'id', 'id', 'user_id')
                    ->distinct();
    }
}