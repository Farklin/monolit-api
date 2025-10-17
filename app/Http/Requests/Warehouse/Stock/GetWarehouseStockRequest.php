<?php

namespace App\Http\Requests\Warehouse\Stock;

use Illuminate\Foundation\Http\FormRequest;

class GetWarehouseStockRequest extends FormRequest
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
            'strategy' => 'required|string|in:base',
            'context_id' => 'required|integer|min:1|exists:contexts,id',
            'category_id' => 'required|integer|min:1',
        ];
    }
}
