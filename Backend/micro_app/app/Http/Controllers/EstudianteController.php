<?php

namespace App\Http\Controllers;

use App\Models\Estudiante;
use Illuminate\Http\Request;


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
        $dataBody = $request->all();
        $nota = new Estudiante();
        $nota->cod = $dataBody['cod'];
        $nota->nombres = $dataBody['nombres'];
        $nota->email = $dataBody['email'];
        $nota->save();
        $data = ["data" => $nota];
        return response()->json($data, 201);
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
        $dataBody = $request->all();
        $nota = Estudiante::find($cod);
        if (empty($nota)) {
            return response()->json(['msg' => "error"], 404);
        }
        $nota->nombres = $dataBody['nombres'];
        $nota->email = $dataBody['email'];
        $nota->save();
        $data = ["data" => $nota];
        return response()->json($data, 200);
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
