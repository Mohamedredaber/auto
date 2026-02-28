<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgencyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'agency_name'    => $this->agency_name,
            'city'           => $this->city,
            'address'        => $this->address,
            'latitude'       => $this->latitude,
            'longitude'      => $this->longitude,
            'time_start'     => $this->time_start,
            'time_end'       => $this->time_end,
            'is_verified'    => $this->is_verified,
            'logo_url'       => $this->logo_url,
            'accounts_social'=> $this->accounts_social,
        ];
    }
}