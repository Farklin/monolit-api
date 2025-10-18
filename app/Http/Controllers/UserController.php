<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\User\CreateUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Requests\User\AddRoleToUserRequest;
use App\Http\Requests\User\RemoveRoleFromUserRequest;
use App\Http\Requests\User\AddPermissionToUserRequest;
use App\Http\Requests\User\RemovePermissionFromUserRequest;
use App\Events\Users\RegisterUser;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
/**
 * @OA\Tag(
 *     name="Users",
 *     description="Users API"
 * )
 */
class UserController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/users",
     *     summary="Fetch all users with roles and permissions",
     *     tags={"Users"},
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="John Doe"),
     *                 @OA\Property(property="email", type="string", example="john@doe.com"),
     *                 @OA\Property(property="created_at", type="string", example="2021-01-01 00:00:00"),
     *                 @OA\Property(property="updated_at", type="string", example="2021-01-01 00:00:00"),
     *                 @OA\Property(
     *                     property="roles",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="name", type="string", example="admin"),
     *                         @OA\Property(property="guard_name", type="string", example="web")
     *                     )
     *                 ),
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
        return User::with(['roles', 'permissions'])->get();
    }

    /**
     * @OA\Get(
     *     path="/api/users/{id}",
     *     summary="Fetch user by id with roles and permissions",
     *     tags={"Users"},
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
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", example="john@doe.com"),
     *             @OA\Property(property="created_at", type="string", example="2021-01-01 00:00:00"),
     *             @OA\Property(property="updated_at", type="string", example="2021-01-01 00:00:00"),
     *             @OA\Property(
     *                 property="roles",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="admin"),
     *                     @OA\Property(property="guard_name", type="string", example="web")
     *                 )
     *             ),
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
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found"
     *     )
     * )
     */
    public function show($id)
    {
        return User::with(['roles', 'permissions'])->findOrFail($id);
    }


    /**
     * @OA\Post(
     *     path="/api/users",
     *     summary="Create data",
     *     tags={"Users"},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="email", type="string"),
     *                 @OA\Property(property="password", type="string"),
     *                 @OA\Property(property="password_confirmation", type="string"),
     *                 example={"name": "John Doe", "email": "john@doe.com", "password": "password", "password_confirmation": "password"}
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", example="john@doe.com"),
     *             @OA\Property(property="created_at", type="string", example="2021-01-01 00:00:00"),
     *             @OA\Property(property="updated_at", type="string", example="2021-01-01 00:00:00")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Validation error"
     *     )
     * )
     */
    public function store(CreateUserRequest $request)
    {
        $user = User::create($request->validated());
        event(new RegisterUser($user));
        return $user;
    }


    /**
     * @OA\Put(
     *     path="/api/users/{id}",
     *     summary="Update data",
     *     tags={"Users"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="email", type="string"),
     *                 @OA\Property(property="password", type="string"),
     *                 @OA\Property(property="password_confirmation", type="string"),
     *                 example={"name": "John Doe", "email": "john@doe.com", "password": "password", "password_confirmation": "password"}
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", example="john@doe.com"),
     *             @OA\Property(property="created_at", type="string", example="2021-01-01 00:00:00"),
     *             @OA\Property(property="updated_at", type="string", example="2021-01-01 00:00:00")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Validation error"
     *     )
     * )
     */
    public function update(UpdateUserRequest $request, $id)
    {
        return User::findOrFail($id)->update($request->validated());
    }

    /**
     * @OA\Delete(
     *     path="/api/users/{id}",
     *     summary="Delete data",
     *     tags={"Users"},
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
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", example="john@doe.com"),
     *             @OA\Property(property="created_at", type="string", example="2021-01-01 00:00:00"),
     *             @OA\Property(property="updated_at", type="string", example="2021-01-01 00:00:00")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found"
     *     )
     * )
     */
    public function destroy($id)
    {
        return User::find($id)->delete();
    }

    /**
     * @OA\Post(
     *     path="/api/users/roles/add",
     *     summary="Add role to user",
     *     tags={"Users"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"user_id", "role_id"},
     *             @OA\Property(property="user_id", type="integer", example=1),
     *             @OA\Property(property="role_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Роль успешно назначена пользователю"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="user_id", type="integer", example=1),
     *                 @OA\Property(property="role_id", type="integer", example=1)
     *             )
     *         )
     *     )
     * )
     */
    public function addRoleToUser(AddRoleToUserRequest $request)
    {
        $data = $request->validated();
        $user = User::findOrFail($data['user_id']);
        $role = Role::findOrFail(id: $data['role_id']);
        $user->assignRole($role);
        return response()->json(data: ['message' => 'Роль успешно назначена пользователю', 'data' => $data]);
    }

    /**
     * @OA\Delete(
     *     path="/api/users/roles/remove",
     *     summary="Remove role from user",
     *     tags={"Users"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"user_id", "role_id"},
     *             @OA\Property(property="user_id", type="integer", example=1),
     *             @OA\Property(property="role_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Роль успешно удалена у пользователя"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="user_id", type="integer", example=1),
     *                 @OA\Property(property="role_id", type="integer", example=1)
     *             )
     *         )
     *     )
     * )
     */
    public function removeRoleFromUser(RemoveRoleFromUserRequest $request)
    {
        $data = $request->validated();
        $user = User::findOrFail($data['user_id']);
        $role = Role::findOrFail($data['role_id']);
        $user->removeRole($role);
        return response()->json(['message' => 'Роль успешно удалена у пользователя', 'data' => $data]);
    }

    /**
     * @OA\Post(
     *     path="/api/users/permissions/add",
     *     summary="Add permission to user",
     *     tags={"Users"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"user_id", "permission_id"},
     *             @OA\Property(property="user_id", type="integer", example=1),
     *             @OA\Property(property="permission_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Разрешение успешно назначено пользователю"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="user_id", type="integer", example=1),
     *                 @OA\Property(property="permission_id", type="integer", example=1)
     *             )
     *         )
     *     )
     * )
     */
    public function addPermissionToUser(AddPermissionToUserRequest $request)
    {
        $data = $request->validated();
        $user = User::findOrFail($data['user_id']);
        $permission = Permission::findOrFail($data['permission_id']);
        $user->givePermissionTo($permission);
        return response()->json(['message' => 'Разрешение успешно назначено пользователю', 'data' => $data]);
    }

    /**
     * @OA\Delete(
     *     path="/api/users/permissions/remove",
     *     summary="Remove permission from user",
     *     tags={"Users"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"user_id", "permission_id"},
     *             @OA\Property(property="user_id", type="integer", example=1),
     *             @OA\Property(property="permission_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Разрешение успешно удалено у пользователя"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="user_id", type="integer", example=1),
     *                 @OA\Property(property="permission_id", type="integer", example=1)
     *             )
     *         )
     *     )
     * )
     */
    public function removePermissionFromUser(RemovePermissionFromUserRequest $request)
    {
        $data = $request->validated();
        $user = User::findOrFail($data['user_id']);
        $permission = Permission::findOrFail($data['permission_id']);
        $user->revokePermissionTo($permission);
        return response()->json(['message' => 'Разрешение успешно удалено у пользователя', 'data' => $data]);
    }

    /**
     * @OA\Post(
     *     path="/api/users/{id}/logout",
     *     summary="Logout user (revoke all tokens)",
     *     tags={"Users"},
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
     *             @OA\Property(property="message", type="string", example="Пользователь успешно разлогинен"),
     *             @OA\Property(property="tokens_deleted", type="integer", example=3)
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found"
     *     )
     * )
     */
    public function logoutUser($id)
    {
        $user = User::findOrFail($id);
        
        // Удаляем все токены пользователя
        $tokensDeleted = $user->tokens()->delete();
        
        return response()->json([
            'message' => 'Пользователь успешно разлогинен',
            'tokens_deleted' => $tokensDeleted
        ]);
    }
}
