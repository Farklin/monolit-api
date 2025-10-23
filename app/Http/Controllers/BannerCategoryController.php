<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BannerCategory;
use App\Models\Banner;

class BannerCategoryController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/banner-categories",
     *     summary="Получение списка категорий баннеров",
     *     description="Возвращает список категорий баннеров с возможностью фильтрации по контексту, типу и категории",
     *     tags={"Banners"},
     *      security={{"sanctum":{}}},
     *     @OA\Parameter(ref="#/components/parameters/AcceptJson"),
     *     @OA\Parameter(
     *         name="context_id",
     *         in="query",
     *         description="ID контекста для фильтрации",
     *         required=false,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(
     *         name="type",
     *         in="query",
     *         description="Тип категории баннера",
     *         required=false,
     *         @OA\Schema(type="string", enum={"catalog", "promo"}, example="catalog")
     *     ),
     *     @OA\Parameter(
     *         name="category_id",
     *         in="query",
     *         description="ID категории для фильтрации",
     *         required=false,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="conditions", type="object", description="Условия фильтрации"),
     *             @OA\Property(property="banners", type="array", @OA\Items(type="object"), description="Список баннеров")
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $query = BannerCategory::query();

        if($request->has("current_context_id") && $request->current_context_id != null) {
            $query->where('context_id', $request->current_context_id);
        }

        if ($request->has('context_id') && $request->context_id != null) {
            $query->where('context_id', $request->context_id);
        }

        if ($request->has('type') && $request->type != null) {
            $query->where('type', $request->type);
        }

        if ($request->has('category_id') && $request->category_id != null) {
            $query->where('category_id', $request->category_id);
        }

        $bannerCategories = $query->get();

        return response()->json($bannerCategories);
    }

    /**
     * @OA\Post(
     *     path="/api/banner-categories",
     *     summary="Создание категории баннера",
     *     description="Создает новую категорию баннера с указанными параметрами",
     *     tags={"Banners"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(ref="#/components/parameters/AcceptJson"),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={"name", "context_id", "banner_id", "type", "category_id", "priority"},
     *                 @OA\Property(property="name", type="string", description="Название категории баннера", example="Banner Category 1"),
     *                 @OA\Property(property="context_id", type="integer", description="ID контекста", example=1),
     *                 @OA\Property(property="banner_id", type="integer", description="ID баннера", example=1),
     *                 @OA\Property(property="type", type="string", enum={"catalog", "promo"}, description="Тип категории", example="catalog"),
     *                 @OA\Property(property="category_id", type="integer", description="ID категории", example=1),
     *                 @OA\Property(property="priority", type="integer", description="Приоритет отображения", example=1),
     *                 example={"name": "Banner Category 1", "context_id": 1, "banner_id": 1, "type": "catalog", "category_id": 1, "priority": 1}
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Категория баннера успешно создана",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Banner category created successfully"),
     *             @OA\Property(property="banner_category", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Banner Category 1"),
     *                 @OA\Property(property="context_id", type="integer", example=1),
     *                 @OA\Property(property="banner_id", type="integer", example=1),
     *                 @OA\Property(property="type", type="string", example="catalog"),
     *                 @OA\Property(property="category_id", type="integer", example=1),
     *                 @OA\Property(property="priority", type="integer", example=1),
     *                 @OA\Property(property="created_at", type="string", format="datetime", example="2021-01-01 00:00:00"),
     *                 @OA\Property(property="updated_at", type="string", format="datetime", example="2021-01-01 00:00:00")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Ошибка валидации",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(property="errors", type="object",
     *                 @OA\Property(property="name", type="array", @OA\Items(type="string", example="The name field is required.")),
     *                 @OA\Property(property="context_id", type="array", @OA\Items(type="string", example="The context id field is required.")),
     *                 @OA\Property(property="banner_id", type="array", @OA\Items(type="string", example="The banner id field is required.")),
     *                 @OA\Property(property="type", type="array", @OA\Items(type="string", example="The type field is required.")),
     *                 @OA\Property(property="category_id", type="array", @OA\Items(type="string", example="The category id field is required.")),
     *                 @OA\Property(property="priority", type="array", @OA\Items(type="string", example="The priority field is required."))
     *             )
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            "name" => "required|string",
            "context_id" => "required|integer",
            "banner_id" => "required|integer",
            "type" => "required|string",
            "category_id" => "required|integer",
            "priority" => "required|integer",
        ]);
        $bannerCategory = BannerCategory::create($data);
        return response()->json(["message" => "Banner category created successfully", "banner_category" => $bannerCategory]);
    }

    /**
     * @OA\Put(
     *     path="/api/banner-categories/{id}",
     *     summary="Обновление категории баннера",
     *     description="Обновляет существующую категорию баннера по ID",
     *     tags={"Banners"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(ref="#/components/parameters/AcceptJson"),
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID категории баннера",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={"name", "context_id", "banner_id", "type", "category_id", "priority"},
     *                 @OA\Property(property="name", type="string", description="Название категории баннера", example="Banner Category 1"),
     *                 @OA\Property(property="context_id", type="integer", description="ID контекста", example=1),
     *                 @OA\Property(property="banner_id", type="integer", description="ID баннера", example=1),
     *                 @OA\Property(property="type", type="string", enum={"catalog", "promo"}, description="Тип категории", example="catalog"),
     *                 @OA\Property(property="category_id", type="integer", description="ID категории", example=1),
     *                 @OA\Property(property="priority", type="integer", description="Приоритет отображения", example=1),
     *                 example={"name": "Banner Category 1", "context_id": 1, "banner_id": 1, "type": "catalog", "category_id": 1, "priority": 1}
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Категория баннера успешно обновлена",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Категория баннера не найдена"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Ошибка валидации",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            "name" => "required|string",
            "context_id" => "required|integer",
            "banner_id" => "required|integer",
            "type" => "required|string",
            "category_id" => "required|integer",
            "priority" => "required|integer",
        ]);
        $bannerCategory = BannerCategory::find($id);
        $bannerCategory->update($data);
        return response()->json(["success" => true]);
    }

    /**
     * @OA\Delete(
     *     path="/api/banner-categories/{id}",
     *     summary="Удаление категории баннера",
     *     description="Удаляет категорию баннера по ID",
     *     tags={"Banners"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(ref="#/components/parameters/AcceptJson"),
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID категории баннера",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Категория баннера успешно удалена",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Banner category deleted successfully"),
     *             @OA\Property(property="banner_category", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Banner Category 1"),
     *                 @OA\Property(property="context_id", type="integer", example=1),
     *                 @OA\Property(property="banner_id", type="integer", example=1),
     *                 @OA\Property(property="type", type="string", example="catalog"),
     *                 @OA\Property(property="category_id", type="integer", example=1),
     *                 @OA\Property(property="priority", type="integer", example=1),
     *                 @OA\Property(property="created_at", type="string", format="datetime", example="2021-01-01 00:00:00"),
     *                 @OA\Property(property="updated_at", type="string", format="datetime", example="2021-01-01 00:00:00")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Категория баннера не найдена"
     *     )
     * )
     */
    public function destroy($id)
    {
        $bannerCategory = BannerCategory::find($id);
        $bannerCategory->delete();
        return response()->json(["message" => "Banner category deleted successfully", "banner_category" => $bannerCategory]);
    }
}
