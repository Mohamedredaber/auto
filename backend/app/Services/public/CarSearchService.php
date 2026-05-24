<?php

namespace App\Services\Public;

use Illuminate\Http\Request;
use App\Models\Car;

class CarSearchService
{
    public function search(Request $request)
    {   
        $query = Car::with(['images', 'agency']);

        // Filtre status (en production, souvent limité à 'available')
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            // Par défaut, afficher uniquement les voitures disponibles
            $query->where('status', 'available');
        }

        // Filtre recherche (brand + model)
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('brand', 'like', "%{$searchTerm}%")
                  ->orWhere('model', 'like', "%{$searchTerm}%");
            });
        }

        // Filtre marque
        if ($request->filled('brand') && $request->brand !== 'Toutes les marques') {
            $query->where('brand', $request->brand);
        }

        // Filtre ville (via agence)
        if ($request->filled('city') && $request->city !== 'Toutes les villes') {
            $query->whereHas('agency', function($q) use ($request) {
                $q->where('city', $request->city);
            });
        }
        
        if ($request->filled('fuel')) {
            $query->where('fuel', $request->fuel);
        }

        // Filtre prix maximum
        if ($request->filled('max_price')) {
            $query->where('price_per_day', '<=', $request->max_price);
        }

        // Tri
        if ($request->sort === 'price_asc') {
            $query->orderBy('price_per_day', 'asc');
        } elseif ($request->sort === 'price_desc') {
            $query->orderBy('price_per_day', 'desc');
        } else {
            // Par défaut: tri par date (plus récent)
            $query->orderBy('created_at', 'desc');
        }

        // Pagination: 12 éléments par page
        return $query->paginate(12);
    }       

    public function getCarById($id) 
    {  
        return Car::with(['images', 'agency'])->findOrFail($id);
    }
}