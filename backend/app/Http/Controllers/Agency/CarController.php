<?php

namespace App\Http\Controllers\Agency;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Car;
use App\Http\Resources\Agency\CarResource;
class CarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user  = auth()->user();
        $cars = Car::with('coverImage')
        ->where('agency_id', $user->agency_id)
        ->latest() 
        ->paginate(10);
    
        return CarResource::collection($cars)->additional([
            'success' => true,
            'message' => 'Liste des voitures récupérée avec succès.',
        ]);
    }


    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
