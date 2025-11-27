<?php
$servername = "localhost";
$username = "root";  //Usuario por defecto en XAMPP
$password = "";      //Contraseña por defecto en XAMPP
$dbname = "soundatlas"; //Nombre base de datos

//Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

//Comprobar conexión
if ($conn->connect_error) {
    //enviar JSON de error
    echo json_encode(["status" => "error", "message" => "Conexión fallida: " . $conn->connect_error]);
    exit();
}
?>
