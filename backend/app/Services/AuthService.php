<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\AgencyResource;
use App\Http\Resources\UserResource;
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
    public function registerAgency(array $data, ?UploadedFile $logo = null): array
{
    return DB::transaction(function () use ($data, $logo) {

        // ── 1. Create User ───────────────────
        $user = User::create([
            'first_name' => $data['first_name'],
            'last_name'  => $data['last_name'],
            'email'      => $data['email'],
            'phone'      => $data['phone'] ?? null,
            'password'   => $data['password'],
            'role'       => 'admin_agency',
        ]);

        // ── 2. Logo ──────────────────────────
        $logoPath = $logo
            ? $logo->store('logos', 'public')
            : null;

        // ── 3. Accounts social ───────────────
        $accounts = null;
        if (!empty($data['accounts_social'])) {
            $accounts = json_decode($data['accounts_social'], true);
        }

        // ── 4. Create Agency ─────────────────
        $agency = Agency::create([
            'agency_name'     => $data['agency_name'],
            'city'            => $data['city'],
            'address'         => $data['address'],
            'time_start'      => $data['time_start'],
            'time_end'        => $data['time_end'],
            'logo'            => $logoPath,
            'accounts_social' => $accounts,
            'is_verified'     => false,
        ]);

        // ── 5. ربط User بـ Agency ────────────
        $user->update(['agency_id' => $agency->id]);

        return [
            'user'   => new UserResource($user->fresh()->load('agency')),
            'agency' => new AgencyResource($agency),
        ];
    });
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
     $user->tokens()->delete();
    }   
}
