<?php

use App\Http\Controllers\EstudianteController;
use App\Http\Controllers\NotaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


//Route::get('/notas/estudiante/{codEstudiante}', [NotaController::class, 'notasPorEstudiante']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::prefix("appNota")->group(function(){
    Route::controller(NotaController::class)->group(function(){
        Route::get("notas", "index");
        Route::get("nota/{codEstudiante}", "show");
        Route::post("nota", "store");
        Route::put("nota/{codEstudiante}", "update");
        Route::delete("nota/{codEstudiante}", "destroy");
        Route::get('notas/estudiante/{codEstudiante}', [NotaController::class, 'notasPorEstudiante']);
    });
 
});
Route::prefix("appEstudiante")->group(function(){
    Route::controller(EstudianteController::class)->group(function(){
        Route::get("estudiantes", "index");
        Route::get("estudiante/{cod}", "show");
        Route::post("estudiante", "store");
        Route::put("estudiante/{cod}", "update");
        Route::delete("estudiante/{cod}", "destroy");
        Route::delete("estudiante/{cod}/con-notas", "destroyAll");
    });
 
});
