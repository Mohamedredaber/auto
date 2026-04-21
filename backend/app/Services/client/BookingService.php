<?php

namespace App\Services\Client;

use App\Models\Booking;
use Illuminate\Support\Collection;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class BookingService
{
    public function getUserBookings(): Collection
    {
        return Booking::where('user_id', auth()->id())
            ->with([
                'car:id,brand,model,agency_id,price_per_day,category',
                'car.images' => fn($q) => $q->where('is_cover', true),
                'agency:id,agency_name,city'
            ])
            ->orderBy('start_date', 'desc')
            ->get();
    }

    public function getUserBooking(int $id): Booking
    {
        $booking = Booking::where('user_id', auth()->id())
            ->where('id', $id)
            ->with([
                'car:id,brand,model,agency_id,price_per_day,category,year,fuel,transmission,seats,doors,description',
                'car.images',
                'agency:id,agency_name,city,address,phone'
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

        if (!in_array($booking->status, ['pending', 'confirmed'])) {
            throw new HttpException(403, 'Impossible d\'annuler cette réservation');
        }

        if (strtotime($booking->start_date) < time()) {
            throw new HttpException(403, 'La réservation a déjà commencé');
        }

        $booking->update(['status' => 'canceled']);

        return [
            'message' => 'Réservation annulée avec succès',
            'booking' => $booking
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