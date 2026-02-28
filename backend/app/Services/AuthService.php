<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Inscription unifiée — client ou admin_agency (Step 1).
     * Si role = client       → compte créé directement, terminé.
     * Si role = admin_agency → compte créé, attente step 2.
     */
    public function register(array $data): array
    {
        $user = User::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'password' => $data['password'],
            'role' => $data['role'],
            // agency_id reste null jusqu'au step 2
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return compact('user', 'token');
    }

    /**
     * Complétion profil agence (Step 2).
     * Crée l'agence et lie l'utilisateur via agency_id.
     */
    public function completeAgencyProfile(User $user, array $data, ?UploadedFile $logo): Agency
    {
        // Upload du logo
        $logoPath = $logo ? $logo->store('logos', 'public') : null;

        // Créer l'agence
        $agency = Agency::create([
            'agency_name' => $data['agency_name'],
            'city' => $data['city'],
            'address' => $data['address'],
            'latitude' => $data['latitude'],
            'longitude' => $data['longitude'],
            'time_start' => $data['time_start'],
            'time_end' => $data['time_end'],
            'logo' => $logoPath,
            'accounts_social' => $data['accounts_social'] ?? null,
            'is_verified' => false, // vérification manuelle par super_admin
        ]);

        // Lier l'utilisateur à cette agence
        $user->update(['agency_id' => $agency->id]);

        return $agency;
    }

    /**
     * Connexion — retourne user + token.
     *
     * @throws ValidationException
     */
    public function login(array $credentials): array
    {
        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Email ou mot de passe incorrect.'],
            ]);
        }

        /** @var User $user */
        $user = Auth::user();
        $user->load('agency');

        // Révoquer les anciens tokens (1 session active)
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return compact('user', 'token');
    }

    /**
     * Déconnexion — révoque le token courant uniquement.
     */
    public function logout(User $user): void
    {
        if ($token = $user->currentAccessToken()) {
            $token->delete();
        }
    }
}
