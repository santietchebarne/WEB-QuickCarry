import {CLIENT_SECRET, CLIENT_ID} from '/api-token.js'

const loginForm = document.querySelector('#login-form')
const emailInput = document.querySelector('#email-input')
const passwordInput = document.querySelector('#password-input')

const getToken = async () => {
    const user = {
        grant_type: 'password',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        username: emailInput.value,
        password: passwordInput.value,
        scope: '*'
    }

    const res = await fetch('http://localhost:8000/oauth/token', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(user)
    })

    if(res.status == '200') {
        const data = await res.json()
        return login(data)
    }

    loginErrors()
} 

const login = token => {
    const {access_token, refresh_token} = token
    location.href = `http://localhost:5003/?token=${access_token}&refresh=${refresh_token}`
}

const loginErrors = () => {
    const loginErrorsContainer = document.querySelector('#login-errors')
    const error = document.createElement('small')
    error.innerText = 'Tu contraseña o email son incorrectos'
    error.classList.add('text-danger')

    loginErrorsContainer.appendChild(error)
}

const eliminarErrores = () => {
    const error = document.querySelector('small')
    if(error) error.remove()
}

window.addEventListener('DOMContentLoaded', () => {
    loginForm.addEventListener('submit', e => {
        e.preventDefault()
        getToken()
    })
    emailInput.addEventListener('input', eliminarErrores)
    passwordInput.addEventListener('input', eliminarErrores)
})