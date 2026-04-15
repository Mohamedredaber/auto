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
        $cars = $this->searchService->search($request);
        return CarCardResource::collection($cars);
        }
        public function show($id){
            $car =Car::with(['coverImage','agency'])->findOrFail($id);
            return new CarCardResource($car);
        }
}
