<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Banner;
use App\Http\Requests\Banner\CreateUploadBannersRequest;
use App\Enum\BannerTypeEnum;
use Illuminate\Support\Facades\Storage;
/**
 * @OA\Tag(
 *     name="Banners",
 *     description="Banners API"
 * )
 */
class BannerController extends Controller
{

   /**
     * @OA\Post(
     *     path="/api/banners/upload",
     *     description="Загрузка баннеров в систему",
     *     summary="Загрузка баннеров",
     *     operationId="uploadBanners",
     *     security={{"sanctum":{}}},
     *     tags={"Banners"},
     *     @OA\Parameter(ref="#/components/parameters/AcceptJson"),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                @OA\Property(property="banners", type="array", @OA\Items(type="string", format="binary"), description="Массив файлов баннеров"),
     *                @OA\Property(property="type", type="string", enum={"default", "mobile", "tablet", "desktop", "all"}, description="Тип баннера"),
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Баннеры успешно загружены",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Баннеры успешно загружены"),
     *             @OA\Property(property="images", type="array", @OA\Items(type="string"), example={"banners/banner1.jpg", "banners/banner2.jpg"})
     *         )
     *     ),
     *     @OA\Response(
     *         response="422",
     *         description="Ошибка валидации",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     * */
    public function uploadBanners(CreateUploadBannersRequest $request)
    {
        $data = $request->validated();
        $banners = $data['banners'];
        $type = $data['type'];

        $mainBanner = null;
        $bannerImages = [];

        foreach ($banners as $key => $bannerFile) {
            $banner = new Banner();
            $banner->image = $bannerFile->store('banners', 'public');
            $banner->type = $type;
            $bannerImages[] = $banner->image;
            // Первый баннер будет основным
            if ($key == 0) {
                $banner->save();
                $mainBanner = $banner;
            } else {
                // Остальные баннеры будут дочерними
                if ($mainBanner !== null) {
                    $banner->banner_id = $mainBanner->id;
                }
                $banner->save();
            }
        }

        return response()->json(['message' => 'Баннеры успешно загружены', 'images' => $bannerImages], 200);
    }

    /**
     * @OA\Get(
     *     path="/api/banners",
     *     summary="Получение списка баннеров",
     *     description="Возвращает список всех баннеров с возможностью фильтрации по типу",
     *     tags={"Banners"},
     *     @OA\Parameter(ref="#/components/parameters/AcceptJson"),
     *     @OA\Parameter(
     *         name="type",
     *         in="query",
     *         description="Фильтр по типу баннера",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             enum={"default", "mobile", "tablet", "desktop", "all"}
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Список баннеров",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="image", type="string", example="banners/banner_1234567890.jpg"),
     *                 @OA\Property(property="type", type="string", example="default"),
     *                 @OA\Property(property="parent_id", type="integer", nullable=true, example=null),
     *                 @OA\Property(property="created_at", type="string", format="datetime", example="2023-10-23T10:30:00.000000Z"),
     *                 @OA\Property(property="updated_at", type="string", format="datetime", example="2023-10-23T10:30:00.000000Z")
     *             )
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $query = Banner::query();

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $banners = $query->get();

        return response()->json($banners);
    }

    /**
     * @OA\Get(
     *     path="/api/banners/{id}",
     *     summary="Get banner by ID",
     *     tags={"Banners"},
     *     @OA\Parameter(ref="#/components/parameters/AcceptJson"),
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="id", type="integer", example=1), @OA\Property(property="image", type="string", example="banners/banner_1234567890.jpg"), @OA\Property(property="type", type="string", example="default"), @OA\Property(property="parent_id", type="integer", nullable=true, example=null), @OA\Property(property="created_at", type="string", format="datetime", example="2023-10-23T10:30:00.000000Z"), @OA\Property(property="updated_at", type="string", format="datetime", example="2023-10-23T10:30:00.000000Z"))),
     *     @OA\Response(response=404, description="Banner not found")
     * )
     */
    public function show($id)
    {
        $banner = Banner::find($id);
        return response()->json($banner);
    }

    /**
     * @OA\Delete(
     *     path="/api/banners/{id}",
     *     summary="Delete banner by ID",
     *     tags={"Banners"},
     *     @OA\Parameter(ref="#/components/parameters/AcceptJson"),
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="message", type="string", example="Banner deleted successfully"), @OA\Property(property="banner", type="object", @OA\Property(property="id", type="integer", example=1), @OA\Property(property="image", type="string", example="banners/banner_1234567890.jpg"), @OA\Property(property="type", type="string", example="default"), @OA\Property(property="parent_id", type="integer", nullable=true, example=null), @OA\Property(property="created_at", type="string", format="datetime", example="2023-10-23T10:30:00.000000Z"), @OA\Property(property="updated_at", type="string", format="datetime", example="2023-10-23T10:30:00.000000Z")))),
     *     @OA\Response(response=404, description="Banner not found")
     * )
     */
    public function destroy($id)
    {
        $banner = Banner::find($id);
        $banner->delete();
        return response()->json(["message" => "Banner deleted successfully", "banner" => $banner]);
    }

    /**
     * @OA\Put(
     *     path="/api/banners/{id}",
     *     summary="Обновление баннера",
     *     description="Обновляет существующий баннер по ID с возможностью загрузки нового изображения",
     *     tags={"Banners"},
     *     @OA\Parameter(ref="#/components/parameters/AcceptJson"),
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID баннера",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(property="image", type="string", format="binary", description="Новое изображение баннера (jpeg, png, jpg, gif, svg, max 2MB)"),
     *                 @OA\Property(property="type", type="string", enum={"default", "mobile", "tablet", "desktop", "all"}, description="Тип баннера"),
     *                 @OA\Property(property="banner_id", type="integer", description="ID родительского баннера")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Баннер успешно обновлен",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Banner updated successfully"),
     *             @OA\Property(property="banner", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="image", type="string", example="banners/banner_1234567890.jpg"),
     *                 @OA\Property(property="type", type="string", example="default"),
     *                 @OA\Property(property="banner_id", type="integer", nullable=true, example=null),
     *                 @OA\Property(property="created_at", type="string", format="datetime", example="2023-10-23T10:30:00.000000Z"),
     *                 @OA\Property(property="updated_at", type="string", format="datetime", example="2023-10-23T10:30:00.000000Z")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Баннер не найден"
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
    public function update(Request $request, $id){
        $data = $request->validate([
            "image" => "file|image|mimes:jpeg,png,jpg,gif,svg|max:2048",
            "type" => "string|in:" . implode(',', BannerTypeEnum::getValues()),
            "banner_id" => "integer",
        ]);
        $banner = Banner::find($id);
        //Удаляем старое изображение
        Storage::disk('public')->delete($banner->image);
        //Создаем новое изображение
        $banner->image = $data['image']->store('banners', 'public');
        $banner->type = $data['type'];
        $banner->banner_id = $data['banner_id'];
        $banner->save();
        return response()->json(["message" => "Banner updated successfully", "banner" => $banner]);
    }
}
