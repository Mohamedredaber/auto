<?php

namespace App\Http\Resources\Client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{


    public function toArray(Request $request): array
    {
        $carCover = $this->car?->images?->first();
        
        return [
            'id' => $this->id,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'total_price' => (float) $this->total_price,
            'status' => $this->status,
            'car_details' => $this->car ? [
                'id' => $this->car->id,
                'brand' => $this->car->brand,
                'model' => $this->car->model,
                'year' => $this->car->year ?? null,
                'category' => $this->car->category,
                'cover_image' => $carCover ? asset('storage/' . $carCover->url) : asset('images/default-car.png'),
            ] : null,
            'agency_details' => $this->agency ? [
                'id' => $this->agency->id,
                'name' => $this->agency->agency_name,
                'city' => $this->agency->city,
                'address' => $this->agency->address ?? null,
                'phone' => $this->agency->phone ?? null,
            ] : null,
            'created_at' => $this->created_at?->format('Y-m-d H:i'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i'),
        ];
    }
}
