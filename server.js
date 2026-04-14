/* Node.js es el motor que lee tu server.js, abre un puerto dentro de tu computadora (8083 en este caso) y le da a tu computadora 
la capacidad de comportarse como un servidor. Por eso cuando cierras la terminal o detienes el proceso (con ctrl + c), el servidor
desaparece. Tu computadora deja de comportarse como tal proque el motor se apago. */

const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json()) // Pilas con esto te olvidaste

class Jugador {
    constructor(id) {
        this.id = id
    }
    asignarMokepon(nombreMokepon) {
        this.nombreMokepon = nombreMokepon
    }
    asignarPosicion(x, y) {
        this.x = x
        this.y = y
    }
    asignarAtaques(ataques) {
        this.ataques = ataques
    }
}

let jugadores = []

app.get("/unirse", (req, res) => {
    const id = `${Math.random()}`
    const jugador = new Jugador(id)
    
    jugadores.push(jugador)

    res.send(id)  
})

app.post("/mokepon/:jugadorId", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const nombreMokepon = req.body.mokepon || ""

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id) // JugadorIndex puede devolver -1 si no
    // encuentra jugadorId === jugador.id

    if (jugadorIndex >= 0) { // Por eso es importante hacer este paso
        jugadores[jugadorIndex].asignarMokepon(nombreMokepon)
    } 

    res.end()
})

app.post("/mokepon/:jugadorId/posicion", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const x = req.body.x || 0
    const y = req.body.y || 0
    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    if(jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarPosicion(x, y)
    }

    const enemigos = jugadores.filter((jugador) => jugadorId !== jugador.id)
    
    res.send({enemigos})
})

app.post("/mokepon/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const ataques = req.body.ataques || []
    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    if(jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarAtaques(ataques)
    }

    res.end()

    console.log(jugadores);
})

app.get("/mokepon/:enemigoId/ataques", (req, res) => {
    const enemigoId = req.params.enemigoId || ""
    const jugadorEnemigo = jugadores.find((jugador) => enemigoId === jugador.id)

    res.send({
        ataques: jugadorEnemigo.ataques || []
    })
})

app.listen(8083, () => {
    console.log("Servidor funcionando")
})
