<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\Client\BookingResource;
use App\Services\Client\BookingService;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class BookingController extends Controller
{
    public function __construct(
        private BookingService $bookingService
    ) {}


    public function index()
    {
            $bookings = $this->bookingService->getUserBookings();
            return BookingResource::collection($bookings)->additional([
                'success' => true,
                'message' => 'Réservations récupérées avec succès'
            ]);
    }
    public function show($id)
    {

            $booking = $this->bookingService->getUserBooking($id);
            return new BookingResource($booking);

       
    }

    public function cancel($id)
    {
      
            $result = $this->bookingService->cancelBooking($id);
            return response()->json($result, 200);

 
    }

    public function destroy($id)
    {
     
            $result = $this->bookingService->deleteBooking($id);
            return response()->json($result, 200);

    
    }
    public function profile()
    {
        $user = auth()->user();
        return response()->json([
        'success' => true,
        'data' => [
            'id'         => $user->id,
            'first_name' => $user->first_name,
            'last_name'  => $user->last_name,
            'email'      => $user->email,
            'phone'      => $user->phone,
            'role'       => $user->role,
            'created_at' => $user->created_at->format('d M Y'),
        ]
        ]);
    }
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email,' . $user->id,
            'phone'      => 'nullable|string|max:20',
        ]);

        $user->update($validated);
        $user = $user->fresh();  // ✅ Récupère les données mises à jour

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour avec succès',
            'data' => [
                'id'         => $user->id,
                'first_name' => $user->first_name,
                'last_name'  => $user->last_name,
                'email'      => $user->email,
                'phone'      => $user->phone,
                'role'       => $user->role,
                'created_at' => $user->created_at->format('d M Y'),
            ]
        ]);
    }
}   