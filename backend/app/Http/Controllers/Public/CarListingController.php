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


    public function index(Request $request)
    {

        try {
            $cars = $this->searchService->search($request);


            // Utiliser collection() pour avoir la structure {data: [...], meta: {...}}
            $response = CarCardResource::collection($cars);


            return $response;
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des voitures',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function show(int $id)
    {
        try {
            $car = Car::with(['images', 'agency','bookings'])->findOrFail($id);

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
