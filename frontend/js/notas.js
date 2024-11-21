const ESTUDIANTE_ENDPOINT = "http://127.0.0.1:8000/api/appEstudiante";
const NOTA_ENDPOINT = "http://127.0.0.1:8000/api/appNota";
const params = new URLSearchParams(window.location.search);
const codigo = params.get("codigo");

// ------ funciones para la tabla -------

const colorNota = async (td, nota) => {
    if (nota >= 0 && nota <= 2) {
        td.className = "nota-color1";
    } else if (nota > 2 && nota < 3) {
        td.className = "nota-color2";
    } else if (nota >= 3 && nota < 4) {
        td.className = "nota-color3";
    } else {
        td.className = "nota-color4";
    }
}

// ------ función de la tabla de notas -------
const cargarNotas = async () => {
  try {
    const infoEstudiante = document.getElementById("info-estudiante");
    const tablaNotas = document.getElementById("tabla-notas").getElementsByTagName("tbody")[0];
    tablaNotas.innerHTML = "";

    const response = await fetch(NOTA_ENDPOINT + `/notas/estudiante/${codigo}`);
    const body = await response.json();
    const notas = body.data;
    infoEstudiante.textContent = `Notas del estudiante con código: ${codigo}`;

    notas.forEach((nota) => {
      const tr = document.createElement("tr");

      const actividadTd = document.createElement("td");
      actividadTd.textContent = nota.actividad;

      const notaTd = document.createElement("td");
      notaTd.textContent = nota.nota;
      colorNota(notaTd, nota.nota);

      const accionesTd = document.createElement("td");

      const btnEliminar = document.createElement("button");
      btnEliminar.innerHTML = '<i class="fas fa-trash"></i>';
      btnEliminar.className = "btn btn-eliminar";
      btnEliminar.addEventListener("click", () => {
        console.log(`Eliminar nota ${nota.id}`);  //Prueba de acción, falta la función
      });

      const btnModificar = document.createElement("button");
      btnModificar.innerHTML = '<i class="fas fa-edit"></i>';
      btnModificar.className = "btn btn-modificar";
      btnModificar.addEventListener("click", () => {
        console.log(`Modificar nota ${nota.id}`);  //tambien falta la función
      });

      accionesTd.appendChild(btnEliminar);
      accionesTd.appendChild(btnModificar);

      tr.appendChild(actividadTd);
      tr.appendChild(notaTd);
      tr.appendChild(accionesTd);
      tablaNotas.appendChild(tr);
    });
  } catch (error) {
    console.error("Error al cargar las notas:", error);
  }
};

cargarNotas();