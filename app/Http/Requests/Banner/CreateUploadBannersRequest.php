<?php

namespace App\Http\Requests\Banner;

use Illuminate\Foundation\Http\FormRequest;
use App\Enum\BannerTypeEnum;

class CreateUploadBannersRequest extends FormRequest
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
            "banners" => "required|array|min:1",
            "banners.*" => "required|image|mimes:jpeg,png,jpg,gif,svg|max:2048",
            "type" => "required|string|in:" . implode(',', BannerTypeEnum::getValues()),
        ];
    }

    public function messages(): array
    {
        return [
            'banners.required' => 'Необходимо загрузить хотя бы один баннер',
            'banners.array' => 'Баннеры должны быть переданы в виде массива',
            'banners.min' => 'Необходимо загрузить хотя бы один баннер',
            'banners.*.required' => 'Каждый баннер обязателен',
            'banners.*.image' => 'Файл должен быть изображением',
            'banners.*.mimes' => 'Поддерживаются только форматы: jpeg, png, jpg, gif, svg',
            'banners.*.max' => 'Размер файла не должен превышать 2MB',
            'type.required' => 'Тип баннера обязателен',
            'type.string' => 'Тип баннера должен быть строкой',
            'type.in' => 'Недопустимый тип баннера. Доступные: ' . implode(', ', BannerTypeEnum::getValues()),
        ];
    }
}
