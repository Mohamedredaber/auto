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
        $userId = auth()->id();
        if (!$userId) {
            return collect();
        }
        
        return Booking::where('user_id', $userId)
            ->with([
                'car' => fn($q) => $q->select('id', 'brand', 'model', 'agency_id', 'price_per_day', 'category', 'year'),
                'car.images' => fn($q) => $q->where('is_cover', true)->select('id', 'car_id', 'url', 'is_cover'),
                'agency' => fn($q) => $q->select('id', 'agency_name', 'city')
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
                'car' => fn($q) => $q->select('id', 'brand', 'model', 'agency_id', 'price_per_day', 'category', 'year', 'fuel', 'transmission', 'seats', 'doors', 'description', 'additional_information'),
                'car.images' => fn($q) => $q->select('id', 'car_id', 'url', 'is_cover'),
                'agency' => fn($q) => $q->select('id', 'agency_name', 'city', 'address', 'phone')
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