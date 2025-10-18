<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class RemovePermissionFromUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'permission_id' => 'required|exists:permissions,id'
        ];
    }
}

