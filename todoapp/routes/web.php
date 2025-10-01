<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;

Route::get('/', function () {
    return view('app');
});

Route::prefix('api')->group(function () {
    Route::apiResource('tasks', TaskController::class);
});
