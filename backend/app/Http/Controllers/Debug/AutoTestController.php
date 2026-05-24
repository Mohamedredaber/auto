<?php

namespace App\Http\Controllers\Debug;

use App\Models\Booking;
use App\Models\Car;
use Illuminate\Support\Facades\DB;

class AutoTestController
{
    /**
     * Test automatisé de tous les problèmes possibles
     */
    public function runAllTests()
    {
        $results = [];

        // TEST 1: Vérifier la BD
        $results['🗄️ BD - Réservations'] = $this->testDatabase();

        // TEST 2: Vérifier les relations
        $results['🔗 Relations'] = $this->testRelations();

        // TEST 3: Vérifier le service
        $results['📦 Service'] = $this->testService();

        // TEST 4: Vérifier la Resource
        $results['📋 Resource'] = $this->testResource();

        // RÉSUMÉ
        $results['📊 Résumé'] = $this->getSummary($results);

        return response()->json($results);
    }

    private function testDatabase()
    {
        $tests = [];

        // Test 1: Réservations avec car_id NULL
        $nullCars = Booking::whereNull('car_id')->count();
        $tests['car_id NULL'] = [
            'count' => $nullCars,
            'status' => $nullCars === 0 ? '✅ OK' : '❌ PROBLÈME',
            'action' => $nullCars > 0 ? 'Supprimer ces réservations' : 'N/A'
        ];

        // Test 2: Réservations avec car_id invalide
        $invalidCars = Booking::whereNotIn('car_id', DB::table('cars')->select('id'))
            ->whereNotNull('car_id')
            ->count();
        $tests['car_id invalide'] = [
            'count' => $invalidCars,
            'status' => $invalidCars === 0 ? '✅ OK' : '❌ PROBLÈME',
            'action' => $invalidCars > 0 ? 'Voitures supprimées - Supprimer les réservations' : 'N/A'
        ];

        // Test 3: Total des réservations
        $total = Booking::count();
        $tests['Total'] = [
            'count' => $total,
            'status' => $total > 0 ? '✅ Données présentes' : '⚠️ Pas de données'
        ];

        return $tests;
    }

    private function testRelations()
    {
        $tests = [];

        // Chercher une réservation valide
        $booking = Booking::whereNotNull('car_id')
            ->whereIn('car_id', DB::table('cars')->select('id'))
            ->first();

        if (!$booking) {
            return ['status' => '❌ Aucune réservation valide trouvée'];
        }

        // Test 1: Relation car chargée
        $carLoaded = $booking->load('car')->car;
        $tests['Relation car'] = [
            'status' => $carLoaded ? '✅ OK' : '❌ NULL',
            'car_id' => $booking->car_id,
            'car' => $carLoaded ? $carLoaded->brand : 'NULL'
        ];

        // Test 2: Relation agency chargée
        $agencyLoaded = $booking->load('agency')->agency;
        $tests['Relation agency'] = [
            'status' => $agencyLoaded ? '✅ OK' : '❌ NULL',
            'agency_id' => $booking->agency_id,
            'agency' => $agencyLoaded ? $agencyLoaded->agency_name : 'NULL'
        ];

        return $tests;
    }

    private function testService()
    {
        $tests = [];

        try {
            $service = app(\App\Services\Client\BookingService::class);
            
            // Simuler un utilisateur
            $booking = Booking::first();
            if (!$booking) {
                return ['status' => '❌ Pas de réservation trouvée'];
            }

            // Test avec auth simulé
            $bookings = Booking::where('user_id', $booking->user_id)
                ->with(['car', 'agency'])
                ->get();

            $tests['Nombre chargé'] = [
                'count' => $bookings->count(),
                'status' => $bookings->count() > 0 ? '✅ OK' : '❌ Aucune'
            ];

            $tests['Car chargé'] = [
                'count' => $bookings->filter(fn($b) => $b->car)->count(),
                'status' => $bookings->filter(fn($b) => $b->car)->count() > 0 ? '✅ OK' : '⚠️ Certaines NULL'
            ];

            return $tests;
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }

    private function testResource()
    {
        $tests = [];

        try {
            $booking = Booking::with(['car', 'agency'])->whereNotNull('car_id')->first();
            if (!$booking) {
                return ['status' => '❌ Pas de réservation valide'];
            }

            $resource = new \App\Http\Resources\Client\BookingResource($booking);
            $data = $resource->resolve();

            $tests['car_details présent'] = [
                'status' => isset($data['car_details']) ? '✅ OK' : '❌ MANQUANT',
                'value' => $data['car_details'] ? 'Non-null' : 'NULL'
            ];

            $tests['agency_details présent'] = [
                'status' => isset($data['agency_details']) ? '✅ OK' : '❌ MANQUANT',
                'value' => $data['agency_details'] ? 'Non-null' : 'NULL'
            ];

            return $tests;
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }

    private function getSummary($results)
    {
        $issues = [];

        if (($results['🗄️ BD - Réservations']['car_id NULL']['count'] ?? 0) > 0) {
            $issues[] = '❌ Il y a des réservations avec car_id NULL';
        }

        if (($results['🗄️ BD - Réservations']['car_id invalide']['count'] ?? 0) > 0) {
            $issues[] = '❌ Il y a des réservations avec car_id invalide (voitures supprimées)';
        }

        if (count($issues) === 0) {
            $issues[] = '✅ Aucun problème détecté !';
        }

        return $issues;
    }
}
