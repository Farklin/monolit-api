<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\Warehouse\Stock\CreateWarehouseStockRequest;
use App\Models\WarehouseStock;
use App\Http\Requests\Warehouse\Stock\UpdateWarehouseStockRequest;
/**
 * @OA\Tag(
 *     name="Warehouse Stocks",
 *     description="Warehouse Stocks API"
 * )
 */
class WarehouseStockController extends Controller
{
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
        return WarehouseStock::findOrFail($id)->delete();
    }
}
