<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Http\Requests\Project\CreateProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;

/**
 * @OA\Tag(
 *     name="Projects",
 *     description="Projects API"
 * )
 */
class ProjectController extends Controller
{


    /**
     * @OA\Get(
     *     path="/api/projects",
     *     summary="Fetch data",
     *     tags={"Projects"},
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
        return Project::all();
    }


    /**
     * @OA\Get(
     *     path="/api/projects/{id}",
     *     summary="Fetch data by id",
     *     tags={"Projects"},
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
     *         description="Project not found"
     *     )
     * )
     */
    public function show($id)
    {
        return Project::findOrFail($id);
    }


    /**
     * @OA\Post(
     *     path="/api/projects",
     *     summary="Create data",
     *     tags={"Projects"},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(
     *                     property="name",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="description",
     *                     oneOf={
     *                     	   @OA\Schema(type="string"),
     *                     	   @OA\Schema(type="integer"),
     *                     }
     *                 ),
     *                 @OA\Property(
     *                     property="status",
     *                     type="boolean"
     *                 ),
     *                 @OA\Property(
     *                     property="priority",
     *                     type="integer"
     *                 ),
     *                 example={"name": "ТСК СПБ", "key": "tsk-spb", "description": "ТСК СПБ", "status": true, "priority": 1}
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
    public function store(CreateProjectRequest $request)
    {
        return Project::create($request->validated());
    }


    /**
     * @OA\Put(
     *     path="/api/projects/{id}",
     *     summary="Update data",
     *     tags={"Projects"},
     *     @OA\Parameter(
     *             name="id",
     *             in="path",
     *             required=true,
     *             @OA\Schema(type="string")
     *         ),
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(
     *                     property="name",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="description",
     *                     oneOf={
     *                     	   @OA\Schema(type="string"),
     *                     	   @OA\Schema(type="integer"),
     *                     }
     *                 ),
     *                 @OA\Property(
     *                     property="status",
     *                     type="boolean"
     *                 ),
     *                 @OA\Property(
     *                     property="priority",
     *                     type="integer"
     *                 ),
     *                 example={"name": "ТСК СПБ", "key": "tsk-spb1", "description": "ТСК СПБ", "status": true, "priority": 1}
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
     *         description="Project not found"
     *     )
     * )
     */
    public function update(UpdateProjectRequest $request, $id)
    {
        return Project::findOrFail($id)->update($request->validated());
    }

    /**
     * @OA\Delete(
     *     path="/api/projects/{id}",
     *     summary="Delete data",
     *     tags={"Projects"},
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
     *     )
     * )
     */
    public function destroy($id)
    {
        return Project::findOrFail($id)->delete();
    }
}
