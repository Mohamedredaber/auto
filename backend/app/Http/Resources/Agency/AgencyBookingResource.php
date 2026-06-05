<?php

namespace App\Http\Resources\Agency;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgencyBookingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
 public function toArray($request)
{
    return [
        'id' => "RES-" . $this->id,
        'client' => [
            'name' => $this->user->first_name . ' ' . $this->user->last_name,
            'avatar' => $this->user->avatar_url,
        ],
        'vehicle' => [
            'name' => $this->car->brand . ' ' . $this->car->model,
            'category' => 'CATÉGORIE ' . $this->car->category,
        ],
        'agence_ville' => $this->car->agency->name . ' / ' . $this->car->agency->city,
        'periode' => [
            'start' => $this->start_date->format('d M Y'),
            'end' => $this->end_date->format('d M Y'),
        ],
        'total_mad' => number_format($this->total_price, 0, '.', ' ') . ' DH',
        'status' => $this->status, // pending, confirmed, finished, canceled
    ];
}
}
