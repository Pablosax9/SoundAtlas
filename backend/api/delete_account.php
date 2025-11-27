<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$path = __DIR__ . '/../../config/db.php'; 
if (!file_exists($path)) { $path = __DIR__ . '/../config/db.php'; }
if (file_exists($path)) { require_once $path; } else { echo json_encode(["status"=>"error","message"=>"No db.php"]); exit(); }

$user_id = $_POST['user_id'] ?? '';

if (!$user_id) {
    echo json_encode(["status" => "error", "message" => "Falta ID"]);
    exit();
}

try {
    //Borramos el usuario. MySQL se encarga de borrar sus favoritos y listas en cascada.
    $stmt = $conn->prepare("DELETE FROM usuarios WHERE id = ?");
    $stmt->bind_param("i", $user_id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Cuenta eliminada"]);
    } else {
        throw new Exception($stmt->error);
    }

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>