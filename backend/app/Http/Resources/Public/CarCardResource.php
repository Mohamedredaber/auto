<?php
namespace App\Http\Resources\Public;

use Illuminate\Http\Resources\Json\JsonResource;

class CarCardResource extends JsonResource
{
    public function toArray($request): array
    {
        // On récupère l'image de couverture dans la collection déjà chargée
        $cover = $this->images->firstWhere('is_cover', true);

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
            
            // On utilise $cover qu'on a trouvé juste au-dessus
            'cover_image'   => $cover 
                                ? asset('storage/' . $cover->url) 
                                : asset('images/default-car.png'),

            // On garde whenLoaded pour la galerie (c'est déjà optimisé)
            'gallery'       => $this->whenLoaded('images', function() {
                return $this->images->map(fn($img) => [
                    'id'       => $img->id,
                    'url'      => asset('storage/' . $img->url),
                    'is_cover' => (bool) $img->is_cover
                ]);
            }),

            'description' => $this->additional_information,
        ];
    }
}