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

    // L'admin de cette agence
    public function admin(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(User::class, 'agency_id');
    }

    // URL publique du logo
    public function getLogoUrlAttribute(): ?string
    {
        return $this->logo ? asset("storage/{$this->logo}") : null;
    }
}