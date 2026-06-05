<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;
    protected $fillable = [
        'car_id', 'user_id', 'agency_id',
        'start_date', 'end_date', 'total_price', 'status',
        'state', 'payment_intent_id', 'payment_status', 'deposit_amount', 'deposit_auth_id',
        'cancellation_reason', 'canceled_by', 'picked_up_at', 'returned_at', 'no_show_at'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'picked_up_at' => 'datetime',
        'returned_at' => 'datetime',
        'no_show_at' => 'datetime',
        'deposit_amount' => 'decimal:2',
    ];

// Relations
public function car() {
    return $this->belongsTo(Car::class, 'car_id', 'id');
}
public function user()   { return $this->belongsTo(User::class); }

public function agency() { return $this->belongsTo(Agency::class); }
    
    public function transitions()
    {
        return $this->hasMany(BookingStateTransition::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
