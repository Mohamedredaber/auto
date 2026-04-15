<?php

namespace App\Services\Public;

use Illuminate\Http\Request;
use App\Models\Car;

class CarSearchService
{
    public function search(Request $request)
    {   
        $query = Car::with(['images', 'agency'])->where('status', 'available');

        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('brand', 'like', "%{$searchTerm}%")
                  ->orWhere('model', 'like', "%{$searchTerm}%");
            });
        }

        if ($request->filled('city')) {
            $query->whereHas('agency', function($q) use ($request) {
                $q->where('city', $request->city);
            });
        }
        
        if ($request->filled('transmission')) {
            $query->where('transmission', $request->transmission);
        }

        if ($request->filled('max_price')) {
            $query->where('price_per_day', '<=', $request->max_price);
        }

        if ($request->sort === 'price_asc') {
            $query->orderBy('price_per_day', 'asc');
        } elseif ($request->sort === 'price_desc') {
            $query->orderBy('price_per_day', 'desc');
        } else {
             $query->orderBy('created_at', 'desc');
        }

        return $query->paginate(12);
    }       

    public function getCarById($id) 
    {  
        return Car::with(['images', 'agency'])->findOrFail($id);
    }
}