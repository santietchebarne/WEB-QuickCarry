const estados = {
    'En espera': 'bg-danger',
    'Almacenado': 'bg-warning',
    'Loteado': 'bg-info',
    'En ruta': 'bg-info',
    'Desloteado': 'bg-primary',
    'En viaje': 'bg-primary',
    'Entregado': 'bg-success'
}

let productosSeleccionados = {}

const formLote = document.querySelector('#form-lote')
const productosContainer = document.querySelector('#productos-container')
const btnsContainer = document.querySelector('#btns-container')

let almacenes = {}

const getAlmacenes = async () => {
    const res = await fetch('http://localhost:8001/api/almacen/tipo?tipo=Propio', {
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

const showAlmacenes = () => {
    const inputAlmacenes = document.querySelector('#almacenes')
    const fragment = document.createDocumentFragment()

    for (const almacen of almacenes) {
        const {id, nombre} = almacen
        const optionInput = document.createElement('option')
        optionInput.value = id
        optionInput.innerText = nombre

        fragment.appendChild(optionInput)
    }
    inputAlmacenes.appendChild(fragment)
}

const crearLote = async idsProductos => {
    const almacenSeleccionada = document.querySelector('#almacenes').value
    const lote = {
        almacen_destino: almacenSeleccionada,
        idsProductos: idsProductos
    }

    const res = await fetch('http://localhost:8001/api/lote', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token 
        },
        body: JSON.stringify(lote)
    })

    if(res.status == '201') {
        const data = await res.json()
        console.log(data)
        location.href = '/html/lote.html'
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
    alert.innerText = "Selecciona al menos un producto!"
    document.body.appendChild(alert)

    eliminarAlerta(alert)
}

const mostrarSpinner = () => {
    document.querySelector('[role="productos"]').classList.remove('d-none')
}

const ocultarSpinner = () => {
    document.querySelector('[role="productos"]').classList.add('d-none')
}

const iniciarLote = () => {
    const productos = []

    for (const idProducto in productosSeleccionados) {
        if(productosSeleccionados[idProducto] == 'checked') {
            productos.push(idProducto)
        }
    }

    if(productos.length != 0) {
        crearLote(productos)
    } else {
        return mostrarError()
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
        
        const checkbox = document.createElement('input')
        const estadoValor = document.createElement('small')

        const {
            id,
            almacen_id,
            departamento,
            direccion_entrega,
            fecha_entrega,
            peso,
            estado
        } = e

        const nombreAlmacen = almacenes[almacen_id - 1].nombre

        checkbox.setAttribute('type', 'checkbox')
        checkbox.setAttribute('id', id)

        if (productosSeleccionados[id] != 'checked') {
            productosSeleccionados[id] = ''
        } else if (productosSeleccionados[id] == 'checked') {
            checkbox.setAttribute('checked', '')
        }

        estadoValor.classList.add(estados[estado], 'text-light', 'p-1', 'rounded', 'fw-bold')
        idColumna.classList.add('fw-bold')
        checkbox.classList.add('ms-3')

        idColumna.innerText = id
        almacenColumna.innerText = nombreAlmacen
        fechaColumna.innerText = fecha_entrega
        pesoColumna.innerText = peso + ' kg'
        departamentoColumna.innerText = departamento
        direccionColumna.innerText = direccion_entrega
        estadoValor.innerText = estado

        checkbox.addEventListener('click', e => {
            const idCheckbox = e.target.id
            if(e.target.checked) {
                productosSeleccionados[idCheckbox] = 'checked'
            } else {
                productosSeleccionados[idCheckbox] = ''
            }
        })

        estadoColumna.appendChild(estadoValor)
        loteColumna.appendChild(checkbox)

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
    const url = page || 'http://localhost:8001/api/producto/lootear'
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
    }
}

window.addEventListener('DOMContentLoaded', () => {
    getAlmacenes()
    .then(()=> getProductos())
    .then(()=> showAlmacenes())
    .catch(err => cerrarSesion())

    formLote.addEventListener('submit', e => {
        e.preventDefault()
        iniciarLote()
    })
})