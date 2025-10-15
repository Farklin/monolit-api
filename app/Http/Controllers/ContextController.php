<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Context;
use App\Http\Requests\Context\CreateContextRequest;
use App\Http\Requests\Context\UpdateContextRequest;

/**
 * @OA\Tag(
 *     name="Contexts",
 *     description="Contexts API"
 * )
 */
class ContextController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/contexts",
     *     summary="Fetch data",
     *     tags={"Contexts"},
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
        return Context::all();
    }

    /**
     * @OA\Get(
     *     path="/api/contexts/{id}",
     *     summary="Fetch data by id",
     *     tags={"Contexts"},
     *     @OA\Parameter(
     *             name="id",
     *             in="path",
     *             required=true,
     *             @OA\Schema(type="string")
     *         ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="string", example="Sample data")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Context not found"
     *     )
     * )
     */
    public function show($id)
    {
        return Context::findOrFail($id);
    }

    /**
     * @OA\Post(
     *     path="/api/contexts",
     *     summary="Create context",
     *     tags={"Contexts"},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(property="project_id", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="key", type="string"),
     *                 @OA\Property(property="description", type="string"),
     *                 example={"project_id": 1, "name": "Context name", "key": "context-key", "description": "Context description"}
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
    public function store(CreateContextRequest $request)
    {
        return Context::create($request->validated());
    }

    /**
     * @OA\Put(
     *     path="/api/contexts/{id}",
     *     summary="Update context",
     *     tags={"Contexts"},
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
     *                 @OA\Property(property="project_id", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="key", type="string"),
     *                 @OA\Property(property="description", type="string"),
     *                 example={"project_id": 1, "name": "Updated name", "key": "updated-key", "description": "Updated description"}
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
     *         response=404,
     *         description="Context not found"
     *     )
     * )
     */
    public function update(UpdateContextRequest $request, $id)
    {
        return Context::findOrFail($id)->update($request->validated());
    }

    /**
     * @OA\Delete(
     *     path="/api/contexts/{id}",
     *     summary="Delete context",
     *     tags={"Contexts"},
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
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Context not found"
     *     )
     * )
     */
    public function destroy($id)
    {
        return Context::findOrFail($id)->delete();
    }
}
