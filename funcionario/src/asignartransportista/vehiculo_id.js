const urlParams = new URLSearchParams(window.location.search)
const idVehiculo = urlParams.get('vehiculo_id')

if( isNaN(idVehiculo) || idVehiculo == null) {
    location.href = '/html/vehiculo.html'
}