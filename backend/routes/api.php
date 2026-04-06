<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Agency\CarController;
use App\Http\Controllers\Agency\DashboardController;
use App\Http\Controllers\Agency\ReservationController;
Route::prefix('auth')->group(function () {

    // ── Routes publiques ──────────────────────────────────
    Route::post('/register',        [AuthController::class, 'register']);
    Route::post('/register/agency', [AuthController::class, 'registerAgency']);
    Route::post('/login',           [AuthController::class, 'login'])
         ->middleware('throttle:login');

    // ── Routes protégées ──────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me',     [AuthController::class, 'me']);
        Route::post('/logout',[AuthController::class, 'logout']);
    });
});
Route::middleware(['auth:sanctum', 'role:admin_agency'])
    ->prefix('agency') 
    ->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index']);

        // 2. Gestion des Voitures (CRUD Complet)
        // apiResource kadiyr: index, store, show, update, destroy
        Route::apiResource('cars', CarController::class);

        Route::get('/reservations', [ReservationController::class, 'index']);
        Route::get('/reservations/{id}', [ReservationController::class, 'show']);
        Route::put('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);

});