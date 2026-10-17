# CM Portaria Virtual — site

Landing page da CM Portaria Virtual, feita em [Astro](https://astro.build). Esta versão é uma **demonstração**: fica publicada no GitHub Pages, escondida dos buscadores, e o formulário não envia dados.

- Demonstração: https://viniciuscruz-dev.github.io/cm-portaria-virtual/
- Especificação: `docs/superpowers/specs/2026-10-17-site-cm-portaria-virtual-design.md`
- Textos do site: `src/content/site.ts`
- Créditos das fotos: `docs/creditos-imagens.md`

## Comandos

| Comando | O que faz |
|---|---|
| `npm install` | Instala as dependências (Node 22.22 ou superior) |
| `npm run dev` | Servidor de desenvolvimento |
| `npm test` | Testes unitários |
| `npm run test:e2e` | Testes no navegador (usa o Chrome instalado) |
| `npm run build` | Gera a demonstração (GitHub Pages) |
| `npm run build:producao` | Gera a versão da HostGator, com o PHP do formulário (veja `servidor/hostgator/LEIA-ME.md`) |

Cada push na `main` roda os testes e publica a demonstração automaticamente.
