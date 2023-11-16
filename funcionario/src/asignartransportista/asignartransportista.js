const vehiculoContainer = document.querySelector('#vehiculo-container')
const btnsContainer =  document.querySelector('#btns-container')
const formTransportistas = document.querySelector('#form-transportistas')
const btnModal = document.querySelector('#mostrar-modal')

let transportistasSeleccionados = {}

const enviarFormulario = async () => {
    const usuarios = []
    const vehiculo = idVehiculo

    for (const id in transportistasSeleccionados) {
        usuarios.push(id)
    }

    const body = {
        vehiculo_id: vehiculo,
        idsTransportistas: usuarios
    }

    const res = await fetch('http://localhost:8001/api/vehiculo/transportistas/asignar', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token 
        },
        body: JSON.stringify(body)
    })

    if(res.status == '201' || res.status == '200') {
        const data = await res.json()
        console.log(data)
        location.href = '/html/vehiculo.html'
    } else {
        const data = await res.json()
        console.log(data)
    }
}

const mostrarFormulario = () => {
    const fragment = document.createDocumentFragment()
    formTransportistas.innerHTML = ''

    if (Object.keys(transportistasSeleccionados).length === 0) {
        formTransportistas.innerText = 'El vehiculo no tiene transportistas asignados!'
        return;
    }

    for (const transportista in transportistasSeleccionados) {
        const nombreCompleto = transportistasSeleccionados[transportista]
        const div = document.createElement('div')

        div.classList.add('border', 'rounded', 'p-2')
        div.innerText = nombreCompleto
        fragment.appendChild(div)
    }

    formTransportistas.appendChild(fragment)
}

const mostrarSpinner = () => {
    document.querySelector('[role="vehiculos"]').classList.remove('d-none')
}

const ocultarSpinner = () => {
    document.querySelector('[role="vehiculos"]').classList.add('d-none')
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
            getTransportistas(prev)
        })
    }

    if(next) {
        btnNext.removeAttribute('disabled', '')
        btnNext.addEventListener('click', () => {
            getTransportistas(next)
        })
    }

    btnsContainer.innerHTML = ''
    btnsContainer.appendChild(btnGroup)
}

const showTransportistas = transportistas => {
    const transportistaContainer = document.querySelector('#transportistas-container')
    const fragment = document.createDocumentFragment()
    
    const {current_page, prev_page_url, next_page_url} = transportistas 
    const {data} = transportistas

    if(data.length == 0) {
        transportistaContainer.innerHTML = '<strong>Actualmente no existen transportistas!</strong>'
        return
    }

    data.forEach(e => {
        const row = document.createElement('tr')
        const idColumna = document.createElement('td')
        const nombreColumna = document.createElement('td')
        const apellidoColumna = document.createElement('td')
        const vehiculoColumna = document.createElement('td')   
        const btnColumna = document.createElement('td')   
        const btnAsignar = document.createElement('button')     

        const {usuario, vehiculo_id, user_id} = e
        const {nombre, apellido} = usuario

        btnAsignar.setAttribute('id', user_id)
        btnAsignar.setAttribute('type', 'button')
        btnAsignar.setAttribute('data-nombre', nombre + ' ' + apellido)
        btnAsignar.style.background = '#198754'

        if(vehiculo_id) {
            btnAsignar.setAttribute('disabled', '')
        }

        idColumna.classList.add('fw-bold')
        btnAsignar.classList.add('btn', 'btn-success')

        idColumna.innerText = user_id
        nombreColumna.innerText = nombre
        apellidoColumna.innerText = apellido
        vehiculoColumna.innerText = vehiculo_id || 'Sin asignar'
        btnAsignar.innerText = 'Asignar'

        btnAsignar.addEventListener('click', e => {
            const id = e.target.id
            const nombre = e.target.dataset.nombre
            transportistasSeleccionados[id] = nombre
            e.target.setAttribute('disabled', '')
        })

        btnColumna.appendChild(btnAsignar)
        row.appendChild(idColumna)
        row.appendChild(nombreColumna)
        row.appendChild(apellidoColumna)
        row.appendChild(vehiculoColumna)
        row.appendChild(btnColumna)

        fragment.appendChild(row)
    })
    transportistaContainer.appendChild(fragment)
    btnsNavegacion(current_page, prev_page_url, next_page_url)
}

const getTransportistas = async (page) => {
    mostrarSpinner()
    const url = page || 'http://localhost:8001/api/transportista'
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
        return showTransportistas(data)
    } else {
        throw new Error()
    }
}

const noExisteVehiculo = () => {
    console.log('No')
}

const showUsuariosAsignados = usuarios => {
    const usuariosContainer = document.querySelector('#transportistas-asignados')
    const fragment = document.createDocumentFragment()

    if(usuarios.length == 0) {
        usuariosContainer.innerHTML = '<strong>No hay transportistas asignados!</strong>'
        return
    }

    usuarios.forEach(e => {
        const {usuario, user_id} = e
        const {nombre, apellido} = usuario

        transportistasSeleccionados[user_id] = nombre + ' ' + apellido

        const nombreApellido = nombre + ' ' + apellido

        const div = document.createElement('div')
        const btn = document.createElement('button')
        const nombreUsuario = document.createTextNode(nombreApellido)

        
        btn.setAttribute('type', 'button')
        btn.setAttribute('id', user_id)
        div.classList.add('d-flex', 'justify-content-between')
        btn.classList.add('btn-close')
        div.classList.add('border', 'rounded', 'p-2')

        btn.addEventListener('click', e => {
            const id = e.target.id
            delete transportistasSeleccionados[id]
            e.target.parentNode.remove()
        })

        div.appendChild(nombreUsuario)
        div.appendChild(btn)
        fragment.appendChild(div)
    })

    usuariosContainer.appendChild(fragment)
}

const showVehiculo = vehiculo => {
    const fragment = document.createDocumentFragment()
    const h4 = document.createElement('h4')
    const h5 = document.createElement('h5')
    const transportistaContainer = document.createElement('div')
    const pLimitePeso = document.createElement('p')
    const pMatricula = document.createElement('p')
    const pEstado = document.createElement('p')
    const pPeso = document.createElement('p')
    
    const {id, matricula, limite_peso, estado, peso, transportista} = vehiculo
    
    h4.classList.add('mt-2', 'mb-0')
    pMatricula.classList.add('p-0', 'm-0')
    pLimitePeso.classList.add('p-0', 'm-0')
    pEstado.classList.add('p-0', 'm-0')
    pPeso.classList.add('p-0', 'm-0')
    transportistaContainer.classList.add('col-2')
    transportistaContainer.setAttribute('id', 'transportistas-asignados')
    
    h4.innerHTML = 'Vehiculo - ' + id
    h5.innerHTML = 'Transportistas asignados'
    pMatricula.innerHTML = '<strong>Matrícula</strong>: ' + matricula.toUpperCase()
    pPeso.innerHTML = '<strong>Peso</strong>: ' + peso + ' kg'
    pLimitePeso.innerHTML = '<strong>Limite de peso</strong>: ' + limite_peso + ' kg'
    pEstado.innerHTML = '<strong>Estado</strong>: ' + estado
    
    fragment.appendChild(h4)
    fragment.appendChild(pMatricula)
    fragment.appendChild(pEstado)
    fragment.appendChild(pPeso)
    fragment.appendChild(pLimitePeso)
    fragment.appendChild(h5)
    fragment.appendChild(transportistaContainer)

    vehiculoContainer.innerHTML = ''
    vehiculoContainer.appendChild(fragment)
    return showUsuariosAsignados(transportista)
}

const getVehiculo = async page => {
    const url = page || 'http://localhost:8001/api/vehiculo/' + idVehiculo
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token 
        }
    })

    if(res.status == '200') {
        const data = await res.json()
        return showVehiculo(data)
    } else if(res.status == '404') {
        return noExisteVehiculo()
    } else {
        throw new Error()
    }
}


window.addEventListener('DOMContentLoaded', () => {
    getVehiculo()
    .then(() => getTransportistas())

    btnModal.addEventListener('click', mostrarFormulario)
    formTransportistas.addEventListener('submit', e => {
        e.preventDefault()
        enviarFormulario()
    })
})