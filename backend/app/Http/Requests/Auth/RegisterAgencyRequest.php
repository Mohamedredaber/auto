<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class CompleteAgencyProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAgencyAdmin();
    }

    public function rules(): array
    {
        return [
            'agency_name'    => ['required', 'string', 'max:150'],
            'city'           => ['required', 'string', 'max:100'],
            'address'        => ['required', 'string', 'max:255'],
            'time_start'     => ['required', 'date_format:H:i'],
            'time_end'       => ['required', 'date_format:H:i', 'after:time_start'],
            'logo'           => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'latitude'       => ['required', 'numeric', 'between:-90,90'],
            'longitude'      => ['required', 'numeric', 'between:-180,180'],
            'accounts_social'=> ['nullable', 'array'],
            'accounts_social.facebook'  => ['nullable', 'url'],
            'accounts_social.instagram' => ['nullable', 'url'],
            'accounts_social.twitter'   => ['nullable', 'url'],
        ];
    }

    public function messages(): array
    {
        return [
            'time_end.after'       => "L'heure de fermeture doit être après l'heure d'ouverture.",
            'authorize'            => "Seul un admin d'agence peut compléter ce profil.",
        ];
    }
}