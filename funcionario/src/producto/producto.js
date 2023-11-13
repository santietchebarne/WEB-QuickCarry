const estados = {
    'En espera': 'bg-danger',
    'Almacenado': 'bg-warning',
    'Loteado': 'bg-info',
    'En ruta': 'bg-info',
    'Desloteado': 'bg-primary',
    'En viaje': 'bg-primary',
    'Entregado': 'bg-success'
}

let almacenes = {}

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
        throw new Error()
    }
}

const productosContainer = document.querySelector('#productos-container')
const btnsContainer = document.querySelector('#btns-container')

const mostrarSpinner = () => {
    document.querySelector('[role="productos"]').classList.remove('d-none')
}

const ocultarSpinner = () => {
    document.querySelector('[role="productos"]').classList.add('d-none')
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
            getProductos(prev)
        })
    }

    if(next) {
        btnNext.removeAttribute('disabled', '')
        btnNext.addEventListener('click', () => {
            getProductos(next)
        })
    }

    btnsContainer.innerHTML = ''
    btnsContainer.appendChild(btnGroup)
}

const showProductos = productos => {
    const fragment = document.createDocumentFragment()
    
    const {current_page, prev_page_url, next_page_url} = productos 
    const {data} = productos 

    if(data.length == 0) {
        productosContainer.innerHTML = '<strong>Actualmente no existen productos!</strong>'
        return
    }

    data.forEach(e => {
        const row = document.createElement('tr')
        const idColumna = document.createElement('td')
        const almacenColumna = document.createElement('td')
        const fechaColumna = document.createElement('td')
        const pesoColumna = document.createElement('td')
        const departamentoColumna = document.createElement('td')
        const direccionColumna = document.createElement('td')
        const estadoColumna = document.createElement('td')
        const loteColumna = document.createElement('td')
        
        const {
            id,
            almacen_id,
            departamento,
            direccion_entrega,
            fecha_entrega,
            lote_id,
            peso,
            estado
        } = e

        const nombreAlmacen = almacenes[almacen_id - 1].nombre

        const estadoValor = document.createElement('small')
        estadoValor.classList.add(estados[estado], 'text-light', 'p-1', 'rounded', 'fw-bold')
        idColumna.classList.add('fw-bold')

        idColumna.innerText = id
        almacenColumna.innerText = nombreAlmacen
        fechaColumna.innerText = fecha_entrega
        pesoColumna.innerText = peso + ' kg'
        departamentoColumna.innerText = departamento
        direccionColumna.innerText = direccion_entrega
        estadoValor.innerText = estado
        loteColumna.innerText = lote_id || 'Sin asignar'

        estadoColumna.appendChild(estadoValor)

        row.appendChild(idColumna)
        row.appendChild(almacenColumna)
        row.appendChild(fechaColumna)
        row.appendChild(pesoColumna)
        row.appendChild(departamentoColumna)
        row.appendChild(direccionColumna)
        row.appendChild(estadoColumna)
        row.appendChild(loteColumna)

        fragment.appendChild(row)
    })
    productosContainer.appendChild(fragment)
    btnsNavegacion(current_page, prev_page_url, next_page_url)
}

const getProductos = async (page) => {
    productosContainer.innerHTML = ''
    btnsContainer.innerHTML = ''
    mostrarSpinner()
    const url = page || 'http://localhost:8001/api/producto'
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
        return showProductos(data)
    } else {
        const err = await res.json()
        cerrarSesion()
    }
}

window.addEventListener('DOMContentLoaded', () => {
    getAlmacenes()
    .then(()=> getProductos())
    .catch(err => cerrarSesion())
})