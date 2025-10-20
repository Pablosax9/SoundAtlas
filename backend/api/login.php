<?php
include_once "../config/db.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM usuarios WHERE email=?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die(json_encode(["status" => "error", "message" => "Error en prepare: " . $conn->error]));
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user && password_verify($password, $user['password'])) {
        echo json_encode(["status" => "success", "user" => ["id"=>$user['id'], "nombre"=>$user['nombre'], "email"=>$user['email']]]);
    } else {
        echo json_encode(["status" => "error", "message" => "Email o contraseña incorrectos"]);
    }

    $stmt->close();
    $conn->close();
}
?>
