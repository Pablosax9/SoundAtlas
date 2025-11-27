<?php
header('Content-Type: application/json');
session_start();
require_once __DIR__ . '/../config/db.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
    exit();
}

//Recoger datos
$email = trim($_POST['userEmail'] ?? '');
$password = trim($_POST['userPassword'] ?? '');

if (!$email || !$password) {
    echo json_encode(["status" => "error", "message" => "Todos los campos son obligatorios"]);
    exit();
}

//Comprobar usuario
$stmt = $conn->prepare("SELECT id, userName, userEmail, userPassword FROM usuarios WHERE userEmail = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    if (password_verify($password, $user['userPassword'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['userName'] = $user['userName'];
        $_SESSION['userEmail'] = $user['userEmail'];

        echo json_encode([
            "status" => "success",
            "message" => "Login correcto",
            "user" => [
                "id" => $user['id'],
                "nombre" => $user['userName'],
                "email" => $user['userEmail']
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Contraseña incorrecta"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "No existe un usuario con ese email"]);
}
?>
