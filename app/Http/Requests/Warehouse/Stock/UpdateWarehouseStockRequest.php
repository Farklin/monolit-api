<?php

namespace App\Http\Requests\Warehouse\Stock;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWarehouseStockRequest extends FormRequest
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
        // ID текущей записи из маршрута
        $stockId = $this->route('stock');

        return [
            'warehouse_id' => 'required|integer|min:1|exists:warehouses,id',
            'category_id' => [
                'required',
                'integer',
                'min:1',
            ],
            'max_quantity' => 'required|integer|min:0',
            'min_quantity' => 'required|integer|min:0',
        ];
    }
}
