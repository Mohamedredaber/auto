<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\CompleteAgencyProfileRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        ['user' => $user] = $this->authService->register($request->validated());

        auth()->login($user);

        return $this->respondWithUser(
            $user,
            $user->isClient() ? 'Inscription réussie.' : 'Complétez votre profil.',
            201
        );
    }

    public function registerAgencyProfile(CompleteAgencyProfileRequest $request): JsonResponse
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
        ['user' => $user] = $this->authService->login($request->only('email', 'password'));

        return $this->respondWithUser($user, 'Connexion réussie.');
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

    // ✅ Me (profil connecté)
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->fresh(); // ✅ fresh() pour garantir un modèle
        $user->load('agency');

        return response()->json([
            'success' => true,
            'data' => new UserResource($user),
        ]);
    }

    // ✅ Helper pour retour JSON utilisateur
    private function respondWithUser($user, string $message, int $status = 200): JsonResponse
    {
        $user = $user->fresh()->load('agency'); // ✅ fresh() pour modèle complet

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => [
                'user' => new UserResource($user),
                'needs_profile_completion' => $user->isAgencyAdmin() && is_null($user->agency_id),
            ],
        ], $status);
    }
}