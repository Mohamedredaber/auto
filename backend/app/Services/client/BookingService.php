<?php

namespace App\Services\Client;

use App\Models\Booking;
use App\Services\BookingService as CoreBookingService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class BookingService
{
    public function getUserBookings(): Collection
    {
        $userId = auth()->id();
        if (!$userId) {
            return collect();
        }
        
        return Booking::where('user_id', $userId)
            ->with([
                 'car',
                'agency'
            ])
            ->orderBy('start_date', 'desc')
            ->get();
    }
    public function getUserBooking(int $id): Booking
    {
        $userId = auth()->id();
        if (!$userId) {
            throw new NotFoundHttpException('Non authentifié');
        }
        
        $booking = Booking::where('user_id', $userId)
            ->where('id', $id)
            ->with([
                'car',
                'agency'
            ])
            ->first();

        if (!$booking) {
            throw new NotFoundHttpException('Réservation non trouvée');
        }

        return $booking;
    }

    public function cancelBooking(int $id): array
    {
        $booking = $this->getUserBooking($id);
        $user = auth()->user();
        $core = new CoreBookingService();

        $result = DB::transaction(function () use ($booking, $core, $user) {
            // update legacy status for compatibility and richer state
            $booking->update([
                'status' => 'canceled',
                'cancellation_reason' => 'Annulé par l\'utilisateur',
                'canceled_by' => $user->id ?? null,
            ]);

            $core->transition($booking, 'canceled', $user, 'Annulé par l\'utilisateur');

            return $booking->fresh();
        });

        return [
            'message' => 'Réservation annulée avec succès',
            'booking' => $result
        ];
    }

    public function deleteBooking(int $id): array
    {
        $booking = $this->getUserBooking($id);

        if ($booking->status !== 'canceled') {
            throw new HttpException(403, 'Seules les réservations annulées peuvent être supprimées');
        }

        $booking->delete();
        return [
            'message' => 'Réservation supprimée définitivement'
        ];
    }
}