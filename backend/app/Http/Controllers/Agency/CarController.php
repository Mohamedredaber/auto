<?php

namespace App\Http\Controllers\Agency;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Http\Resources\Agency\CarResource;
use App\Http\Requests\Agency\Car\UpdateCarRequest;
use App\Http\Requests\Agency\Car\StoreCarRequest;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CarController extends Controller
{
    public function index()
    {
        $cars = Car::with('coverImage')
            ->where('agency_id', Auth::user()->agency_id)
            ->latest()
            ->paginate(10);
        return CarResource::collection($cars)->additional([
            'success' => true,
            'message' => 'Liste des véhicules récupérée.',
        ]);
    }

    public function store(StoreCarRequest $request)
    {
        return DB::transaction(function () use ($request) {
            // 1. Création du véhicule
            $car = Car::create(array_merge(
                $request->validated(),
                ['agency_id' => Auth::user()->agency_id]
            ));

            // 2. Image de couverture (Obligatoire)
            if ($request->hasFile('cover_image')) {
                $path = $request->file('cover_image')->store('cars/covers', 'public');
                $car->images()->create([
                    'url' => $path,
                    'is_cover' => true,
                ]);
            }

            // 3. Galerie d'images (Optionnelle)
        if ($request->hasFile('images')) {
            // Supprimer les anciennes d'abord
            $car->images()->where('is_cover', false)->each(function ($img) {
                Storage::disk('public')->delete($img->url);
                $img->delete();
            });
            foreach ($request->file('images') as $image) {
                $path = $image->store('cars/gallery', 'public');
                $car->images()->create(['url' => $path, 'is_cover' => false]);
            }
        }

            return (new CarResource($car->load(['coverImage', 'images'])))
                ->additional(['success' => true, 'message' => 'Véhicule ajouté !']);
        });
    }
    public function update(UpdateCarRequest $request, Car $car)
{
    if ($car->agency_id !== Auth::user()->agency_id) {
        return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
    }

    return DB::transaction(function () use ($request, $car) {

        // 1. Update car data
        $car->update($request->validated());

        // 2. New cover image
        if ($request->hasFile('cover_image')) {
            // حذف القديمة
            $old = $car->images()->where('is_cover', true)->first();
            if ($old) {
                Storage::disk('public')->delete($old->url);
                $old->delete();
            }
            $path = $request->file('cover_image')->store('cars/covers', 'public');
            $car->images()->create(['url' => $path, 'is_cover' => true]);
        }

        // 3. New gallery images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('cars/gallery', 'public');
                $car->images()->create(['url' => $path, 'is_cover' => false]);
            }
        }

        return (new CarResource($car->load(['coverImage', 'images'])))
            ->additional(['success' => true, 'message' => 'Véhicule mis à jour !']);
    });
}
public function show(Car $car)
{
    if ($car->agency_id !== Auth::user()->agency_id) {
        return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
    }

    return (new CarResource($car->load(['coverImage', 'images'])))
        ->additional(['success' => true]);
}
    public function destroy(Car $car)
    {
        if ($car->agency_id !== Auth::user()->agency_id) {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        // Supprimer physiquement les fichiers avant la BDD
        foreach ($car->images as $img) {
            Storage::disk('public')->delete($img->url);
        }

        $car->delete();

        return response()->json(['success' => true, 'message' => 'Véhicule supprimé.']);
    }
}