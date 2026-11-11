<?php
require_once __DIR__ . '/db_config.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDbConnection();

if ($pdo) {
    try {
        $stmt = $pdo->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        echo json_encode([
            'status' => 'connected',
            'message' => 'اتصال پایگاه داده با موفقیت برقرار است.',
            'data' => [
                'is_connected' => true,
                'database' => $DB_NAME,
                'tables_count' => count($tables),
                'tables' => $tables,
                'server_time' => date('Y-m-d H:i:s')
            ]
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'خطا در ارتباط با پایگاه داده: ' . $e->getMessage(),
            'data' => ['is_connected' => false]
        ], JSON_UNESCAPED_UNICODE);
    }
} else {
    echo json_encode([
        'status' => 'disconnected',
        'message' => 'پایگاه داده در هاست متصل نیست. سامانه در حالت آفلاین/لوکال کار می‌کند.',
        'data' => [
            'is_connected' => false,
            'hint' => 'مشخصات دیتابیس را در فایل public/api/db_config.php تنظیم نمایید.'
        ]
    ], JSON_UNESCAPED_UNICODE);
}
