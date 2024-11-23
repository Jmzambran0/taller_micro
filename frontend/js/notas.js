const NOTA_ENDPOINT = "http://127.0.0.1:8000/api/appNota";
const ESTUDIANTE_ENDPOINT = "http://127.0.0.1:8000/api/appEstudiante";
const params = new URLSearchParams(window.location.search);
const codigo = params.get("codigo");
const nombre = params.get("nombre");
const email = params.get("email");

const btnNuevaNota = document.getElementById("nueva-nota");
const btnAviso = document.getElementById("aviso-close");
const aviseBG = document.getElementById("avisoBG");
const confirmAvise = document.getElementById("aviso-confirmacion");

const confirmBtn = document.getElementById("confirm");
const cancelBtn = document.getElementById("cancel");
const okayBtn = document.getElementById("okay");

const msgAvise = document.getElementById("msg");

const formsDiv = document.getElementById("formsDiv");

const deleteEstBtn = document.getElementById("deleteEstBtn");
const modEstBtn = document.getElementById("modEstBtn");

const okDiv = document.getElementById("okDiv");
const confirmDiv = document.getElementById("confirmDiv");

const notasForm = document.forms["notasForm"];
const estInfoForm = document.forms["estInfoForm"];

const estinfoMsg = document.getElementById("estinfoMsg");

const est = document.getElementById("estadisticas");
const estTitulo = document.getElementById("estTitulo");

// ------ funciones para la tabla -------

let notas = [];

let totalNotas = 0;

let notasAprobadas = 0;
let notasReprobadas = 0;

const confirmationButtons = (isConfirmation) => {
  confirmAvise.style.display = 'block';
  if (isConfirmation) {
    okDiv.style.display = 'none';
    confirmDiv.style.display = 'block';
  } else {
    confirmDiv.style.display = 'none';
    okDiv.style.display = 'block';
  }
}

const notasFormAction = (idNota, actividad, calificacion) => {
  estInfoForm.style.display = 'none';
  notasForm.style.display = 'block';
  if (idNota) {
    notasForm["notaId"].value = idNota;
    notasForm["actividad"].value = actividad;
    notasForm["nota"].value = calificacion;
  } else {
    notasForm["notaId"].value = '';
    notasForm["actividad"].value = '';
    notasForm["nota"].value = '';
  }
  notasForm["codigo"].value = codigo;
  formsDiv.style.display = 'block';
  aviseBG.style.display = 'block';
}

const estInfoFormAction = () => {
  notasForm.style.display = 'none';
  estInfoForm.style.display = 'block';

  estInfoForm["estudiante"].value = nombre;
  estInfoForm["email"].value = email;

  formsDiv.style.display = 'block';
  aviseBG.style.display = 'block';
}

const closeAviseAction = () => {
  aviseBG.style.display = 'none';
  confirmAvise.style.display = 'none';
  formsDiv.style.display = 'none';
}

const confirmAviseAction = (isNota, value, id) => {
  confirmationButtons(true);
  aviseBG.style.display = 'block';

  if (isNota) {
    msgAvise.textContent = "¿Desea borrar la nota " + value + "?";
    confirmBtn.addEventListener("click", () => {
      fetch(NOTA_ENDPOINT + "/nota/" + id, { //Elimina una nota
        method: "delete",
      })
        .then((response) => response.json())
        .then((body) => {
          window.location.href = "";
        }
      );
    });
  } else {
    if (totalNotas > 0) {
      msgAvise.textContent = "No es posible borrar un estudiante con notas.";
      confirmationButtons(false);
      okayBtn.addEventListener("click", () => {
        closeAviseAction();
      });
    } else {
      msgAvise.textContent = "¿Desea borrar al estudiante con codigo " + codigo + "?";
      confirmationButtons(true);
      confirmBtn.addEventListener("click", () => {
        fetch(ESTUDIANTE_ENDPOINT + "/estudiante/" + codigo, { //Elimina al estudiante cuando no tiene notas
          method: "delete",
        })
          .then((response) => response.json())
          .then((body) => {
            window.location.href = "inicio.html";
          }
        );
      });
    }
  }
}

const colorNota = async (td, nota) => {
    if (nota >= 0 && nota <= 2) {
      notasReprobadas += 1;
      td.className = "nota-color1";
    } else if (nota > 2 && nota < 3) {
      notasReprobadas += 1;
      td.className = "nota-color2";
    } else if (nota >= 3 && nota < 4) {
      notasAprobadas += 1;
      td.className = "nota-color3";
    } else {
      notasAprobadas += 1;
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

const mostrarEst = () => {
  estTitulo.textContent = "Resumen de las notas"; 
  const apP = document.createElement("p");
  const nApP = document.createElement("p");

  apP.id = "aprobadas";
  nApP.id = "noAprobadas";

  apP.innerHTML = "<b>Notas menores a 3.0:</b> " + notasReprobadas;
  nApP.innerHTML = "<b>Notas iguales o superiores a 3.0:</b> " + notasAprobadas;

  est.appendChild(apP);
  est.appendChild(nApP);
};

const mostrarInfo = (resultado) => {
  const infoEstudiante = document.getElementById("info-estudiante");
  infoEstudiante.innerHTML = "";

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

const mostrarAllNotas = async () => {
  const tablaNotas = document.getElementById("tabla-notas").getElementsByTagName("tbody")[0];
  tablaNotas.innerHTML = "";
  est.innerHTML = "";
  estTitulo.textContent = "Cargando notas...";

  let acumulado = 0;
  totalNotas = 0;
  notasAprobadas = 0;
  notasReprobadas = 0;

  notas.forEach((nota) => {
    const tr = document.createElement("tr");

    const actividadTd = document.createElement("td");
    actividadTd.textContent = nota.actividad;

    const notaTd = document.createElement("td");
    notaTd.textContent = nota.nota;
    colorNota(notaTd, nota.nota);

    acumulado += parseFloat(nota.nota);
    totalNotas += 1;

    const accionesTd = document.createElement("td");

    const btnEliminar = document.createElement("button");
    btnEliminar.innerHTML = '<i class="fas fa-trash"></i>';
    btnEliminar.className = "btn btn-eliminar";
    btnEliminar.addEventListener("click", () => { //Eliminar nota
      confirmAviseAction(true, nota.actividad, nota.id);
    });

    const btnModificar = document.createElement("button");
    btnModificar.innerHTML = '<i class="fas fa-edit"></i>';
    btnModificar.className = "btn btn-modificar";
    btnModificar.addEventListener("click", () => { //Modificar nota
      notasFormAction(nota.id, nota.actividad, nota.nota);
    });

    accionesTd.appendChild(btnEliminar);
    accionesTd.appendChild(btnModificar);

    tr.appendChild(actividadTd);
    tr.appendChild(notaTd);
    tr.appendChild(accionesTd);
    tablaNotas.appendChild(tr);
  });

  const resultado = acumulado / totalNotas;
  mostrarInfo(resultado.toFixed(2));
  mostrarEst();
};

//=== filtro ===

const filtrarNotas = async (actividad, notaMin, notaMax) => {
  const tablaNotas = document.getElementById("tabla-notas").getElementsByTagName("tbody")[0];
  tablaNotas.innerHTML = "";
  est.innerHTML = "";

  totalNotas = 0;
  notasAprobadas = 0;
  notasReprobadas = 0;

  for (const nota of notas) {
    if (
      (actividad === "" || nota.actividad.toString() === actividad) &&
      (nota.nota >= notaMin && nota.nota <= notaMax)
    ) {
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
      btnEliminar.addEventListener("click", () => { //Eliminar nota
        confirmAviseAction(true, nota.actividad, nota.id);
      });
  
      const btnModificar = document.createElement("button");
      btnModificar.innerHTML = '<i class="fas fa-edit"></i>';
      btnModificar.className = "btn btn-modificar";
      btnModificar.addEventListener("click", () => { //Modificar nota
        notasFormAction(nota.id, nota.actividad, nota.nota);
      });

      accionesTd.appendChild(btnEliminar);
      accionesTd.appendChild(btnModificar);
  
      tr.appendChild(actividadTd);
      tr.appendChild(notaTd);
      tr.appendChild(accionesTd);
      tablaNotas.appendChild(tr);
    }
  }
  mostrarEst();
};

//------------ formularios ================================================================

notasForm.addEventListener("submit", (ev) => {
  ev.preventDefault();
  if (notasForm["notaId"].value == '') {
    fetch(NOTA_ENDPOINT + "/nota", { //crear una nota
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        actividad: notasForm["actividad"].value,
        nota: notasForm["nota"].value,
        codEstudiante: notasForm["codigo"].value,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        getAllNotas();
      }
    );
  } else {
    fetch(NOTA_ENDPOINT + "/nota/" + notasForm["notaId"].value, { //actualizar una nota
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        actividad: notasForm["actividad"].value,
        nota: notasForm["nota"].value,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        getAllNotas();
      }
    );
  }
});

estInfoForm.addEventListener("submit", (ev) => {
  estinfoMsg.style.display = "none";
  ev.preventDefault();

  if (estInfoForm["estudiante"].value == nombre && 
    estInfoForm["email"].value == email) 
    {
      estinfoMsg.style.display = "block";
    estinfoMsg.textContent = "No hubo cambios en los datos ingresados.";
  } else {
    const nuevoEmail = estInfoForm["email"].value;

    let correoExiste = false;

    fetch(ESTUDIANTE_ENDPOINT + "/estudiantes")
    .then((response) => response.json())
    .then((body) => {
      const allEstudiantes = body.data;

      allEstudiantes.forEach((estudiante) => {
        if (estudiante.email == nuevoEmail && nuevoEmail != email) {
          correoExiste = true;
        }
      });

      const emailRegex = /^[a-zA-Z0-9._%+-]+@test\.com$/;

  if (!emailRegex.test(nuevoEmail)) {
    estinfoMsg.style.display = "block";
    estinfoMsg.textContent = "El correo debe tener el formato '@test.com'.";
    return;
  }

  if (correoExiste) {
    estinfoMsg.style.display = "block";
    estinfoMsg.textContent = "El correo ya existe.";
  } else {
    estinfoMsg.style.backgroundColor = "#86dfff";
    estinfoMsg.style.color = "#0053bd";
    estinfoMsg.style.display = "block";
    estinfoMsg.textContent = "Cargando datos...";

    fetch(ESTUDIANTE_ENDPOINT + "/estudiante/" + codigo, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombres: estInfoForm["estudiante"].value,
        email: nuevoEmail,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        window.location.href = "inicio.html";
      }
    );
  } 
  });
  }
});

// ------ Botones -------

btnNuevaNota.addEventListener("click", () => {
    notasFormAction(null);
  }
);

deleteEstBtn.addEventListener("click", () => {
  confirmAviseAction(false);
}
);

modEstBtn.addEventListener("click", () => {
  estInfoFormAction();
}
);

btnAviso.addEventListener("click", () => {
    closeAviseAction();
  }
);

cancelBtn.addEventListener("click", () => {
  closeAviseAction();
});

// ---- Filtro notas ----

document.getElementById("buscarEst").addEventListener("click", async () => {
  const actividad = document.getElementById("actividadFiltro").value.trim().toLowerCase();
  const notaMin = parseFloat(document.getElementById("notaMinFiltro").value) || 0;
  const notaMax = parseFloat(document.getElementById("notaMaxFiltro").value) || 5;

  if (actividad === "" && isNaN(notaMin) && isNaN(notaMax)) {
      await mostrarAllNotas();
  } else {
      await filtrarNotas(actividad, notaMin, notaMax);
      mostrarBotonVolver();
  }
});

const mostrarBotonVolver = () => {
  const botonVolver = document.getElementById("botonVolver");
  if (!botonVolver) {
      const nuevoBoton = document.createElement("button");
      nuevoBoton.id = "botonVolver";
      nuevoBoton.textContent = "Ver Todas las Notas";
      nuevoBoton.className = "btn btn-volver";
      nuevoBoton.addEventListener("click", async () => {
        await mostrarAllNotas();
        nuevoBoton.remove();
      });
      document.getElementById("filtros").appendChild(nuevoBoton);
  }
};

//===== Obtener datos ===========

const getAllNotas = async () => {
  try {
    const response = await fetch(NOTA_ENDPOINT + `/notas/estudiante/${codigo}`);
    const body = await response.json();
    notas = body.data;

    closeAviseAction();
    mostrarAllNotas();

  } catch (error) {
    console.error("Error al cargar las notas:", error);
  }
}

getAllNotas();
