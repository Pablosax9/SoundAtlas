<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$path = __DIR__ . '/../../config/db.php'; 
if (!file_exists($path)) { $path = __DIR__ . '/../config/db.php'; }
if (file_exists($path)) { require_once $path; } else { echo json_encode(["status"=>"error","message"=>"No db.php"]); exit(); }

$user_id = $_GET['user_id'] ?? '';

if (!$user_id) {
    echo json_encode(["status" => "error", "message" => "Falta ID"]);
    exit();
}

try {
    //Contar canciones
    $stmt1 = $conn->prepare("SELECT COUNT(*) as total FROM favoritos WHERE user_id = ?");
    $stmt1->bind_param("i", $user_id);
    $stmt1->execute();
    $canciones = $stmt1->get_result()->fetch_assoc()['total'];

    //Contar listas
    $stmt2 = $conn->prepare("SELECT COUNT(*) as total FROM listas WHERE user_id = ?");
    $stmt2->bind_param("i", $user_id);
    $stmt2->execute();
    $listas = $stmt2->get_result()->fetch_assoc()['total'];

    echo json_encode([
        "status" => "success", 
        "data" => ["canciones" => $canciones, "listas" => $listas]
    ]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>