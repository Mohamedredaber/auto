<?php

namespace App\Http\Controllers\Agency;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Http\Resources\Agency\BookingResource;
use App\Http\Requests\Agency\Booking\UpdateBookingRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
class ReservationController extends Controller
{
    /**
     * Lister toutes les réservations de l'agence
     */
 public function index(Request $request)
{
    $agencyId = Auth::user()->agency_id; // Récupère l'ID de l'agence de l'utilisateur connecté

    $query = Booking::with(['car', 'user'])
        ->where('agency_id', $agencyId);

    if ($request->has('search') && $request->search != '') {
        $search = $request->search;
        $query->where(function($q) use ($search) {
            $q->where('id', 'like', "%$search%")
              ->orWhereHas('user', function($qu) use ($search) {
                  $qu->where('first_name', 'like', "%$search%")
                    ->orWhere('last_name', 'like', "%$search%");
              })
              
              ->orWhereHas('car', function($qc) use ($search) {
                  $qc->where('brand', 'like', "%$search%")
                    ->orWhere('model', 'like', "%$search%");
              });
        });
    }

    if ($request->has('status') && $request->status != 'all') {
        $query->where('status', $request->status);
    }

    if ($request->has('date_start') && $request->has('date_end')) {
        $query->whereBetween('start_date', [$request->date_start, $request->date_end]);
    }

    $bookings = $query->latest()->paginate($request->get('per_page', 15));

    // 6. On retourne la collection avec les métadonnées
    return BookingResource::collection($bookings)->additional([
        'success' => true,
        'message' => 'Réservations filtrées avec succès.',
    ]);
}

    /**
     * Afficher une réservation spécifique
     */
    public function show(Booking $booking)
    {
        if ($booking->agency_id !== Auth::user()->agency_id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        return (new BookingResource($booking->load(['car', 'user', 'car.images'])))
            ->additional(['success' => true]);
    }

    /**
     * Mettre à jour le statut d'une réservation
     */
    public function update(UpdateBookingRequest $request, Booking $booking)
    {
        if ($booking->agency_id !== Auth::user()->agency_id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        return DB::transaction(function () use ($request, $booking) {
            $booking->update(['status' => $request->validated('status')]);

            return (new BookingResource($booking->load(['car', 'user'])))
                ->additional([
                    'success' => true,
                    'message' => 'Statut de la réservation mis à jour.'
                ]);
        });
    }

    /**
     * Annuler une réservation
     */
    public function cancel(Booking $booking)
    {
        if ($booking->agency_id !== Auth::user()->agency_id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        if ($booking->status === 'canceled') {
            return response()->json([
                'success' => false,
                'message' => 'Cette réservation est déjà annulée.'
            ], 400);
        }

        if ($booking->status === 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Impossible d\'annuler une réservation complétée.'
            ], 400);
        }

        $booking->update(['status' => 'canceled']);

        return response()->json([
            'success' => true,
            'message' => 'Réservation annulée avec succès.'
        ]);
    }

    /**
     * Filtrer les réservations par statut
     */


    /**
     * Statistiques des réservations
     */
    public function stats()
    {
        $agencyId = Auth::user()->agency_id;

        $stats = [
            'total_bookings' => Booking::where('agency_id', $agencyId)->count(),
            'pending' => Booking::where('agency_id', $agencyId)->where('status', 'pending')->count(),
            'confirmed' => Booking::where('agency_id', $agencyId)->where('status', 'confirmed')->count(),
            'canceled' => Booking::where('agency_id', $agencyId)->where('status', 'canceled')->count(),
            'completed' => Booking::where('agency_id', $agencyId)->where('status', 'completed')->count(),
            'total_revenue' => Booking::where('agency_id', $agencyId)->where('status', 'completed')->sum('total_price'),
            'pending_revenue' => Booking::where('agency_id', $agencyId)->where('status', '!=', 'canceled')->sum('total_price'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Réservations par période (derniers 30 jours, etc.)
     */
    public function recentBookings($days = 30)
    {
        $agencyId = Auth::user()->agency_id;
        $startDate = now()->subDays($days);

        $bookings = Booking::with(['car', 'user'])
            ->where('agency_id', $agencyId)
            ->where('created_at', '>=', $startDate)
            ->latest()
            ->paginate(15);

        return BookingResource::collection($bookings)->additional([
            'success' => true,
            'message' => "Réservations des {$days} derniers jours.",
        ]);
    }
}