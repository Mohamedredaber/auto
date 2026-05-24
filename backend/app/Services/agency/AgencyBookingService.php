<?php
namespace App\Services\Agency;


use App\Models\Booking;
use Illuminate\Support\Facades\Auth;
class AgencyBookingService
{
    public function getAgencyBookings($request)
    {
        $agencyId = Auth::user()->agency_id; // Assure-toi que l'user a un agency_id

        return Booking::whereHas('car', function($query) use ($agencyId) {
                $query->where('agency_id', $agencyId);
            })
            ->with(['user', 'car']) // Eager loading pour éviter les requêtes N+1
            ->when($request->search, function($q, $search) {
                $q->where('id', 'like', "%$search%")
                  ->orWhereHas('user', function($qu) use ($search) {
                      $qu->where('first_name', 'like', "%$search%");
                  });
            })
            ->latest()
            ->paginate(10);
    }

    public function getAgencyStats()
    {
        $agencyId = Auth::user()->agency_id;
        $baseQuery = Booking::whereHas('car', function($q) use ($agencyId) {
            $q->where('agency_id', $agencyId);
        });

        return [
            'total' => (clone $baseQuery)->count(),
            'pending' => (clone $baseQuery)->where('status', 'pending')->count(),
            'confirmed' => (clone $baseQuery)->where('status', 'confirmed')->count(),
            'cancelled' => (clone $baseQuery)->where('status', 'canceled')->count(),
        ];
    }
}