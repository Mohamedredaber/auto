<?php

namespace App\Http\Controllers\super_admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminBookingController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(['pending', 'confirmed', 'canceled', 'completed'])],
            'car_id' => ['nullable', 'integer', 'exists:cars,id'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'agency_id' => ['nullable', 'integer', 'exists:agencies,id'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $perPage = $validated['per_page'] ?? 10;

        $bookings = Booking::with(['car', 'user', 'agency'])
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->search;

                $query->where(function ($q) use ($search) {
                    $q->whereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhereHas('car', function ($carQuery) use ($search) {
                        $carQuery->where('brand', 'like', "%{$search}%")
                            ->orWhere('model', 'like', "%{$search}%");
                    })
                    ->orWhereHas('agency', function ($agencyQuery) use ($search) {
                        $agencyQuery->where('agency_name', 'like', "%{$search}%");
                    });
                });
            })
            ->when($request->filled('status'), fn ($query) =>
                $query->where('status', $request->status)
            )
            ->when($request->filled('car_id'), fn ($query) =>
                $query->where('car_id', $request->car_id)
            )
            ->when($request->filled('user_id'), fn ($query) =>
                $query->where('user_id', $request->user_id)
            )
            ->when($request->filled('agency_id'), fn ($query) =>
                $query->where('agency_id', $request->agency_id)
            )
            ->when($request->filled('start_date'), fn ($query) =>
                $query->whereDate('start_date', '>=', $request->start_date)
            )
            ->when($request->filled('end_date'), fn ($query) =>
                $query->whereDate('end_date', '<=', $request->end_date)
            )
            ->latest('id')
            ->paginate($perPage)
            ->appends($request->query());

        return response()->json([
            'success' => true,
            'message' => 'Liste des réservations récupérée.',
            'data' => collect($bookings->items())->map(function ($booking) {
                return $this->formatBooking($booking);
            }),
            'pagination' => [
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
                'from' => $bookings->firstItem(),
                'to' => $bookings->lastItem(),
                'prev_page_url' => $bookings->previousPageUrl(),
                'next_page_url' => $bookings->nextPageUrl(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'car_id' => ['required', 'integer', 'exists:cars,id'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'agency_id' => ['required', 'integer', 'exists:agencies,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'total_price' => ['required', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(['pending', 'confirmed', 'canceled', 'completed'])],
        ]);

        $booking = Booking::create($data);
        $booking->load(['car', 'user', 'agency']);

        return response()->json([
            'success' => true,
            'message' => 'Réservation créée avec succès.',
            'data' => $this->formatBooking($booking),
        ], 201);
    }

    public function show($id)
    {
        $booking = Booking::with(['car', 'user', 'agency'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Détails de la réservation récupérés.',
            'data' => $this->formatBooking($booking),
        ]);
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $data = $request->validate([
            'car_id' => ['sometimes', 'required', 'integer', 'exists:cars,id'],
            'user_id' => ['sometimes', 'required', 'integer', 'exists:users,id'],
            'agency_id' => ['sometimes', 'required', 'integer', 'exists:agencies,id'],
            'start_date' => ['sometimes', 'required', 'date'],
            'end_date' => ['sometimes', 'required', 'date', 'after_or_equal:start_date'],
            'total_price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'status' => ['sometimes', 'required', Rule::in(['pending', 'confirmed', 'canceled', 'completed'])],
        ]);

        $booking->update($data);
        $booking->load(['car', 'user', 'agency']);

        return response()->json([
            'success' => true,
            'message' => 'Réservation mise à jour avec succès.',
            'data' => $this->formatBooking($booking),
        ]);
    }

    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();

        return response()->json([
            'success' => true,
            'message' => 'Réservation supprimée avec succès.',
        ]);
    }

    public function stats()
    {
        return response()->json([
            'success' => true,
            'message' => 'Statistiques des réservations récupérées.',
            'data' => [
                'total_bookings' => Booking::count(),
                'total_pending' => Booking::where('status', 'pending')->count(),
                'total_confirmed' => Booking::where('status', 'confirmed')->count(),
                'total_canceled' => Booking::where('status', 'canceled')->count(),
                'total_completed' => Booking::where('status', 'completed')->count(),
                'total_revenue' => Booking::whereIn('status', ['confirmed', 'completed'])->sum('total_price'),
            ],
        ]);
    }

    private function formatBooking($booking)
    {
        return [
            'id' => $booking->id,

            'car_id' => $booking->car_id,
            'car_name' => $booking->car
                ? $booking->car->brand . ' ' . $booking->car->model
                : null,

            'user_id' => $booking->user_id,
            'user_name' => $booking->user
                ? $booking->user->first_name . ' ' . $booking->user->last_name
                : null,
            'user_email' => $booking->user?->email,

            'agency_id' => $booking->agency_id,
            'agency_name' => $booking->agency?->agency_name,

            'start_date' => $booking->start_date,
            'end_date' => $booking->end_date,
            'total_price' => $booking->total_price,
            'status' => $booking->status,

            'created_at' => $booking->created_at,
            'updated_at' => $booking->updated_at,
        ];
    }
}