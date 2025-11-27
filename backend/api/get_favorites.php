<?php
//CONFIGURACIÓN
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

//CONEXIÓN
$path = __DIR__ . '/../../config/db.php'; 
if (!file_exists($path)) { $path = __DIR__ . '/../config/db.php'; }
if (file_exists($path)) { require_once $path; } else { echo json_encode(["status"=>"error","message"=>"No db.php"]); exit(); }

//RECIBIR DATOS
$user_id = $_GET['user_id'] ?? '';
$lista_id = $_GET['lista_id'] ?? ''; // Nuevo parámetro

if (!$user_id) {
    echo json_encode(["status" => "error", "message" => "Falta ID usuario"]);
    exit();
}

try {
    //PREPARAR LA CONSULTA SEGÚN EL FILTRO
    $sql = "SELECT * FROM favoritos WHERE user_id = ?";
    $params = ["i", $user_id]; //Array para guardar tipos y valores dinámicamente

    if ($lista_id === 'general') {
        //Caso 1: Queremos ver solo los sueltos (Favoritos Generales)
        $sql .= " AND lista_id IS NULL";
    
    } elseif (is_numeric($lista_id)) {
        //Caso 2: Queremos ver una carpeta específica
        $sql .= " AND lista_id = ?";
        $params[0] .= "i"; //Añadimos otro entero a los tipos
        $params[] = $lista_id; //Añadimos el valor
    }
    //Caso 3: Si lista_id está vacío, no añadimos nada y mostramos TODO (útil para debug)

    $sql .= " ORDER BY created_at DESC";

    //EJECUTAR CONSULTA DINÁMICA
    $stmt = $conn->prepare($sql);
    
    //Usamos call_user_func_array para bind_param dinámico
    if (count($params) > 2) {
        $stmt->bind_param($params[0], $params[1], $params[2]);
    } else {
        $stmt->bind_param($params[0], $params[1]);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $favorites = [];
    while ($row = $result->fetch_assoc()) {
        $favorites[] = $row;
    }

    echo json_encode(["status" => "success", "data" => $favorites]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>