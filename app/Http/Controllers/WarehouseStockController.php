<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\Warehouse\Stock\CreateWarehouseStockRequest;
use App\Models\WarehouseStock;
use App\Http\Requests\Warehouse\Stock\UpdateWarehouseStockRequest;
use App\Models\Context;
use App\Enum\PermissonEnum;
/**
 * @OA\Tag(
 *     name="Warehouse Stocks",
 *     description="Warehouse Stocks API"
 * )
 */
class WarehouseStockController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/warehouse-stocks",
     *     summary="Get warehouse stocks",
     *     tags={"Warehouse Stocks"},
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
        if ($error = $this->checkPermission(PermissonEnum::READ_WAREHOUSE_STOCK->value, 'У вас недостаточно прав для просмотра складских остатков')) {
            return $error;
        }
        $query = WarehouseStock::query();

        // Фильтр по контексту (через warehouse)
        $contextId = $request->header('X-Context-Id') ?: $request->input('current_context_id');
        if ($contextId) {
            $query->whereHas('warehouse', function ($q) use ($contextId) {
                $q->where('context_id', $contextId);
            });
        }
        // Фильтр по проекту (через warehouse и context)
        elseif ($projectId = $request->header('X-Project-Id') ?: $request->input('current_project_id')) {
            $contextIds = Context::where('project_id', $projectId)->pluck('id');
            $query->whereHas('warehouse', function ($q) use ($contextIds) {
                $q->whereIn('context_id', $contextIds);
            });
        }

        return $query->get();
    }

    /**
     * @OA\Get(
     *     path="/api/warehouse-stocks/{id}",
     *     summary="Get warehouse stock by id",
     *     tags={"Warehouse Stocks"},
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
        if ($error = $this->checkPermission(PermissonEnum::READ_WAREHOUSE_STOCK->value, 'У вас недостаточно прав для просмотра складских остатков')) {
            return $error;
        }
        return WarehouseStock::findOrFail($id);
    }

    /**
     * @OA\Post(
     *     path="/api/warehouse-stocks",
     *     summary="Create warehouse stock",
     *     tags={"Warehouse Stocks"},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(property="warehouse_id", type="integer"),
     *                 @OA\Property(property="category_id", type="integer"),
     *                 @OA\Property(property="max_quantity", type="integer"),
     *                 @OA\Property(property="min_quantity", type="integer"),
     *                 example={"warehouse_id": 1, "category_id": 1, "max_quantity": 100, "min_quantity": 0}
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
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Warehouse stock already exists"
     *     )
     * )
     */
    public function store(CreateWarehouseStockRequest $request){
        if ($error = $this->checkPermission(PermissonEnum::CREATE_WAREHOUSE_STOCK->value, 'У вас недостаточно прав для создания складских остатков')) {
            return $error;
        }
        $data = $request->validated();
        $exists = WarehouseStock::where('warehouse_id', $data['warehouse_id'])->where('category_id', $data['category_id'])->exists();
        if($exists){
            return response()->json(['error' => 'Warehouse stock already exists'], 400);
        }
        return WarehouseStock::create($data);
    }

    /**
     * @OA\Put(
     *     path="/api/warehouse-stocks/{id}",
     *     summary="Update warehouse stock",
     *     tags={"Warehouse Stocks"},
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
     *                 @OA\Property(property="warehouse_id", type="integer"),
     *                 @OA\Property(property="category_id", type="integer"),
     *                 @OA\Property(property="max_quantity", type="integer"),
     *                 @OA\Property(property="min_quantity", type="integer"),
     *                 example={"warehouse_id": 1, "category_id": 1, "max_quantity": 100, "min_quantity": 0}
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
    public function update(UpdateWarehouseStockRequest $request, $id){
        if ($error = $this->checkPermission(PermissonEnum::UPDATE_WAREHOUSE_STOCK->value, 'У вас недостаточно прав для обновления складских остатков')) {
            return $error;
        }
        return WarehouseStock::findOrFail($id)->update($request->validated());
    }

    /**
     * @OA\Delete(
     *     path="/api/warehouse-stocks/{id}",
     *     summary="Delete warehouse stock",
     *     tags={"Warehouse Stocks"},
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
    public function destroy($id){
        if ($error = $this->checkPermission(PermissonEnum::DELETE_WAREHOUSE_STOCK->value, 'У вас недостаточно прав для удаления складских остатков')) {
            return $error;
        }
        return WarehouseStock::findOrFail($id)->delete();
    }
}
