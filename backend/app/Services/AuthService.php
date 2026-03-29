<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Register (Client ou Step 1 Agency)
     * Crée uniquement le User — pas d'agence ici.
     */
    public function register(array $data): array
    {
        $user = User::create([
            'first_name' => $data['first_name'],
            'last_name'  => $data['last_name'],
            'email'      => $data['email'],
            'phone'      => $data['phone'],
            'password'   => $data['password'],
            'role'       => $data['role'],
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return compact('user', 'token');
    }

    /**
     * Step 2 : Compléter profil agence.
     * L'user est déjà authentifié via Sanctum (cookie).
     * Cette méthode reçoit UNIQUEMENT les données agence — pas first_name, email, etc.
     */
    public function registerAgency(array $data, ?UploadedFile $logo = null): array
    {
        /** @var User $user */
        $user = Auth::user();

        // Sécurité : seul un admin_agency sans agence peut compléter
        if (!$user || !$user->isAgencyAdmin()) {
            throw ValidationException::withMessages([
                'user' => ['Non autorisé.'],
            ]);
        }

        if ($user->agency_id !== null) {
            throw ValidationException::withMessages([
                'agency' => ['Profil déjà complété.'],
            ]);
        }

        return DB::transaction(function () use ($data, $logo, $user) {

            $logoPath = $logo
                ? $logo->store('logos', 'public')
                : null;

            // accounts_social est déjà décodé par CompleteAgencyProfileRequest
            $accounts = $data['accounts_social'] ?? null;

            $agency = Agency::create([
                'agency_name'     => $data['agency_name'],
                'city'            => $data['city'],
                'address'         => $data['address'],
                'time_start'      => $data['time_start'],
                'time_end'        => $data['time_end'],
                'logo'            => $logoPath,
                'latitude'        => $data['latitude']  ?? null,
                'longitude'       => $data['longitude'] ?? null,
                'accounts_social' => $accounts,
                'is_verified'     => false,
            ]);

            $user->update(['agency_id' => $agency->id]);

            return [
                'user' => new UserResource($user->fresh()->load('agency')),
            ];
        });
    }

    /**
     * Login
     */
    public function login(array $credentials): array
    {
        // Auth::attempt() retourne un bool — récupérer l'user APRÈS via Auth::user()
        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Email ou mot de passe incorrect.'],
            ]);
        }

        /** @var User $user */
        $user = Auth::user(); // ✅ FIX : était appelé avant cette ligne dans la version originale

        // Une session à la fois : révoquer les anciens tokens
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        $user->load('agency');

        return compact('user', 'token');
    }

    /**
     * Logout
     */
    public function logout(User $user): void
    {
        $user->tokens()->delete();
    }
}