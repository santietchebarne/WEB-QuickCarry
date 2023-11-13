const btnslogout = document.querySelectorAll('.logout')

window.addEventListener('DOMContentLoaded', () => {
    btnslogout.forEach(e => {
        e.addEventListener('click', cerrarSesion)
    })
})