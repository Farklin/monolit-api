<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ContextController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\WarehouseStockController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{id}', [ProjectController::class, 'show']);
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
Route::get('/warehouses/context/{contextId}/category/{categoryId}', [WarehouseController::class, 'getWarehouseForCategory']);

Route::post('/warehouse-stocks', [WarehouseStockController::class, 'store']);
Route::put('/warehouse-stocks/{id}', [WarehouseStockController::class, 'update']);
Route::delete('/warehouse-stocks/{id}', [WarehouseStockController::class, 'destroy']);
