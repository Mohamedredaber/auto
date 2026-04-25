<?php

namespace App\Http\Resources\Agency;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'car_id'       => $this->car_id,
            'user_id'      => $this->user_id,
            'agency_id'    => $this->agency_id,
            'start_date'   => $this->start_date,
            'end_date'     => $this->end_date,
            'total_price'  => (float) $this->total_price,
            'status'       => $this->status,
            
            'car' => $this->whenLoaded('car', function() {
                return [
                    'id'    => $this->car->id,
                    'brand' => $this->car->brand,
                    'model' => $this->car->model,
                    'year'  => $this->car->year,
                    'cover_image_url' => $this->car->coverImage 
                        ? asset('storage/' . $this->car->coverImage->url)
                        : asset('images/default-car.png'),
                ];
            }),
            
            'user' => $this->whenLoaded('user', function() {
                return [
                    'id'       => $this->user->id,
                    'name'     => $this->user->first_name . ' ' . $this->user->last_name    ,
                    'email'    => $this->user->email,
                    'phone'    => $this->user->phone ?? null,
                ];
            }),
            
            'created_at' => $this->created_at->format('Y-m-d H:i'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i'),
        ];
    }
}
