<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use App\Http\Requests\Permission\CreatePermissionRequest;
use App\Http\Requests\Permission\UpdatePermissionRequest;

/**
 * @OA\Tag(
 *     name="Permissions",
 *     description="Permissions API"
 * )
 */
class PermissionController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/permissions",
     *     summary="Get all permissions",
     *     tags={"Permissions"},
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="create users"),
     *                 @OA\Property(property="guard_name", type="string", example="web"),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time")
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        return Permission::all();
    }

    /**
     * @OA\Get(
     *     path="/api/permissions/{id}",
     *     summary="Get permission by ID",
     *     tags={"Permissions"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="create users"),
     *             @OA\Property(property="guard_name", type="string", example="web"),
     *             @OA\Property(property="created_at", type="string", format="date-time"),
     *             @OA\Property(property="updated_at", type="string", format="date-time")
     *         )
     *     )
     * )
     */
    public function show($id)
    {
        return Permission::findOrFail($id);
    }

    /**
     * @OA\Post(
     *     path="/api/permissions",
     *     summary="Create permission",
     *     tags={"Permissions"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"name"},
     *             @OA\Property(property="name", type="string", example="edit posts"),
     *             @OA\Property(property="guard_name", type="string", example="web")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="edit posts"),
     *             @OA\Property(property="guard_name", type="string", example="web"),
     *             @OA\Property(property="created_at", type="string", format="date-time"),
     *             @OA\Property(property="updated_at", type="string", format="date-time")
     *         )
     *     )
     * )
     */
    public function store(CreatePermissionRequest $request)
    {
        return Permission::create($request->validated());
    }

    /**
     * @OA\Put(
     *     path="/api/permissions/{id}",
     *     summary="Update permission",
     *     tags={"Permissions"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"name"},
     *             @OA\Property(property="name", type="string", example="edit posts"),
     *             @OA\Property(property="guard_name", type="string", example="web")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Разрешение обновлено успешно"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="edit posts"),
     *                 @OA\Property(property="guard_name", type="string", example="web"),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time")
     *             )
     *         )
     *     )
     * )
     */
    public function update($id, UpdatePermissionRequest $request)
    {
        $permission = Permission::findOrFail($id);
        $permission->update($request->validated());
        return response()->json(['message' => 'Разрешение обновлено успешно', 'data' => $permission]);
    }

    /**
     * @OA\Delete(
     *     path="/api/permissions/{id}",
     *     summary="Delete permission",
     *     tags={"Permissions"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="boolean",
     *             example=true
     *         )
     *     )
     * )
     */
    public function destroy($id)
    {
        return Permission::findById($id)->delete();

    }
}
