<?php
namespace App\Http\Resources\Public;

use Illuminate\Http\Resources\Json\JsonResource;

class CarCardResource extends JsonResource
{
    public function toArray($request): array
    {
        $cover = $this->images->firstWhere('is_cover', true);
        $agency = $this->agency;
            return [
            'id'            => $this->id,
            'brand'         => $this->brand,
            'model'         => $this->model,
            'price_per_day' => $this->price_per_day,
            'status'        => $this->status,
            'fuel'          => $this->fuel,
            'transmission'  => $this->transmission,
            'year'          => $this->year,
            'seats'         => $this->seats,
            
            'cover_image'   => $cover 
                                ? asset('/storage/' . $cover->url) 
                                : asset('images/default-car.png'),


            'gallery'       => $this->whenLoaded('images', function() {
                return $this->images->map(fn($img) => [
                    'id'       => $img->id,
                    'url'      => asset('storage/' . $img->url),
                    'is_cover' => (bool) $img->is_cover
                ]);
            }),
            'agency' => $agency,
            'description' => $this->additional_information,
        ];
    }
}