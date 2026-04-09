<?php
namespace App\Services\Public;

use Symfony\Component\HttpFoundation\Request;
use Illuminate\Http\Request
use App\Models\Car;
class CarSearchService
{
        public function search(Request $request): array
    {   
        $query =Car::with(['coverImage', 'images','agency'])->where('status', 'available');
        if($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('brand', 'like', "%{$searchTerm}%")
                  ->orWhere('model', 'like', "%{$searchTerm}%") ;
            });
            if ($request->filled('city')) {
                $query->whereHas('agency', function($q) use ($request) {
                    $q->where('city', $request->city);
                });
            }
            if($request->filled('fuel')) {
                $query->where('fuel', $request->fuel);
            }
            if($request->filled('transmission')) {
                $query->where('transmission', $request->transmission);
            }
            if($request->filled('seats')) {
                $query->where('seats', $request->seats);
            }
            if($request->filled('year')) {
                $query->where('year', $request->year);
            }
            if ($request->filled('max_price')) {
            $query->where('price_per_day', '<=', $request->max_price);
        }
        if ($request->sort === 'price_asc') {
            $query->orderBy('price_per_day', 'asc');
        } elseif ($request->sort === 'price_desc') {
            $query->orderBy('price_per_day', 'desc');
        } else {
            $query->latest();
        }


        
    }       
}