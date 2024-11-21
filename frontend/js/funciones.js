const NOTA_ENDPOINT = "http://127.0.0.1:8000/api/appNota";

  function getNotaDef(cod) {
    let acumulado = 0;
    let divisor = 0;
  
    try {
      fetch(NOTA_ENDPOINT + "/notas/estudiante/" + cod)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((body) => {
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
      });
    } catch (error) {
      console.error("Error al obtener las notas:", error);
      return "Error";
    }
  }
  
  function getEstado(notaDef) {
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
  }