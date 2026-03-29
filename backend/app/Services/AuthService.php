<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\User;
use App\Http\Resources\UserResource;
use App\Http\Resources\AgencyResource;
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
            'password'   => bcrypt($data['password']),
            'role'       => $data['role'],
        ]);

        return compact('user');
    }

    /**
     * Step 2 : Compléter profil agence.
     * L'utilisateur est déjà authentifié via Sanctum (cookie).
     */
    public function registerAgency(array $data, ?UploadedFile $logo = null): array
    {
        return DB::transaction(function () use ($data, $logo) {

            // 1️⃣ Création de l'utilisateur
            $user = User::create([
                'first_name' => $data['first_name'],
                'last_name'  => $data['last_name'],
                'email'      => $data['email'],
                'phone'      => $data['phone'],
                'password'   => bcrypt($data['password']),
                'role'       => $data['role'],
            ]);

            // 2️⃣ Création de l'agence
            $logoPath = $logo ? $logo->store('logos', 'public') : null;
            $accounts = $data['accounts_social'] ?? null;

            $agency = Agency::create([
                'agency_name'     => $data['agency_name'],
                'city'            => $data['city'],
                'address'         => $data['address'],
                'time_start'      => $data['time_start'],
                'time_end'        => $data['time_end'],
                'logo'            => $logoPath,
                'latitude'        => $data['latitude'] ?? null,
                'longitude'       => $data['longitude'] ?? null,
                'accounts_social' => $accounts,
                'is_verified'     => false,
            ]);

            // 3️⃣ Liaison user → agence
            $user->update(['agency_id' => $agency->id]);

            // 4️⃣ Login automatique
            Auth::login($user);

            // 5️⃣ Retour JSON Resource prêt pour le front
            return [
                'user'   => new UserResource($user->fresh()->load('agency')), // ✅ fresh() pour garantir un modèle
                'agency' => new AgencyResource($agency),
            ];
        });
    }

    /**
     * Login
     */
    public function login(array $credentials): array
    {
        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Email ou mot de passe incorrect.'],
            ]);
        }

        $user = Auth::user()->fresh(); // ✅ fresh() pour avoir un modèle complet
        $user->load('agency');

        return compact('user');
    }

    /**
     * Logout
     */
    public function logout(User $user): void
    {
        Auth::logout();
    }
}