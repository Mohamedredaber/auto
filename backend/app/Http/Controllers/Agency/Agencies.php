<?php

namespace App\Http\Controllers\Agency;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Agency;

class Agencies extends Controller
{
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
    
    public function show($id)

    {
        $agency = Agency::find($id);
        return response()->json([
            'success' => true,
            'message' => 'Détails de l\'agence récupérés.',
            'data' => $agency
        ]);
      
    }
}
