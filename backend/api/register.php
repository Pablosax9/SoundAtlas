<?php
header('Content-Type: application/json');
session_start();
require_once __DIR__ . '/../config/db.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $nombre = trim($_POST['userName'] ?? '');
    $email = trim($_POST['userEmail'] ?? '');
    $password = trim($_POST['userPassword'] ?? '');

    if (!$nombre || !$email || !$password) {
        echo json_encode(["status" => "error", "message" => "Todos los campos son obligatorios"]);
        exit();
    }

    //Verificar si el email ya existe
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE userEmail = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "El email ya está registrado"]);
        exit();
    }

    //Insertar usuario
    $hashPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO usuarios (userName, userEmail, userPassword, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("sss", $nombre, $email, $hashPassword);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Usuario registrado correctamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al registrar usuario"]);
    }

} else {
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
}
