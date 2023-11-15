const ciContainer = document.querySelector('#ci')
const nameContainer = document.querySelector('#name')
const emailContainer = document.querySelector('#email')
const phoneContainer = document.querySelector('#phone')
const addressContainer = document.querySelector('#address')

const getUserInformation = () => {
    return fetch('http://localhost:8002/api/usuario/token', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token 
        }
    })
}

const showUserInformation = user => {
    const {ci, email, nombre, nombre2, apellido, apellido2, ubicacion, telefono} = user
    const {departamento, calle, nro_de_puerta ,esquina} = ubicacion

    nombre2 
        ? nameContainer.innerText = `${nombre} ${nombre2} ${apellido} ${apellido2}`
        :  nameContainer.innerText = `${nombre} ${apellido} ${apellido2}`

    esquina 
        ? addressContainer.innerText = `${departamento} - ${calle} ${nro_de_puerta}, esquina ${esquina}`
        :  addressContainer.innerText = `${departamento} - ${calle} ${nro_de_puerta}`


    ciContainer.innerText = formatearCI(ci)
    emailContainer.value = email
    phoneContainer.value = telefono[0].telefono // TODO: Mostrar todos los telefonos
}

const formatearCI = (ci) => {
    const numVerificador = ci.slice(-1);
    const ciSinVerificador = ci.slice(0, -1);
    const ciFormateada = ciSinVerificador.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + '-' + numVerificador;

    return ciFormateada;
  }

window.addEventListener('DOMContentLoaded', () => {
    getUserInformation()
        .then(res => {
            if(res.status == '200') {
                return res.json()
            } else {
                throw new Error('No tienes permisos')
            }
        })
        .then(data => {
            showUserInformation(data)
        })
        .catch(err => {
            cerrarSesion()
        })
})