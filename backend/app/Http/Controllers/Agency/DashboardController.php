<?php

namespace App\Http\Controllers\Agency;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index()
{
    $agency = auth()->user()->agency;
    
    $stats = [
        'total_voitures' => $agency->cars()->count(),
        'voitures_disponibles' => $agency->cars()->where('status', 'available')->count(),
        'reservations_actives' => $agency->bookings()->where('status', 'completed')->count(), // الحجوزات المؤكدة حالياً
        'revenu_mensuel' => $agency->bookings()->where('status', 'completed')->whereMonth('created_at', now()->month)->sum('total_price'),
    ];

    $reservationrecente = $agency->bookings()
        ->with(['user', 'car']) 
        ->orderBy('created_at', 'desc')
        ->take(5)
        ->get();

    $volumemensuel = $agency->bookings()
        ->selectRaw('MONTH(created_at) as month, COUNT(*) as count')
        ->where('status', 'completed')
        ->where('created_at', '>=', now()->subMonths(6))
        ->groupBy('month')
        ->orderBy('month')
        ->get();


    $currentTrimestre = $agency->bookings()->where('created_at', '>=', now()->subQuarter())->count();
    $lastTrimestre = $agency->bookings()
        ->where('created_at', '>=', now()->subQuarters(2))
        ->where('created_at', '<', now()->subQuarter())
        ->count();

    $croissanceTrimestre = $lastTrimestre > 0 
        ? (($currentTrimestre - $lastTrimestre) / $lastTrimestre) * 100 
        : 100;

    return response()->json([
        'stats' => $stats,
        'recent_bookings' => $reservationrecente,
        'chart_data' => $volumemensuel,
        'performance' => [
            'trimestre_growth' => round($croissanceTrimestre, 1)
        ]
    ]);
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
