const ESTUDIANTE_ENDPOINT = "http://127.0.0.1:8000/api/appEstudiante";
const NOTA_ENDPOINT = "http://127.0.0.1:8000/api/appNota";
const table = document.getElementById("estudiantes");
const est = document.getElementById("estadisticas");

let aprobados = 0;
let noAprobados = 0;
let sinNotas = 0;

// ------ funciones para la tabla -----------

const getNotaDef = async (cod) => {
  let acumulado = 0;
  let divisor = 0;

  try {
    const response = await fetch(NOTA_ENDPOINT + "/notas/estudiante/" + cod);
    const body = await response.json();
    const notas = body.data;

    notas.forEach((nota) => {
      acumulado += parseFloat(nota.nota);
      divisor += 1;
    });
    if (divisor > 0) {
      const resultado = acumulado / divisor;
      return resultado.toString();
    } else {
      return "Sin notas";
    };
  } catch (error) {
    console.error("Error al obtener las notas:", error);
    return "0";
  }
};

const getEstado = (notaDef) => {
  if (notaDef >= 3 && notaDef <= 5) {
    aprobados += 1;
    return "Aprobado";
  } else if (notaDef >= 0 && notaDef < 3) {
    noAprobados += 1;
    return "No aprobado";
  } else {
    sinNotas += 1;
    return "Indefinido";
  };
};

const mostrarEst = () => {
  est.innerHTML = ""; 
  const apP = document.createElement("p");
  const nApP = document.createElement("p");
  const sinNP= document.createElement("p");

  apP.id = "aprobados";
  nApP.id = "noAprobados";
  sinNP.id = "sinNotas";

  apP.className = "estEstilo";
  nApP.className = "estEstilo";
  sinNP.className = "estEstilo";

  apP.textContent = "Aprobados: " + aprobados.toString();
  nApP.textContent = "No aprobados: " + noAprobados.toString();
  sinNP.textContent = "Sin notas registradas: " + sinNotas.toString();

  est.appendChild(apP);
  est.appendChild(nApP);
  est.appendChild(sinNP);
};

// ------ Tabla de los estudiantes ---------

const leerEstudiantes = async () => {
  try {
    const response = await fetch(ESTUDIANTE_ENDPOINT + "/estudiantes");
    const body = await response.json();
    const estudiantes = body.data;
    const tbody = table.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    est.innerHTML = "Cargando listado de estudiantes...";

    for (const estudiante of estudiantes) {
      const tr = document.createElement("tr");

      const codTd = document.createElement("td");
      codTd.textContent = estudiante.cod;
      const nombreTd = document.createElement("td");
      nombreTd.textContent = estudiante.nombres;
      const emailTd = document.createElement("td");
      emailTd.textContent = estudiante.email;

      const defTd = document.createElement("td");
      defTd.textContent = await getNotaDef(estudiante.cod);

      const estadoTd = document.createElement("td");
      estadoTd.textContent = getEstado(parseFloat(defTd.textContent));

      tr.appendChild(codTd);
      tr.appendChild(nombreTd);
      tr.appendChild(emailTd);
      tr.appendChild(defTd);
      tr.appendChild(estadoTd);
      tbody.appendChild(tr);
    }
    mostrarEst();
  } catch (error) {
    console.error("Error al leer los estudiantes:", error);
  }
};

leerEstudiantes();