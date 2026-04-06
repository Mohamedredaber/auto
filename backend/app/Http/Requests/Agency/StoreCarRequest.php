<?php

namespace App\Http\Requests\Agency;

use Illuminate\Foundation\Http\FormRequest;

class StoreCarRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

     public function rules(): array
{
    return [
        'brand'         => 'required|string|max:50',
        'model'         => 'required|string|max:50',
        'category'      => 'required|string', // ex: SUV, Compact...
        'price_per_day' => 'required|numeric|min:0',
        'transmission'  => 'required|in:manual,automatic',
        'fuel'          => 'required|in:petrol,diesel,electric,hybrid',
        'images'        => 'required|array|min:1', // Khass au moins image wa7da
        'images.*'      => 'image|mimes:jpeg,png,jpg|max:2048', // Kol image max 2MB
    ];
}
    }

