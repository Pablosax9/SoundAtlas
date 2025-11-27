<?php
//ACTIVAR REPORTE DE ERRORES (Para que no salga error de conexión genérico)
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

//BUSCAR CONEXIÓN (db.php)
//Primero intentamos subir 2 niveles (Estructura: SoundAtlas/backend/api/create_list.php)
$path = __DIR__ . '/../../config/db.php'; 

if (!file_exists($path)) {
    //Si falla, intentamos subir solo 1 nivel (por si la estructura es distinta)
    $path = __DIR__ . '/../config/db.php'; 
}

if (file_exists($path)) {
    require_once $path;
} else {
    //Si no lo encuentra, devolvemos error JSON para que lo leas en la alerta
    echo json_encode(["status" => "error", "message" => "NO SE ENCUENTRA db.php. Ruta buscada: " . $path]);
    exit();
}

//VALIDAR LA CONEXIÓN MYSQL 
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Error conexión MySQL: " . $conn->connect_error]);
    exit();
}

//PROCESAR LA CREACIÓN DE LA LISTA
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $user_id = $_POST['user_id'] ?? '';
    $nombre_lista = $_POST['nombre'] ?? '';

    if (!$user_id || !$nombre_lista) {
        echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios (ID o Nombre)"]);
        exit();
    }

    //Intentamos insertar la lista
    try {
        $stmt = $conn->prepare("INSERT INTO listas (user_id, nombre, created_at) VALUES (?, ?, NOW())");
        
        if (!$stmt) {
            throw new Exception("Error preparando SQL: " . $conn->error);
        }

        $stmt->bind_param("is", $user_id, $nombre_lista);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Lista creada correctamente"]);
        } else {
            throw new Exception("Error ejecutando SQL: " . $stmt->error);
        }

    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Excepción: " . $e->getMessage()]);
    }

} else {
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
}
?>