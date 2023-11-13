const token = localStorage.getItem('token')
if (!token) location.href = 'http://localhost:5000'

const cerrarSesion = async () => {
    const res = await fetch('http://localhost:8000/api/logout', {
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
        console.log(data)
    }

    location.reload()
    localStorage.removeItem('token')
}