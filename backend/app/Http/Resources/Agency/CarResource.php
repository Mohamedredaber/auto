<?php

namespace App\Http\Resources\Agency;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CarResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'brand'          => $this->brand,
            'model'          => $this->model,
            'category'       => $this->category,
            'year'           => $this->year,
            'transmission'   => $this->transmission,
            'fuel'           => $this->fuel,
            'seats'          => $this->seats,
            'doors'          => $this->doors,
            'price_per_day'  => (float) $this->price_per_day,
            'status'         => $this->status,
            'additional_info'=> $this->additional_information,
            'description'    => $this->description,
            'version'        => $this->version,
            'cover_image_url'=> $this->coverImage 
                ? asset('storage/' . $this->coverImage->url) 
                : asset('images/default-car.png'),

            'gallery'        => $this->whenLoaded('images', function() {
                return $this->images->map(fn($img) => [
                    'id'       => $img->id,
                    'url'      => asset('storage/' . $img->url),
                    'is_cover' => (bool) $img->is_cover
                ]);
            }),
            
            'created_at'     => $this->created_at->format('Y-m-d'),
        ];
    }
}