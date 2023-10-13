<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_FILES["imagen"]) && $_FILES["imagen"]["error"] == 0) {
        $targetDir = "img/"; // Carpeta de destino para las imágenes
        $targetFile = $targetDir . basename($_FILES["imagen"]["name"]);

        // Verifica si el archivo ya existe en la carpeta "img/"
        if (file_exists($targetFile)) {
            echo "El archivo ya existe.";
        } else {
            // Mueve el archivo cargado a la carpeta "img/"
            if (move_uploaded_file($_FILES["imagen"]["tmp_name"], $targetFile)) {
                echo "La imagen se ha cargado con éxito.";
                // Muestra la imagen cargada
                echo '<img src="' . $targetFile . '" alt="Imagen subida">';
            } else {
                echo "Hubo un error al cargar la imagen.";
            }
        }
    } else {
        echo "No se proporcionó ninguna imagen o hubo un error al cargarla.";
    }
} else {
    echo "Acceso no válido.";
}
?>
