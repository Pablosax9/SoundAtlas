<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$path = __DIR__ . '/../../config/db.php'; 
if (!file_exists($path)) { $path = __DIR__ . '/../config/db.php'; }
if (file_exists($path)) { require_once $path; } else { echo json_encode(["status"=>"error","message"=>"No db.php"]); exit(); }

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $user_id = $_POST['user_id'] ?? '';
    $api_id = $_POST['api_id'] ?? '';
    $titulo = $_POST['titulo'] ?? '';
    $artista = $_POST['artista'] ?? '';
    $imagen = $_POST['imagen'] ?? '';
    
    //Obtenemos el ID de la lista
    $lista_id = isset($_POST['lista_id']) && $_POST['lista_id'] !== "" ? $_POST['lista_id'] : NULL;

    if (!$user_id || !$api_id) {
        echo json_encode(["status" => "error", "message" => "Faltan datos"]);
        exit();
    }

    try {
        //Comprobamos los duplicados (teniendo en cuenta la lista)
        //Si lista_id es NULL usamos "IS NULL", si es numero usamos "="
        $sql_check = "SELECT id FROM favoritos WHERE user_id = ? AND api_id = ? AND " . ($lista_id ? "lista_id = ?" : "lista_id IS NULL");
        $stmt = $conn->prepare($sql_check);
        
        if($lista_id) {
            $stmt->bind_param("isi", $user_id, $api_id, $lista_id);
        } else {
            $stmt->bind_param("is", $user_id, $api_id);
        }
        
        $stmt->execute();
        if ($stmt->get_result()->num_rows > 0) {
            echo json_encode(["status" => "exists", "message" => "Ya existe en esta lista"]);
            exit();
        }

        //Insertamos
        $tituloCompleto = $artista . " - " . $titulo;
        $tipo = 'cancion';

        $stmt = $conn->prepare("INSERT INTO favoritos (user_id, api_id, tipo, titulo, imagen_url, lista_id, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())");
        //"issssi": integer, string, string, string, string, integer
        $stmt->bind_param("issssi", $user_id, $api_id, $tipo, $tituloCompleto, $imagen, $lista_id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Guardado correctamente"]);
        } else {
            throw new Exception($stmt->error);
        }

    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>