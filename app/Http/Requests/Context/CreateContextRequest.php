<?php

namespace App\Http\Requests\Context;

use Illuminate\Foundation\Http\FormRequest;

class CreateContextRequest extends FormRequest
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
            'project_id' => 'required|integer|min:1|exists:projects,id',
            'status' => 'required|boolean',
            'priority' => 'required|integer|min:0',
            'name' => 'required|string|max:255',
            'key' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ];
    }
}
