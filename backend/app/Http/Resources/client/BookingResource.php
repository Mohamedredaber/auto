<?php

namespace App\Http\Resources\Client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{


    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'total_price' => $this->total_price,
            'status' => $this->status,
            'car_details' => [
                'id' => $this->car->id,
                'brand' => $this->car->brand,
                'model' => $this->car->model,
                'category' => $this->car->category,
                'cover_image' => $this->car->images?->first()?->url ?? null,
            ],
            'agency_details' => [
                'id' => $this->agency->id,
                'name' => $this->agency->agency_name,
                'city' => $this->agency->city,
                'address' => $this->agency->address ?? null,
            ],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
