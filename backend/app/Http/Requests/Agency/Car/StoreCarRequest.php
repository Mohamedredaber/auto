<?php

namespace App\Http\Requests\Agency\Car;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        return [
            'brand'         => 'required|string|max:255',
            'model'         => 'required|string|max:255',
            'category'      => 'required|string',
            'year'          => 'required|integer|min:1990|max:' . (date('Y') + 1),
            'transmission'  => ['required', Rule::in(['manual', 'automatic'])],
            'fuel'          => ['required', Rule::in(['diesel', 'gasoline', 'hybrid', 'electric'])],
            'seats'         => 'required|integer|min:1|max:10',
            'doors'         => 'required|integer|min:2|max:5',
            'price_per_day' => 'required|numeric|min:0',
            'status'        => ['required', Rule::in(['available', 'reserved', 'maintenance'])],
            'available_from' => 'required|date',
            'available_to'   => 'required|date|after:available_from',
            
            'cover_image'   => 'required|image|mimes:jpeg,png,jpg|max:2048', 
            
            'images'        => 'nullable|array',
            'images.*'      => 'image|mimes:jpeg,png,jpg|max:2048', 
            'description'   => 'nullable|string',
            'version'       => 'nullable|string',
            'additional_information' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'brand.required'       => 'La marque est obligatoire.',
            'price_per_day.numeric'=> 'Le prix doit être un nombre.',
            'cover_image.required' => 'L\'image de couverture est obligatoire.',
            'cover_image.image'    => 'Le fichier doit être une image.',
        ];
    }
}