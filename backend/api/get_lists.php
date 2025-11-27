<?php
//ACTIVAR REPORTE DE ERRORES
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

//BUSCAR CONEXIÓN (db.php)
$path = __DIR__ . '/../../config/db.php'; 

if (!file_exists($path)) {
    $path = __DIR__ . '/../config/db.php'; 
}

if (file_exists($path)) {
    require_once $path;
} else {
    echo json_encode(["status" => "error", "message" => "No se encuentra db.php"]);
    exit();
}

//VALIDAR CONEXIÓN
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Error MySQL: " . $conn->connect_error]);
    exit();
}

//RECIBIR DATOS
$user_id = $_GET['user_id'] ?? '';

if (!$user_id) {
    echo json_encode(["status" => "error", "message" => "Falta ID usuario"]);
    exit();
}

//CONSULTA
try {
    $stmt = $conn->prepare("SELECT * FROM listas WHERE user_id = ? ORDER BY created_at DESC");
    
    if (!$stmt) {
        throw new Exception("Error en la consulta SQL: " . $conn->error);
    }

    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $listas = [];
    while ($row = $result->fetch_assoc()) {
        $listas[] = $row;
    }

    //SIEMPRE devolvemos success, aunque el array esté vacío
    echo json_encode(["status" => "success", "data" => $listas]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>