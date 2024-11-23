const ESTUDIANTE_ENDPOINT = "http://127.0.0.1:8000/api/appEstudiante";
const NOTA_ENDPOINT = "http://127.0.0.1:8000/api/appNota";
const table = document.getElementById("estudiantes");
const est = document.getElementById("estadisticas");
const estTitulo = document.getElementById("estTitulo");

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
            return resultado.toFixed(2);
        } else {
            return "Sin notas";
        }
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
    }
};

const mostrarEst = () => {
    estTitulo.textContent = "Resumen del listado"; 
    const apP = document.createElement("p");
    const nApP = document.createElement("p");
    const sinNP = document.createElement("p");

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
        const estudiantes = body.data;
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

// Llamar a la función para cargar los estudiantes al inicio
leerEstudiantes();

// ---- Filtro Estudiante ----

document.getElementById("buscarEst").addEventListener("click", async () => {
    const codigo = document.getElementById("codigoFiltro").value.trim();
    const nombre = document.getElementById("nombreFiltro").value.trim().toLowerCase();
    const email = document.getElementById("emailFiltro").value.trim().toLowerCase();
    const estado = document.getElementById("estadoFiltro").value;
    const notaMin = parseFloat(document.getElementById("notaMinFiltro").value) || 0;
    const notaMax = parseFloat(document.getElementById("notaMaxFiltro").value) || 5;

    // Si todos los campos de filtro están vacíos, recargar todos los estudiantes
    if (codigo === "" && nombre === "" && email === "" && estado === "" && isNaN(notaMin) && isNaN(notaMax)) {
        await leerEstudiantes(); // Llama a la función que carga todos los estudiantes
    } else {
        await filtrarEstudiantes(codigo, nombre, email, estado, notaMin, notaMax);
        mostrarBotonVolver(); // Muestra el botón para volver a ver todos los estudiantes
    }
});

// Función para filtrar estudiantes
const filtrarEstudiantes = async (codigo, nombre, email, estado, notaMin, notaMax) => {
    try {
        const response = await fetch(ESTUDIANTE_ENDPOINT + "/estudiantes");
        const body = await response.json();
        const estudiantes = body.data;
        const tbody = table.getElementsByTagName("tbody")[0];
        tbody.innerHTML = "";

        for (const estudiante of estudiantes) {
            const definitiva = await getNotaDef(estudiante.cod);
            const estadoEstudiante = getEstado(parseFloat(definitiva));

            // Filtrar según los criterios
            const notaDefinitiva = parseFloat(definitiva) || -1; // -1 para "Sin notas"
            if (
                (codigo === "" || estudiante.cod.toString() === codigo) &&
                (nombre === "" || estudiante.nombres.toLowerCase().includes(nombre)) &&
                (email === "" || estudiante.email.toLowerCase().includes(email)) &&
                (estado === "" || estadoEstudiante === estado) &&
                (notaDefinitiva >= notaMin && notaDefinitiva <= notaMax)
            ) {
                const tr = document.createElement("tr");

                const codTd = document.createElement("td");
                codTd.textContent = estudiante.cod;

                const nombreTd = document.createElement("td");
                nombreTd.textContent = estudiante .nombres;

                const emailTd = document.createElement("td");
                emailTd.textContent = estudiante.email;

                const defTd = document.createElement("td");
                defTd.textContent = definitiva;

                const estadoTd = document.createElement("td");
                estadoTd.textContent = estadoEstudiante;

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
        }
    } catch (error) {
        console.error("Error al filtrar los estudiantes:", error);
    }
};

// Función para mostrar el botón de volver a ver todos los estudiantes
const mostrarBotonVolver = () => {
    const botonVolver = document.getElementById("botonVolver");
    if (!botonVolver) {
        const nuevoBoton = document.createElement("button");
        nuevoBoton.id = "botonVolver";
        nuevoBoton.textContent = "Ver Todos los Estudiantes";
        nuevoBoton.className = "btn btn-volver";
        nuevoBoton.addEventListener("click", async () => {
            await leerEstudiantes();
            nuevoBoton.remove(); // Elimina el botón después de usarlo
        });
        document.getElementById("filtros").appendChild(nuevoBoton); // Asegúrate de que el contenedor de filtros exista
    }
};