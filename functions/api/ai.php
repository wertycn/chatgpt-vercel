<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');

$timeout = 30000; // 30秒超时

try {
    // 获取请求体
    $body = json_decode(file_get_contents('php://input'), true);
    $messages = $body['messages'] ?? [];
    $key = $body['key'] ?? getenv('OPENAI_API_KEY') ?? '';
    $temperature = $body['temperature'] ?? 0.7;
    $model = $body['model'] ?? 'gpt-3.5-turbo';
    
    // 准备请求数据
    $data = [
        'model' => $model,
        'messages' => array_map(function($k) {
            return [
                'role' => $k['role'],
                'content' => $k['content']
            ];
        }, $messages),
        'temperature' => $temperature,
        'stream' => true
    ];

    // 初始化 cURL
    $ch = curl_init('https://search.awsv.cn/v1/chat/completions');
    
    // 设置 cURL 选项
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => $timeout / 1000,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $key
        ]
    ]);

    // 执行请求
    $response = curl_exec($ch);
    
    if (curl_errno($ch)) {
        throw new Exception(curl_error($ch));
    }
    
    // 关闭 cURL 句柄
    curl_close($ch);

    // 输出响应
    echo $response;
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'error' => [
            'message' => $e->getMessage()
        ]
    ]);
}

// 刷新输出缓冲
ob_flush();
flush(); 