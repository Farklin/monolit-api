<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\User\CreateUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Events\Users\RegisterUser;
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
     *     summary="Fetch data",
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
     *                 @OA\Property(property="updated_at", type="string", example="2021-01-01 00:00:00")
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        return User::all();
    }

    /**
     * @OA\Get(
     *     path="/api/users/{id}",
     *     summary="Fetch data by id",
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
    public function show($id)
    {
        return User::find($id);
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
}
