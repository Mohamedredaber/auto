<?php

namespace App\Http\Controllers\Agency;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    public function index()
    {
        $agencyId = auth()->user()->agency->id;

        $totalBookings = Booking::where('agency_id', $agencyId)->count();
        $totalRevenue = Booking::where('agency_id', $agencyId)->sum('total_price');
        $popularCar = Car::where('agency_id', $agencyId)
                        ->withCount('bookings')
                        ->orderBy('bookings_count', 'desc')
                        ->first();

        $monthlyBookings = Booking::where('agency_id', $agencyId)
            ->whereYear('created_at', date('Y'))
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw('count(*) as total'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $monthlyRevenue = Booking::where('agency_id', $agencyId)
            ->whereYear('created_at', date('Y'))
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw('sum(total_price) as revenue'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $topCars = Car::where('agency_id', $agencyId)
            ->withCount('bookings')
            ->orderBy('bookings_count', 'desc')
            ->take(5)
            ->get()
            ->map(function($car) {
                return [
                    'model' => $car->brand . ' ' . $car->model,
                    'count' => $car->bookings_count,
                    'revenue' => $car->bookings()->sum('total_price'),
                    'usage_rate' => rand(40, 95) // تقدر تحسبها بـ Logic حقيقي (أيام الكراء / الشهر)
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'total_bookings' => $totalBookings,
                    'total_revenue' => number_format($totalRevenue, 2) . ' MAD',
                    'popular_car' => $popularCar ? $popularCar->brand . ' ' . $popularCar->model : 'N/A',
                    'avg_duration' => '4.2 Jours', // مثال
                ],
                'charts' => [
                    'bookings' => $monthlyBookings,
                    'revenue' => $monthlyRevenue
                ],
                'top_cars' => $topCars
            ]
        ]);
    }
}