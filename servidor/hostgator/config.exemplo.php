<?php
/**
 * Copie este arquivo para FORA da pasta pública, com o nome cm-config.php:
 *   /home/SEU_USUARIO/cm-config.php   (o site fica em /home/SEU_USUARIO/public_html)
 * e preencha os valores. Nunca coloque a senha real no repositório.
 */
return [
    'smtp' => [
        'host' => 'mail.cmportariavirtual.com.br',
        'porta' => 465,
        'seguranca' => 'ssl', // 'ssl' (porta 465) ou 'tls' (porta 587)
        'usuario' => 'site@cmportariavirtual.com.br',
        'senha' => 'TROQUE_PELA_SENHA_DA_CAIXA',
    ],
    'remetente' => ['email' => 'site@cmportariavirtual.com.br', 'nome' => 'Site CM Portaria Virtual'],
    'destinatario' => 'contato@cmportariavirtual.com.br',
    'origens_permitidas' => ['https://www.cmportariavirtual.com.br', 'https://cmportariavirtual.com.br'],
    'pasta_dados' => __DIR__ . '/cm-dados',
    'sal' => 'TROQUE_POR_UM_TEXTO_ALEATORIO_LONGO',
];
