<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgencyPublicResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->agency_name,
            'city'           => $this->city,
            'address'        => $this->address,
            'is_verified'    => $this->is_verified,
            'logo'           => $this->logo_url, 
            'location' => [
                'lat' => $this->latitude,
                'lng' => $this->longitude,
            ],

            'working_hours' => [
                'start' => $this->time_start,
                'end'   => $this->time_end,
            ],

            'social_media' => $this->accounts_social ?? [],

            'stats' => [
                'total_available_cars' => $this->cars_count ?? $this->cars()->where('status', 'available')->count(),
                'happy_clients'        => $this->clients()->count(),
            ],

            'fleet' => $this->whenLoaded('cars', function() {
                return $this->cars->map(function($car) {
                    return [
                        'id'            => $car->id,
                        'brand'         => $car->brand,
                        'model'         => $car->model,
                        'category'      => $car->category,
                        'price_per_day' => $car->price_per_day,
                        'image'         => $car->image_url, // نفترض عندك Accessor فـ موديل Car
                        'transmission'  => $car->transmission,
                        'fuel'          => $car->fuel_type,
                    ];
                });
            }),
        ];
    }
}