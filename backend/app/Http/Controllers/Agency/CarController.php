<?php

namespace App\Http\Controllers\Agency;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Car;
use App\Http\Resources\Agency\CarResource;
use App\Http\Requests\Agency\StoreCarRequest;
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


 public function store(StoreCarRequest $request)
{
    // 1. Validation automatique via StoreCarRequest
    $validated = $request->validated();
    
    // 2. Zid l-agency_id d l-user li m-connecter
    $validated['agency_id'] = auth()->user()->agency_id;

    // 3. Création d'l-voiture (bla tsawer f l-wel)
    $car = Car::create($validated);

    // 4. Traitement dyal l-images (ila jaw f l-request)
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $image) {
            // Khzen l-image f storage/app/public/cars
            $path = $image->store('cars', 'public');

            // Zid l-entry f la table 'car_images' (ou la table li m-lyiya m3a Car)
            $car->images()->create([
                'path' => $path,
                // t-qder t-حدد hna ina wa7da hiya l-cover
            ]);
        }
    }

    return (new CarResource($car->load('images')))->additional([
        'success' => true,
        'message' => 'Voiture et images créées avec succès.',
    ]);
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
