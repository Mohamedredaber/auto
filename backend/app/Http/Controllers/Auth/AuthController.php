<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\CompleteAgencyProfileRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\AgencyResource;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $authService) {}

    // ─────────────────────────────────────────────────────
    //  POST /api/auth/register
    //  Formulaire unique — role: client → Valider
    //                    — role: admin_agency → Next (step 2)
    // ─────────────────────────────────────────────────────
    public function register(RegisterRequest $request): JsonResponse
    {
        ['user' => $user, 'token' => $token] = $this->authService->register($request->validated());

        $message = $user->isClient() ? 'Inscription réussie.' : 'Compte agence créé. Veuillez compléter votre profil.';

        return $this->respondWithToken($user, $token, $message, 201);
    }
    

    // ─────────────────────────────────────────────────────
    //  POST /api/auth/agency/complete-profile  🔒
    //  Step 2 — uniquement pour admin_agency
    // ─────────────────────────────────────────────────────
    public function registerAgency(Request $request): JsonResponse
    {
        $request->validate([
            // User
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin_agency',

            // Agency
            'agency_name' => 'required|string|max:255',
            'city' => 'required|string',
            'address' => 'required|string',
            'time_start' => 'required',
            'time_end' => 'required',
            'postal_code' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
            'accounts_social' => 'nullable|string',
        ]);

        $result = $this->authService->registerAgency($request->validated(), $request->file('logo'));

        return response()->json(
            [
                'success' => true,
                'message' => 'Compte agence créé avec succès.',
                'data' => $result,
            ],
            201,
        );
    }
    // ─────────────────────────────────────────────────────
    //  POST /api/auth/login
    // ─────────────────────────────────────────────────────
    public function login(LoginRequest $request): JsonResponse
    {
        ['user' => $user, 'token' => $token] = $this->authService->login($request->only('email', 'password'));

        return $this->respondWithToken($user, $token, 'Connexion réussie.');
    }

    // ─────────────────────────────────────────────────────
    //  POST /api/auth/logout  🔒
    // ─────────────────────────────────────────────────────
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie.',
        ]);
    }

    // ─────────────────────────────────────────────────────
    //  GET /api/auth/me  🔒
    // ─────────────────────────────────────────────────────
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('agency');

        return response()->json([
            'success' => true,
            'data' => new UserResource($user),
        ]);
    }

    // ─────────────────────────────────────────────────────
    //  Helper privé
    // ─────────────────────────────────────────────────────
    private function respondWithToken($user, string $token, string $message, int $status = 200): JsonResponse
    {
        return response()->json(
            [
                'success' => true,
                'message' => $message,
                'data' => [
                    'user' => new UserResource($user->load('agency')),
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                    // Indique au frontend si le step 2 est nécessaire
                    'needs_profile_completion' => $user->isAgencyAdmin() && is_null($user->agency_id),
                ],
            ],
            $status,
        );
    }
}
