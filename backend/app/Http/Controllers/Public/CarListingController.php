<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use app\Http\Resources\Public\CarCardResource;
use App\Services\Public\CarSearchService;
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
}
