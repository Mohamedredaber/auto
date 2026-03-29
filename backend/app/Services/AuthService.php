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
    // ✅ Register Client uniquement
    public function register(array $data): array
    {
        $user = User::create([
            'first_name' => $data['first_name'],
            'last_name'  => $data['last_name'],
            'email'      => $data['email'],
            'phone'      => $data['phone'],
            'password'   => $data['password'], // ✅ cast hashed dans User
            'role'       => 'client',           // ✅ forcé côté service
        ]);

        return compact('user');
    }

    // ✅ Register Agency — User + Agence en une seule transaction
    public function registerAgency(array $data, ?UploadedFile $logo = null): array
    {
        return DB::transaction(function () use ($data, $logo) {

            // 1️⃣ Création du user
            $user = User::create([
                'first_name' => $data['first_name'],
                'last_name'  => $data['last_name'],
                'email'      => $data['email'],
                'phone'      => $data['phone'],
                'password'   => $data['password'], // ✅ cast hashed dans User
                'role'       => 'admin_agency',     // ✅ forcé côté service
            ]);

            // 2️⃣ Création de l'agence
            $logoPath = $logo ? $logo->store('logos', 'public') : null;

            $agency = Agency::create([
                'agency_name'     => $data['agency_name'],
                'city'            => $data['city'],
                'address'         => $data['address'],
                'time_start'      => $data['time_start'],
                'time_end'        => $data['time_end'],
                'logo'            => $logoPath,
                'latitude'        => $data['latitude'] ?? 0,
                'longitude'       => $data['longitude']      ?? 0,
                'accounts_social' => $data['accounts_social'] ?? null,
                'is_verified'     => false,
            ]);

            // 3️⃣ Liaison user → agence
            $user->update(['agency_id' => $agency->id]);

            // 4️⃣ Login automatique
            Auth::login($user);

            // 5️⃣ Retour
            return [
                'user'   => new UserResource($user->load('agency')),
                'agency' => new AgencyResource($agency),
            ];
        });
    }

    // ✅ Login
    public function login(array $credentials): array
    {
        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Email ou mot de passe incorrect.'],
            ]);
        }

        /** @var \App\Models\User $user */
        $user = User::find(Auth::id());
        $user->load('agency');

        return compact('user');
    }

    // ✅ Logout — sans paramètre inutile
    public function logout(): void
    {
        Auth::logout();
    }
}