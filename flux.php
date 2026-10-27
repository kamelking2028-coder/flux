<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://kamelking2028-coder.github.io');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function envoyerErreur($code, $message) {
    http_response_code($code);
    echo json_encode([
        'status' => 'error',
        'error' => $message
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    envoyerErreur(405, 'Méthode non autorisée.');
}

$prompt = trim($_POST['prompt'] ?? '');

if ($prompt === '') {
    envoyerErreur(400, 'La description de l’image est vide.');
}

// La clé doit être configurée dans les variables
// d’environnement du serveur, jamais dans GitHub.
$apiKey = getenv('POLLINATIONS_API_KEY');

if (!$apiKey) {
    envoyerErreur(500, 'La clé API Pollinations n’est pas configurée.');
}

$url = 'https://gen.pollinations.ai/image/'
     . rawurlencode($prompt)
     . '?model=flux&width=1024&height=1024';

$ch = curl_init($url);

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_CONNECTTIMEOUT => 15,
    CURLOPT_TIMEOUT => 120,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Accept: image/*'
    ]
]);

$image = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE) ?: '';
$curlError = curl_error($ch);

curl_close($ch);

if ($image === false) {
    error_log('Erreur cURL Pollinations : ' . $curlError);
    envoyerErreur(502, 'Impossible de contacter le service de génération.');
}

if ($httpCode < 200 || $httpCode >= 300) {
    error_log('Réponse Pollinations HTTP : ' . $httpCode);
    envoyerErreur(
        502,
        'Pollinations a refusé la requête (HTTP ' . $httpCode . ').'
    );
}

if (strpos($contentType, 'image/') !== 0 || strlen($image) === 0) {
    envoyerErreur(502, 'Le serveur n’a pas renvoyé une image valide.');
}

echo json_encode([
    'status' => 'ok',
    'mime_type' => explode(';', $contentType)[0],
    'image_base64' => base64_encode($image)
]);
