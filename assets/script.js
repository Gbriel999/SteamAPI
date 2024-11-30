const urlApi =
  "https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamApps/GetAppList/v2/"; // USAR ESTO ANTES DEL LINK PARA ARREGLAR ESE ERROR DE SEGURIDAD https://cors-anywhere.herokuapp.com/

function obtenerYMostrarJuegos() {
  fetch(urlApi)
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      const juegos = datos.applist.apps;
      const juegosAleatorios = obtenerJuegosAleatorios(juegos, 30); // si aumento esto rip ram
      mostrarJuegos(juegosAleatorios);
    })
    .catch((error) => {
      console.error("Error al obtener los datos de la API: ", error);
    });
}

function obtenerJuegosAleatorios(juegos, cantidad) {
  let mezclados = juegos.sort(() => 0.5 - Math.random());
  return mezclados.slice(0, cantidad);
}

function mostrarJuegos(juegos) {
  const contenedorJuegos = document.getElementById("contenedor-juegos");
  contenedorJuegos.innerHTML = "";

  juegos.forEach((juego) => {
    const elementoJuego = document.createElement("div");
    elementoJuego.classList.add("juego");
    elementoJuego.innerHTML = `
            <div class="tarjeta-juego">
                <h4>${juego.name}</h4>
                <p>ID: ${juego.appid}</p>
                <img src="https://cdn.cloudflare.steamstatic.com/steam/apps/${juego.appid}/header.jpg" alt="${juego.name}" class="imagen-juego">
            </div>
        `;
    contenedorJuegos.appendChild(elementoJuego);
  });
}

function mostrarDetallesJuego(juego) {
  const contenedorDetalles = document.getElementById("detalles-juego");
  contenedorDetalles.innerHTML = `
        <h2>${juego.name}</h2>
        <img src="${juego.header_image}" alt="${juego.name}" class="imagen-juego">
        <p><strong>Precio:</strong> ${
          juego.price_overview.final_formatted ? juego.price_overview.final_formatted : "Gratis"
        }</p>
    `;
}

document.getElementById("buscar-id").addEventListener("click", function () {
  const idJuego = document.getElementById("id-juego").value;
  if (idJuego) {
    obtenerJuegoPorId(idJuego);
  }
});

function obtenerJuegoPorId(idJuego) {
  const urlApiPorId = `https://cors-anywhere.herokuapp.com/https://store.steampowered.com/api/appdetails?appids=${idJuego}`;

  fetch(urlApiPorId)
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      const juego = datos[idJuego].data;
      mostrarDetallesJuego(juego);
    })
    .catch((error) =>
      console.error("Error al obtener los datos del juego por ID: ", error)
    );
}

document.getElementById("buscar-nombre").addEventListener("click", function () {
  const nombreJuego = document.getElementById("nombre-juego-input").value;
  if (nombreJuego) {
    obtenerIdPorNombreJuego(nombreJuego);
  }
});

function obtenerIdPorNombreJuego(nombreJuego) {
  const urlApiPorNombre = `https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamApps/GetAppList/v2/`;

  fetch(urlApiPorNombre)
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      const juegos = datos.applist.apps;
      const juego = juegos.find(
        (j) => j.name.toLowerCase() === nombreJuego.toLowerCase()
      ); // Buscar por nombre exacto
      if (juego) {
        alert(`El ID del juego es: ${juego.appid}`);
      } else {
        console.error("No se encontraron juegos con ese nombre.");
      }
    })
    .catch((error) =>
      console.error("Error al obtener los datos del juego por nombre: ", error)
    );
}

document.addEventListener("DOMContentLoaded", obtenerYMostrarJuegos);
