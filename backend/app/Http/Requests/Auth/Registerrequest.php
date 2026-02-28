<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Formulaire unique partagé entre client et agence (Step 1).
 * Le champ "role" détermine le comportement.
 */
class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name'  => ['required', 'string', 'max:100'],
            'email'      => ['required', 'email', 'unique:users,email'],
            'phone'      => ['required', 'string', 'max:20'],
            'password'   => ['required', 'string', 'min:8', 'confirmed'],
            'role'       => ['required', 'in:client,admin_agency'],
        ];
    }

    public function messages(): array
    {
        return [
            'role.in' => 'Le rôle doit être client ou admin_agency.',
        ];
    }
}