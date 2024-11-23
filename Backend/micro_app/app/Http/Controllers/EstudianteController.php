<?php

namespace App\Http\Controllers;

use App\Models\Estudiante;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;


class EstudianteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rows = Estudiante::all();
        $data = ["data" => $rows];
        return response()->json($data, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $dataBody = $request->all();
            $estudiante = new Estudiante();
            $estudiante->cod = $dataBody['cod'];
            $estudiante->nombres = $dataBody['nombres'];
            $estudiante->email = $dataBody['email'];
            $estudiante->save();
            $data = ["data" => $estudiante];
            return response()->json($data, 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'Ocurrio un error al crear el estudiante'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $cod)
    {
        $row = Estudiante::find($cod);
        if (empty($row)) {
            return response()->json(['msg' => "error"], 404);
        }
        $data = ["data" => $row];
        return response()->json($data, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $cod)
    {
        try {
            $dataBody = $request->all();
            $estudiante = Estudiante::find($cod);
            //$estudiante->cod = $dataBody['cod'];
            $estudiante->nombres = $dataBody['nombres'];
            $estudiante->email = $dataBody['email'];
            $estudiante->save();
            $data = ["data" => $estudiante];
            return response()->json($data, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Estudiante no encontrado'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Ocurrio un error al actualizar el estudiante'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $cod)
    {
        $row = Estudiante::find($cod);
        if (empty($row)) {
            return response()->json(['msg' => "error"], 404);
        }
        $row->delete();
        $data = ["data" => "estudiante eliminado"];
        return response()->json($data, 200);
    }

    public function destroyAll(string $cod)
    {
        $row = Estudiante::find($cod);
        if (empty($row)) {
            return response()->json(['msg' => "error"], 404);
        }
        $row->notas()->delete();
        $row->delete();
        $data = ["data" => "Estudiante y sus notas eliminado"];
        return response()->json($data, 200);
            }
}
