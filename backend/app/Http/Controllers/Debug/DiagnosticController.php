<?php

namespace App\Http\Controllers\Debug;

use App\Models\Booking;
use App\Models\Car;
use Illuminate\Support\Facades\DB;

class DiagnosticController
{
    public function checkBooking($bookingId)
    {
        $booking = Booking::find($bookingId);
        
        if (!$booking) {
            return response()->json(['error' => "Réservation {$bookingId} non trouvée"]);
        }

        $carId = $booking->car_id;
        $carExists = Car::find($carId);

        $debug = [
            '📋 Booking' => $booking->toArray(),
            '🚗 Car ID dans réservation' => $carId,
            '🔍 Voiture existe' => $carExists ? true : false,
            '❌ Problème' => !$carExists ? "La voiture ID {$carId} n'existe pas - elle a probablement été supprimée" : 'La voiture existe',
            '🔗 Relation car chargée' => $booking->car ? true : false,
            '✅ Car data' => $booking->car ? $booking->car->toArray() : null,
        ];

        // Vérifier si c'est un problème de contrainte étrangère
        $orphaned = Booking::whereNotIn('car_id', DB::table('cars')->select('id'))->count();
        $debug['📊 Réservations orphelines'] = $orphaned;

        return response()->json($debug);
    }

    public function listAllIssues()
    {
        $issues = [];

        // Réservations sans voiture
        $orphaned = Booking::whereNotIn('car_id', DB::table('cars')->select('id'))->get();
        if ($orphaned->count() > 0) {
            $issues['Réservations orphelines'] = $orphaned->pluck('id')->toArray();
        }

        // Réservations avec car_id NULL
        $nullCar = Booking::whereNull('car_id')->get();
        if ($nullCar->count() > 0) {
            $issues['Réservations avec car_id NULL'] = $nullCar->pluck('id')->toArray();
        }

        // Total
        $issues['Total réservations'] = Booking::count();
        $issues['Total voitures'] = Car::count();

        return response()->json($issues);
    }
}
