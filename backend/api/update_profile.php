<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$path = __DIR__ . '/../../config/db.php'; 
if (!file_exists($path)) { $path = __DIR__ . '/../config/db.php'; }
if (file_exists($path)) { require_once $path; } else { echo json_encode(["status"=>"error","message"=>"No db.php"]); exit(); }

$user_id = $_POST['user_id'] ?? '';
$action = $_POST['action'] ?? ''; //'update_name' o 'change_password'

if (!$user_id || !$action) {
    echo json_encode(["status" => "error", "message" => "Faltan datos"]);
    exit();
}

try {
    if ($action === 'update_name') {
        //CAMBIAR NOMBRE
        $newName = $_POST['newName'] ?? '';
        if(strlen($newName) < 2) throw new Exception("El nombre es muy corto");

        $stmt = $conn->prepare("UPDATE usuarios SET userName = ? WHERE id = ?");
        $stmt->bind_param("si", $newName, $user_id);
        
        if($stmt->execute()){
            echo json_encode(["status" => "success", "message" => "Nombre actualizado"]);
        } else {
            throw new Exception("Error al actualizar");
        }
    } 
    elseif ($action === 'change_password') {
        //CAMBIAR CONTRASEÑA 
        $oldPass = $_POST['oldPass'] ?? '';
        $newPass = $_POST['newPass'] ?? '';

        if(!$oldPass || !$newPass) throw new Exception("Faltan contraseñas");

        //Obtener contraseña actual de la BD
        $stmt = $conn->prepare("SELECT userPassword FROM usuarios WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $res = $stmt->get_result();
        $user = $res->fetch_assoc();

        //Verificar que la contraseña antigua es correcta
        if (!password_verify($oldPass, $user['userPassword'])) {
            throw new Exception("La contraseña actual es incorrecta");
        }

        //Encriptar y guardar la nueva
        $hashNew = password_hash($newPass, PASSWORD_DEFAULT);
        $update = $conn->prepare("UPDATE usuarios SET userPassword = ? WHERE id = ?");
        $update->bind_param("si", $hashNew, $user_id);

        if($update->execute()){
            echo json_encode(["status" => "success", "message" => "Contraseña cambiada correctamente"]);
        } else {
            throw new Exception("Error al guardar contraseña");
        }
    }

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>