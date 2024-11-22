const NOTA_ENDPOINT = "http://127.0.0.1:8000/api/appNota";
const params = new URLSearchParams(window.location.search);
const notaId = params.get("notaId");
const codigo = params.get("codigo");
const actividad = params.get("actividad");
const nota = params.get("nota");

console.log(notaId, codigo, actividad, nota);