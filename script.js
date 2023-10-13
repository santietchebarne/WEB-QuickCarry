function convertToPasswordInput() {
    // Obtén el div y el input
    const passwordDiv = document.getElementById('passwordDiv');
    const passwordInput = document.getElementById('passwordInput');
  
    // Crea un nuevo elemento de input de contraseña
    const newPasswordInput = document.createElement('input');
    newPasswordInput.type = 'password';
    newPasswordInput.placeholder = 'Ingrese su contraseña';
  
    // Reemplaza el div con el nuevo input
    passwordDiv.parentNode.replaceChild(newPasswordInput, passwordDiv);
  }

  


  $(document).ready(function () {
    // Habilita el Datepicker en el campo de fecha
    $("#Fecha").datepicker({
        dateFormat: 'dd/mm/yy', // Formato de fecha personalizado
        minDate: 1, // Solo se permite una fecha futura (mínimo 1 día desde hoy)
    });
});



  