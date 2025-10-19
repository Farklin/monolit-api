<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Warehouse;
use App\Http\Requests\Warehouse\Stock\GetWarehouseStockRequest;
use App\Http\Requests\Warehouse\CreateWarehouseRequest;
use App\Http\Requests\Warehouse\UpdateWarehouseRequest;
use App\Services\Warehouse\WarehouseService;
use App\Dto\Warehouse\QueryWarehouseStrockDto;
use Illuminate\Support\Facades\Cache;
use App\Models\Context;
use App\Enum\PermissonEnum;
/**
 * @OA\Tag(
 *     name="Warehouses",
 *     description="Warehouses API"
 * )
 */
class WarehouseController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/warehouses",
     *     summary="Fetch data",
     *     tags={"Warehouses"},
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="string", example="Sample data")
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        if ($error = $this->checkPermission(PermissonEnum::READ_WAREHOUSE->value, 'У вас недостаточно прав для просмотра складов')) {
            return $error;
        }

        $query = Warehouse::query();

        if($request->has("current_context_id")){
            $query->where('context', $request->current_context_id);
        }

        if (!$request->has("current_context_id") || $request->has('current_project_id')) {
            $contexts = Context::where('project_id', $request->current_project_id)->pluck('id');
            $query->whereIn('context_id', $contexts);
        }
        return $query->get();
    }

    /**
     * @OA\Get(
     *     path="/api/warehouses/{id}",
     *     summary="Fetch data by id",
     *     tags={"Warehouses"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="string", example="Sample data")
     *         )
     *     )
     * )
     */
    public function show($id)
    {
        if ($error = $this->checkPermission(PermissonEnum::READ_WAREHOUSE->value, 'У вас недостаточно прав для просмотра складов')) {
            return $error;
        }
        return Warehouse::findOrFail($id);
    }

    /**
     * @OA\Post(
     *     path="/api/warehouses",
     *     summary="Create data",
     *     tags={"Warehouses"},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="description", type="string"),
     *                 @OA\Property(property="content", type="string"),
     *                 @OA\Property(property="context_id", type="integer"),
     *                 @OA\Property(property="status", type="boolean"),
     *                 @OA\Property(property="priority", type="integer"),
     *                 example={"name": "Warehouse name", "description": "Warehouse description", "content": "Warehouse content", "context_id": 1, "status": true, "priority": 1}
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="string", example="Sample data")
     *         )
     *     )
     * )
     */
    public function store(CreateWarehouseRequest $request)
    {
        if ($error = $this->checkPermission(PermissonEnum::CREATE_WAREHOUSE->value, 'У вас недостаточно прав для создания складов')) {
            return $error;
        }
        return Warehouse::create($request->validated());
    }

    /**
     * @OA\Put(
     *     path="/api/warehouses/{id}",
     *     summary="Update data",
     *     tags={"Warehouses"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="description", type="string"),
     *                 @OA\Property(property="content", type="string"),
     *                 @OA\Property(property="context_id", type="integer"),
     *                 @OA\Property(property="status", type="boolean"),
     *                 @OA\Property(property="priority", type="integer"),
     *                 example={"name": "Warehouse name", "description": "Warehouse description", "content": "Warehouse content", "context_id": 1, "status": true, "priority": 1}
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="string", example="Sample data")
     *         )
     *     )
     * )
     */
    public function update(UpdateWarehouseRequest $request, $id)
    {
        if ($error = $this->checkPermission(PermissonEnum::UPDATE_WAREHOUSE->value, 'У вас недостаточно прав для обновления складов')) {
            return $error;
        }
        return Warehouse::findOrFail($id)->update($request->validated());
    }

    /**
     * @OA\Delete(
     *     path="/api/warehouses/{id}",
     *     summary="Delete data",
     *     tags={"Warehouses"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="string", example="Sample data")
     *         )
     *     )
     * )
     */
    public function destroy($id)
    {
        if ($error = $this->checkPermission(PermissonEnum::DELETE_WAREHOUSE->value, 'У вас недостаточно прав для удаления складов')) {
            return $error;
        }
        return Warehouse::findOrFail($id)->delete();
    }

    /**
     * @OA\Post(
     *     path="/api/warehouses/stocks",
     *     summary="Получить остатки на складах для категории",
     *     tags={"Warehouses"},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(property="context_id", type="integer"),
     *                 @OA\Property(property="category_id", type="integer"),
     *                 @OA\Property(property="strategy", type="string", description="Стратегия получения остатков", enum={"base"}),
     *                 example={"context_id": 1, "category_id": 1, "strategy": "base"}
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="warehouse_name", type="string"),
     *                 @OA\Property(property="warehouse_id", type="integer"),
     *                 @OA\Property(property="quantity", type="integer"),
     *             )
     *         )
     *     )
     * )
     */
    public function getWarehouseForCategory(GetWarehouseStockRequest $request)
    {
        $dto = QueryWarehouseStrockDto::fromRequest($request);
        $warehouseService = new WarehouseService();
        $cacheKey = 'warehouse_for_category_' . $dto->categoryId . '_' . $dto->contextId . '_' . $dto->strategy;
        $warehouseStocks = Cache::remember($cacheKey, 60, function () use ($dto, $warehouseService) {
            return $warehouseService->getWarehouseForCategory($dto);
        });

        // Конвертируем массив DTO в массив для JSON ответа
        $response = array_map(fn($item) => $item->toArray(), $warehouseStocks);

        return response()->json($response);
    }
}
