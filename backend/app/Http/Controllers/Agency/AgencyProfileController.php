<?php

namespace App\Http\Controllers\Agency;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class AgencyProfileController extends Controller
{
    /**
     * Récupérer les informations du profil
     */
    public function index()
    {
        /** @var User $user */
        $user = auth()->user();
        $agency = $user->agency;

        if (!$agency) {
            return response()->json(['success' => false, 'message' => 'Agence non trouvée'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id'              => $agency->id,
                'agency_name'     => $agency->agency_name,
                'city'            => $agency->city,
                'address'         => $agency->address,
                'latitude'        => $agency->latitude,
                'longitude'       => $agency->longitude,
                'time_start'      => $agency->time_start,
                'time_end'        => $agency->time_end,
                'is_verified'     => $agency->is_verified,
                'logo_url'        => $agency->logo_url,
                'accounts_social' => $agency->accounts_social,
                'phone'           => $user->phone,
                'email'           => $user->email,
            ]
        ]);
    }

    /**
     * Mettre à jour les informations de l'agence
     */
    public function update(Request $request)
    {
        /** @var User $user */
        $user = auth()->user();
        $agency = $user->agency;

        // Sécurité : Vérifier si l'agence existe
        if (!$agency) {
            return response()->json(['success' => false, 'message' => 'Agence introuvable'], 404);
        }

        $validated = $request->validate([
            'agency_name'     => 'required|string|max:255',
            'city'            => 'required|string|max:100',
            'address'         => 'required|string',
            'time_start'      => 'required',
            'time_end'        => 'required',
            'latitude'        => 'nullable|numeric',
            'longitude'       => 'nullable|numeric',
            'accounts_social' => 'nullable|array',
            'phone'           => 'nullable|string', // Validation pour le téléphone
        ]);

        try {
            DB::beginTransaction();

            // 1. Mise à jour de l'agence
            // L'erreur "undefined" disparaît ici car $agency est une instance de Model
            $agency->update($validated);

            // 2. Mise à jour du téléphone sur le User
            if ($request->has('phone')) {
                // Utilisation de la méthode update sur le modèle User typé
                $user->update(['phone' => $validated['phone']]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Profil mis à jour avec succès',
                'data'    => $this->index()->getData()->data // On renvoie la même structure que l'index
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false, 
                'message' => 'Erreur lors de la mise à jour : ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour le logo
     */
    public function updateLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        /** @var User $user */
        $user = auth()->user();
        $agency = $user->agency;

        if ($request->hasFile('logo') && $agency) {
            if ($agency->logo) {
                Storage::disk('public')->delete($agency->logo);
            }

            $path = $request->file('logo')->store('agencies/logos', 'public');
            $agency->update(['logo' => $path]);

            return response()->json([
                'success' => true,
                'logo_url' => asset("storage/$path"),
                'message' => 'Logo mis à jour'
            ]);
        }

        return response()->json(['success' => false, 'message' => 'Action impossible'], 400);
    }
}