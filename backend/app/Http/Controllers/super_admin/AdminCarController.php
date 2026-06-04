<?php

namespace App\Http\Controllers\super_admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\CarResource;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;


class AdminCarController extends Controller
{
public function index(Request $request)
{
    $validated = $request->validate([
        'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],

        'search' => ['nullable', 'string', 'max:255'],
        'status' => ['nullable', 'in:available,reserved,maintenance'],
        'transmission' => ['nullable', 'in:manual,automatic'],
        'fuel' => ['nullable', 'in:diesel,gasoline,hybrid,electric'],
        'year' => ['nullable', 'digits:4'],
        'brand' => ['nullable', 'string', 'max:100'],
        'model' => ['nullable', 'string', 'max:100'],
        'version' => ['nullable', 'string', 'max:100'],
        'category' => ['nullable', 'string', 'max:100'],
        'agency_name' => ['nullable', 'string', 'max:255'],
    ]);

    $perPage = $validated['per_page'] ?? 10;

    $cars = Car::with(['agency', 'coverImage'])
        ->when($request->filled('search'), function ($query) use ($request) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('brand', 'like', "%{$search}%")
                    ->orWhere('model', 'like', "%{$search}%")
                    ->orWhere('version', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('year', 'like', "%{$search}%")
                    ->orWhereHas('agency', function ($agencyQuery) use ($search) {
                        $agencyQuery->where('agency_name', 'like', "%{$search}%");
                    });
            });
        })
        ->when($request->filled('status'), fn ($query) =>
            $query->where('status', $request->status)
        )
        ->when($request->filled('transmission'), fn ($query) =>
            $query->where('transmission', $request->transmission)
        )
        ->when($request->filled('fuel'), fn ($query) =>
            $query->where('fuel', $request->fuel)
        )
        ->when($request->filled('year'), fn ($query) =>
            $query->where('year', $request->year)
        )
        ->when($request->filled('brand'), fn ($query) =>
            $query->where('brand', 'like', "%{$request->brand}%")
        )
        ->when($request->filled('model'), fn ($query) =>
            $query->where('model', 'like', "%{$request->model}%")
        )
        ->when($request->filled('version'), fn ($query) =>
            $query->where('version', 'like', "%{$request->version}%")
        )
        ->when($request->filled('category'), fn ($query) =>
            $query->where('category', 'like', "%{$request->category}%")
        )
        ->when($request->filled('agency_name'), function ($query) use ($request) {
            $query->whereHas('agency', function ($agencyQuery) use ($request) {
                $agencyQuery->where('agency_name', 'like', "%{$request->agency_name}%");
            });
        })
        ->latest('id')
        ->paginate($perPage)
        ->appends($request->query());

    return response()->json([
        'success' => true,
        'message' => 'Liste des véhicules récupérée.',
        'data' => CarResource::collection($cars)->resolve(),

        'pagination' => [
            'current_page' => $cars->currentPage(),
            'last_page' => $cars->lastPage(),
            'per_page' => $cars->perPage(),
            'total' => $cars->total(),
            'from' => $cars->firstItem(),
            'to' => $cars->lastItem(),
            'prev_page_url' => $cars->previousPageUrl(),
            'next_page_url' => $cars->nextPageUrl(),
        ],
    ]);
}

    public function stats()
    {
        return response()->json([
            'success' => true,
            'message' => 'Statistiques des véhicules récupérées avec succès.',
            'data' => [
                'total_cars' => Car::count(),
                'total_available' => Car::where('status', 'available')->count(),
                'total_reserved' => Car::where('status', 'reserved')->count(),
                'total_maintenance' => Car::where('status', 'maintenance')->count(),
            ],
        ]);
    }
// use Illuminate\Support\Facades\Storage;

public function show($id)
{
    $car = Car::with(['agency', 'images'])->find($id);

    if (!$car) {
        return response()->json([
            'success' => false,
            'message' => 'Véhicule non trouvé.',
        ], 404);
    }

        $images = $car->images->map(function ($image) {
            return [
                'id' => $image->id,
                'url' => asset('storage/' . $image->url),
                'is_cover' => $image->is_cover,
            ];
        });

    return response()->json([
        'success' => true,
        'message' => 'Détails du véhicule récupérés.',
        'data' => [
            'id' => $car->id,
            'agency_id' => $car->agency_id,
            'brand' => $car->brand,
            'model' => $car->model,
            'category' => $car->category,
            'year' => $car->year,
            'transmission' => $car->transmission,
            'fuel' => $car->fuel,
            'seats' => $car->seats,
            'doors' => $car->doors,
            'price_per_day' => $car->price_per_day,
            'status' => $car->status,
            'available_from' => $car->available_from,
            'available_to' => $car->available_to,
            'description' => $car->description,
            'additional_information' => $car->additional_information,
            'images' => $images,
        ],
    ]);
}
     public function destroy($id)
    {
        $car = Car::findOrFail($id);

        $car->delete();

        return response()->json([
            'success' => true,
            'message' => 'Car deleted successfully',
        ]);
    }

    public function store(Request $request)
{
    $data = $request->validate([
        'agency_id' => ['required', 'exists:agencies,id'],
        'category' => ['required', 'string', 'max:191'],
        'brand' => ['required', 'string', 'max:191'],
        'model' => ['required', 'string', 'max:191'],
        'version' => ['nullable', 'string', 'max:191'],
        'description' => ['nullable', 'string'],
        'year' => ['required', 'digits:4'],
        'transmission' => ['required', 'in:manual,automatic'],
        'fuel' => ['required', 'in:diesel,gasoline,hybrid,electric'],
        'seats' => ['required', 'integer', 'min:1'],
        'doors' => ['required', 'integer', 'min:1'],
        'price_per_day' => ['required', 'numeric', 'min:0'],
        'status' => ['required', 'in:available,reserved,maintenance'],
        'available_from' => ['nullable', 'date'],
        'available_to' => ['nullable', 'date', 'after_or_equal:available_from'],
        'additional_information' => ['nullable', 'string'],

        'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        'images' => ['nullable', 'array'],
        'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
    ]);

    return DB::transaction(function () use ($request, $data) {
        unset($data['cover_image'], $data['images']);

        $car = Car::create($data);

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('cars/covers', 'public');

            $car->images()->create([
                'url' => $path,
                'is_cover' => true,
            ]);
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('cars/gallery', 'public');

                $car->images()->create([
                    'url' => $path,
                    'is_cover' => false,
                ]);
            }
        }

        return (new CarResource($car->load(['agency', 'coverImage', 'images'])))
            ->additional([
                'success' => true,
                'message' => 'Véhicule ajouté par admin !',
            ]);
    });
}

    public function update(Request $request, $id )
    {

        try {
                    $car = Car::findOrFail($id);

        $data = $request->validate([
            'agency_id' => ['sometimes', 'required', 'exists:agencies,id'],

            'category' => ['sometimes', 'required', 'string', 'max:191'],
            'brand' => ['sometimes', 'required', 'string', 'max:191'],
            'model' => ['sometimes', 'required', 'string', 'max:191'],
            'version' => ['nullable', 'string', 'max:191'],
            'description' => ['nullable', 'string'],
            'year' => ['sometimes', 'required', 'digits:4'],

            'transmission' => ['sometimes', 'required', 'in:manual,automatic'],
            'fuel' => ['sometimes', 'required', 'in:diesel,gasoline,hybrid,electric'],

            'seats' => ['sometimes', 'required', 'integer', 'min:1'],
            'doors' => ['sometimes', 'required', 'integer', 'min:1'],

            'price_per_day' => ['sometimes', 'required', 'numeric', 'min:0'],
            'status' => ['sometimes', 'required', 'in:available,reserved,maintenance'],

            'available_from' => ['nullable', 'date'],
            'available_to' => ['nullable', 'date', 'after_or_equal:available_from'],

            'additional_information' => ['nullable', 'string'],

            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

            return DB::transaction(function () use ($request, $car, $data) {

                unset($data['cover_image'], $data['images']);

                $car->update($data);

                if ($request->hasFile('cover_image')) {
                    $existingCover = $car->images()
                        ->where('is_cover', true)
                        ->first();

                    if ($existingCover) {
                        Storage::disk('public')->delete($existingCover->url);
                        $existingCover->delete();
                    }

                    $path = $request->file('cover_image')
                        ->store('cars/covers', 'public');

                    $car->images()->create([
                        'url' => $path,
                        'is_cover' => true,
                    ]);
                }

                if ($request->hasFile('images')) {
                    $oldImages = $car->images()
                        ->where('is_cover', false)
                        ->get();

                    foreach ($oldImages as $img) {
                        Storage::disk('public')->delete($img->url);
                        $img->delete();
                    }

                    foreach ($request->file('images') as $image) {
                        $path = $image->store('cars/gallery', 'public');

                        $car->images()->create([
                            'url' => $path,
                            'is_cover' => false,
                        ]);
                    }
                }

                $car->load(['agency', 'coverImage', 'images']);

                return (new CarResource($car))->additional([
                    'success' => true,
                    'message' => 'Véhicule mis à jour par admin !',
                ]);
            });

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du véhicule.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    }
