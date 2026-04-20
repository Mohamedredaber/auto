<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;
    protected $fillable = [
    'car_id', 'user_id', 'agency_id', 
    'start_date', 'end_date', 'total_price', 'status'
];

// Relations
public function car()    { return $this->belongsTo(Car::class); }
public function user()   { return $this->belongsTo(User::class); }
public function agency() { return $this->belongsTo(Agency::class); }
}
