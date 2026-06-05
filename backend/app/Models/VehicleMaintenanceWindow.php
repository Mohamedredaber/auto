<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleMaintenanceWindow extends Model
{
    use HasFactory;

    protected $fillable = ['vehicle_id', 'start_at', 'end_at', 'reason', 'created_by'];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Car::class, 'vehicle_id');
    }
}
