<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Estudiante extends Model
{
    use HasFactory;
    protected $table = 'estudiantes';
    protected $primaryKey = 'cod';
    public $timestamps = false;
    
    public function notas()
    {
        return $this->hasMany(Nota::class, 'codEstudiante', 'cod');
    }
}
