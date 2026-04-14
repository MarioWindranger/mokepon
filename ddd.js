const contenedorTarjetas = document.getElementById('contenedor-tarjetas')
const contenedorAtaques = document.getElementById('contenedor-ataques')
const botonMascotaJugador = document.getElementById('boton-mascota')
const sectionSeleccionarMascota = document.getElementById('seleccionar-mascota')
const sectionVerMapa = document.getElementById('ver-mapa')
const mapa = document.getElementById('mapa')
const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque')
const nombreMascotaJugador = document.getElementById('mascota-jugador')
const nombreMascotaEnemigo = document.getElementById('mascota-enemigo')
const spanVictoriasJugador = document.getElementById('victorias-jugador')
const spanVictoriasEnemigo = document.getElementById('victorias-enemigo')
const sectionBotonReiniciar = document.getElementById('reiniciar')
const botonReiniciar = document.getElementById('boton-reiniciar')
const ataquesDelJugador = document.getElementById('ataque-del-jugador')
const ataquesDelEnemigo = document.getElementById('ataque-del-enemigo')
const parrafo = document.getElementById('resultado')

let codigoDeMokepones
let codigoDeBotones
let jugadorId = null
let enemigoId = null
let mokepones = []
let mokeponesEnemigos = []
let botones = []
let ataqueJugador = []
let ataqueEnemigo = []
let indexAtaqueActual = 0
let inputHipodoge
let inputCapipepo
let inputRatigueya
let botonFuego
let botonTierra
let botonAgua
let mascotaJugador
let indexAtaqueJugador
let indexAtaqueEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let mascotaJugadorCanva 
let intervalo
let lienzo = mapa.getContext("2d") // Pilas. Acuerdate para que sirve la variable mapa
let mapaBackground = new Image()
mapaBackground.src = './mokemap.webp' // Pilas src ./

mapa.width = 400
mapa.height = 400

class Mokepon {
    constructor(nombre, foto, fotoMapa, id = null) { // Pilas con el id. Se necesita declararlo para usarlo cuando se crea un objeto.
        this.nombre = nombre
        this.ataques = []
        this.foto = foto
        this.id = id
        this.ancho = 40
        this.alto = 40
        this.x = aleatorio(0, mapa.width - this.ancho)
        this.y = aleatorio(0, mapa.height - this.alto)
        this.mapaFoto = new Image() // Pilas
        this.mapaFoto.src = fotoMapa
        this.velocidadX = 0
        this.velocidadY = 0
    }

    pintarMokepon() {
        lienzo.drawImage( // Error #1
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
        )
    }
}

let hipodoge = new Mokepon('Hipodoge', './inputmokepon.png', './hipodoge.webp') // Importante poner el ./
let capipepo = new Mokepon('Capipepo', './inputcapipepo.png', './capipepo.webp')
let ratigueya = new Mokepon('Ratigueya', './inputratigueya.png', './ratigueya.webp')

const hipodoge_ataques = [
    {nombre: 'Agua', id: 'boton-agua'},
    {nombre: 'Agua', id: 'boton-agua'},
    {nombre: 'Agua', id: 'boton-agua'},
    {nombre: 'Fuego', id: 'boton-fuego'},
    {nombre: 'Tierra', id: 'boton-tierra'}
]

hipodoge.ataques.push(...hipodoge_ataques)

const capipepo_ataques = [
    {nombre: 'Tierra', id: 'boton-tierra'},
    {nombre: 'Tierra', id: 'boton-tierra'},
    {nombre: 'Tierra', id: 'boton-tierra'},
    {nombre: 'Agua', id: 'boton-agua'},
    {nombre: 'Fuego', id: 'boton-fuego'},
]

capipepo.ataques.push(...capipepo_ataques)

const ratigueya_ataques = [
    {nombre: 'Fuego', id: 'boton-fuego'},
    {nombre: 'Fuego', id: 'boton-fuego'},
    {nombre: 'Fuego', id: 'boton-fuego'},
    {nombre: 'Tierra', id: 'boton-tierra'},
    {nombre: 'Agua', id: 'boton-agua'}
]

ratigueya.ataques.push(...ratigueya_ataques)

mokepones.push(hipodoge, capipepo, ratigueya)

function iniciarJuego() { // Puede fallar en caso de que no haya CSS todavia 
    sectionVerMapa.style.display = 'none'
    sectionSeleccionarAtaque.style.display = 'none'

    mokepones.forEach((mokepon) => {
        codigoDeMokepones = ` 
            <input type="radio" name="mascota" id=${mokepon.nombre} /> 
            <label class="tarjeta-de-mokepon" for=${mokepon.nombre}>
                <p> ${mokepon.nombre} </p>
                <img src="${mokepon.foto}" alt=${mokepon.nombre}> 
            </label> 
        `;
        contenedorTarjetas.innerHTML += codigoDeMokepones

    inputHipodoge = document.getElementById('Hipodoge') // Pilas no olvidar
    inputCapipepo = document.getElementById('Capipepo')
    inputRatigueya = document.getElementById('Ratigueya')

    })

    sectionBotonReiniciar.style.display = 'none'

    botonMascotaJugador.addEventListener("click", seleccionarMascotaJugador) // Importante esto

    unirseAlJuego()
}

function unirseAlJuego() {
    fetch("http://localhost:8083/unirse")
        .then(function(res) {
            if(res.ok) {
                res.text()
                    .then(function(respuesta) {
                        console.log(respuesta);
                        jugadorId = respuesta
                    }) 
            }
        })
}

function seleccionarMascotaJugador() {
    if(inputHipodoge.checked) {
        nombreMascotaJugador.innerHTML = inputHipodoge.id
        mascotaJugador = inputHipodoge.id
    } else if(inputCapipepo.checked) {
        nombreMascotaJugador.innerHTML = inputCapipepo.id
        mascotaJugador = inputCapipepo.id
    } else if(inputRatigueya.checked) {
        nombreMascotaJugador.innerHTML = inputRatigueya.id
        mascotaJugador = inputRatigueya.id
    } else {
        alert('Selecciona alguna mascota')
        return // Finaliza la funcion aqui y ya no continua con lo de abajo
    }
    sectionSeleccionarMascota.style.display = 'none'
    seleccionarMokepon(mascotaJugador)
    extraerAtaques(mascotaJugador)
    sectionVerMapa.style.display = 'flex'
    iniciarMapa()
}

function seleccionarMokepon(mascotaJugador) {
    fetch(`http://localhost:8083/mokepon/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify ({
            mokepon: mascotaJugador
        })
    })
}

function extraerAtaques(mascotaJugador) {
    let ataquesInput
    for (let i = 0; i < mokepones.length; i++) {
        if(mascotaJugador === mokepones[i].nombre) {
            ataquesInput = mokepones[i].ataques
        }
    }
    mostrarAtaques(ataquesInput)
}

function mostrarAtaques(ataquesInput) {
    ataquesInput.forEach((ataque) => { // Pilas al cerrar bien las etiquetas html
        codigoDeBotones = ` 
            <button id=${ataque.id} class="boton-de-ataque BAtaque"> ${ataque.nombre} </button> 
        `;
        contenedorAtaques.innerHTML += codigoDeBotones
    })

    botonFuego = document.getElementById('boton-fuego')
    botonTierra = document.getElementById('boton-tierra')
    botonAgua = document.getElementById('boton-agua')
    botones = document.querySelectorAll('.BAtaque') // Selecciona la etiqueta boton basandose en su clase
}

function seleccionarBoton() {
    botones.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            if (e.target.innerText === 'Fuego') {
                ataqueJugador.push('FUEGO')
                boton.style.background = '#112f58'
                boton.disabled = true
                console.log(ataqueJugador)
                
            } else if (e.target.innerText === 'Agua') {
                ataqueJugador.push('AGUA')
                boton.style.background = '#112f58'
                boton.disabled = true
                console.log(ataqueJugador)
                
            } else if (e.target.innerText === 'Tierra') {
                ataqueJugador.push('TIERRA')
                boton.style.background = '#112f58'
                boton.disabled = true
                console.log(ataqueJugador)
                
            }

            enviarAtaques()
        })
    })
}

function enviarAtaques() {
    fetch(`http://localhost:8083/mokepon/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    })
    clearInterval(intervalo) // Es necesario limpiar el intervalo para que no se llame cada vez que le demos click a un boton.

    intervalo = setInterval(obtenerAtaques, 50) /* Basta con dar un click a un boton de ataque para que quede abierto este intervalo,
    lo que hace que cada 50 ms se este llamando a la funcion obtenerAtaques() que tiene el then() como promesa */
}

/* Si le damos click a 3 botones de ataque y mi enemigo no ha dado click a ningun boton, cuando el enemigo finalmente ataque, 
los 3 intervalos detectan la respuesta casi al mismo tiempo y los 3 intentan ejecutar combate(), causando comportamientos
raros e impredecibles. */

function obtenerAtaques() {
    fetch(`http://localhost:8083/mokepon/${enemigoId}/ataques`) // Que pasa si son varios enemigos conectados??
        .then(function(res) {
            if(res.ok) {
                res.json()
                    .then(function({ataques}) {

                        if(ataques.length <= indexAtaqueActual) { // No deja que se agregue valores vacios al arreglo ataqueEnemigo.
                            return 
                        }

                        if(!ataqueJugador[indexAtaqueActual]) { // Si no tengo ataque en ese indice, entonces no hay combate()
                            return
                        }

                        ataqueEnemigo = ataques
                        combate(indexAtaqueActual)
                        indexAtaqueActual++ // wau!
                    })
                }
            })
}

function indexCapturaAtaques(jugador, enemigo) {
    indexAtaqueJugador = ataqueJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}

function combate(index) {

        if(ataqueJugador[index] === ataqueEnemigo[index]) {
            indexCapturaAtaques(index, index)
            crearMensajes('EMPATASTE')
        } else if(ataqueJugador[index] === 'FUEGO' && ataqueEnemigo[index] === 'TIERRA') {
            indexCapturaAtaques(index, index)
            crearMensajes('GANASTE')
            victoriasJugador++
            spanVictoriasJugador.innerHTML = victoriasJugador
        } else if(ataqueJugador[index] === 'AGUA' && ataqueEnemigo[index] === 'FUEGO') {
            indexCapturaAtaques(index, index)
            crearMensajes('GANASTE')
            victoriasJugador++
            spanVictoriasJugador.innerHTML = victoriasJugador
        } else if(ataqueJugador[index] === 'TIERRA' && ataqueEnemigo[index] === 'AGUA') {
            indexCapturaAtaques(index, index)
            crearMensajes('GANASTE')
            victoriasJugador++
            spanVictoriasJugador.innerHTML = victoriasJugador
        } else {
            indexCapturaAtaques(index, index)
            crearMensajes('PERDISTE')
            victoriasEnemigo++
            spanVictoriasEnemigo.innerHTML = victoriasEnemigo
        }
    
    if(ataqueJugador.length == 5 && ataqueEnemigo.length == 5 ) {
        clearInterval(intervalo)
        revisarVictorias()
    }
}

function crearMensajes(resultado) {
    let nuevoAtaqueDelJugador = document.createElement('p')
    let nuevoAtaqueDelEnemigo = document.createElement('p')

    parrafo.innerHTML = resultado
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo 

    ataquesDelJugador.appendChild(nuevoAtaqueDelJugador)
    ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)
}

function revisarVictorias() {
    if (victoriasJugador === victoriasEnemigo) {
        crearMensajeFinal('EMPATE')
    } else if(victoriasJugador > victoriasEnemigo) {
        crearMensajeFinal('VICTORIA')
    } else if(victoriasJugador < victoriasEnemigo) {
        crearMensajeFinal('DERROTA')
    }
}

function crearMensajeFinal(resultadoFinal) {
    parrafo.innerHTML = resultadoFinal

    sectionBotonReiniciar.style.display = 'flex'

    botonReiniciar.addEventListener("click", reiniciarJuego)
}

function reiniciarJuego() {
    location.reload()
}

function seleccionarMascotaEnemigo(enemigo) { 
    nombreMascotaEnemigo.innerHTML = enemigo.nombre // Por eso el nombre es del enemigo con el que colisionaste no con cualquiera

    seleccionarBoton()
}

function iniciarMapa() {
    intervalo = setInterval(pintarCanvas, 50)
    mascotaJugadorCanva = obtenerMascotaCanva(mascotaJugador)

    window.addEventListener('keydown', sePresionoUnatecla)
    window.addEventListener('keyup', detenerMovimiento)
}

function pintarCanvas() {
    mascotaJugadorCanva.x = mascotaJugadorCanva.x + mascotaJugadorCanva.velocidadX
    mascotaJugadorCanva.y = mascotaJugadorCanva.y + mascotaJugadorCanva.velocidadY
    lienzo.clearRect(0, 0, mapa.clientWidth, mapa.clientHeight)

    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height
    )

    mascotaJugadorCanva.pintarMokepon()

    enviarPosicion(mascotaJugadorCanva.x, mascotaJugadorCanva.y)

    mokeponesEnemigos.forEach(function(mokeponEnemigo) {
        mokeponEnemigo.pintarMokepon()
        revisarColisiones(mokeponEnemigo)
    })
}

function enviarPosicion(x, y) {
    fetch(`http://localhost:8083/mokepon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })
    .then(function(res) {
        if(res.ok) {
            res.json()
                .then(function({enemigos}) {
                    mokeponesEnemigos = enemigos.map(function(enemigo) {
                        if (!enemigo.nombreMokepon) {
                            return null // Con esto se esta retornando valores null a la lista de mokeponesEnemigos
                        }
                        let mokeponEnemigo = null
                        const mokeponNombre = enemigo.nombreMokepon || ""

                        if (mokeponNombre === "Hipodoge") {
                            mokeponEnemigo = new Mokepon('Hipodoge', './inputmokepon.png', './hipodoge.webp', enemigo.id)
                        } else if (mokeponNombre === "Capipepo") {
                            mokeponEnemigo = new Mokepon('Capipepo', './inputcapipepo.png', './capipepo.webp', enemigo.id)
                        } else if (mokeponNombre === "Ratigueya") {
                            mokeponEnemigo = new Mokepon('Ratigueya', './inputratigueya.png', './ratigueya.webp', enemigo.id)
                        }
                        mokeponEnemigo.x = enemigo.x
                        mokeponEnemigo.y = enemigo.y
                        return mokeponEnemigo

                    }).filter((mokeponEnemigo) => mokeponEnemigo !== null)
                })
        }
    })
}

function obtenerMascotaCanva(mascotaJugador) {
    for (let i = 0; i < mokepones.length; i++) { // En base a esta operacion matematica, itero en el arreglo mokepones
        if(mascotaJugador === mokepones[i].nombre) {
            return mokepones[i] // Pilas. Entender bien esto
        }
    }
}

function moverArriba() {
    mascotaJugadorCanva.velocidadY = -6
}

function moverAbajo() {
    mascotaJugadorCanva.velocidadY = 6
}

function moverDerecha() {
    mascotaJugadorCanva.velocidadX = 6
}

function moverIzquierda() {
    mascotaJugadorCanva.velocidadX = -6
}

function sePresionoUnatecla(evento) { // Entender bien esto!
    switch (evento.key) {
        case 'ArrowUp':
            moverArriba()
            break
        case 'ArrowDown':
            moverAbajo()
            break
        case 'ArrowLeft':
            moverIzquierda()
            break
        case 'ArrowRight':
            moverDerecha()
            break
        default:
            break
    }
}

function detenerMovimiento() {
    mascotaJugadorCanva.velocidadX = 0
    mascotaJugadorCanva.velocidadY = 0
}

function revisarColisiones(enemigo) {
    const arribaEnemigo = enemigo.y 
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaMascota = mascotaJugadorCanva.y
    const abajoMascota = mascotaJugadorCanva.y + mascotaJugadorCanva.alto
    const derechaMascota = mascotaJugadorCanva.x + mascotaJugadorCanva.ancho
    const izquierdaMascota = mascotaJugadorCanva.x

    if (abajoMascota < arribaEnemigo || arribaMascota > abajoEnemigo || derechaMascota < izquierdaEnemigo
        || izquierdaMascota > derechaEnemigo 
     ) {
        return
     }

    detenerMovimiento()
    clearInterval(intervalo)
    enemigoId = enemigo.id // Este va a ser el id del enemigo con el que chocamos
    sectionVerMapa.style.display = 'none'
    sectionSeleccionarAtaque.style.display = 'flex'
    seleccionarMascotaEnemigo(enemigo) // Este enemigo es con el que hace colision. Se lo lleva a la funcion seleccionarMascotaEnemigo()
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}  

window.addEventListener('load', iniciarJuego) // Pilas. Importante esta linea