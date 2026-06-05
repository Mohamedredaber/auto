<?php

namespace App\Http\Controllers\super_admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Agency;
use Illuminate\Support\Facades\Validator;


class adminController extends Controller
{
    public function changeAgencyStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'agency_id' => 'required|exists:agencies,id',
            'is_verified' => 'required|in:verified,inverified,wait',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $agency = Agency::findOrFail($request->agency_id);
        $agency->update([
            'is_verified' => $request->is_verified,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'status de l\'agence mis à jour avec succès',
            'data' => $agency->fresh()
        ]);
       
    }
}
