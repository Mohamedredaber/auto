<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'first_name' => $this->first_name,
            'last_name'  => $this->last_name,
            'full_name'  => $this->full_name,
            'email'      => $this->email,
            'phone'      => $this->phone,
            'role'       => $this->role,

            // Affiché seulement si c'est un admin_agency
            'agency' => $this->when(
                $this->isAgencyAdmin() && $this->relationLoaded('agency'),
                fn () => new AgencyResource($this->agency)
            ),

            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}