const NOTA_ENDPOINT = "http://127.0.0.1:8000/api/appNota";
const params = new URLSearchParams(window.location.search);
const codigo = params.get("codigo");
const nombre = params.get("nombre");
const email = params.get("email");

const btnNuevaNota = document.getElementById("nueva-nota");
const btnAviso = document.getElementById("aviso-close");
const aviseBG = document.getElementById("avisoBG");

const notasIdInput = document.getElementById("notaIdinp");
const codInput = document.getElementById("codInp");
const actividadInput = document.getElementById("actInp");
const notaInput = document.getElementById("calInp");

// ------ funciones para la tabla -------

const aviseAction = (showAvise, idNota, actividad, calificacion) => {
    if (showAvise) {
        if (idNota) {
            notasIdInput.value = idNota;
            actividadInput.value = actividad;
            notaInput.value = calificacion;
        } else {
            notasIdInput.value = '';
            actividadInput.value = '';
            notaInput.value = '';
        }
        codInput.value = codigo;
        aviseBG.style.display = 'block';
    } else {
        aviseBG.style.display = 'none';
    }
}

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

const getEstado = (notaDef) => {
    if (notaDef >= 3 && notaDef <= 5) {
      return "Aprobado";
    } else if (notaDef >= 0 && notaDef < 3) {
      return "No aprobado";
    } else {
      return "Sin notas";
    };
  };

const mostrarInfo = (infoEstudiante, resultado) => {
    const nombreDiv = document.createElement("p");
    nombreDiv.innerHTML = `<b>Nombre del estudiante:</b> ${nombre}`;

    const codigoDiv = document.createElement("p");
    codigoDiv.innerHTML = `<b>Código:</b> ${codigo}`;

    const emailDiv = document.createElement("p");
    emailDiv.innerHTML = `<b>Correo electronico:</b> ${email}`;

    const defDiv = document.createElement("p");
    defDiv.innerHTML = `<b>Nota definitiva:</b> ${resultado}`;

    const estadoDiv = document.createElement("p");
    estadoDiv.innerHTML = `<b>Estado:</b> ${getEstado(resultado)}`;

    infoEstudiante.appendChild(nombreDiv);
    infoEstudiante.appendChild(codigoDiv);
    infoEstudiante.appendChild(emailDiv);
    infoEstudiante.appendChild(defDiv);
    infoEstudiante.appendChild(estadoDiv);
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

    let acumulado = 0;
    let divisor = 0;

    notas.forEach((nota) => {
      const tr = document.createElement("tr");

      const actividadTd = document.createElement("td");
      actividadTd.textContent = nota.actividad;

      const notaTd = document.createElement("td");
      notaTd.textContent = nota.nota;
      colorNota(notaTd, nota.nota);

      acumulado += parseFloat(nota.nota);
      divisor += 1;

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
        aviseAction(true, nota.id, nota.actividad, nota.nota);
      });

      accionesTd.appendChild(btnEliminar);
      accionesTd.appendChild(btnModificar);

      tr.appendChild(actividadTd);
      tr.appendChild(notaTd);
      tr.appendChild(accionesTd);
      tablaNotas.appendChild(tr);
    });

    const resultado = acumulado / divisor;
    mostrarInfo(infoEstudiante, resultado);
  } catch (error) {
    console.error("Error al cargar las notas:", error);
  }
};

// ------ Botones -------

btnNuevaNota.addEventListener("click", () => {
    aviseAction(true, null);
  }
);

btnAviso.addEventListener("click", () => {
    aviseAction(false);
  }
);

cargarNotas();