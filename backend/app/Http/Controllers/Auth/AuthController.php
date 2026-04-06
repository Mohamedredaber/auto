<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterAgencyRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Http\Resources\AgencyResource;
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
        request()->session()->regenerate(); 

        return response()->json([
            'success' => true,
            'message' => 'Inscription réussie.',
            'data'    => [
                'user' => new UserResource($user->load('agency')),
            ],
        ], 201);
    }

    public function registerAgency(RegisterAgencyRequest $request): JsonResponse
    {
        $result = $this->authService->registerAgency(
            $request->validated(),
            $request->file('logo')
        );

        return response()->json([
            'success' => true,
            'message' => 'Compte agence créé avec succès.',
            'data'    => $result,
        ], 201);
    }

    // ✅ Login
    public function login(LoginRequest $request): JsonResponse
    {
        ['user' => $user] = $this->authService->login(
            $request->only('email', 'password')
        );

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie.',
            'data'    => [
                'user' => new UserResource($user->load('agency')),
            ],
        ]);
    }

    // ✅ Logout
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request);

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
            'data'    => new UserResource(
                $request->user()->load('agency')
            ),
        ]);
    }
}