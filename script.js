let tablero = ["", "", "", "", "", "", "", "", ""];
let jugador = "X";
let computadora = "O";
let juegoTerminado = false;
let tiempoInicio = null;

window.onload = function() {
    cargarTablaLideres();
    let celdas = document.getElementsByClassName("celda");
    for(let i = 0; i < celdas.length; i++) {
        celdas[i].addEventListener("click", movimientoJugador);
    }
}

function movimientoJugador(evento) {
    let celda = evento.target;
    let indice = celda.id.replace("celda", "");
    if(tablero[indice] === "" && !juegoTerminado) {
        tablero[indice] = jugador;
        celda.innerHTML = jugador;
        celda.classList.add('x'); 
        if(tiempoInicio === null) {
            tiempoInicio = new Date();
        }
        verificarGanador();
        if(!juegoTerminado) {
            setTimeout(movimientoComputadora, 500); 
        }
    }
}

function movimientoComputadora() {
    let celdasVacias = [];
    for(let i = 0; i < tablero.length; i++) {
        if(tablero[i] === "") {
            celdasVacias.push(i);
        }
    }
    if(celdasVacias.length > 0) {
        let indiceAleatorio = celdasVacias[Math.floor(Math.random() * celdasVacias.length)];
        tablero[indiceAleatorio] = computadora;
        let celdaComputadora = document.getElementById("celda" + indiceAleatorio);
        celdaComputadora.innerHTML = computadora;
        celdaComputadora.classList.add('o'); 
        verificarGanador();
    }
}

function verificarGanador() {
    let combinacionesGanadoras = [
        [0,1,2], [3,4,5], [6,7,8], 
        [0,3,6], [1,4,7], [2,5,8], 
        [0,4,8], [2,4,6]           
    ];

    for(let combo of combinacionesGanadoras) {
        let [a, b, c] = combo;
        if(tablero[a] !== "" && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
            juegoTerminado = true;
            let mensaje = document.getElementById("mensaje");
            if(tablero[a] === jugador) {
                let tiempoFin = new Date();
                let tiempoTotal = ((tiempoFin - tiempoInicio) / 1000).toFixed(2);
                mensaje.innerHTML = "✨ ¡Ganaste! Tiempo: " + tiempoTotal + " segundos";
                guardarPuntuacion(tiempoTotal);
            } else {
                mensaje.innerHTML = "💀 La computadora ganó.";
            }
            return;
        }
    }

    if(!tablero.includes("")) {
        juegoTerminado = true;
        document.getElementById("mensaje").innerHTML = "😐 Empate.";
    }
}

function guardarPuntuacion(tiempo) {
    let nombre = prompt("🎉 ¡Felicidades! Ingresa tu nombre:");
    if(nombre) {
        let puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || [];
        puntuaciones.push({nombre: nombre, tiempo: parseFloat(tiempo), fecha: new Date().toLocaleString()});
        puntuaciones.sort(function(a, b) {
            return a.tiempo - b.tiempo;
        });
        if(puntuaciones.length > 10) {
            puntuaciones = puntuaciones.slice(0, 10);
        }
        localStorage.setItem("puntuaciones", JSON.stringify(puntuaciones));
        cargarTablaLideres();
    }
}

function cargarTablaLideres() {
    let tablaLideres = document.getElementById("tablaLideres");
    tablaLideres.innerHTML = "";
    let puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || [];
    for(let puntuacion of puntuaciones) {
        let li = document.createElement("li");
        li.textContent = "👤 " + puntuacion.nombre + " - ⏱️ " + puntuacion.tiempo + "s - 📅 " + puntuacion.fecha;
        tablaLideres.appendChild(li);
    }
}
