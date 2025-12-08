<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$path = __DIR__ . '/../../config/db.php'; 
if (!file_exists($path)) { $path = __DIR__ . '/../config/db.php'; }
if (file_exists($path)) { require_once $path; } else { echo json_encode(["status"=>"error","message"=>"No db.php"]); exit(); }

$fav_id = $_POST['fav_id'] ?? '';
$rating = $_POST['rating'] ?? '';

if (!$fav_id || $rating === '') { echo json_encode(["status" => "error", "message" => "Faltan datos"]); exit(); }

try {
    $stmt = $conn->prepare("UPDATE favoritos SET rating = ? WHERE id = ?");
    $stmt->bind_param("ii", $rating, $fav_id);
    if ($stmt->execute()) echo json_encode(["status" => "success"]);
    else throw new Exception($stmt->error);
} catch (Exception $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
?>