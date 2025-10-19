<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use App\Http\Requests\Role\CreateRoleRequest;
use Spatie\Permission\Models\Permission;
use App\Http\Requests\Role\AddPermissionToRoleRequest;
use App\Http\Requests\Role\RemovePermissionToRoleRequest;
use App\Enum\PermissonEnum;
/**
 * @OA\Tag(
 *     name="Roles",
 *     description="Roles API"
 * )
 */
class RoleController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/roles",
     *     summary="Get all roles with permissions",
     *     tags={"Roles"},
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="admin"),
     *                 @OA\Property(property="guard_name", type="string", example="web"),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time"),
     *                 @OA\Property(
     *                     property="permissions",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="name", type="string", example="create users"),
     *                         @OA\Property(property="guard_name", type="string", example="web")
     *                     )
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        if ($error = $this->checkPermission(PermissonEnum::READ_ROLE->value, 'У вас недостаточно прав для просмотра ролей')) {
            return $error;
        }
        return Role::with('permissions')->get();
    }

    /**
     * @OA\Get(
     *     path="/api/roles/{id}",
     *     summary="Get role by ID with permissions",
     *     tags={"Roles"},
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
     *             @OA\Property(property="name", type="string", example="admin"),
     *             @OA\Property(property="guard_name", type="string", example="web"),
     *             @OA\Property(property="created_at", type="string", format="date-time"),
     *             @OA\Property(property="updated_at", type="string", format="date-time"),
     *             @OA\Property(
     *                 property="permissions",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="create users"),
     *                     @OA\Property(property="guard_name", type="string", example="web")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function show($id)
    {
        if ($error = $this->checkPermission(PermissonEnum::READ_ROLE->value, 'У вас недостаточно прав для просмотра ролей')) {
            return $error;
        }
        return Role::with('permissions')->findOrFail($id);
    }


    /**
     * @OA\Post(
     *     path="/api/roles",
     *     summary="Create role",
     *     tags={"Roles"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"name"},
     *             @OA\Property(property="name", type="string", example="manager"),
     *             @OA\Property(property="guard_name", type="string", example="web")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="manager"),
     *             @OA\Property(property="guard_name", type="string", example="web"),
     *             @OA\Property(property="created_at", type="string", format="date-time"),
     *             @OA\Property(property="updated_at", type="string", format="date-time")
     *         )
     *     )
     * )
     */
    public function store(CreateRoleRequest $request)
    {
        if ($error = $this->checkPermission(PermissonEnum::CREATE_ROLE->value, 'У вас недостаточно прав для создания ролей')) {
            return $error;
        }
        return Role::create($request->validated());
    }

    /**
     * @OA\Delete(
     *     path="/api/roles/{id}",
     *     summary="Delete role",
     *     tags={"Roles"},
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
        $role = Role::findOrFail($id);
        $role->delete();
        return response()->json(['message' => 'Роль удалена успешно', 'data' => $role]);
    }

    /**
     * @OA\Post(
     *     path="/api/roles/permissions",
     *     summary="Add permission to role",
     *     tags={"Roles"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"role_id", "permission_id"},
     *             @OA\Property(property="role_id", type="integer", example=1),
     *             @OA\Property(property="permission_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Разрешение добавлено в роль успешно"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="role_id", type="integer", example=1),
     *                 @OA\Property(property="permission_id", type="integer", example=1)
     *             )
     *         )
     *     )
     * )
     */
    public function addPermissionToRole(AddPermissionToRoleRequest $request)
    {
        if ($error = $this->checkPermission(PermissonEnum::HANDLE_USERS_PERMISSIONS->value, 'У вас недостаточно прав для добавления разрешения в роль')) {
            return $error;
        }
        $data = $request->validated();
        $role = Role::findOrFail($data['role_id']);
        $permission = Permission::findOrFail($data['permission_id']);
        $role->givePermissionTo($permission);
        return response()->json(['message' => 'Разрешение добавлено в роль успешно', 'data' => $data]);
    }

    /**
     * @OA\Delete(
     *     path="/api/roles/permissions",
     *     summary="Remove permission from role",
     *     tags={"Roles"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"role_id", "permission_id"},
     *             @OA\Property(property="role_id", type="integer", example=1),
     *             @OA\Property(property="permission_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Разрешение удалено из роли успешно"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="role_id", type="integer", example=1),
     *                 @OA\Property(property="permission_id", type="integer", example=1)
     *             )
     *         )
     *     )
     * )
     */
    public function removePermissionFromRole(RemovePermissionToRoleRequest $request)
    {
        $data = $request->validated();
        $role = Role::findOrFail($data['role_id']);
        $permission = Permission::findOrFail($data['permission_id']);
        $role->revokePermissionTo($permission);
        return response()->json(['message' => 'Разрешение удалено из роли успешно', 'data' => $data]);
    }
}
