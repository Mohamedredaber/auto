<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    if (!Auth::attempt($request->only('email', 'password'))) {
        return response()->json([
            'message' => 'Identifiants incorrects'
        ], 401);
    }

    $user = Auth::user();

    // Création du token
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'status' => true,
        'token' => $token,
        'user' => $user
    ]);
}
}
