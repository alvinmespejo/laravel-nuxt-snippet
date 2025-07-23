<?php

use App\Http\Controllers\Api\v1\Auth\AuthController;
use App\Http\Controllers\Api\v1\Auth\RegisterController;
use App\Http\Controllers\Api\v1\SnippetController;
use App\Http\Controllers\Api\v1\StepController;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::group(['prefix' => 'auth', 'middleware' => 'api'], function () {
    Route::post('/signin', [AuthController::class, 'signin']);
    Route::post('/signup', [RegisterController::class, 'register']);

    Route::get('/me', [AuthController::class, 'me'])->middleware(['jwt']);
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware(['jwt']);
    Route::post('/signout', [AuthController::class, 'signout'])->middleware(['jwt']);
});

Route::group(['prefix' => 'snippets'], function () {
    Route::get('/me', [SnippetController::class, 'me']);

    Route::patch('/{snippet}/steps/{step}', [StepController::class, 'update']);
    Route::delete('/{snippet}/steps/{step}', [StepController::class, 'destroy']);
    Route::post('/{snippet}/steps', [StepController::class, 'store']);

    Route::delete('/{snippet}', [SnippetController::class, 'destroy'])->middleware(['jwt']);
    Route::patch('/{snippet}', [SnippetController::class, 'update'])->middleware(['jwt']);
    Route::get('/{snippet}', [SnippetController::class, 'show'])->middleware(['jwt']);
    Route::post('/', [SnippetController::class, 'store'])->middleware(['jwt']);
    Route::get('/', [SnippetController::class, 'index']);
});
