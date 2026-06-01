<?php

namespace App\Http\Controllers\Agency;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Agency;
use Illuminate\Support\Facades\Storage;

class Agencies extends Controller
{
    public function cities()
    {
        $cities = Agency::query()
            ->whereNotNull('city')
            ->where('city', '!=', '')
            ->distinct()
            ->orderBy('city')
            ->pluck('city');

        return response()->json([
            'success' => true,
            'message' => 'Liste des villes récupérée.',
            'data' => $cities,
        ]);
    }

    public function stats(){
        
        return response()->json([
            'success' => true,
            'message' => 'Statistiques des agences récupérées avec succès',
            'data' => [
                'total_agencies' => Agency::count(),
                'total_agencies_verified' => Agency::where('is_verified', 'verified')->count(),
                'total_agencies_inverified' => Agency::where('is_verified', 'inverified')->count(),
                'total_agencies_wait' => Agency::where('is_verified', 'wait')->count(),
            ]
        ]);
    }


    public function index(Request $request)
    {
        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'is_verified' => ['nullable', 'in:verified,inverified,wait'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $name = isset($validated['name']) ? trim($validated['name']) : null;
        $city = isset($validated['city']) ? trim($validated['city']) : null;
        $status = $validated['is_verified'] ?? null;
        $perPage = $validated['per_page'] ?? 10;

        $query = Agency::query()
        ->withCount('cars')
        ->when($name, function ($q, $name) {
            $q->where('agency_name', 'like', '%' . $name . '%');
        })
        ->when($city, function ($q, $city) {
            $q->where('city', 'like', '%' . $city . '%');
        })
        ->when($status, function ($q, $status) {
            $q->where('is_verified', $status);
        });

        $agencies = $query->latest('id')->paginate($perPage)->appends($request->query());

        return response()->json([
            'success' => true,
            'message' => 'Liste des agences récupérée.',
            'data' => $agencies
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'agency_name' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'address' => ['required', 'string'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'time_start' => ['required'],
            'time_end' => ['required'],
            'is_verified' => ['nullable', 'in:verified,inverified,wait'],
            'accounts_social' => ['nullable', 'array'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('logos', 'public');
        }

        if (!isset($validated['is_verified'])) {
            $validated['is_verified'] = Agency::STATUS_WAIT;
        }

        $agency = Agency::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Agence créée avec succès.',
            'data' => $agency,
        ], 201);
    }
    
    public function show($id)

    {
        $agency = Agency::find($id)->loadCount('cars');
        if (!$agency) {
            return response()->json([
                'success' => false,
                'message' => 'Agence introuvable.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Détails de l\'agence récupérés.',
            'data' => $agency
        ]);
      
    }

    public function update(Request $request, $id)
    {
        $agency = Agency::find($id);
        if (!$agency) {
            return response()->json([
                'success' => false,
                'message' => 'Agence introuvable.',
            ], 404);
        }

        $validated = $request->validate([
            'agency_name' => ['sometimes', 'required', 'string', 'max:255'],
            'city' => ['sometimes', 'required', 'string', 'max:100'],
            'address' => ['sometimes', 'required', 'string'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'time_start' => ['sometimes', 'required'],
            'time_end' => ['sometimes', 'required'],
            'is_verified' => ['sometimes', 'required', 'in:verified,inverified,wait'],
            'accounts_social' => ['nullable', 'array'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        if ($request->hasFile('logo')) {
            if ($agency->logo) {
                Storage::disk('public')->delete($agency->logo);
            }
            $validated['logo'] = $request->file('logo')->store('logos', 'public');
        }

        $agency->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Agence mise à jour avec succès.',
            'data' => $agency->fresh(),
        ]);
    }

    public function destroy($id)
    {
        $agency = Agency::find($id);
        if (!$agency) {
            return response()->json([
                'success' => false,
                'message' => 'Agence introuvable.',
            ], 404);
        }

        $agency->delete();

        return response()->json([
            'success' => true,
            'message' => 'Agence supprimée avec succès.',
        ]);
    }
}
