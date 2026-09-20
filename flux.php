<?php
header('Content-Type: application/json');

$prompt = $_POST['prompt'] ?? '';

$image = file_get_contents("https://image.pollinations.ai/prompt/" . urlencode($prompt));

echo json_encode([
    "status" => "ok",
    "image_base64" => base64_encode($image)
]);
