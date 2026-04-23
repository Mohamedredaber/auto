<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\Client\BookingResource;
use App\Services\Client\BookingService;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class BookingController extends Controller
{
    public function __construct(
        private BookingService $bookingService
    ) {}

    public function index()
    {
        try {
            $bookings = $this->bookingService->getUserBookings();
            return BookingResource::collection($bookings)->additional([
                'success' => true,
                'message' => 'Réservations récupérées avec succès'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching user bookings: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $booking = $this->bookingService->getUserBooking($id);
            return new BookingResource($booking);

        } catch (HttpExceptionInterface $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], $e->getStatusCode());
        }
    }

    public function cancel($id)
    {
        try {
            $result = $this->bookingService->cancelBooking($id);
            return response()->json($result, 200);

        } catch (HttpExceptionInterface $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], $e->getStatusCode());
        }
    }

    public function destroy($id)
    {
        try {
            $result = $this->bookingService->deleteBooking($id);
            return response()->json($result, 200);

        } catch (HttpExceptionInterface $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], $e->getStatusCode());
        }
    }
}