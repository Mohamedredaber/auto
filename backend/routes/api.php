<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes – AutoConnect
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {

    // ── Routes publiques ───────────────────────────────────────────────
    Route::post('/register', [AuthController::class, 'register']);  // client + agence step 1
   Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:login');
    // ── Routes protégées ───────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me',                        [AuthController::class, 'me']);
        Route::post('/logout',                   [AuthController::class, 'logout']);
        Route::post('/agency/complete-profile',  [AuthController::class, 'completeAgencyProfile']); // step 2
    });
});
