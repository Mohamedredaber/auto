<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Agency\CarController;
use App\Http\Controllers\Agency\DashboardController;
use App\Http\Controllers\Agency\ReservationController;
use App\Http\Controllers\Client\BookingController as ClientBookingController;
use App\Http\Controllers\Public\CarListingController;
use App\Http\Controllers\Public\BookingController;
use Illuminate\Support\Facades\Route;

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
Route::get('/cars/{id}/booking-details', [BookingController::class, 'getCarForBooking']);
Route::post('/createbookings', [BookingController::class, 'store']);

Route::middleware(['auth:sanctum', 'role:admin_agency'])
    ->prefix('agency') 
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::apiResource('cars', CarController::class);
});

Route::middleware('auth:sanctum')
    ->prefix('client')
    ->group(function () {
        Route::get('/bookings', [ClientBookingController::class, 'index']);
        Route::get('/bookings/{id}', [ClientBookingController::class, 'show']);
        Route::patch('/bookings/{id}/cancel', [ClientBookingController::class, 'cancel']);
        Route::delete('/bookings/{id}/destroy', [ClientBookingController::class, 'destroy']);
    });