<?php

namespace App\Http\Controllers;

use App\Models\Nota;
use Illuminate\Http\Request;


class NotaController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rows = Nota::all();
        $data = ["data" => $rows];
        return response()->json($data, 200);
    }


    public function notasPorEstudiante(string $codEstudiante)
    {
        $notas = Nota::where('codEstudiante', $codEstudiante)->get();
        return response()->json(['data' => $notas], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $dataBody = $request->all();
        $nota = new Nota();
        $nota->actividad = $dataBody['actividad'];
        $nota->nota = $dataBody['nota'];
        $nota->codEstudiante = $dataBody['codEstudiante'];
        $nota->save();
        $data = ["data" => $nota];
        return response()->json($data, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $row = Nota::find($id);
        if (empty($row)) {
            return response()->json(['msg' => "error"], 404);
        }
        $data = ["data" => $row];
        return response()->json($data, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $dataBody = $request->all();
        $nota = Nota::find($id);
        if (empty($nota)) {
            return response()->json(['msg' => "error"], 404);
        }
        if (isset($dataBody['actividad'])) {
            $nota->actividad = $dataBody['actividad'];
        }
        if (isset($dataBody['nota'])) {
            $nota->nota = $dataBody['nota'];
        }
        $nota->save();
        $data = ["data" => $nota];
        return response()->json($data, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $row = Nota::find($id);
        if (empty($row)) {
            return response()->json(['msg' => "error"], 404);
        }
        $row->delete();
        $data = ["data" => "nota del estudiante eliminado"];
        return response()->json($data, 200);
    }
    
}
