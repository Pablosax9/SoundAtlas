<?php
//CONFIGURACIÓN
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

//CONEXIÓN
$path = __DIR__ . '/../../config/db.php'; 
if (!file_exists($path)) { $path = __DIR__ . '/../config/db.php'; }
if (file_exists($path)) { require_once $path; } else { echo json_encode(["status"=>"error","message"=>"No db.php"]); exit(); }

//RECIBIR DATOS
$data = json_decode(file_get_contents("php://input"), true); // Para recibir JSON raw si hace falta
$fav_id = $_POST['fav_id'] ?? $data['fav_id'] ?? '';
$user_id = $_POST['user_id'] ?? $data['user_id'] ?? '';

if (!$fav_id || !$user_id) {
    echo json_encode(["status" => "error", "message" => "Faltan datos (ID favorito o Usuario)"]);
    exit();
}

try {
    //ELIMINAR (Asegurándonos de que pertenece a ese usuario por seguridad)
    $stmt = $conn->prepare("DELETE FROM favoritos WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $fav_id, $user_id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(["status" => "success", "message" => "Eliminado correctamente"]);
        } else {
            echo json_encode(["status" => "error", "message" => "No se encontró la canción o no tienes permiso"]);
        }
    } else {
        throw new Exception($stmt->error);
    }

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>