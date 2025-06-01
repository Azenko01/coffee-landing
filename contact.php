<?php
// Set content type to JSON
header('Content-Type: application/json');

// Enable CORS if needed
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed. Please use POST.'
    ]);
    exit;
}

// Get and sanitize form data
$firstName = isset($_POST['firstName']) ? trim(htmlspecialchars($_POST['firstName'])) : '';
$lastName = isset($_POST['lastName']) ? trim(htmlspecialchars($_POST['lastName'])) : '';
$email = isset($_POST['email']) ? trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL)) : '';
$phone = isset($_POST['phone']) ? trim(htmlspecialchars($_POST['phone'])) : '';
$subject = isset($_POST['subject']) ? trim(htmlspecialchars($_POST['subject'])) : '';
$message = isset($_POST['message']) ? trim(htmlspecialchars($_POST['message'])) : '';

// Validation
$errors = [];

if (empty($firstName)) {
    $errors[] = 'First name is required.';
}

if (empty($lastName)) {
    $errors[] = 'Last name is required.';
}

if (empty($email)) {
    $errors[] = 'Email address is required.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}

if (empty($subject)) {
    $errors[] = 'Please select a subject.';
}

if (empty($message)) {
    $errors[] = 'Message is required.';
} elseif (strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters long.';
}

// If there are validation errors, return them
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Please fix the following errors:',
        'errors' => $errors
    ]);
    exit;
}

// Email configuration
$to = "info@brewhaven.com"; // Replace with your actual email
$emailSubject = "New Contact Form Submission - " . ucfirst($subject);

// Create email content
$emailContent = "New contact form submission from Brew Haven website:\n\n";
$emailContent .= "Name: {$firstName} {$lastName}\n";
$emailContent .= "Email: {$email}\n";

if (!empty($phone)) {
    $emailContent .= "Phone: {$phone}\n";
}

$emailContent .= "Subject: " . ucfirst($subject) . "\n";
$emailContent .= "Message:\n{$message}\n\n";
$emailContent .= "---\n";
$emailContent .= "Submitted on: " . date('Y-m-d H:i:s') . "\n";
$emailContent .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";

// Email headers
$headers = [
    "From: Brew Haven Website <noreply@brewhaven.com>",
    "Reply-To: {$firstName} {$lastName} <{$email}>",
    "X-Mailer: PHP/" . phpversion(),
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8"
];

// For development/testing purposes, always return success
// In production, uncomment the mail() function below
$mailSent = true;

// Uncomment this line for production use:
// $mailSent = mail($to, $emailSubject, $emailContent, implode("\r\n", $headers));

if ($mailSent) {
    // Log successful submission (optional)
    $logEntry = date('Y-m-d H:i:s') . " - Contact form submission from {$email}\n";
    @file_put_contents('contact_log.txt', $logEntry, FILE_APPEND | LOCK_EX);
    
    // Return success response
    echo json_encode([
        'status' => 'success',
        'message' => 'Thank you for your message! We\'ll get back to you within 24 hours.'
    ]);
} else {
    // Log failed submission (optional)
    $errorLog = date('Y-m-d H:i:s') . " - Failed to send email from {$email}\n";
    @file_put_contents('contact_errors.txt', $errorLog, FILE_APPEND | LOCK_EX);
    
    // Return error response
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Sorry, there was an error sending your message. Please try again later or contact us directly.'
    ]);
}

// Auto-responder email (optional)
function sendAutoResponder($email, $firstName) {
    $subject = "Thank you for contacting Brew Haven!";
    
    $message = "Dear {$firstName},\n\n";
    $message .= "Thank you for reaching out to Brew Haven! We've received your message and will get back to you within 24 hours.\n\n";
    $message .= "In the meantime, feel free to:\n";
    $message .= "- Visit us at 123 Coffee Street, Downtown District\n";
    $message .= "- Call us at (555) 123-4567\n";
    $message .= "- Follow us on social media for daily updates\n\n";
    $message .= "We look forward to serving you the perfect cup of coffee!\n\n";
    $message .= "Best regards,\n";
    $message .= "The Brew Haven Team\n\n";
    $message .= "---\n";
    $message .= "This is an automated response. Please do not reply to this email.";
    
    $headers = [
        "From: Brew Haven <info@brewhaven.com>",
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=UTF-8"
    ];
    
    return mail($email, $subject, $message, implode("\r\n", $headers));
}

// Uncomment the following line to enable auto-responder
// sendAutoResponder($email, $firstName);
?>
