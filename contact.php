<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log incoming data for debugging
file_put_contents("debug.log", print_r($_POST, true) . print_r($_FILES, true), FILE_APPEND);

// Set CORS + JSON headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Create upload directory if missing
$uploadDir = __DIR__ . "/uploads/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Save contact form data
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$subject = $_POST['subject'] ?? '';
$message = $_POST['message'] ?? '';

$logEntry = "Name: $name\nEmail: $email\nSubject: $subject\nMessage: $message\n---\n";
file_put_contents("contact.txt", $logEntry, FILE_APPEND);

// Handle file upload
$uploadedFileName = null;

// Use the correct input name: 'attachment'
if (!empty($_FILES['attachment']['name'])) {
    $file = $_FILES['attachment'];

    if ($file['error'] === 0) {
        $safeName = time() . "_" . basename($file['name']);
        $targetPath = $uploadDir . $safeName;

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $uploadedFileName = $safeName;
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Failed to save uploaded file.'
            ]);
            exit;
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error during file upload.'
        ]);
        exit;
    }
}

// Respond with JSON
echo json_encode([
    'success' => true,
    'message' => 'Form received successfully!',
    'saved_file' => $uploadedFileName
]);
exit;
?>
