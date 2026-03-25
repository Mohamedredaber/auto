<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterAgencyRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\AgencyResource;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    // ✅ Register (Client ou Step1 Agency)
    public function register(RegisterRequest $request): JsonResponse
    {
        ['user' => $user, 'token' => $token] =
            $this->authService->register($request->validated());

        return $this->respondWithToken(
            $user,
            $token,
            $user->isClient()
                ? 'Inscription réussie.'
                : 'Compte agence créé. Complétez votre profil.',
            201
        );
    }

    // ✅ Step 2 Agency
    public function registerAgency(RegisterAgencyRequest $request): JsonResponse
    {
        $result = $this->authService->registerAgency(
            $request->validated(),
            $request->file('logo')
        );

        return response()->json([
            'success' => true,
            'message' => 'Profil agence complété avec succès.',
            'data' => $result,
        ], 201);
    }

    // ✅ Login
    public function login(LoginRequest $request): JsonResponse
    {
        ['user' => $user, 'token' => $token] =
            $this->authService->login($request->only('email', 'password'));

        return $this->respondWithToken($user, $token, 'Connexion réussie.');
    }

    // ✅ Logout
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie.',
        ]);
    }

    // ✅ Me
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new UserResource(
                $request->user()->load('agency')
            ),
        ]);
    }

    // ✅ Helper
    private function respondWithToken($user, string $token, string $message, int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => [
                'user' => new UserResource($user->load('agency')),
                'access_token' => $token,
                'token_type' => 'Bearer',
                'needs_profile_completion' =>
                    $user->isAgencyAdmin() && is_null($user->agency_id),
            ],
        ], $status);
    }
}