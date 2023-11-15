const estados = {
    'Creado': 'bg-danger',
    'En viaje': 'bg-warning',
    'Desarmado': 'bg-success'
}

const lotesContainer = document.querySelector('#lotes-container')
const btnsContainer = document.querySelector('#btns-container')

let almacenes = {}
let usuarios = {}

const mostrarSpinner = () => {
    document.querySelector('[role="lotes"]').classList.remove('d-none')
}

const ocultarSpinner = () => {
    document.querySelector('[role="lotes"]').classList.add('d-none')
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
        estadoValor.classList.add(estados[estado], 'text-light', 'p-1', 'rounded', 'fw-bold')
        idColumna.classList.add('fw-bold')

        idColumna.innerText = id
        creadorColumna.innerText = nombreUsuario + ' ' + apellidoUsuario
        almacenColumna.innerText = nombreAlmacen
        pesoColumna.innerText = peso + ' kg'
        estadoValor.innerText = estado

        estadoColumna.appendChild(estadoValor)

        row.appendChild(idColumna)
        row.appendChild(creadorColumna)
        row.appendChild(almacenColumna)
        row.appendChild(pesoColumna)
        row.appendChild(estadoColumna)

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

window.addEventListener('DOMContentLoaded', () => {
    getAlmacenes()
    .then(() => getUsuarios())
    .then(() => getLotes())
})