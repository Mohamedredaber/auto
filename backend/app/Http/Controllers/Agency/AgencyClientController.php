<?php

namespace App\Http\Controllers\Agency;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AgencyClientController extends Controller
{

 public function index(Request $request)
{
    $agency = auth()->user()->agency;

    $query = $agency->clients()
        ->withCount(['bookings' => function($q) use ($agency) {
            $q->where('agency_id', $agency->id);
        }]);

    if ($request->has('search')) {
        $search = $request->input('search');
        $query->where(function($q) use ($search) {
            $q->where('first_name', 'like', "%{$search}%")
              ->orWhere('last_name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%")
              ->orWhere('phone', 'like', "%{$search}%");
        });
    }

    if ($request->input('filter') === 'frequent') {
        $query->having('bookings_count', '>=', 5);
    }


    $query->orderBy('bookings_count', 'desc');

   
    $clients = $query->paginate(10);

    return response()->json([
        'success' => true,
        'data' => $clients->items(), 
        'meta' => [
            'current_page' => $clients->currentPage(),
            'last_page' => $clients->lastPage(),
            'total' => $clients->total(),
            'per_page' => $clients->perPage(),
        ]
    ]);
}
// App\Http\Controllers\Agency\AgencyClientController.php

public function recent()
{
    $agency = auth()->user()->agency;

    $recentClients = $agency->clients()
        ->withCount(['bookings' => function($q) use ($agency) {
            $q->where('agency_id', $agency->id);
        }])
        ->orderBy('users.created_at', 'desc') 
        ->take(3)
        ->get();

    return response()->json([
        'success' => true,
        'data' => $recentClients
    ]);
}

public function getStats()
{
    $agency = auth()->user()->agency;

    return response()->json([
        'success' => true,
        'data' => [
            'total_clients' => $agency->clients()->distinct()->count(), // العدد الإجمالي بلا تكرار
        ]
    ]);
}
}