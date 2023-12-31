const desripcion = {
    'En espera': 'Tu pedido esta viajando hacia nuestro deposito central.',
    'Almacenado': 'Tu pedido esta almacenado en nuestro deposito central.',
    'Loteado': 'Tu pedido se encuentra en proceso de viajar hacia su departamento destino.',
    'En ruta': 'Tu pedido esta viajando hacia el departamento destino.',
    'Desloteado': 'Tu pedido esta en el departamento destino.',
    'En viaje': 'Tu pedido esta en reparto.',
    'Entregado': 'Tu pedido ya ha sido entregado.'
}

const buscarPedido = async () => {
    const container = document.querySelector('#info-pedido')
    const inputPedido = document.querySelector('#input-pedido')
    const idProducto = inputPedido.value.trim() || 0
    const URL = 'http://localhost:8002/api/guest/producto/' + idProducto

    container.classList.add('d-none')

    mostrarSpinner()
    const res = await fetch(URL)
    ocultarSpinner()

    if (res.status == '200') {
        const data = await res.json()
        return mostrarPedido(data, container)
    }
    container.classList.remove('d-none')
    container.innerText = 'El código de pedido proporcionado no se encuentra en nuestros registros'
}

const mostrarPedido = (pedido, container) => {
    container.innerHTML = ''

    const {estado, departamento, fecha_entrega} = pedido

    const [year, month, day] = fecha_entrega.split('-')
    const header = document.createElement('h4')
    const headerStrong = document.createElement('strong')
    const pDepartamento = document.createElement('p')
    const pDescripcion = document.createElement('p')
    const pFecha = document.createElement('p')

    
    header.innerText = 'Tu pedido se encuentra: '
    headerStrong.innerText = estado
    pDepartamento.innerText = `Departamento destino: ${departamento}`
    pDescripcion.innerText = desripcion[estado]
    pFecha.innerText = `Fecha de entrega: ${month}/${day}`
    
    headerStrong.classList.add('text-primary')
    pDepartamento.classList.add('p-0', 'm-0')
    pDescripcion.classList.add('p-0', 'm-0')
    pFecha.classList.add('p-0', 'm-0')
    
    header.appendChild(headerStrong)
    container.appendChild(header)
    container.appendChild(pDescripcion)
    container.appendChild(pDepartamento)
    container.appendChild(pFecha)

    container.classList.remove('d-none')
}

const mostrarSpinner = () => {
    document.querySelector('[role="pedido"]').classList.remove('d-none')
}

const ocultarSpinner = () => {
    document.querySelector('[role="pedido"]').classList.add('d-none')
}

window.addEventListener('DOMContentLoaded', () => {
    const formBuscarPedido = document.querySelector('#buscar-pedido')

    formBuscarPedido.addEventListener('submit', e => {
        e.preventDefault()
        buscarPedido()
    })
})