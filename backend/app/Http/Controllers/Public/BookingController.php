<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Car;

class BookingController extends Controller

{
    public function getCarForBooking($id)
{
    $car = Car::with('agency')->findOrFail($id);
    
    return response()->json($car);
}
    public function store(Request $request) 
    {
    $car = Car::findOrFail($request->car_id);

    // 2. Calculer la durée (en jours)
    $start = \Carbon\Carbon::parse($request->start_date);
    $end = \Carbon\Carbon::parse($request->end_date);
    $days = $start->diffInDays($end) ?: 1; // Minimum 1 jour

    // 3. Créer la réservation
    $booking = Booking::create([
        'car_id'      => $car->id,
        'user_id'     => auth()->id(),
        'agency_id'   => $car->agency_id, // On récupère l'agence de la voiture
        'start_date'  => $request->start_date,
        'end_date'    => $request->end_date,
        'total_price' => $days * $car->price_per_day,
        'status'      => 'pending',
    ]);

    return response()->json($booking);
}
}
