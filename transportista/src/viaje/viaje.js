const sinVehiculoHeader = document.querySelector('.sin-vehiculo')
const formIniciarViaje = document.querySelector('#iniciar-viaje')

const tengoVehiculo = async () => {
    const res = await fetch('http://localhost:8002/api/vehiculo/asignado', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token 
        }
    })

    if (res.status == '200') {
        sinVehiculoHeader.classList.add('d-none')
        return await res.json()
    } else {
        throw new Error('No tienes vehiculo asignado')
    }
}

const tengoViaje = async vehiculo_id => {
    const res = await fetch('http://localhost:8002/api/viaje/asignado', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token 
        }
    })

    if (res.status == '200') {
        sinVehiculoHeader.classList.add('d-none')
        return await res.json()
    } else {
        throw new Error('No tienes viajes asignados')
    }
}

const showViaje = viajes => {
    const viajesSinEmpezarContainer = document.querySelector('#viaje-sin-empezar-container')
    const viajesContenedor = document.querySelector('.con-viajes')
    const fragment = document.createDocumentFragment()

    viajes.forEach(e => {
        const row = document.createElement('tr')
        const vehiculoColumna = document.createElement('td')
        const loteColumna = document.createElement('td')
        const estadoColumna = document.createElement('td')
        const salidaColumna = document.createElement('td')

        const {
            vehiculo_id,
            lote_id,
            estado_viaje,
            salida_programada
        } = e

        vehiculoColumna.innerText = vehiculo_id
        loteColumna.innerText = lote_id
        estadoColumna.innerText = estado_viaje
        salidaColumna.innerText = salida_programada

        row.appendChild(vehiculoColumna)
        row.appendChild(loteColumna)
        row.appendChild(estadoColumna)
        row.appendChild(salidaColumna)

        fragment.appendChild(row)
    })
    viajesSinEmpezarContainer.appendChild(fragment)
    viajesContenedor.classList.remove('d-none')
}

const iniciarViaje = async () => {
    const res = await fetch('http://localhost:8002/api/vehiculo/asignado', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token 
        }
    })

    if (res.status == '200' || res.status == '201') {
        return await res.json()
    } else {
        throw new Error('Ha ocurrido un error')
    }
}

const mostrarLotesParaConfirmar = (transporta, asignado) => {
    const viajesSinEmpezarContainer = document.querySelector('#viaje-sin-empezar-container')
    viajesSinEmpezarContainer.classList.remove('d-none')

    const viajeIniciadoContainer = document.querySelector('#viaje-iniciado')
    
}

window.addEventListener('DOMContentLoaded', () => {
    tengoVehiculo()
    .then(data => {
        if (data.vehiculo_id) {
            return data.vehiculo_id
        } else {
            throw new Error('No tienes vehiculo asignado!')
        }
    })
    .then(() => {
        return tengoViaje()
    })
    .then(data => {
        showViaje(data)
    })
    .catch(err => {
        sinVehiculoHeader.classList.remove('d-none')
        sinVehiculoHeader.innerText = err
    })

    formIniciarViaje.addEventListener('submit', e => {
        e.preventDefault()
        iniciarViaje()
        .then(() => {
            mostrarLotesParaConfirmar()
        })
    })
})