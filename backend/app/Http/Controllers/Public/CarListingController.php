<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\Public\CarCardResource;
use App\Services\Public\CarSearchService;
use App\Models\Car;

class CarListingController extends Controller
{
    public function __construct(
        private readonly CarSearchService $searchService
    ) {}

    /**
     * GET /api/catalog
     * Retourne une liste paginée de voitures disponibles
     */
    public function index(Request $request)
    {
        \Log::info('🚗 [CarListingController] index() called with params:', $request->all());

        try {
            $cars = $this->searchService->search($request);

            \Log::info('✅ [CarListingController] Voitures trouvées:', [
                'count' => $cars->count(),
                'total' => $cars->total(),
                'current_page' => $cars->currentPage(),
            ]);

            // Utiliser collection() pour avoir la structure {data: [...], meta: {...}}
            $response = CarCardResource::collection($cars);

            \Log::info('✅ [CarListingController] Response prête à retourner');

            return $response;
        } catch (\Exception $e) {
            \Log::error('❌ [CarListingController] Erreur:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des voitures',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/catalog/{id}
     * Retourne une voiture spécifique
     */
    public function show($id)
    {
        try {
            $car = Car::with(['images', 'agency'])->findOrFail($id);

            return new CarCardResource($car);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Voiture introuvable',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement de la voiture',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
