# Publicação na HostGator (produção)

> Ainda não usado: por enquanto o site roda só como demonstração no GitHub Pages.

1. Gere a versão de produção: `npm run build:producao`. A pasta `dist/` sai pronta, com `api/` e `.htaccess`.
2. No cPanel, faça backup completo de `public_html`.
3. Crie a caixa `site@cmportariavirtual.com.br` (E-mail → Contas de e-mail) e anote a senha.
4. Copie `servidor/hostgator/config.exemplo.php` para `/home/SEU_USUARIO/cm-config.php` (fora de `public_html`). Preencha a senha e o `sal` e confira o host e a porta SMTP indicados no cPanel.
5. Apague o conteúdo antigo de `public_html` e envie todo o conteúdo de `dist/`.
6. Envie um pedido pelo site e confira se chegou em contato@cmportariavirtual.com.br (olhe também o spam). Confira também `/home/SEU_USUARIO/cm-dados/leads.jsonl`.
7. Teste os redirecionamentos: `/index.html`, `/paginas/hikvision/cftv-hikvision.html` e `/recursos/guia-seguranca-predial-2025.html` devem levar à página inicial.
8. No Google Search Console, envie `https://www.cmportariavirtual.com.br/sitemap-index.xml`.
9. Antes de publicar: preencha razão social e CNPJ na Política de Privacidade (`src/pages/politica-de-privacidade.astro`) e peça a revisão de um advogado.
