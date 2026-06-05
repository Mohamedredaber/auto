<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get Client Dashboard Overview
     * Returns: Stats, Recent Activity, Account Health
     */
    public function getDashboardData(Request $request)
    {
        $user = auth()->user();
        
        $allBookings = $user->bookings()->get();
        $completedBookings = $user->bookings()->where('status', 'completed')->get();
        $activeBookings = $user->bookings()->whereIn('status', ['confirmed', 'pending'])->get();
        
        $stats = [
            'total_bookings' => $allBookings->count(),
            'total_spent' => $completedBookings->sum('total_price') ?? 0,
            'active_bookings' => $activeBookings->count(),
        ];

        $recentBooking = $user->bookings()
            ->with(['car', 'agency'])
            ->orderBy('created_at', 'desc')
            ->first();

        $recentActivity = $recentBooking ? [
            'id' => $recentBooking->id,
            'car_brand' => $recentBooking->car->brand,
            'car_model' => $recentBooking->car->model,
            'car_image' => asset('storage/' . $recentBooking->car->coverImage->url),
            'agency_name' => $recentBooking->agency->name,
            'start_date' => $recentBooking->start_date,
            'end_date' => $recentBooking->end_date,
            'total_price' => $recentBooking->total_price,
            'status' => $recentBooking->status,
            'created_at' => $recentBooking->created_at,
        ] : null;

        // ========== ACCOUNT HEALTH ==========
        $profileCompletion = $this->calculateProfileCompletion($user);

        // ========== CHART DATA (LAST 6 MONTHS) ==========
        $chartData = $user->bookings()
            ->selectRaw('MONTH(created_at) as month, YEAR(created_at) as year, COUNT(*) as count')
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get()
            ->map(fn($item) => [
                'month' => $this->getMonthName($item->month),
                'count' => $item->count,
                'value' => $item->count,
            ]);

        // ========== RESPONSE ==========
        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'recent_activity' => $recentActivity,
                'account_health' => $profileCompletion,
                'chart_data' => $chartData,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->first_name . ' ' . $user->last_name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                ],
            ]
        ]);
    }

    /**
     * Calculate profile completion percentage
     */
    private function calculateProfileCompletion($user): int
    {
        $fields = [
            'first_name' => !empty($user->first_name),
            'last_name' => !empty($user->last_name),
            'email' => !empty($user->email),
            'phone' => !empty($user->phone),
        ];

        $completed = array_filter($fields);
        return round((count($completed) / count($fields)) * 100);
    }

    /**
     * Get month name from number
     */
    private function getMonthName($month): string
    {
        $months = [
            1 => 'Jan', 2 => 'Fév', 3 => 'Mar', 4 => 'Avr',
            5 => 'Mai', 6 => 'Juin', 7 => 'Juil', 8 => 'Aoû',
            9 => 'Sep', 10 => 'Oct', 11 => 'Nov', 12 => 'Déc',
        ];
        return $months[$month] ?? 'N/A';
    }
}
