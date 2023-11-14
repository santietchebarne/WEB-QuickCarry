const estados = {
    'Disponible': 'bg-success',
    'No disponible': 'bg-warning',
    'En reparación': 'bg-danger'
}

const vehiculoContainer = document.querySelector('#vehiculos-container')
const btnsContainer = document.querySelector('#btns-container')

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
            getVehiculos(prev)
        })
    }

    if(next) {
        btnNext.removeAttribute('disabled', '')
        btnNext.addEventListener('click', () => {
            getVehiculos(next)
        })
    }

    btnsContainer.innerHTML = ''
    btnsContainer.appendChild(btnGroup)
}

const showVehiculos = vehiculos => {
    const fragment = document.createDocumentFragment()
    
    const {current_page, prev_page_url, next_page_url} = vehiculos 
    const {data} = vehiculos 

    if(data.length == 0) {
        vehiculoContainer.innerHTML = '<strong>Actualmente no existen vehiculos!</strong>'
        return
    }

    data.forEach(e => {
        const row = document.createElement('tr')
        const idColumna = document.createElement('td')
        const matriculaColumna = document.createElement('td')
        const pesoColumna = document.createElement('td')
        const limitePesoColuma = document.createElement('td')
        const estadoColumna = document.createElement('td')
        const estadoValor = document.createElement('small')

        const {
            id,
            matricula,
            peso,
            limite_peso,
            estado
        } = e

        row.classList.add('row-to-click')
        estadoValor.classList.add(estados[estado], 'text-light', 'p-1', 'rounded', 'fw-bold')
        idColumna.classList.add('fw-bold')

        idColumna.innerText = id
        matriculaColumna.innerText = matricula.toUpperCase()
        pesoColumna.innerText = peso + ' kg'
        limitePesoColuma.innerText = limite_peso + ' kg'
        estadoValor.innerText = estado

        row.addEventListener('click', () => {
            location.href = `/html/asignartransportistas.html?=vehiculo_id=${id}`
        })

        estadoColumna.appendChild(estadoValor)
        row.appendChild(idColumna)
        row.appendChild(matriculaColumna)
        row.appendChild(pesoColumna)
        row.appendChild(limitePesoColuma)
        row.appendChild(estadoColumna)

        fragment.appendChild(row)
    })
    vehiculoContainer.appendChild(fragment)
    btnsNavegacion(current_page, prev_page_url, next_page_url)
}

const mostrarSpinner = () => {
    document.querySelector('[role="vehiculos"]').classList.remove('d-none')
}

const ocultarSpinner = () => {
    document.querySelector('[role="vehiculos"]').classList.add('d-none')
}

const getVehiculos = async (page) => {
    vehiculoContainer.innerHTML = ''
    btnsContainer.innerHTML = ''
    mostrarSpinner()
    const url = page || 'http://localhost:8001/api/vehiculo'
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
        return showVehiculos(data)
    } else {
        const err = await res.json()
        cerrarSesion()
    }
}

window.addEventListener('DOMContentLoaded', () => {
    getVehiculos()
})