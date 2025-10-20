<?php
include_once "../config/db.php";

$sql = "SHOW TABLES";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "Conexión correcta. Tablas encontradas:<br>";
    while ($row = $result->fetch_array()) {
        echo "- " . $row[0] . "<br>";
    }
} else {
    echo "Conexión correcta pero sin tablas.";
}

$conn->close();
?>
