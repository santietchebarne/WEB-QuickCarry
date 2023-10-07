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
  