<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ContextController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\WarehouseStockController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;

Route::post('/auth/register', [AuthController::class, 'createUser']);
Route::post('/auth/login', [AuthController::class, 'loginUser']);

Route::group(['middleware' => 'auth:sanctum'], function () {

    Route::get("/users", [UserController::class, 'index']);
    Route::get("/users/{id}", [UserController::class, 'show']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::post('/users/{id}/logout', [UserController::class, 'logoutUser']);

    Route::post("/users/roles/add", [UserController::class, 'addRoleToUser']);
    Route::delete("/users/roles/remove", [UserController::class, 'removeRoleFromUser']);

    Route::post("/users/permissions/add", [UserController::class, 'addPermissionToUser']);
    Route::delete("/users/permissions/remove", [UserController::class, 'removePermissionFromUser']);

    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);
    Route::get('/projects/{id}/contexts', [ProjectController::class, 'getContexts']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);

    Route::get('/contexts', [ContextController::class, 'index']);
    Route::get('/contexts/{id}', [ContextController::class, 'show']);
    Route::post('/contexts', [ContextController::class, 'store']);
    Route::put('/contexts/{id}', [ContextController::class, 'update']);
    Route::delete('/contexts/{id}', [ContextController::class, 'destroy']);


    Route::get('/warehouses', [WarehouseController::class, 'index']);
    Route::get('/warehouses/{id}', [WarehouseController::class, 'show']);
    Route::post('/warehouses', [WarehouseController::class, 'store']);
    Route::put('/warehouses/{id}', [WarehouseController::class, 'update']);
    Route::delete('/warehouses/{id}', [WarehouseController::class, 'destroy']);
    Route::post('/warehouses/stocks', [WarehouseController::class, 'getWarehouseForCategory']);

    Route::get('/warehouse-stocks', [WarehouseStockController::class, 'index']);
    Route::get('/warehouse-stocks/{id}', [WarehouseStockController::class, 'show']);
    Route::post('/warehouse-stocks', [WarehouseStockController::class, 'store']);
    Route::put('/warehouse-stocks/{id}', [WarehouseStockController::class, 'update']);
    Route::delete('/warehouse-stocks/{id}', [WarehouseStockController::class, 'destroy']);

    Route::get("/roles", [RoleController::class, 'index']);

    Route::get("/roles/{id}", [RoleController::class, 'show']);
    Route::post("/roles", [RoleController::class, 'store']);
    Route::delete("/roles/{id}", [RoleController::class, 'destroy']);
    Route::post("/roles/permissions/add", [RoleController::class, 'addPermissionToRole']);
    Route::delete("/roles/permissions/remove", [RoleController::class, 'removePermissionFromRole']);


    Route::get("/permissions", [PermissionController::class, 'index']);
    Route::put("/permissions/{id}", [PermissionController::class, 'update']);
    Route::delete("/permissions/{id}", [PermissionController::class, 'destroy']);
    Route::get("/permissions/{id}", [PermissionController::class, 'show']);
    Route::post("/permissions", [PermissionController::class, 'store']);


    // Системное уведомление (всем)
    Route::post('/notifications/send', [NotificationController::class, 'send']);
    // Персональное уведомление конкретному пользователю
    Route::post('/notifications/send-to-user/{userId}', [NotificationController::class, 'sendToUser']);
})->middleware('auth:sanctum');
