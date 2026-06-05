<?php

namespace App\Http\Controllers\Debug;

use App\Models\Booking;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DebugBookingController
{
    /**
     * Debug une réservation spécifique
     */
    public function debugBooking($bookingId)
    {
        $booking = Booking::find($bookingId);
        
        if (!$booking) {
            return response()->json(['error' => 'Réservation non trouvée']);
        }

        return response()->json([
            '📋 Booking Raw Data' => $booking->toArray(),
            '🔍 Car ID' => $booking->car_id,
            '🚗 Car Data' => $booking->car ? $booking->car->toArray() : 'NULL - La voiture n\'existe pas ou a été supprimée',
            '🏢 Agency Data' => $booking->agency ? $booking->agency->toArray() : 'NULL',
            '👤 User Data' => $booking->user ? $booking->user->toArray() : 'NULL',
            '🖼️ Images' => $booking->car?->images?->toArray() ?? 'Aucune image',
        ]);
    }

    /**
     * Lister tous les problèmes de réservations
     */
    public function debugAllBookings()
    {
        $bookings = Booking::all();
        
        $issues = [
            'total_bookings' => count($bookings),
            'bookings_without_car' => [],
            'bookings_with_car' => [],
        ];

        foreach ($bookings as $booking) {
            if (!$booking->car) {
                $issues['bookings_without_car'][] = [
                    'id' => $booking->id,
                    'car_id' => $booking->car_id,
                    'user_id' => $booking->user_id,
                    'status' => 'Car not found - Data might be inconsistent',
                ];
            } else {
                $issues['bookings_with_car'][] = $booking->id;
            }
        }

        return response()->json($issues);
    }

    /**
     * Réparer les problèmes de réservations
     */
    public function fixBookings()
    {
        // Supprimer les réservations avec car_id NULL
        $deleted = Booking::whereNull('car_id')->delete();
        
        // Supprimer les réservations avec car_id qui n'existe pas
        $invalidBookings = Booking::whereNotIn(
            'car_id',
            DB::table('cars')->select('id')
        )->delete();

        return response()->json([
            'message' => 'Réparation effectuée',
            'deleted_null_car_id' => $deleted,
            'deleted_invalid_car_id' => $invalidBookings,
        ]);
    }
}
