<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\BookingStateTransition;
use Illuminate\Support\Facades\DB;use Illuminate\Support\Facades\Schema;use Illuminate\Database\Eloquent\ModelNotFoundException;

class BookingService
{
    /**
     * Create a booking transactionally with a simple availability check.
     * Throws \Exception on conflict.
     */
    public function createBooking(array $data, $user = null): Booking
    {
        return DB::transaction(function () use ($data, $user) {
            // Lock the car row to prevent concurrent availability races
            $car = DB::table('cars')->where('id', $data['car_id'])->lockForUpdate()->first();
            if (! $car) {
                throw new ModelNotFoundException('Car not found');
            }

            // Check overlapping bookings for this car
            $overlap = Booking::where('car_id', $data['car_id'])
                ->where(function ($q) use ($data) {
                    $q->where('start_date', '<=', $data['end_date'])
                      ->where('end_date', '>=', $data['start_date']);
                })
                ->whereIn('status', ['pending', 'confirmed'])
                ->exists();

            if ($overlap) {
                throw new \Exception('Vehicle is not available for the requested period');
            }

            $booking = Booking::create(array_merge($data, [
                'status' => $data['status'] ?? 'pending',
            ]));

            // Log initial status transition when the transition table exists
            if (Schema::hasTable('booking_state_transitions')) {
                BookingStateTransition::create([
                    'booking_id' => $booking->id,
                    'from' => null,
                    'to' => $booking->status,
                    'user_id' => $user?->id ?? null,
                    'reason' => 'created',
                ]);
            }

            return $booking;
        });
    }

    /**
     * Transition booking state and record audit.
     */
    public function transition(Booking $booking, string $to, $by = null, ?string $reason = null): Booking
    {
        return DB::transaction(function () use ($booking, $to, $by, $reason) {
            $from = $booking->status;
            $booking->status = $to;
            $booking->save();

            if (Schema::hasTable('booking_state_transitions')) {
                BookingStateTransition::create([
                    'booking_id' => $booking->id,
                    'from' => $from,
                    'to' => $to,
                    'user_id' => $by?->id ?? null,
                    'reason' => $reason,
                ]);
            }

            return $booking;
        });
    }
}
