<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\AgencyResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
class AuthService
{
    /**
     * ✅ Register (Client ou Step 1 Agency)
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
     * ✅ Step 2: Compléter profil agence
     */
    public function registerAgency(array $data, ?UploadedFile $logo = null): array
    {
        /** @var User $user */
        $user = Auth::user();

        // 🔒 Sécurité
        if (!$user || !$user->isAgencyAdmin()) {
            throw ValidationException::withMessages([
                'user' => ['Non autorisé.'],
            ]);
        }

        // 🔒 Empêcher double création
        if ($user->agency_id !== null) {
            throw ValidationException::withMessages([
                'agency' => ['Profil déjà complété.'],
            ]);
        }

        return DB::transaction(function () use ($data, $logo, $user) {

            // 📁 Upload logo
            $logoPath = $logo
                ? $logo->store('logos', 'public')
                : null;

            // 🌐 Accounts social
            $accounts = $data['accounts_social'] ?? null;

            // 🏢 Create Agency
            $agency = Agency::create([
                'agency_name'     => $data['agency_name'],
                'city'            => $data['city'],
                'address'         => $data['address'],
                'time_start'      => $data['time_start'],
                'time_end'        => $data['time_end'],
                'logo'            => $logoPath,
                'latitude'        => $data['latitude'],
                'longitude'       => $data['longitude'],
                'accounts_social' => $accounts,
                'is_verified'     => false,
            ]);

            // 🔗 Lier user existant
            $user->update([
                'agency_id' => $agency->id
            ]);

            return [
                'user'   => new UserResource($user->fresh()->load('agency')),
                // 'agency' => new AgencyResource($agency),
            ];
        });
    }

    /**
     * ✅ Login
     */
    public function login(array $credentials): array
    {
        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Email ou mot de passe incorrect.'],
            ]);
        }

        /** @var User $user */
        $user->load('agency');

        // 🔒 Supprimer anciens tokens
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return compact('user', 'token');
    }

    /**
     * ✅ Logout
     */
    public function logout(User $user): void
    {
        $user->tokens()->delete();
    }
}