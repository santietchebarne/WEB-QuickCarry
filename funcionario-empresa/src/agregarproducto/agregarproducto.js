const formAgregarProducto = document.querySelector('#agregarproducto')
let almacenesPropias = {}

const getAlmacenes = () => {
    return fetch('http://localhost:8001/api/tercerizado/almacen?tipo=Propio', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token 
        }
    })
}

const showAlmacenes = (almacenes) => {
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

const obtenerFechaPorDefecto = () => {
  const fechaActual = new Date()

  fechaActual.setUTCHours(fechaActual.getUTCHours() - 3)
  fechaActual.setUTCDate(fechaActual.getUTCDate() + 2)

  const anio = fechaActual.getUTCFullYear()
  const mes = (fechaActual.getUTCMonth() + 1).toString().padStart(2, '0')
  const dia = fechaActual.getUTCDate().toString().padStart(2, '0')

  const fechaFormateada = `${anio}-${mes}-${dia}`
  return fechaFormateada
}

const mostrarProductoCreado = producto => {
    const container = document.querySelector('#container-productos')
    const containerPadre = document.querySelector('#container-padre')
    const row = document.createElement('tr')

    containerPadre.classList.remove('d-md-none')

    const {id, almacen_id, fecha_entrega, direccion_entrega, peso, departamento} = producto
    let nombreAlmacen = ''

    for (const almacen of almacenesPropias) {
        if (almacen.id == almacen_id) {
            nombreAlmacen = almacen.nombre
        }
    }

    const idColumna = document.createElement('td')
    const almacenColumna = document.createElement('td')
    const fechaColumna = document.createElement('td')
    const pesoColumna = document.createElement('td')
    const departamentoColumna = document.createElement('td')
    const direccionColumna = document.createElement('td')
    const estadoColumna = document.createElement('td')

    const estadoValor = document.createElement('small')
    estadoValor.innerText = 'En espera'

    idColumna.innerText = id
    almacenColumna.innerText = nombreAlmacen
    fechaColumna.innerText = fecha_entrega
    pesoColumna.innerText = peso
    departamentoColumna.innerText = departamento
    direccionColumna.innerText = direccion_entrega

    estadoValor.classList.add('bg-danger', 'text-light', 'p-1', 'rounded', 'fw-bold')
    idColumna.classList.add('fw-bold')

    estadoColumna.appendChild(estadoValor)
    row.appendChild(idColumna)
    row.appendChild(almacenColumna)
    row.appendChild(fechaColumna)
    row.appendChild(pesoColumna)
    row.appendChild(departamentoColumna)
    row.appendChild(direccionColumna)
    row.appendChild(estadoColumna)

    container.appendChild(row)
}

const crearProducto = async () => {
    const departamento = document.querySelector('#departamento')
    const direccion = document.querySelector('#direccion')
    const almacen = document.querySelector('#almacenes')
    const fecha = document.querySelector('#fecha')
    const peso = document.querySelector('#peso')
    
    const fechaPorDefecto = obtenerFechaPorDefecto()

    const producto = {
        departamento: departamento.value,
        direccion_entrega: direccion.value,
        almacen_id: almacen.value,
        fecha_entrega: fecha.value || fechaPorDefecto,
        peso: peso.value
    }

    const res = await fetch('http://localhost:8001/api/tercerizado/producto', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token 
        },
        body: JSON.stringify(producto)
    })

    if(res.status == '201') {
        const data = await res.json()
        mostrarProductoCreado(data)
    } else {
        const err = await res.json()
        console.log(err)
    }
}

window.addEventListener('DOMContentLoaded', () => {
    getAlmacenes()
    .then(res => {
        if(res.status == '200') {
            return res.json()
        } else {
            throw new Error()
        }
    })
    .then(data => {
        almacenesPropias = data
        showAlmacenes(data)
    })
    .catch(err => {
        console.log(err)
    })


    formAgregarProducto.addEventListener('submit', e => {
        e.preventDefault()
        crearProducto()
    })
})