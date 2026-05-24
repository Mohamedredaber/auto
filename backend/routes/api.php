<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Agency\CarController;
use App\Http\Controllers\Agency\ReservationController;
use App\Http\Controllers\Client\BookingController as ClientBookingController;
use App\Http\Controllers\Public\CarListingController;
use App\Http\Controllers\Public\BookingController;
use App\Http\Controllers\Agency\StatisticsController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Agency\AgencyProfileController;
use App\Http\Controllers\Agency\AgencyClientController;
use App\Http\Controllers\Agency\DashboardController;
use App\Http\Controllers\Public\AgencyPublicController;


Route::prefix('catalog')->group(function () {
    Route::get('/', [CarListingController::class, 'index']);
    Route::get('/{id}', [CarListingController::class, 'show']);
});
Route::get('/public/agency/{id}', [AgencyPublicController::class, 'show']);  
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
    Route::get('/clients', [AgencyClientController::class, 'index']);
    Route::get('/clients/recent', [AgencyClientController::class, 'recent']);
    Route::get('/stats', [AgencyClientController::class, 'getStats']);
    Route::apiResource('cars', CarController::class);
    Route::get('/profile', [AgencyProfileController::class, 'index']);
    Route::put('/profile/update', [AgencyProfileController::class, 'update']);
    Route::post('/profile/logo', [AgencyProfileController::class, 'updateLogo']);
    Route::get('/statistics', [StatisticsController::class, 'index']);

        Route::prefix('reservations')->group(function () {
            Route::get('/', [ReservationController::class, 'index']);
            Route::get('/{booking}', [ReservationController::class, 'show']);
            Route::patch('/{booking}', [ReservationController::class, 'update']);
            Route::post('/{booking}/cancel', [ReservationController::class, 'cancel']);
            Route::get('/stats/overview', [ReservationController::class, 'stats']);
            Route::get('/recent/{days?}', [ReservationController::class, 'recentBookings']);
    });
});
Route::middleware('auth:sanctum')
    ->prefix('client')
    ->group(function () {
        Route::get('/bookings', [ClientBookingController::class, 'index']);
        Route::get('/bookings/{id}', [ClientBookingController::class, 'show']);
        Route::patch('/bookings/{id}/cancel', [ClientBookingController::class, 'cancel']);
        Route::delete('/bookings/{id}/destroy', [ClientBookingController::class, 'destroy']);
        Route::get('/profile', [ClientBookingController::class, 'profile']);
        Route::post('/profile', [ClientBookingController::class, 'updateProfile']);
    });

// Debug Routes (À SUPPRIMER EN PRODUCTION)
if (env('APP_DEBUG')) {
    Route::prefix('debug')->group(function () {
        Route::get('/bookings', [\App\Http\Controllers\Debug\DebugBookingController::class, 'debugAllBookings']);
        Route::get('/bookings/{id}', [\App\Http\Controllers\Debug\DebugBookingController::class, 'debugBooking']);
        Route::post('/bookings/fix', [\App\Http\Controllers\Debug\DebugBookingController::class, 'fixBookings']);
        
        // Diagnostic simple
        Route::get('/diagnostic/booking/{id}', [\App\Http\Controllers\Debug\DiagnosticController::class, 'checkBooking']);
        Route::get('/diagnostic/issues', [\App\Http\Controllers\Debug\DiagnosticController::class, 'listAllIssues']);
        
        // Test automatisé
        Route::get('/auto-test', [\App\Http\Controllers\Debug\AutoTestController::class, 'runAllTests']);
    });
}

Route::prefix('super-admin')
    ->group(function () {
        Route::put('/changeAgencyStatus', [\App\Http\Controllers\super_admin\adminController::class, 'changeAgencyStatus']);
        Route::get('/agencies', [\App\Http\Controllers\Agency\Agencies::class, 'index']);
        Route::get('/agencies/{id}', [\App\Http\Controllers\Agency\Agencies::class, 'show']);
        Route::get('/agencies/stats', [\App\Http\Controllers\Agency\Agencies::class, 'stats']);
        // Autres routes super admin à venir...
    });