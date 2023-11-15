const estados = {
    'Creado': 'bg-danger',
    'En viaje': 'bg-warning',
    'Desarmado': 'bg-success'
}

const lotesContainer = document.querySelector('#lotes-container')
const btnsContainer = document.querySelector('#btns-container')
const btnIniciarViaje = document.querySelector('#iniciar-viaje')
const rutaSelect = document.querySelector('#ruta-container')
const vehiculoSelect = document.querySelector('#vehiculo-container')
const modalConfirmarViaje = new bootstrap.Modal(document.querySelector('#confirmar-viaje'))
const formViaje = document.querySelector('#form-viaje')

let almacenes = {}
let usuarios = {}
let lotesSeleccionados = {}

const mostrarSpinner = () => {
    document.querySelector('[role="lotes"]').classList.remove('d-none')
}

const ocultarSpinner = () => {
    document.querySelector('[role="lotes"]').classList.add('d-none')
}

const enviarFormulario = async () => {
    const ruta = rutaSelect.value
    const vehiculo = vehiculoSelect.value
    const fecha = document.querySelector('#fecha')
    const hora = document.querySelector('#hora')
    const lotes = [] 

    for (const id in lotesSeleccionados) {
        lotes.push(id)
    }

    if(lotes.length == 0) {
        // cerrarSesion()
    }

    console.log(fecha.value)
    console.log(hora.value)
    const fecha_programada = `${fecha.value} ${hora.value}:00`    

    const body = {
        vehiculo_id: vehiculo,
        ruta_id: ruta,
        idsLotes: lotes,
        salida_programada: fecha_programada
    }

    const res = await fetch('http://localhost:8001/api/vehiculo/crearViaje', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token 
        },
        body: JSON.stringify(body)
    })

    if(res.status == '201') {
        const data = await res.json()
        console.log(data)
        location.href = '/html/vehiculo.html'
    } else {
        const data = await res.json()
        console.log(data)
    }
}

const eliminarAlerta = alerta => {
    setTimeout(() => {
        alerta.classList.remove('show')
    }, 3000)
}

const mostrarError = () => {
    const alert = document.createElement('div')
    alert.classList.add('alert', 'alert-danger', 'alert-dismissible', 'fade', 'show', 'fixed-top', 'mt-5', 'mx-5')
    alert.innerText = "Selecciona al menos un lote!"
    document.body.appendChild(alert)

    eliminarAlerta(alert)
}

const iniciarViaje = () => {
    const lotes = []

    for (const idLote in lotesSeleccionados) {
        if(lotesSeleccionados[idLote] == 'checked') {
            lotes.push(idLote)
        }
    }

    if(lotes.length != 0) {
        modalConfirmarViaje.show()
    } else {
        return mostrarError()
    }
}

const getAlmacenes = async () => {
    const res = await fetch('http://localhost:8001/api/almacen', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token 
        }
    })

    if (res.status == '200') {
        const data = await res.json()
        almacenes = data
    } else {
        const data = await res.json()
    }
}

const getUsuarios = async () => {
    const res = await fetch('http://localhost:8001/api/usuario', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token 
        }
    })

    if (res.status == '200') {
        const data = await res.json()
        usuarios = data
    } else {
        const data = await res.json()
    }
}

const btnsNavegacion = (current, prev, next) => {
    const btnGroup = document.createElement('div')
    const btnPrev = document.createElement('button')
    const btnNext = document.createElement('button')
    const iPrev = document.createElement('i')
    const iNext = document.createElement('i')
    const textPrev = document.createTextNode(' Atrás')
    const textNext = document.createTextNode('Siguiente ')


    btnGroup.setAttribute('role', 'group')
    btnGroup.setAttribute('aria-label', 'Botones de Navegación')
    btnPrev.setAttribute('type', 'button')
    btnPrev.setAttribute('disabled', '')
    btnNext.setAttribute('type', 'button')
    btnNext.setAttribute('disabled', '')
    
    btnGroup.classList.add('btn-group')
    btnPrev.classList.add('btn', 'btn-success')
    btnNext.classList.add('btn', 'btn-success')
    iPrev.classList.add('fas', 'fa-chevron-left')
    iNext.classList.add('fas', 'fa-chevron-right')

    btnPrev.appendChild(iPrev)
    btnPrev.appendChild(textPrev)
    btnNext.appendChild(textNext)
    btnNext.appendChild(iNext)
    btnGroup.appendChild(btnPrev)
    btnGroup.appendChild(btnNext)

    if(prev) {
        btnPrev.removeAttribute('disabled', '')
        btnPrev.addEventListener('click', () => {
            getLotes(prev)
        })
    }

    if(next) {
        btnNext.removeAttribute('disabled', '')
        btnNext.addEventListener('click', () => {
            getLotes(next)
        })
    }

    btnsContainer.innerHTML = ''
    btnsContainer.appendChild(btnGroup)
}

const showLotes = lotes => {
    const fragment = document.createDocumentFragment()
    
    const {current_page, prev_page_url, next_page_url} = lotes 
    const {data} = lotes 

    if(data.length == 0) {
        lotesContainer.innerHTML = '<strong>Actualmente no existen lotes!</strong>'
        return
    }

    data.forEach(e => {
        const row = document.createElement('tr')
        const idColumna = document.createElement('td')
        const creadorColumna = document.createElement('td')
        const almacenColumna = document.createElement('td')
        const pesoColumna = document.createElement('td')
        const estadoColumna = document.createElement('td')
        const checkboxColumna = document.createElement('td')
        const checkbox = document.createElement('input')
        
        const {
            id,
            almacen_destino,
            peso,
            estado,
            creador_id
        } = e

        const nombreAlmacen = almacenes[almacen_destino - 1].nombre
        const nombreUsuario = usuarios[creador_id - 1].nombre
        const apellidoUsuario = usuarios[creador_id - 1].apellido

        const estadoValor = document.createElement('small')

        checkbox.setAttribute('type', 'checkbox')
        checkbox.setAttribute('id', id)

        if (lotesSeleccionados[id] != 'checked') {
            lotesSeleccionados[id] = ''
        } else if (lotesSeleccionados[id] == 'checked') {
            checkbox.setAttribute('checked', '')
        }

        estadoValor.classList.add(estados[estado], 'text-light', 'p-1', 'rounded', 'fw-bold')
        idColumna.classList.add('fw-bold')
        checkbox.classList.add('ms-3')
        
        checkbox.addEventListener('click', e => {
            const idCheckbox = e.target.id
            if(e.target.checked) {
                lotesSeleccionados[idCheckbox] = 'checked'
            } else {
                lotesSeleccionados[idCheckbox] = ''
            }
        })

        idColumna.innerText = id
        creadorColumna.innerText = nombreUsuario + ' ' + apellidoUsuario
        almacenColumna.innerText = nombreAlmacen
        pesoColumna.innerText = peso + ' kg'
        estadoValor.innerText = estado

        estadoColumna.appendChild(estadoValor)

        checkboxColumna.appendChild(checkbox)

        row.appendChild(idColumna)
        row.appendChild(creadorColumna)
        row.appendChild(almacenColumna)
        row.appendChild(pesoColumna)
        row.appendChild(estadoColumna)
        row.appendChild(checkboxColumna)

        fragment.appendChild(row)
    })
    lotesContainer.appendChild(fragment)
    btnsNavegacion(current_page, prev_page_url, next_page_url)
}

const getLotes = async (page) => {
    lotesContainer.innerHTML = ''
    btnsContainer.innerHTML = ''
    mostrarSpinner()
    const url = page || 'http://localhost:8001/api/lote/estado?estado=Creado'
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token 
        }
    })
    ocultarSpinner()

    if(res.status == '200') {
        const data = await res.json()
        return showLotes(data)
    } else {
        const err = await res.json()
        throw new Error()
    }
}

const getRutas = async () => {
    const res = await fetch('http://localhost:8001/api/ruta', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token 
        }
    })

    if (res.status == '200') {
        const data = await res.json()
        showRutas(data)
    } else {
        const data = await res.json()
    }
}

const showRutas = rutas => {
    const fragment = document.createDocumentFragment()

    for (const ruta of rutas) {
        const {id, distanciakm, tiempo_estimado} = ruta
        const optionInput = document.createElement('option')
        optionInput.value = id
        optionInput.innerText = `Ruta: ${id} - ${distanciakm} Km - ${tiempo_estimado} Hs`

        fragment.appendChild(optionInput)
    }
    rutaSelect.appendChild(fragment)
}

const getVehiculos = async () => {
    const res = await fetch('http://localhost:8001/api/vehiculo/estado?estado=Disponible', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token 
        }
    })

    if (res.status == '200') {
        const data = await res.json()
        showVehiculos(data)
    } else {
        const data = await res.json()
    }
}

const showVehiculos = vehiculos => {
    const fragment = document.createDocumentFragment()

    for (const vehiculo of vehiculos) {
        const {id, matricula, limite_peso} = vehiculo
        const optionInput = document.createElement('option')
        optionInput.value = id
        optionInput.innerText = `${matricula.toUpperCase()} - Limite peso: ${limite_peso}`

        fragment.appendChild(optionInput)
    }
    vehiculoSelect.appendChild(fragment)
}

window.addEventListener('DOMContentLoaded', () => {
    getAlmacenes()
    .then(() => getUsuarios())
    .then(() => getLotes())
    .then(() => getRutas())
    .then(() => getVehiculos())

    btnIniciarViaje.addEventListener('click', () => {
        iniciarViaje()
    })

    formViaje.addEventListener('submit', e => {
        e.preventDefault()
        enviarFormulario()
    })
})