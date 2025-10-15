<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Warehouse;
use App\Http\Requests\Warehouse\CreateWarehouseRequest;
use App\Http\Requests\Warehouse\UpdateWarehouseRequest;
use App\Models\WarehouseStock;
use Illuminate\Support\Facades\Cache;
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
    public function index()
    {
        return Warehouse::all();
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
        return Warehouse::findOrFail($id)->delete();
    }

    /**
     * @OA\Get(
     *     path="/api/warehouses/context/{contextId}/category/{categoryId}",
     *     summary="Get warehouse for category",
     *     tags={"Warehouses"},
     *     @OA\Parameter(
     *         name="categoryId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="contextId",
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
    public function getWarehouseForCategory($contextId, $categoryId)
    {
        //генерация случайны остатков складов
        $warehouseStock = WarehouseStock::where('category_id', $categoryId)->whereHas('warehouse', function ($query) use ($contextId) {
            $query->where('context_id', $contextId);
        })->get();

        $warehouseStock = $warehouseStock->map(function ($item) {
            $quantity = rand($item->min_quantity, $item->max_quantity);
            return [
                "warehouse_name" => $item->warehouse->name,
                "warehouse_id" => $item->warehouse->id,
                "quantity" => $quantity,
            ];
        });
        return $warehouseStock;

    }
}
