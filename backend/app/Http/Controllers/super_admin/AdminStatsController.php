<?php

namespace App\Http\Controllers\super_admin;

use App\Http\Controllers\Controller;
use App\Models\Agency;
use App\Models\Booking;
use App\Models\User;
use App\Models\Car;
use Illuminate\Support\Facades\DB;

class AdminStatsController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'message' => 'Statistiques récupérées avec succès.',
            'data' => [
                'cards' => $this->cards(),
                'bookings_by_month' => $this->bookingsByMonth(),
                'revenues_by_month' => $this->revenuesByMonth(),
                'agencies_by_month' => $this->agenciesByMonth(),
                'top_cars' => $this->topCars(),
            ],
        ]);
    }

    private function cards()
    {
        return [
            'total_revenue' => Booking::whereIn('status', ['confirmed', 'completed'])
                ->sum('total_price'),

            'total_bookings' => Booking::count(),

            'total_agencies' => Agency::count(),

            'total_users' => User::count(),
        ];
    }

    private function bookingsByMonth()
    {
        return Booking::select(
                DB::raw('MONTH(created_at) as month_number'),
                DB::raw('DATE_FORMAT(created_at, "%b") as month'),
                DB::raw('COUNT(*) as total')
            )
            ->whereYear('created_at', now()->year)
            ->groupBy('month_number', 'month')
            ->orderBy('month_number')
            ->get();
    }

    private function revenuesByMonth()
    {
        return Booking::select(
                DB::raw('MONTH(created_at) as month_number'),
                DB::raw('DATE_FORMAT(created_at, "%b") as month'),
                DB::raw('SUM(total_price) as revenue')
            )
            ->whereYear('created_at', now()->year)
            ->whereIn('status', ['confirmed', 'completed'])
            ->groupBy('month_number', 'month')
            ->orderBy('month_number')
            ->get();
    }

    private function agenciesByMonth()
    {
        return Agency::select(
                DB::raw('MONTH(created_at) as month_number'),
                DB::raw('DATE_FORMAT(created_at, "%b") as month'),
                DB::raw('COUNT(*) as agencies')
            )
            ->whereYear('created_at', now()->year)
            ->groupBy('month_number', 'month')
            ->orderBy('month_number')
            ->get();
    }

    private function topCars()
    {
        return Booking::query()
            ->join('cars', 'bookings.car_id', '=', 'cars.id')
            ->select(
                DB::raw('CONCAT(cars.brand, " ", cars.model) as name'),
                DB::raw('COUNT(bookings.id) as value')
            )
            ->groupBy('cars.id', 'cars.brand', 'cars.model')
            ->orderByDesc('value')
            ->limit(5)
            ->get();
    }

    public function dashboard()
{
    return response()->json([
        'success' => true,
        'message' => 'Données du dashboard récupérées avec succès.',
        'data' => [
            'totals' => [
                'total_agencies' => Agency::count(),
                'total_cars' => Car::count(),
                'total_users' => User::count(),
                'total_bookings' => Booking::count(),
                'total_revenue' => Booking::whereIn('status', ['confirmed', 'completed'])
                    ->sum('total_price'),
            ],

            'bookings_status' => [
                'pending' => Booking::where('status', 'pending')->count(),
                'confirmed' => Booking::where('status', 'confirmed')->count(),
                'completed' => Booking::where('status', 'completed')->count(),
                'canceled' => Booking::where('status', 'canceled')->count(),
            ],

            'cars_status' => [
                'available' => Car::where('status', 'available')->count(),
                'reserved' => Car::where('status', 'reserved')->count(),
                'maintenance' => Car::where('status', 'maintenance')->count(),
            ],

            'users_by_role' => [
                'clients' => User::where('role', 'client')->count(),
                'admin_agencies' => User::where('role', 'admin_agency')->count(),
                'super_admins' => User::where('role', 'super_admin')->count(),
            ],

            'latest_bookings' => Booking::with(['user', 'car', 'agency'])
                ->latest('id')
                ->limit(5)
                ->get()
                ->map(function ($booking) {
                    return [
                        'id' => $booking->id,
                        'user_name' => $booking->user
                            ? $booking->user->first_name . ' ' . $booking->user->last_name
                            : null,
                        'car_name' => $booking->car
                            ? $booking->car->brand . ' ' . $booking->car->model
                            : null,
                        'agency_name' => $booking->agency?->agency_name,
                        'total_price' => $booking->total_price,
                        'status' => $booking->status,
                        'created_at' => $booking->created_at,
                    ];
                }),

            'latest_users' => User::latest('id')
                ->limit(5)
                ->get(['id', 'first_name', 'last_name', 'email', 'role', 'created_at']),
        ],
    ]);
    }
}