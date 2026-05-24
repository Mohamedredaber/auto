<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterAgencyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        return [
            'first_name'            => ['required', 'string', 'max:255'],
            'last_name'             => ['required', 'string', 'max:255'],
            'email'                 => ['required', 'email', 'unique:users,email'],
            'phone'                 => ['required', 'string', 'max:20'],
            'password'              => ['required', 'string', 'min:8', 'confirmed'],

            'agency_name'           => ['required', 'string', 'max:255'],
            'city'                  => ['required', 'string', 'max:100'],
            'address'               => ['required', 'string', 'max:500'],
            'time_start'            => ['required', 'date_format:H:i'],
            'time_end'              => ['required', 'date_format:H:i', 'after:time_start'],
            'logo'                  => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:2048'],
            'latitude'              => ['nullable', 'numeric'],
            'longitude'             => ['nullable', 'numeric'],
            'accounts_social'       => ['nullable', 'string'],
        ];
    }
    public function messages(): array
    {
        return [
            'time_end.after' => 'L\'heure de fin doit être après l\'heure de début.',
        ];
    }
}