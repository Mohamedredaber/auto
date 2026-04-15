<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Agency\CarController;
use App\Http\Controllers\Agency\DashboardController;
use App\Http\Controllers\Agency\ReservationController;
use App\Http\Controllers\Public\CarListingController;
use Illuminate\Support\Facades\Route;

// 🚗 Catalog Routes (Public - No Auth Required)
Route::prefix('catalog')->group(function () {
    Route::get('/', [CarListingController::class, 'index']);
    Route::get('/{id}', [CarListingController::class, 'show']);
});

// Legacy routes (backward compatibility)
Route::get('/cars', [CarListingController::class, 'index']);
Route::get('/cars/{id}', [CarListingController::class, 'show']);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/register/agency', [AuthController::class, 'registerAgency']);
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

Route::middleware(['auth:sanctum', 'role:admin_agency'])
    ->prefix('agency') 
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::apiResource('cars', CarController::class);
        
        Route::get('/reservations', [ReservationController::class, 'index']);
        Route::get('/reservations/{id}', [ReservationController::class, 'show']);
        Route::put('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);
});