const sinVehiculoHeader = document.querySelector('.sin-vehiculo')

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
    
}

window.addEventListener('DOMContentLoaded', () => {
    tengoVehiculo()
    .then(data => {
        if (data.vehiculo_id) {
            console.log(data)
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
})