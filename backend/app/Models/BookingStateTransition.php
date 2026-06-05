<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingStateTransition extends Model
{
    use HasFactory;

    protected $fillable = ['booking_id', 'from', 'to', 'user_id', 'reason'];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
