<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\AgencyResource;
use App\Http\Resources\Public\AgencyPublicResource;
use App\Models\Agency;
class AgencyPublicController extends Controller
{

    public function show($id) 
    {
        $agency = Agency::withCount(['cars' => function ($query) {
            $query->where('status', 'available');
        }])
        ->with(['cars' => function ($query) {
            $query->where('status', 'available')->take(10); // كنجيبو غير 10 اللولين مثلاً
        }])
        ->findOrFail($id);


        return (new AgencyPublicResource($agency))
            ->additional([
                'success' => true,
                'message' => 'Profil de l\'agence récupéré avec succès.'
            ]);
    }
}