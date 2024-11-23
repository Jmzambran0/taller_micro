const ESTUDIANTE_ENDPOINT = "http://127.0.0.1:8000/api/appEstudiante";
const NOTA_ENDPOINT = "http://127.0.0.1:8000/api/appNota";
const table = document.getElementById("estudiantes");
const est = document.getElementById("estadisticas");
const estTitulo = document.getElementById("estTitulo");

const aviseBG = document.getElementById("avisoBG");
const newEstForm = document.forms["newEstForm"];
const newEstMsg = document.getElementById("newEstMsg");

const newEstBtn = document.getElementById("nuevo-est");
const closeAvisoBtn = document.getElementById("aviso-close");

let aprobados = 0;
let noAprobados = 0;
let sinNotas = 0;

let estudiantes = [];

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
      return resultado.toFixed(2);
    } else {
      return "Sin notas";
    };
  } catch (error) {
    console.error("Error al obtener las notas:", error);
    return "Error";
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
    return "Sin notas";
  };
};

const mostrarEst = () => {
  estTitulo.textContent = "Resumen del listado"; 
  const apP = document.createElement("p");
  const nApP = document.createElement("p");
  const sinNP= document.createElement("p");

  apP.id = "aprobados";
  nApP.id = "noAprobados";
  sinNP.id = "sinNotas";

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
    estudiantes = body.data;
    const tbody = table.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    estTitulo.textContent = "Cargando listado de estudiantes...";

    for (const estudiante of estudiantes) {
      const tr = document.createElement("tr");

      const codTd = document.createElement("td");
      codTd.textContent = estudiante.cod;
      const nombreTd = document.createElement("td");
      nombreTd.textContent = estudiante.nombres;
      const emailTd = document.createElement("td");
      emailTd.textContent = estudiante.email;

      const defTd = document.createElement("td");
      const definitiva = await getNotaDef(estudiante.cod);
      defTd.textContent = definitiva;

      const estadoTd = document.createElement("td");
      estadoTd.textContent = getEstado(parseFloat(defTd.textContent));

      const verNotasTd = document.createElement("td");
      const btnVerNotas = document.createElement("button");
      btnVerNotas.textContent = "Ver";
      btnVerNotas.className = "btn btn-ver-notas";
      btnVerNotas.addEventListener("click", () => {
        window.location.href = `notas.html?codigo=${estudiante.cod}&nombre=${estudiante.nombres}&email=${estudiante.email}`;
      });

      verNotasTd.appendChild(btnVerNotas);

      tr.appendChild(codTd);
      tr.appendChild(nombreTd);
      tr.appendChild(emailTd);
      tr.appendChild(defTd);
      tr.appendChild(estadoTd);
      tr.appendChild(verNotasTd);
      tbody.appendChild(tr);
    }
    mostrarEst();
  } catch (error) {
    console.error("Error al leer los estudiantes:", error);
  }
};

// --------------- Nuevo estudiante ---------------------------------------------------

newEstForm.addEventListener("submit", (ev) => {
  ev.preventDefault();
  newEstMsg.style.display = "none";

  const nuevoCodigo = newEstForm["codigo"].value;
  const nuevoEmail = newEstForm["email"].value;

  let codigoExiste = false;
  let correoExiste = false;

  estudiantes.forEach((estudiante) => {
    if (estudiante.cod == nuevoCodigo) {
      codigoExiste = true;
    }
    if (estudiante.email == nuevoEmail) {
      correoExiste = true;
    }
  });

  if (codigoExiste) {
    newEstMsg.style.display = "block";
    newEstMsg.textContent = "El código de estudiante ya existe.";
  } else if (correoExiste) {
    newEstMsg.style.display = "block";
    newEstMsg.textContent = "El correo ya existe.";
  } else {
    newEstMsg.style.backgroundColor = "#86dfff";
    newEstMsg.style.color = "#0053bd";
    newEstMsg.style.display = "block";
    newEstMsg.textContent = "Cargando datos...";

    fetch(ESTUDIANTE_ENDPOINT + "/estudiante", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cod: nuevoCodigo,
        nombres: newEstForm["estudiante"].value,
        email: nuevoEmail,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        window.location.href = "";
      }
    );
  }
});

// ------ Botones -------

newEstBtn.addEventListener("click", () => {
  aviseBG.style.display = 'block';
});

closeAvisoBtn.addEventListener("click", () => {
  aviseBG.style.display = 'none';
});

leerEstudiantes();