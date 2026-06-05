<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'agency_id' => $this->agency_id,
            'agency_name' => $this->agency?->agency_name,
            'agency_city' => $this->agency?->city,
            'category' => $this->category,
            'brand' => $this->brand,
            'model' => $this->model,
            'version' => $this->version,
            'description' => $this->description,
            'year' => $this->year,
            'transmission' => $this->transmission,
            'fuel' => $this->fuel,
            'seats' => $this->seats,
            'doors' => $this->doors,
            'price_per_day' => (float) $this->price_per_day,
            'status' => $this->status,
            'available_from' => $this->available_from,
            'available_to' => $this->available_to,
            'additional_information' => $this->additional_information,
            'cover_image_url' => $this->coverImage
                ? asset('storage/' . $this->coverImage->url)
                : asset('images/default-car.png'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
