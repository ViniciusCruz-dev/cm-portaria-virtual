<?php
/**
 * Recebe os pedidos de orçamento do site e envia por e-mail (SMTP autenticado).
 * Cada pedido também é gravado em um arquivo fora da pasta pública.
 * Configuração: /home/USUARIO/cm-config.php (modelo em servidor/hostgator/config.exemplo.php).
 */
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception as ErroEmail;
use PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/lib/PHPMailer/Exception.php';
require __DIR__ . '/lib/PHPMailer/PHPMailer.php';
require __DIR__ . '/lib/PHPMailer/SMTP.php';

const CIDADES = ['São José dos Campos', 'Jacareí', 'Caçapava', 'Taubaté', 'Pindamonhangaba', 'Outra cidade da região'];
const LIMITE_POR_HORA = 5;
const TEMPO_MINIMO_MS = 3000;

function querJson(): bool
{
    return stripos((string) ($_SERVER['HTTP_ACCEPT'] ?? ''), 'application/json') !== false;
}

function paginaSimples(string $titulo, string $texto): string
{
    $t = htmlspecialchars($titulo, ENT_QUOTES, 'UTF-8');
    $x = htmlspecialchars($texto, ENT_QUOTES, 'UTF-8');
    return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
        . '<title>' . $t . ' | CM Portaria Virtual</title>'
        . '<style>body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#0b2426;color:#ece8dd;font-family:Georgia,serif;text-align:center}'
        . 'h1{font-weight:400;letter-spacing:.06em;text-transform:uppercase}a{color:#b7d06f}</style></head>'
        . '<body><main><h1>' . $t . '</h1><p>' . $x . '</p><p><a href="/#contato">Voltar ao site</a></p></main></body></html>';
}

function responder(int $status, array $dados, string $titulo, string $texto): void
{
    http_response_code($status);
    header('Cache-Control: no-store');
    if (querJson()) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    } else {
        header('Content-Type: text/html; charset=utf-8');
        echo paginaSimples($titulo, $texto);
    }
    exit;
}

function texto(array $entrada, string $chave, int $maximo, bool $umaLinha = true): string
{
    $valor = isset($entrada[$chave]) && is_scalar($entrada[$chave]) ? trim((string) $entrada[$chave]) : '';
    $valor = (string) preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $valor);
    if ($umaLinha) {
        $valor = (string) preg_replace('/\s+/u', ' ', $valor);
    }
    return mb_substr($valor, 0, $maximo, 'UTF-8');
}

function validar(array $dados): array
{
    $erros = [];
    if (mb_strlen($dados['nome'], 'UTF-8') < 2) {
        $erros[] = 'nome';
    }
    $digitos = (string) preg_replace('/\D/', '', $dados['telefone']);
    if (strlen($digitos) < 10 || strlen($digitos) > 11) {
        $erros[] = 'telefone';
    }
    if ($dados['email'] !== '' && filter_var($dados['email'], FILTER_VALIDATE_EMAIL) === false) {
        $erros[] = 'email';
    }
    if (mb_strlen($dados['condominio'], 'UTF-8') < 2) {
        $erros[] = 'condominio';
    }
    if (!in_array($dados['cidade'], CIDADES, true)) {
        $erros[] = 'cidade';
    }
    if ($dados['unidades'] !== '' && (!ctype_digit($dados['unidades']) || (int) $dados['unidades'] < 1 || (int) $dados['unidades'] > 5000)) {
        $erros[] = 'unidades';
    }
    return $erros;
}

function linhasDoPedido(array $dados): array
{
    return [
        'Nome' => $dados['nome'],
        'Telefone / WhatsApp' => $dados['telefone'],
        'E-mail' => $dados['email'] !== '' ? $dados['email'] : '—',
        'Condomínio' => $dados['condominio'],
        'Cidade' => $dados['cidade'],
        'Unidades' => $dados['unidades'] !== '' ? $dados['unidades'] : '—',
        'Mensagem' => $dados['mensagem'] !== '' ? $dados['mensagem'] : '—',
        'Simulação' => $dados['simulacao'] !== '' ? $dados['simulacao'] : '—',
        'Recebido em' => date('d/m/Y H:i'),
    ];
}

function corpoHtml(array $linhas): string
{
    $html = '<h2 style="font-family:Georgia,serif;font-weight:400">Novo pedido de orçamento</h2>'
        . '<table cellpadding="8" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">';
    foreach ($linhas as $rotulo => $valor) {
        $html .= '<tr><th align="left" style="border-bottom:1px solid #ddd;color:#555">' . htmlspecialchars((string) $rotulo, ENT_QUOTES, 'UTF-8') . '</th>'
            . '<td style="border-bottom:1px solid #ddd">' . nl2br(htmlspecialchars((string) $valor, ENT_QUOTES, 'UTF-8')) . '</td></tr>';
    }
    return $html . '</table>';
}

function corpoTexto(array $linhas): string
{
    $saida = "Novo pedido de orçamento\n\n";
    foreach ($linhas as $rotulo => $valor) {
        $saida .= $rotulo . ': ' . $valor . "\n";
    }
    return $saida;
}

// ---------------------------------------------------------------- fluxo principal

$caminhoConfig = dirname(__DIR__, 2) . '/cm-config.php';
if (!is_file($caminhoConfig)) {
    error_log('[cm-orcamento] Configuração não encontrada: ' . $caminhoConfig);
    responder(500, ['ok' => false, 'error' => 'config'], 'Erro de configuração', 'Fale com a gente pelo WhatsApp (12) 98185-4159.');
}
$config = require $caminhoConfig;
date_default_timezone_set('America/Sao_Paulo');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    responder(405, ['ok' => false, 'error' => 'metodo'], 'Método não permitido', 'Use o formulário do site.');
}

$origem = (string) ($_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? ''));
$origemValida = false;
foreach ((array) $config['origens_permitidas'] as $permitida) {
    if ($origem !== '' && strpos($origem, (string) $permitida) === 0) {
        $origemValida = true;
        break;
    }
}
if (!$origemValida) {
    responder(403, ['ok' => false, 'error' => 'origem'], 'Acesso negado', 'Envie o pedido pelo formulário do site.');
}

$tipoConteudo = (string) ($_SERVER['CONTENT_TYPE'] ?? '');
if (stripos($tipoConteudo, 'application/json') !== false) {
    $entrada = json_decode((string) file_get_contents('php://input'), true);
    if (!is_array($entrada)) {
        $entrada = [];
    }
} else {
    $entrada = $_POST;
}

$dados = [
    'nome' => texto($entrada, 'nome', 80),
    'telefone' => texto($entrada, 'telefone', 20),
    'email' => texto($entrada, 'email', 120),
    'condominio' => texto($entrada, 'condominio', 100),
    'cidade' => texto($entrada, 'cidade', 60),
    'unidades' => texto($entrada, 'unidades', 6),
    'mensagem' => texto($entrada, 'mensagem', 1000, false),
    'simulacao' => texto($entrada, 'simulacao', 400),
];
$isca = texto($entrada, 'website', 200);
$decorrido = texto($entrada, 't', 12);

// Antispam silencioso: robôs recebem "sucesso" e nada é enviado.
if ($isca !== '' || ($decorrido !== '' && ctype_digit($decorrido) && (int) $decorrido < TEMPO_MINIMO_MS)) {
    responder(200, ['ok' => true], 'Pedido recebido', 'Obrigado! Entraremos em contato em breve.');
}

$erros = validar($dados);
if ($erros !== []) {
    responder(422, ['ok' => false, 'error' => 'validacao', 'campos' => $erros], 'Confira os dados', 'Volte e confira os campos do formulário.');
}

$pasta = rtrim((string) $config['pasta_dados'], '/');
if (!is_dir($pasta)) {
    @mkdir($pasta, 0750, true);
}

// Limite de envios por IP. O IP é guardado só como hash.
$hashIp = hash('sha256', (string) ($_SERVER['REMOTE_ADDR'] ?? '') . (string) $config['sal']);
$arquivoLimite = $pasta . '/limite-' . substr($hashIp, 0, 32) . '.json';
$agora = time();
$historico = is_file($arquivoLimite) ? json_decode((string) file_get_contents($arquivoLimite), true) : [];
$historico = array_values(array_filter(is_array($historico) ? $historico : [], function ($momento) use ($agora): bool {
    return is_int($momento) && $momento > $agora - 3600;
}));
if (count($historico) >= LIMITE_POR_HORA) {
    responder(429, ['ok' => false, 'error' => 'limite'], 'Muitos envios', 'Aguarde alguns minutos ou fale pelo WhatsApp (12) 98185-4159.');
}
$historico[] = $agora;
file_put_contents($arquivoLimite, json_encode($historico), LOCK_EX);

// Cópia de segurança de cada pedido.
$registro = $dados + ['recebido_em' => date('c'), 'ip_hash' => substr($hashIp, 0, 16)];
file_put_contents($pasta . '/leads.jsonl', json_encode($registro, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);

$linhas = linhasDoPedido($dados);
$email = new PHPMailer(true);
try {
    $smtp = (array) $config['smtp'];
    $email->isSMTP();
    $email->Host = (string) $smtp['host'];
    $email->SMTPAuth = true;
    $email->Username = (string) $smtp['usuario'];
    $email->Password = (string) $smtp['senha'];
    $email->SMTPSecure = (($smtp['seguranca'] ?? 'ssl') === 'tls') ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
    $email->Port = (int) $smtp['porta'];
    $email->CharSet = PHPMailer::CHARSET_UTF8;
    $email->setFrom((string) $config['remetente']['email'], (string) $config['remetente']['nome']);
    $email->addAddress((string) $config['destinatario']);
    if ($dados['email'] !== '') {
        $email->addReplyTo($dados['email'], $dados['nome']);
    }
    $email->Subject = 'Novo pedido de orçamento — ' . $dados['condominio'] . ' (' . $dados['cidade'] . ')';
    $email->isHTML(true);
    $email->Body = corpoHtml($linhas);
    $email->AltBody = corpoTexto($linhas);
    $email->send();
} catch (ErroEmail $erro) {
    error_log('[cm-orcamento] Falha no envio: ' . $email->ErrorInfo);
    responder(502, ['ok' => false, 'error' => 'envio'], 'Não conseguimos enviar agora', 'Seu pedido foi registrado. Se preferir, fale pelo WhatsApp (12) 98185-4159.');
}

responder(200, ['ok' => true], 'Pedido recebido', 'Obrigado! Nossa equipe vai entrar em contato em breve.');
