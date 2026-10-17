# Site CM Portaria Virtual v1 — Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir a landing page nova da CM Portaria Virtual em Astro e publicá-la como demonstração no GitHub Pages, deixando prontos os arquivos de produção da HostGator.

**Architecture:** O site é estático, gerado pelo Astro 7, sem framework de interface. Os textos ficam em `src/content/site.ts`, e a lógica pura (simulador, formulário, dados estruturados, consentimento) em `src/lib/`, coberta por testes unitários (Vitest). Cada seção é um componente `.astro` com estilo próprio e, quando precisa, um `<script>` pequeno; o comportamento é verificado por testes de ponta a ponta (Playwright, usando o Chrome instalado). O alvo da compilação (`DEPLOY_TARGET=ghpages|hostgator`) define `site`, `base`, indexação e o modo do formulário.

**Tech Stack:** Astro 7.4.0 (Fonts API, astro:assets, astro:env), TypeScript, CSS próprio, sharp, @astrojs/sitemap, Vitest 5, Playwright 1.64 + @axe-core/playwright, cross-env, php-parser (verificação de sintaxe), PHP 7.4+/PHPMailer 7.1.1 (produção), GitHub Actions + GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-17-site-cm-portaria-virtual-design.md`

## Global Constraints

- Node ≥ 22.22 (máquina local: 24.14). Astro fixado em `7.4.0`. Se a compilação falhar por erro do próprio Astro 7.4.0, use `7.3.8`.
- Todos os textos visíveis vêm de `src/content/site.ts`, exatamente como na spec. **Sem números da empresa, sem depoimentos e sem preços da CM.**
- Identificadores, classes CSS e mensagens em português. Código em TypeScript.
- **Demonstração:** `site` = `https://viniciuscruz-dev.github.io`, `base` = `/cm-portaria-virtual/`, `trailingSlash: 'always'`, meta `noindex, nofollow`, formulário em modo `demo` (sem rede).
- **Produção:** `site` = `https://www.cmportariavirtual.com.br`, `base` = `/`, indexável, formulário em modo `php` (`{base}api/orcamento.php`).
- Todo link interno usa `import.meta.env.BASE_URL`. Nunca use `/` fixo.
- **Área do morador:** `https://portal.cmportariavirtual.com.br`, na mesma aba.
- **WhatsApp:** número `5512981854159`. **0800:** `tel:08006727280`. **E-mail:** `contato@cmportariavirtual.com.br`.
- **Cores** (tokens): `--bg #0b2426`, `--bg-2 #0d2a2c`, `--bg-deep #081b1d`, `--text #ece8dd`, `--muted rgba(236,232,221,.68)`, `--accent #b7d06f`, `--accent-logo #90ba42`, `--on-accent #0b2426`.
- **Fontes** (Astro Fonts API, provedor Google, baixadas na compilação): Cormorant Garamond → `--font-serif`; Manrope → `--font-sans`; Great Vibes → `--font-script`.
- **Simulador:** porteiro diurno R$ 3.000, noturno R$ 3.800, fator de encargos 1,8. Portaria 24h = 2 diurnos + 2 noturnos; 12h diurna = 2 diurnos; 12h noturna = 2 noturnos.
- **Acessibilidade:** WCAG 2.2 AA; `prefers-reduced-motion` desliga animações.
- **Desempenho no celular:** LCP ≤ 2,5 s, CLS ≤ 0,05, JS próprio ≤ 35 KB gzip.
- **Repositório público:** nunca versionar `analise/`, `logos/`, `.superpowers/`, `.env*` nem credenciais.
- **Commits** terminam com `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`. O desenvolvimento acontece no ramo `feat/site-v1`, que é mesclado na `main` só na Task 15.
- Comandos de shell em Git Bash, a partir de `D:/projetos/sitecm`.

## Mapa de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`, `.gitignore` | Projeto, alvos de compilação, testes |
| `src/styles/tokens.css`, `src/styles/base.css` | Variáveis de design e estilos globais (pílulas, títulos, aparições) |
| `src/content/site.ts` | Todos os textos e dados |
| `src/lib/simulador.ts` | Cálculo e formatação do simulador (puro) |
| `src/lib/formulario.ts` | Máscara, validação e mensagens/links de WhatsApp (puro) |
| `src/lib/esquemas.ts` | JSON-LD LocalBusiness e FAQPage (puro) |
| `src/lib/consentimento.ts` | Leitura e gravação da escolha de cookies (puro) |
| `src/layouts/Base.astro` | `<head>` (SEO, fontes, JSON-LD), cabeçalho, rodapé, script de aparição |
| `src/components/*.astro` | Uma seção ou peça fixa por arquivo |
| `src/pages/index.astro`, `politica-de-privacidade.astro`, `404.astro`, `robots.txt.ts` | Páginas |
| `src/assets/logo-cm.png`, `src/assets/fotos/*.jpg` | Imagens otimizadas na compilação |
| `public/` | Favicons e imagem de compartilhamento (gerados por script) |
| `scripts/baixar-imagens.mjs`, `scripts/gerar-imagens-sociais.mjs`, `scripts/pos-build.mjs`, `scripts/verificar-php.mjs` | Utilitários |
| `servidor/hostgator/` | PHP do formulário, PHPMailer, `.htaccess`, configuração de exemplo, LEIA-ME |
| `tests/unit/*.test.ts`, `tests/e2e/*.spec.ts` | Testes |
| `.github/workflows/pages.yml` | Testes + publicação no GitHub Pages |

---

### Task 1: Fundação do projeto (Astro, estilos globais, imagens, testes)

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `vitest.config.ts`, `playwright.config.ts`
- Create: `src/styles/tokens.css`, `src/styles/base.css`, `src/layouts/Base.astro`, `src/pages/index.astro`
- Create: `scripts/baixar-imagens.mjs`, `src/assets/logo-cm.png`, `src/assets/fotos/*.jpg`, `docs/creditos-imagens.md`
- Test: `tests/e2e/fundacao.spec.ts`

**Interfaces:**
- Produces: `Base.astro` com props `{ titulo: string; descricao: string }`; classes globais `.container`, `.secao`, `.secao--alt`, `.rotulo`, `.texto`, `.pill`, `.pill--cheia`, `.manuscrito`, `.revelar`, `.sr-only`; variáveis CSS dos tokens e `--font-serif`, `--font-sans`, `--font-script`; `astro:env/client` exporta `DEPLOY_TARGET: 'ghpages' | 'hostgator'` e `GA_ID?: string`; imagens em `src/assets/fotos/`: `abertura-torre.jpg`, `sobre-entrada.jpg`, `servico-monitoramento.jpg`, `servico-acesso.jpg`, `servico-app.jpg`, `servico-audio.jpg`, `servico-relatorios.jpg`, `servico-emergencias.jpg`, `central-hall.jpg`, `central-perimetro.jpg`.

- [ ] **Step 1: Iniciar o git e o ramo de trabalho**

```bash
cd D:/projetos/sitecm
git init -b main
git checkout -b feat/site-v1
```

- [ ] **Step 2: Criar `package.json` e instalar as dependências**

`package.json`:
```json
{
  "name": "cm-portaria-virtual",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "build:producao": "cross-env DEPLOY_TARGET=hostgator astro build && node scripts/pos-build.mjs",
    "preview": "astro preview",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "verificar:php": "node scripts/verificar-php.mjs"
  }
}
```

```bash
npm install astro@7.4.0 @astrojs/sitemap@3.7.4 sharp@0.35.5
npm install -D vitest@5.0.5 @playwright/test@1.64.1 @axe-core/playwright@4.14.0 cross-env@10.1.0 php-parser@3.7.0
```
Expected: `node_modules/` e `package-lock.json` criados, sem erros.

- [ ] **Step 3: Arquivos de configuração**

`astro.config.mjs`:
```js
// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const ALVOS = {
  ghpages: { site: 'https://viniciuscruz-dev.github.io', base: '/cm-portaria-virtual/' },
  hostgator: { site: 'https://www.cmportariavirtual.com.br', base: '/' },
};
const alvo = process.env.DEPLOY_TARGET === 'hostgator' ? 'hostgator' : 'ghpages';

export default defineConfig({
  site: ALVOS[alvo].site,
  base: ALVOS[alvo].base,
  trailingSlash: 'always',
  integrations: alvo === 'hostgator' ? [sitemap()] : [],
  env: {
    schema: {
      DEPLOY_TARGET: envField.enum({ context: 'client', access: 'public', values: ['ghpages', 'hostgator'], default: 'ghpages' }),
      GA_ID: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
  fonts: [
    { provider: fontProviders.google(), name: 'Cormorant Garamond', cssVariable: '--font-serif', weights: [300, 400, 500], styles: ['normal'], subsets: ['latin'], fallbacks: ['Georgia', 'serif'] },
    { provider: fontProviders.google(), name: 'Manrope', cssVariable: '--font-sans', weights: [300, 400, 500, 600], styles: ['normal'], subsets: ['latin'], fallbacks: ['system-ui', 'sans-serif'] },
    { provider: fontProviders.google(), name: 'Great Vibes', cssVariable: '--font-script', weights: [400], styles: ['normal'], subsets: ['latin'], fallbacks: ['cursive'] },
  ],
});
```

`tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "node_modules"]
}
```

`.gitignore`:
```
node_modules/
dist/
.astro/
analise/
logos/
.superpowers/
.env
.env.*
test-results/
playwright-report/
lighthouse*.json
*.log
```

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
```

`playwright.config.ts`:
```ts
import { defineConfig, devices } from '@playwright/test';

const PORTA = 4321;
const BASE = '/cm-portaria-virtual/';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORTA}${BASE}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1440, height: 900 } } },
    { name: 'celular', use: { ...devices['Pixel 7'], channel: 'chrome', viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORTA}`,
    url: `http://localhost:${PORTA}${BASE}`,
    reuseExistingServer: false,
    timeout: 240_000,
  },
});
```

- [ ] **Step 4: Escrever o teste de fumaça (vai falhar)**

`tests/e2e/fundacao.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('página inicial abre com idioma, título e noindex da demonstração', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveTitle(/CM Portaria Virtual/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
});
```

- [ ] **Step 5: Rodar e ver falhar**

Run: `npx playwright test tests/e2e/fundacao.spec.ts`
Expected: FAIL. O build quebra ou a página não existe, porque ainda não há `src/pages`.

- [ ] **Step 6: Estilos globais**

`src/styles/tokens.css`:
```css
:root {
  --bg: #0b2426;
  --bg-2: #0d2a2c;
  --bg-deep: #081b1d;
  --line: rgba(236, 232, 221, 0.13);
  --line-strong: rgba(236, 232, 221, 0.28);
  --text: #ece8dd;
  --muted: rgba(236, 232, 221, 0.68);
  --accent: #b7d06f;
  --accent-logo: #90ba42;
  --on-accent: #0b2426;
  --gutter: clamp(20px, 5vw, 64px);
  --max: 1240px;
  --section-y: clamp(80px, 11vw, 136px);
  --radius-pill: 999px;
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --header-h: 88px;
}

@media (max-width: 1099px) {
  :root {
    --header-h: 72px;
  }
}
```

`src/styles/base.css`:
```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
  scroll-padding-top: var(--header-h);
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  font-weight: 300;
  font-size: 16px;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

body:has(dialog[open]) {
  overflow: hidden;
}

[hidden] {
  display: none !important;
}

img,
svg,
picture {
  display: block;
  max-width: 100%;
  height: auto;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
select,
textarea {
  font: inherit;
  color: inherit;
}

h1,
h2,
h3,
p,
ul,
ol,
dl,
dd,
figure {
  margin: 0;
}

ul[role='list'],
ol[role='list'] {
  list-style: none;
  padding: 0;
}

::selection {
  background: var(--accent);
  color: var(--on-accent);
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.pular {
  position: absolute;
  left: 16px;
  top: -100px;
  z-index: 1000;
  padding: 10px 18px;
  border-radius: var(--radius-pill);
  background: var(--accent);
  color: var(--on-accent);
  font-weight: 500;
}

.pular:focus {
  top: 16px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.container {
  width: 100%;
  max-width: calc(var(--max) + 2 * var(--gutter));
  margin-inline: auto;
  padding-inline: var(--gutter);
}

.secao {
  padding-block: var(--section-y);
  border-top: 1px solid var(--line);
}

.secao--alt {
  background: var(--bg-2);
}

.rotulo {
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
}

.texto {
  max-width: 34em;
  font-size: 16px;
  line-height: 1.75;
  color: var(--muted);
}

.texto + .texto {
  margin-top: 1.1em;
}

.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 28px;
  border: 1px solid currentColor;
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.3s var(--ease), color 0.3s var(--ease), border-color 0.3s var(--ease);
}

.pill:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.pill--cheia {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--on-accent);
}

.pill--cheia:hover {
  border-color: var(--text);
  background: var(--text);
  color: var(--on-accent);
}

.manuscrito {
  display: inline-block;
  font-family: var(--font-script);
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0;
  text-transform: none;
  color: var(--accent);
  transform: rotate(-3deg);
}

.js-revelar .revelar {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s var(--ease), transform 0.6s var(--ease);
}

.js-revelar .revelar.is-visivel {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 7: Logo e fotos**

Copie o logo transparente do site atual:
```bash
mkdir -p src/assets
cp analise/site-original/imagens/logocm.png src/assets/logo-cm.png
```

`scripts/baixar-imagens.mjs`:
```js
// Baixa as fotos de banco (licenças Unsplash/Pexels: uso comercial gratuito) e gera os créditos.
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DESTINO = 'src/assets/fotos';

function pexels(id) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2000`;
}

const FOTOS = [
  { arquivo: 'abertura-torre.jpg', url: 'https://images.unsplash.com/photo-1755896409740-0f28922c0997?w=2400&q=80&fm=jpg&fit=crop', pagina: 'https://unsplash.com/photos/tall-apartment-building-with-glowing-windows-at-night-KhRTqpJUWtA', licenca: 'Unsplash License', uso: 'Abertura; câmera "Fachada"' },
  { arquivo: 'sobre-entrada.jpg', url: pexels(34973377), pagina: 'https://www.pexels.com/photo/modern-building-entrance-at-night-with-cleaner-34973377/', licenca: 'Pexels License', uso: 'Sobre; câmera "Portão social"' },
  { arquivo: 'servico-monitoramento.jpg', url: pexels(3205737), pagina: 'https://www.pexels.com/photo/white-surveillance-camera-3205737/', licenca: 'Pexels License', uso: 'Serviço: Monitoramento 24 horas' },
  { arquivo: 'servico-acesso.jpg', url: pexels(37538043), pagina: 'https://www.pexels.com/photo/modern-fingerprint-access-control-system-37538043/', licenca: 'Pexels License', uso: 'Serviço: Controle de acesso facial' },
  { arquivo: 'servico-app.jpg', url: pexels(6943441), pagina: 'https://www.pexels.com/photo/a-person-using-mobile-phone-6943441/', licenca: 'Pexels License', uso: 'Serviço: Aplicativo CM Portaria' },
  { arquivo: 'servico-audio.jpg', url: pexels(9461758), pagina: 'https://www.pexels.com/photo/man-in-black-long-sleeve-shirt-pressing-a-button-on-intercom-9461758/', licenca: 'Pexels License', uso: 'Serviço: Comunicação por áudio' },
  { arquivo: 'servico-relatorios.jpg', url: pexels(17279853), pagina: 'https://www.pexels.com/photo/graphics-on-the-laptop-screen-17279853/', licenca: 'Pexels License', uso: 'Serviço: Relatórios gerenciais' },
  { arquivo: 'servico-emergencias.jpg', url: pexels(14984574), pagina: 'https://www.pexels.com/photo/police-car-driving-on-night-road-14984574/', licenca: 'Pexels License', uso: 'Serviço: Resposta a emergências' },
  { arquivo: 'central-hall.jpg', url: pexels(31737862), pagina: 'https://www.pexels.com/photo/modern-house-entrance-at-night-illuminated-31737862/', licenca: 'Pexels License', uso: 'Câmera "Hall"' },
  { arquivo: 'central-perimetro.jpg', url: pexels(18362805), pagina: 'https://www.pexels.com/photo/modern-apartment-building-18362805/', licenca: 'Pexels License', uso: 'Câmera "Perímetro"' },
];

await mkdir(DESTINO, { recursive: true });
for (const foto of FOTOS) {
  const resposta = await fetch(foto.url);
  if (!resposta.ok) throw new Error(`Falha ao baixar ${foto.arquivo}: HTTP ${resposta.status}`);
  await writeFile(join(DESTINO, foto.arquivo), Buffer.from(await resposta.arrayBuffer()));
  console.log(`ok  ${foto.arquivo}`);
}

const linhas = [
  '# Créditos das imagens',
  '',
  'Fotos de banco usadas provisoriamente até a chegada das fotos reais da CM.',
  'As licenças Unsplash e Pexels permitem uso comercial gratuito, sem atribuição obrigatória.',
  '',
  '| Arquivo | Uso no site | Origem | Licença |',
  '|---|---|---|---|',
  ...FOTOS.map((f) => `| \`${f.arquivo}\` | ${f.uso} | ${f.pagina} | ${f.licenca} |`),
  '',
];
await writeFile('docs/creditos-imagens.md', linhas.join('\n'));
console.log('Créditos gravados em docs/creditos-imagens.md');
```

Run: `node scripts/baixar-imagens.mjs`
Expected: 10 linhas `ok  …jpg` e o arquivo `docs/creditos-imagens.md`.

- [ ] **Step 8: Layout base e página inicial provisória**

`src/layouts/Base.astro`:
```astro
---
import { Font } from 'astro:assets';
import { DEPLOY_TARGET } from 'astro:env/client';
import '../styles/tokens.css';
import '../styles/base.css';

interface Props {
  titulo: string;
  descricao: string;
}

const { titulo, descricao } = Astro.props;
const naoIndexar = DEPLOY_TARGET === 'ghpages';
---

<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{titulo}</title>
    <meta name="description" content={descricao} />
    {naoIndexar && <meta name="robots" content="noindex, nofollow" />}
    <meta name="theme-color" content="#0b2426" />
    <Font cssVariable="--font-serif" preload={[{ weight: 400 }]} />
    <Font cssVariable="--font-sans" preload={[{ weight: 300 }]} />
    <Font cssVariable="--font-script" />
  </head>
  <body>
    <a class="pular" href="#conteudo">Pular para o conteúdo</a>
    <main id="conteudo"><slot /></main>
    <script>
      const revelaveis = document.querySelectorAll('.revelar');
      const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (revelaveis.length > 0 && !reduzir && 'IntersectionObserver' in window) {
        document.documentElement.classList.add('js-revelar');
        const observador = new IntersectionObserver(
          (entradas) => {
            for (const entrada of entradas) {
              if (entrada.isIntersecting) {
                entrada.target.classList.add('is-visivel');
                observador.unobserve(entrada.target);
              }
            }
          },
          { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
        );
        revelaveis.forEach((elemento) => observador.observe(elemento));
      }
    </script>
  </body>
</html>
```

`src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
---

<Base titulo="CM Portaria Virtual" descricao="Portaria virtual para condomínios em São José dos Campos.">
  <h1>CM Portaria Virtual</h1>
</Base>
```

- [ ] **Step 9: Rodar e ver passar**

Run: `npx playwright test tests/e2e/fundacao.spec.ts`
Expected: PASS (2 testes: desktop e celular). Se o build reclamar dos pesos da fonte, confira os nomes no Google Fonts e rode de novo.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore: base do projeto Astro, estilos globais e fotos

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Lógica do simulador

**Files:**
- Create: `src/lib/simulador.ts`
- Test: `tests/unit/simulador.test.ts`

**Interfaces:**
- Produces:
  - `type TipoPortaria = '24h' | '12h-diurna' | '12h-noturna'`
  - `interface Premissas { custoDiurno: number; custoNoturno: number; fatorEncargos: number }`
  - `PREMISSAS_PADRAO: Premissas`
  - `ROTULO_TIPO: Record<TipoPortaria, string>`
  - `custoMensal(tipo: TipoPortaria, premissas?: Premissas): number`
  - `resultado(mensal: number, unidades: number): { mensal: number; porUnidade: number; anual: number }`
  - `formatarReais(valor: number): string`
  - `descricaoPorteiros(tipo: TipoPortaria): string`
  - `resumoSimulacao(e: { tipo: TipoPortaria; unidades: number; mensal: number; informado: boolean }): string`

- [ ] **Step 1: Escrever os testes**

`tests/unit/simulador.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { custoMensal, descricaoPorteiros, formatarReais, PREMISSAS_PADRAO, resultado, resumoSimulacao } from '../../src/lib/simulador';

describe('custoMensal', () => {
  it('portaria 24 horas com os valores padrão custa R$ 24.480', () => {
    expect(custoMensal('24h')).toBe(24480);
  });
  it('portaria 12h diurna usa 2 porteiros diurnos', () => {
    expect(custoMensal('12h-diurna')).toBe(10800);
  });
  it('portaria 12h noturna usa 2 porteiros noturnos', () => {
    expect(custoMensal('12h-noturna')).toBe(13680);
  });
  it('aceita custos ajustados pelo síndico', () => {
    expect(custoMensal('24h', { ...PREMISSAS_PADRAO, custoDiurno: 2500 })).toBe(22680);
  });
});

describe('resultado', () => {
  it('divide pelo número de unidades e multiplica por 12 meses', () => {
    expect(resultado(24480, 80)).toEqual({ mensal: 24480, porUnidade: 306, anual: 293760 });
  });
  it('nunca divide por zero', () => {
    expect(resultado(1000, 0).porUnidade).toBe(1000);
  });
});

describe('formatarReais', () => {
  it('usa o formato brasileiro, sem centavos', () => {
    expect(formatarReais(24480)).toBe('R$ 24.480');
    expect(formatarReais(306.4)).toBe('R$ 306');
  });
});

describe('descricaoPorteiros', () => {
  it('descreve a equipe de cada tipo', () => {
    expect(descricaoPorteiros('24h')).toBe('2 diurnos + 2 noturnos');
    expect(descricaoPorteiros('12h-diurna')).toBe('2 diurnos');
    expect(descricaoPorteiros('12h-noturna')).toBe('2 noturnos');
  });
});

describe('resumoSimulacao', () => {
  it('descreve a estimativa', () => {
    expect(resumoSimulacao({ tipo: '24h', unidades: 80, mensal: 24480, informado: false })).toBe(
      'Simulação: portaria 24 horas (2 diurnos + 2 noturnos), 80 unidades. Custo estimado: R$ 24.480/mês (R$ 306 por unidade).',
    );
  });
  it('descreve o valor informado pelo síndico', () => {
    expect(resumoSimulacao({ tipo: '24h', unidades: 100, mensal: 20000, informado: true })).toBe(
      'Simulação: valor atual informado pelo síndico, 100 unidades. Custo informado: R$ 20.000/mês (R$ 200 por unidade).',
    );
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run tests/unit/simulador.test.ts`
Expected: FAIL, com o erro de módulo não encontrado (`src/lib/simulador`).

- [ ] **Step 3: Implementar**

`src/lib/simulador.ts`:
```ts
/** Cálculo do custo da portaria atual. Valores informados pela CM (site antigo). */

export type TipoPortaria = '24h' | '12h-diurna' | '12h-noturna';

export interface Premissas {
  custoDiurno: number;
  custoNoturno: number;
  fatorEncargos: number;
}

export interface ResultadoSimulacao {
  mensal: number;
  porUnidade: number;
  anual: number;
}

export const PREMISSAS_PADRAO: Premissas = { custoDiurno: 3000, custoNoturno: 3800, fatorEncargos: 1.8 };

const PORTEIROS: Record<TipoPortaria, { diurnos: number; noturnos: number }> = {
  '24h': { diurnos: 2, noturnos: 2 },
  '12h-diurna': { diurnos: 2, noturnos: 0 },
  '12h-noturna': { diurnos: 0, noturnos: 2 },
};

export const ROTULO_TIPO: Record<TipoPortaria, string> = {
  '24h': '24 horas',
  '12h-diurna': '12h diurna',
  '12h-noturna': '12h noturna',
};

const formatador = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

export function custoMensal(tipo: TipoPortaria, premissas: Premissas = PREMISSAS_PADRAO): number {
  const { diurnos, noturnos } = PORTEIROS[tipo];
  return Math.round((diurnos * premissas.custoDiurno + noturnos * premissas.custoNoturno) * premissas.fatorEncargos);
}

export function resultado(mensal: number, unidades: number): ResultadoSimulacao {
  const divisor = Math.max(1, Math.round(unidades));
  return { mensal: Math.round(mensal), porUnidade: Math.round(mensal / divisor), anual: Math.round(mensal * 12) };
}

export function formatarReais(valor: number): string {
  return `R$ ${formatador.format(Math.round(valor))}`;
}

export function descricaoPorteiros(tipo: TipoPortaria): string {
  const { diurnos, noturnos } = PORTEIROS[tipo];
  const partes: string[] = [];
  if (diurnos > 0) partes.push(`${diurnos} diurnos`);
  if (noturnos > 0) partes.push(`${noturnos} noturnos`);
  return partes.join(' + ');
}

export function resumoSimulacao(e: { tipo: TipoPortaria; unidades: number; mensal: number; informado: boolean }): string {
  const r = resultado(e.mensal, e.unidades);
  const descricao = e.informado
    ? `valor atual informado pelo síndico, ${e.unidades} unidades. Custo informado`
    : `portaria ${ROTULO_TIPO[e.tipo]} (${descricaoPorteiros(e.tipo)}), ${e.unidades} unidades. Custo estimado`;
  return `Simulação: ${descricao}: ${formatarReais(r.mensal)}/mês (${formatarReais(r.porUnidade)} por unidade).`;
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run tests/unit/simulador.test.ts`
Expected: PASS (10 testes).

- [ ] **Step 5: Commit**

```bash
git add src/lib/simulador.ts tests/unit/simulador.test.ts
git commit -m "$(cat <<'EOF'
feat: cálculo do simulador de custo da portaria

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Lógica do formulário

**Files:**
- Create: `src/lib/formulario.ts`
- Test: `tests/unit/formulario.test.ts`

**Interfaces:**
- Produces:
  - `CIDADES_FORM: readonly string[]` (as 5 cidades + "Outra cidade da região")
  - `type CampoPedido = 'nome' | 'telefone' | 'email' | 'condominio' | 'cidade' | 'unidades' | 'mensagem'`
  - `interface DadosPedido { nome; telefone; email; condominio; cidade; unidades; mensagem; simulacao: string }`
  - `type ErrosPedido = Partial<Record<CampoPedido, string>>`
  - `CAMPOS_PEDIDO: CampoPedido[]`
  - `mascararTelefone(valor: string): string`
  - `validarCampo(campo: CampoPedido, valor: string): string | undefined`
  - `validarPedido(dados: DadosPedido): ErrosPedido`
  - `linkWhatsApp(numero: string, texto: string): string`
  - `mensagemWhatsAppSucesso(d: DadosPedido): string`
  - `mensagemWhatsAppCompleta(d: DadosPedido): string`

- [ ] **Step 1: Escrever os testes**

`tests/unit/formulario.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import {
  linkWhatsApp,
  mascararTelefone,
  mensagemWhatsAppCompleta,
  mensagemWhatsAppSucesso,
  validarCampo,
  validarPedido,
  type DadosPedido,
} from '../../src/lib/formulario';

const valido: DadosPedido = {
  nome: 'Ana Souza',
  telefone: '(12) 98185-4159',
  email: 'ana@exemplo.com',
  condominio: 'Residencial Aurora',
  cidade: 'São José dos Campos',
  unidades: '80',
  mensagem: '',
  simulacao: '',
};

describe('mascararTelefone', () => {
  it('formata celular com 11 dígitos', () => expect(mascararTelefone('12981854159')).toBe('(12) 98185-4159'));
  it('formata fixo com 10 dígitos', () => expect(mascararTelefone('1239211234')).toBe('(12) 3921-1234'));
  it('formata enquanto a pessoa digita', () => {
    expect(mascararTelefone('1')).toBe('(1');
    expect(mascararTelefone('129')).toBe('(12) 9');
  });
  it('ignora letras e corta o excesso', () => expect(mascararTelefone('12a98185415999')).toBe('(12) 98185-4159'));
  it('vazio continua vazio', () => expect(mascararTelefone('')).toBe(''));
});

describe('validarPedido', () => {
  it('aceita um pedido completo', () => expect(validarPedido(valido)).toEqual({}));
  it('exige nome, telefone, condomínio e cidade', () => {
    const erros = validarPedido({ ...valido, nome: '', telefone: '', condominio: '', cidade: '' });
    expect(Object.keys(erros).sort()).toEqual(['cidade', 'condominio', 'nome', 'telefone']);
  });
  it('e-mail é opcional, mas precisa ser válido se preenchido', () => {
    expect(validarPedido({ ...valido, email: '' })).toEqual({});
    expect(validarPedido({ ...valido, email: 'ana@' }).email).toBe('Confira o e-mail.');
  });
  it('unidades precisa ser um número entre 1 e 5000', () => {
    expect(validarPedido({ ...valido, unidades: '' })).toEqual({});
    expect(validarPedido({ ...valido, unidades: '0' }).unidades).toBe('Use um número entre 1 e 5000.');
    expect(validarPedido({ ...valido, unidades: '5001' }).unidades).toBe('Use um número entre 1 e 5000.');
    expect(validarPedido({ ...valido, unidades: 'abc' }).unidades).toBe('Use um número entre 1 e 5000.');
  });
  it('cidade precisa ser uma das opções', () => {
    expect(validarPedido({ ...valido, cidade: 'Rio de Janeiro' }).cidade).toBe('Escolha a cidade.');
  });
  it('mensagem tem limite de 1000 caracteres', () => {
    expect(validarPedido({ ...valido, mensagem: 'a'.repeat(1001) }).mensagem).toBe('Use até 1000 caracteres.');
  });
});

describe('validarCampo', () => {
  it('telefone curto pede o DDD', () => expect(validarCampo('telefone', '(12) 9818')).toBe('Informe um telefone com DDD.'));
  it('campo válido não tem mensagem', () => expect(validarCampo('nome', 'Ana')).toBeUndefined());
});

describe('links do WhatsApp', () => {
  it('monta a URL com o texto codificado', () => {
    expect(linkWhatsApp('5512981854159', 'Olá! Tudo bem?')).toBe('https://wa.me/5512981854159?text=Ol%C3%A1!%20Tudo%20bem%3F');
  });
  it('a mensagem de sucesso cita nome, condomínio e cidade', () => {
    expect(mensagemWhatsAppSucesso(valido)).toBe(
      'Olá! Acabei de pedir um orçamento pelo site. Sou Ana Souza, do condomínio Residencial Aurora (São José dos Campos).',
    );
  });
  it('a mensagem completa leva todos os campos preenchidos', () => {
    const texto = mensagemWhatsAppCompleta({ ...valido, mensagem: 'Temos 2 portões.', simulacao: 'Simulação: teste.' });
    expect(texto).toBe(
      [
        'Olá! Gostaria de um orçamento de portaria virtual.',
        'Nome: Ana Souza',
        'Telefone: (12) 98185-4159',
        'E-mail: ana@exemplo.com',
        'Condomínio: Residencial Aurora',
        'Cidade: São José dos Campos',
        'Unidades: 80',
        'Mensagem: Temos 2 portões.',
        'Simulação: teste.',
      ].join('\n'),
    );
  });
  it('a mensagem completa omite campos vazios e não repete a simulação', () => {
    const texto = mensagemWhatsAppCompleta({ ...valido, email: '', unidades: '', mensagem: 'Simulação: teste.', simulacao: 'Simulação: teste.' });
    expect(texto).not.toContain('E-mail');
    expect(texto).not.toContain('Unidades');
    expect(texto.match(/Simulação: teste\./g)).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run tests/unit/formulario.test.ts`
Expected: FAIL, com o erro de módulo não encontrado.

- [ ] **Step 3: Implementar**

`src/lib/formulario.ts`:
```ts
/** Regras do formulário de orçamento, compartilhadas pelo navegador e pelos testes. */

export const CIDADES_FORM = ['São José dos Campos', 'Jacareí', 'Caçapava', 'Taubaté', 'Pindamonhangaba', 'Outra cidade da região'] as const;

export type CampoPedido = 'nome' | 'telefone' | 'email' | 'condominio' | 'cidade' | 'unidades' | 'mensagem';

export interface DadosPedido {
  nome: string;
  telefone: string;
  email: string;
  condominio: string;
  cidade: string;
  unidades: string;
  mensagem: string;
  simulacao: string;
}

export type ErrosPedido = Partial<Record<CampoPedido, string>>;

export const CAMPOS_PEDIDO: CampoPedido[] = ['nome', 'telefone', 'email', 'condominio', 'cidade', 'unidades', 'mensagem'];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, '');
}

export function mascararTelefone(valor: string): string {
  const d = apenasDigitos(valor).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function validarCampo(campo: CampoPedido, valorBruto: string): string | undefined {
  const valor = valorBruto.trim();
  switch (campo) {
    case 'nome':
      return valor.length < 2 || valor.length > 80 ? 'Informe seu nome.' : undefined;
    case 'telefone': {
      const digitos = apenasDigitos(valor).length;
      return digitos < 10 || digitos > 11 ? 'Informe um telefone com DDD.' : undefined;
    }
    case 'email':
      return valor !== '' && !EMAIL.test(valor) ? 'Confira o e-mail.' : undefined;
    case 'condominio':
      return valor.length < 2 || valor.length > 100 ? 'Informe o nome do condomínio.' : undefined;
    case 'cidade':
      return (CIDADES_FORM as readonly string[]).includes(valor) ? undefined : 'Escolha a cidade.';
    case 'unidades': {
      if (valor === '') return undefined;
      const numero = Number(valor);
      return /^\d+$/.test(valor) && numero >= 1 && numero <= 5000 ? undefined : 'Use um número entre 1 e 5000.';
    }
    case 'mensagem':
      return valor.length > 1000 ? 'Use até 1000 caracteres.' : undefined;
    default:
      return undefined;
  }
}

export function validarPedido(dados: DadosPedido): ErrosPedido {
  const erros: ErrosPedido = {};
  for (const campo of CAMPOS_PEDIDO) {
    const mensagem = validarCampo(campo, dados[campo]);
    if (mensagem) erros[campo] = mensagem;
  }
  return erros;
}

export function linkWhatsApp(numero: string, texto: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

export function mensagemWhatsAppSucesso(d: DadosPedido): string {
  return `Olá! Acabei de pedir um orçamento pelo site. Sou ${d.nome}, do condomínio ${d.condominio} (${d.cidade}).`;
}

export function mensagemWhatsAppCompleta(d: DadosPedido): string {
  const linhas = ['Olá! Gostaria de um orçamento de portaria virtual.', `Nome: ${d.nome}`, `Telefone: ${d.telefone}`];
  if (d.email) linhas.push(`E-mail: ${d.email}`);
  linhas.push(`Condomínio: ${d.condominio}`, `Cidade: ${d.cidade}`);
  if (d.unidades) linhas.push(`Unidades: ${d.unidades}`);
  if (d.mensagem) linhas.push(`Mensagem: ${d.mensagem}`);
  if (d.simulacao && !d.mensagem.includes(d.simulacao)) linhas.push(d.simulacao);
  return linhas.join('\n');
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run tests/unit/formulario.test.ts`
Expected: PASS (17 testes).

- [ ] **Step 5: Commit**

```bash
git add src/lib/formulario.ts tests/unit/formulario.test.ts
git commit -m "$(cat <<'EOF'
feat: validação, máscara e mensagens de WhatsApp do formulário

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Conteúdo, cabeçalho, menu do celular, rodapé e WhatsApp flutuante

**Files:**
- Create: `src/content/site.ts`, `src/components/Icone.astro`, `src/components/TituloSecao.astro`, `src/components/Cabecalho.astro`, `src/components/MenuCelular.astro`, `src/components/Rodape.astro`, `src/components/WhatsAppFlutuante.astro`
- Modify: `src/layouts/Base.astro` (arquivo completo abaixo)
- Test: `tests/e2e/estrutura.spec.ts`

**Interfaces:**
- Consumes: `linkWhatsApp` (Task 3).
- Produces:
  - **Exports de `site.ts`:** `contato`, `cidades`, `navegacao`, `seo`, `abertura`, `sobre`, `servicos`, `central`, `comoFunciona`, `simulador`, `cobertura`, `duvidas`, `contatoSecao` e os tipos `LinkNavegacao`, `IdServico`, `Servico`, `Passo`, `PinoMapa`, `Pergunta`.
  - `<TituloSecao titulo manuscrito id? />`: renderiza `<h2 class="titulo-secao revelar">`; `\n` no título vira `<br>`.
  - `<Icone nome="pessoa" | "whatsapp" tamanho? />`.
  - **Atributos de dados:**
    - `data-abrir-menu` (botão), `data-menu` (`<dialog id="menu-celular">`), `data-fechar-menu`, `data-link-menu`.
    - `data-evento="clique_area_morador" | "clique_whatsapp" | "clique_telefone"`, usado pela medição (Task 12).

- [ ] **Step 1: Escrever os testes**

`tests/e2e/estrutura.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

const PORTAL = 'https://portal.cmportariavirtual.com.br';

test.describe('computador', () => {
  test.skip(({ isMobile }) => isMobile, 'só no computador');

  test('cabeçalho com 4 links, Área do morador e Orçamento', async ({ page }) => {
    await page.goto('./');
    const nav = page.getByRole('navigation', { name: 'Seções do site' });
    await expect(nav.getByRole('link')).toHaveText(['Serviços', 'Como funciona', 'Simulador', 'Contato']);
    const morador = page.locator('.cabecalho__morador');
    await expect(morador).toBeVisible();
    await expect(morador).toHaveAttribute('href', PORTAL);
    await expect(page.locator('.cabecalho__orcamento')).toHaveAttribute('href', /#contato$/);
  });
});

test.describe('celular', () => {
  test.skip(({ isMobile }) => !isMobile, 'só no celular');

  test('mostra o botão Morador e abre o menu em tela cheia', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('.cabecalho__morador-curto')).toHaveAttribute('href', PORTAL);
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    const menu = page.getByRole('dialog', { name: 'Menu' });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('navigation').getByRole('link')).toHaveText(['Serviços', 'Como funciona', 'Simulador', 'Cobertura', 'Dúvidas', 'Contato']);
    await expect(menu.getByRole('link', { name: 'Área do morador' })).toHaveAttribute('href', PORTAL);
  });

  test('o foco fica preso no menu e Esc fecha', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    for (let i = 0; i < 15; i += 1) await page.keyboard.press('Tab');
    const dentro = await page.evaluate(() => document.querySelector('[data-menu]')?.contains(document.activeElement) ?? false);
    expect(dentro).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden();
  });

  test('clicar num link fecha o menu e vai para a seção', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page.getByRole('dialog', { name: 'Menu' }).getByRole('link', { name: 'Simulador' }).click();
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden();
    await expect(page).toHaveURL(/#simulador$/);
  });
});

test('rodapé com Área do morador e Política de privacidade', async ({ page }) => {
  await page.goto('./');
  const rodape = page.locator('footer');
  await expect(rodape.getByRole('link', { name: 'Área do morador' })).toHaveAttribute('href', PORTAL);
  await expect(rodape.getByRole('link', { name: 'Política de privacidade' })).toHaveAttribute('href', /politica-de-privacidade\/$/);
});

test('botão flutuante abre o WhatsApp da CM', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('link', { name: 'Conversar no WhatsApp' })).toHaveAttribute('href', /^https:\/\/wa\.me\/5512981854159\?text=/);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx playwright test tests/e2e/estrutura.spec.ts`
Expected: FAIL, porque o cabeçalho, o menu e o rodapé ainda não existem.

- [ ] **Step 3: Conteúdo do site**

`src/content/site.ts`:
```ts
/**
 * Fonte única dos textos e dados do site.
 * Para trocar um texto, altere aqui: os componentes só leem estes valores.
 */

export const contato = {
  telefone0800: '0800 672 7280',
  telefone0800Link: 'tel:08006727280',
  whatsapp: '(12) 98185-4159',
  whatsappNumero: '5512981854159',
  email: 'contato@cmportariavirtual.com.br',
  portalMorador: 'https://portal.cmportariavirtual.com.br',
  horarioComercial: 'Seg. a sex. 8h–18h · Sáb. 8h–12h',
  horarioSuporte: '24 horas, todos os dias',
  mensagemWhatsAppPadrao: 'Olá! Vim pelo site e gostaria de mais informações sobre a portaria virtual.',
} as const;

export const cidades = ['São José dos Campos', 'Jacareí', 'Caçapava', 'Taubaté', 'Pindamonhangaba'];

export interface LinkNavegacao {
  rotulo: string;
  ancora: string;
}

export const navegacao: { computador: LinkNavegacao[]; celular: LinkNavegacao[] } = {
  computador: [
    { rotulo: 'Serviços', ancora: 'servicos' },
    { rotulo: 'Como funciona', ancora: 'como-funciona' },
    { rotulo: 'Simulador', ancora: 'simulador' },
    { rotulo: 'Contato', ancora: 'contato' },
  ],
  celular: [
    { rotulo: 'Serviços', ancora: 'servicos' },
    { rotulo: 'Como funciona', ancora: 'como-funciona' },
    { rotulo: 'Simulador', ancora: 'simulador' },
    { rotulo: 'Cobertura', ancora: 'cobertura' },
    { rotulo: 'Dúvidas', ancora: 'duvidas' },
    { rotulo: 'Contato', ancora: 'contato' },
  ],
};

export const seo = {
  titulo: 'Portaria Virtual em São José dos Campos | CM Portaria Virtual',
  descricao:
    'Portaria virtual para condomínios em São José dos Campos e Vale do Paraíba: central própria 24 horas, reconhecimento facial e atendimento humano. Peça seu orçamento.',
};

export const abertura = {
  titulo: 'Portaria virtual\npara condomínios',
  manuscrito: 'em São José dos Campos',
  texto: 'Central própria 24 horas, reconhecimento facial e atendimento humano, sem encargos trabalhistas, férias ou faltas.',
  botaoPrincipal: 'Solicitar orçamento',
  botaoSecundario: 'Como funciona',
  altFoto: 'Prédio residencial à noite, com janelas acesas',
};

export const sobre = {
  titulo: 'Segurança que\nnão tira folga',
  manuscrito: 'sobre a CM',
  paragrafos: [
    'A CM Portaria Virtual cuida da entrada do seu condomínio a partir de uma central de monitoramento própria em São José dos Campos. Operadores treinados atendem visitantes, falam com os moradores e liberam o acesso a distância, com registro de tudo.',
    'Instalação, manutenção e suporte são feitos pela nossa própria equipe, que está na região e chega rápido quando precisa.',
  ],
  diferenciais: ['Central própria 24h', 'Equipe técnica local', 'Atendimento humano', 'App para moradores'],
  altFoto: 'Entrada iluminada de um edifício à noite',
};

export type IdServico = 'monitoramento' | 'acesso' | 'app' | 'audio' | 'relatorios' | 'emergencias';

export interface Servico {
  id: IdServico;
  titulo: string;
  texto: string;
  itens: string[];
  altFoto: string;
}

export const servicos: { titulo: string; manuscrito: string; itens: Servico[] } = {
  titulo: 'Tudo que a sua portaria faz',
  manuscrito: 'e um pouco mais',
  itens: [
    {
      id: 'monitoramento',
      titulo: 'Monitoramento 24 horas',
      texto: 'Operadores acompanham as câmeras do condomínio dia e noite, com alertas em tempo real e gravação em nuvem.',
      itens: ['Câmeras HD com visão noturna', 'Gravação em nuvem', 'Alertas em tempo real'],
      altFoto: 'Câmera de segurança instalada na fachada de um prédio',
    },
    {
      id: 'acesso',
      titulo: 'Controle de acesso facial',
      texto: 'Moradores entram por reconhecimento facial. Visitantes e prestadores são cadastrados e liberados a distância.',
      itens: ['Reconhecimento facial automático', 'Abertura remota de portões', 'Cadastro digital de visitantes', 'Histórico completo de acessos'],
      altFoto: 'Terminal de controle de acesso na entrada de um edifício',
    },
    {
      id: 'app',
      titulo: 'Aplicativo CM Portaria',
      texto: 'Pelo celular, o morador libera visitantes, recebe comunicados, faz reservas e registra ocorrências.',
      itens: ['Liberação de visitantes', 'Comunicados e avisos', 'Acesso a câmeras externas', 'Reservas e ocorrências'],
      altFoto: 'Pessoa usando o celular à noite',
    },
    {
      id: 'audio',
      titulo: 'Comunicação por áudio',
      texto: 'Interfone IP com áudio nos dois sentidos: o visitante fala direto com a central e recebe instruções claras.',
      itens: ['Áudio bidirecional HD', 'Atendimento personalizado', 'Instruções claras aos visitantes'],
      altFoto: 'Visitante usando o interfone na entrada do prédio',
    },
    {
      id: 'relatorios',
      titulo: 'Relatórios gerenciais',
      texto: 'Relatórios para síndicos e administradoras com estatísticas de acesso, ocorrências e análise de segurança.',
      itens: ['Estatísticas de acesso', 'Registro de ocorrências', 'Análise de segurança'],
      altFoto: 'Notebook exibindo gráficos',
    },
    {
      id: 'emergencias',
      titulo: 'Resposta a emergências',
      texto: 'Protocolos para cada tipo de ocorrência, com acionamento rápido das autoridades e dos contatos de segurança.',
      itens: ['Botão de pânico', 'Contato direto com a polícia', 'Procedimentos de evacuação'],
      altFoto: 'Viatura policial com as luzes acesas à noite',
    },
  ],
};

export const central = {
  titulo: 'Uma central\nque não dorme',
  manuscrito: '24 horas, 7 dias',
  texto:
    'Enquanto o condomínio dorme, nossa equipe acompanha cada entrada. Cada chamado é atendido por uma pessoa, e cada acesso fica registrado para o síndico consultar quando quiser.',
  nota: 'Ilustração do painel de monitoramento.',
  cameras: ['Portão social', 'Hall', 'Fachada', 'Perímetro'],
  eventos: [
    'Visitante liberado · Bloco B',
    'Entrega recebida · Portaria',
    'Morador reconhecido · Garagem',
    'Ronda de câmeras concluída',
    'Prestador autorizado pelo app · Bloco A',
    'Portão social fechado',
    'Visitante aguardando confirmação',
    'Acesso negado · cadastro inexistente',
    'Morador reconhecido · Portão social',
  ],
};

export interface Passo {
  titulo: string;
  texto: string;
}

export const comoFunciona: { titulo: string; manuscrito: string; passos: Passo[] } = {
  titulo: 'Como funciona',
  manuscrito: 'em cinco passos',
  passos: [
    { titulo: 'Chegada', texto: 'O visitante toca o interfone e é atendido pela central.' },
    { titulo: 'Identificação', texto: 'O operador vê e ouve o visitante pelas câmeras e pelo áudio.' },
    { titulo: 'Confirmação', texto: 'O morador autoriza pelo aplicativo ou por telefone.' },
    { titulo: 'Liberação', texto: 'O acesso é liberado a distância e fica registrado.' },
    { titulo: 'Monitoramento', texto: 'As áreas comuns seguem acompanhadas o tempo todo.' },
  ],
};

export const simulador = {
  titulo: 'Quanto custa a sua\nportaria hoje?',
  manuscrito: 'faça a conta',
  aviso:
    'Cálculo estimado baseado em médias do mercado. Valores incluem salários, encargos trabalhistas (FGTS, INSS, férias, 13º), benefícios e substituições. O valor final pode variar conforme especificidades do condomínio.',
  botao: 'Quero saber quanto economizo',
};

export interface PinoMapa {
  cidade: string;
  x: number;
  y: number;
  rotuloX: number;
  rotuloY: number;
  sede?: boolean;
}

export const cobertura: { titulo: string; manuscrito: string; nota: string; pinos: PinoMapa[] } = {
  titulo: 'Onde atendemos',
  manuscrito: 'Vale do Paraíba',
  nota: 'Outras cidades da região: consulte.',
  pinos: [
    { cidade: 'São José dos Campos', x: 197, y: 239, rotuloX: 214, rotuloY: 262, sede: true },
    { cidade: 'Jacareí', x: 111, y: 331, rotuloX: 124, rotuloY: 352 },
    { cidade: 'Caçapava', x: 392, y: 182, rotuloX: 364, rotuloY: 164 },
    { cidade: 'Taubaté', x: 556, y: 128, rotuloX: 528, rotuloY: 110 },
    { cidade: 'Pindamonhangaba', x: 658, y: 54, rotuloX: 560, rotuloY: 40 },
  ],
};

export interface Pergunta {
  pergunta: string;
  resposta: string;
}

export const duvidas: { titulo: string; manuscrito: string; perguntas: Pergunta[] } = {
  titulo: 'Dúvidas frequentes',
  manuscrito: 'sem rodeios',
  perguntas: [
    {
      pergunta: 'Como funciona a portaria virtual 24 horas?',
      resposta:
        'Nossa central em São José dos Campos atende os visitantes por câmeras e áudio, confirma com o morador e libera o acesso a distância. Os moradores usam o aplicativo CM Portaria, e todas as ocorrências geram registro.',
    },
    {
      pergunta: 'Os moradores têm aplicativo?',
      resposta: 'Sim. Pelo app CM Portaria o morador autoriza visitantes, recebe avisos, acessa câmeras externas, faz reservas e registra ocorrências.',
    },
    {
      pergunta: 'A portaria virtual atende emergências?',
      resposta: 'Sim. A central tem protocolos para cada tipo de ocorrência e aciona polícia, bombeiros e SAMU quando necessário.',
    },
    {
      pergunta: 'A CM tem equipe técnica na região?',
      resposta: 'Sim. Instalação, manutenção e suporte são feitos pela nossa própria equipe, baseada em São José dos Campos.',
    },
    {
      pergunta: 'Quanto custa?',
      resposta:
        'Depende do porte do condomínio e dos equipamentos necessários. Fazemos uma análise técnica sem compromisso e enviamos a proposta. No simulador acima você vê quanto a portaria atual custa hoje.',
    },
    {
      pergunta: 'Quais cidades vocês atendem?',
      resposta: 'São José dos Campos, Jacareí, Caçapava, Taubaté e Pindamonhangaba. Para outras cidades do Vale do Paraíba, consulte.',
    },
  ],
};

export const contatoSecao = {
  titulo: 'Fale com a CM',
  manuscrito: 'sem compromisso',
  botao: 'Enviar pedido',
};
```

- [ ] **Step 4: Ícones e título de seção**

`src/components/Icone.astro`:
```astro
---
interface Props {
  nome: 'pessoa' | 'whatsapp';
  tamanho?: number;
}

const { nome, tamanho = 16 } = Astro.props;
---

{
  nome === 'pessoa' && (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </svg>
  )
}
{
  nome === 'whatsapp' && (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z" />
    </svg>
  )
}
```

`src/components/TituloSecao.astro`:
```astro
---
interface Props {
  titulo: string;
  manuscrito: string;
  id?: string;
}

const { titulo, manuscrito, id } = Astro.props;
const linhas = titulo.split('\n');
---

<h2 class="titulo-secao revelar" id={id}>
  {linhas.map((linha, i) => (<Fragment>{i > 0 && <br />}{linha}</Fragment>))}
  <span class="titulo-secao__manuscrito manuscrito">{manuscrito}</span>
</h2>

<style>
  .titulo-secao {
    position: relative;
    display: inline-block;
    margin: 0 0 clamp(52px, 6vw, 76px);
    padding-right: 0.4em;
    font-family: var(--font-serif);
    font-weight: 400;
    font-size: clamp(30px, 4.2vw, 48px);
    line-height: 1.05;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .titulo-secao__manuscrito {
    position: absolute;
    right: -0.4em;
    bottom: -0.95em;
    font-size: 0.82em;
    white-space: nowrap;
  }

  @media (max-width: 699px) {
    .titulo-secao {
      display: block;
      padding-right: 0;
    }

    .titulo-secao__manuscrito {
      position: static;
      display: block;
      margin-top: 0.15em;
      text-align: right;
    }
  }
</style>
```

- [ ] **Step 5: Cabeçalho**

`src/components/Cabecalho.astro`:
```astro
---
import { Image } from 'astro:assets';
import logo from '../assets/logo-cm.png';
import Icone from './Icone.astro';
import { contato, navegacao } from '../content/site';

const base = import.meta.env.BASE_URL;
---

<header class="cabecalho" data-cabecalho>
  <div class="cabecalho__barra container">
    <a class="cabecalho__marca" href={base}>
      <Image src={logo} alt="" width={96} height={96} class="cabecalho__logo" loading="eager" />
      <span class="cabecalho__nome">CM<br />Portaria Virtual</span>
    </a>
    <nav class="cabecalho__nav" aria-label="Seções do site">
      {navegacao.computador.map((link) => <a href={`${base}#${link.ancora}`}>{link.rotulo}</a>)}
    </nav>
    <a class="cabecalho__morador" href={contato.portalMorador} data-evento="clique_area_morador">
      <Icone nome="pessoa" tamanho={15} />
      <span>Área do morador</span>
    </a>
    <a class="pill pill--cheia cabecalho__orcamento" href={`${base}#contato`}>Orçamento</a>
    <a class="cabecalho__morador-curto" href={contato.portalMorador} data-evento="clique_area_morador">
      <Icone nome="pessoa" tamanho={13} />
      <span>Morador</span>
    </a>
    <button class="cabecalho__abrir" type="button" aria-haspopup="dialog" aria-controls="menu-celular" aria-expanded="false" data-abrir-menu>
      <span class="sr-only">Abrir menu</span>
      <i aria-hidden="true"></i>
      <i aria-hidden="true"></i>
    </button>
  </div>
</header>

<script>
  const cabecalho = document.querySelector<HTMLElement>('[data-cabecalho]');
  if (cabecalho) {
    const atualizar = () => cabecalho.classList.toggle('is-solido', window.scrollY > 80);
    atualizar();
    window.addEventListener('scroll', atualizar, { passive: true });
  }
</script>

<style>
  .cabecalho {
    position: fixed;
    inset: 0 0 auto;
    z-index: 50;
    border-bottom: 1px solid transparent;
    transition: background-color 0.4s var(--ease), border-color 0.4s var(--ease);
  }

  .cabecalho.is-solido {
    background: rgba(11, 36, 38, 0.96);
    border-bottom-color: var(--line);
    backdrop-filter: blur(10px);
  }

  .cabecalho__barra {
    display: flex;
    align-items: center;
    gap: 16px;
    height: var(--header-h);
  }

  .cabecalho__marca {
    display: flex;
    flex: none;
    align-items: center;
    gap: 14px;
  }

  .cabecalho__marca :global(img) {
    width: 48px;
    height: 48px;
  }

  .cabecalho__nome {
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: 17px;
    line-height: 1.15;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .cabecalho__nav {
    display: flex;
    gap: 28px;
    margin-left: auto;
    font-size: 11.5px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .cabecalho__nav a {
    padding-block: 12px;
    opacity: 0.85;
    transition: opacity 0.3s, color 0.3s;
  }

  .cabecalho__nav a:hover {
    color: var(--accent);
    opacity: 1;
  }

  .cabecalho__morador {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-left: 22px;
    padding: 12px 0 12px 22px;
    border-left: 1px solid var(--line);
    color: var(--accent);
    font-size: 11.5px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .cabecalho__orcamento {
    min-height: 44px;
    margin-left: 16px;
    padding: 0 22px;
    font-size: 11px;
  }

  .cabecalho__morador-curto,
  .cabecalho__abrir {
    display: none;
  }

  @media (max-width: 1099px) {
    .cabecalho__marca :global(img) {
      width: 40px;
      height: 40px;
    }

    .cabecalho__nome {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }

    .cabecalho__nav,
    .cabecalho__morador,
    .cabecalho__orcamento {
      display: none;
    }

    .cabecalho__morador-curto {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-height: 44px;
      margin-left: auto;
      padding: 0 14px 0 12px;
      border: 1px solid rgba(183, 208, 111, 0.6);
      border-radius: var(--radius-pill);
      color: var(--accent);
      font-size: 10.5px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .cabecalho__abrir {
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      gap: 7px;
      width: 44px;
      height: 44px;
      margin-right: -8px;
      padding: 0 8px;
      border: 0;
      background: none;
      cursor: pointer;
    }

    .cabecalho__abrir i {
      display: block;
      height: 1.5px;
      background: var(--text);
    }
  }
</style>
```

- [ ] **Step 6: Menu do celular**

`src/components/MenuCelular.astro`:
```astro
---
import { Image } from 'astro:assets';
import logo from '../assets/logo-cm.png';
import { contato, navegacao } from '../content/site';
import { linkWhatsApp } from '../lib/formulario';

const base = import.meta.env.BASE_URL;
---

<dialog class="menu" id="menu-celular" aria-label="Menu" data-menu>
  <div class="menu__topo container">
    <Image src={logo} alt="" width={80} height={80} class="menu__logo" />
    <button class="menu__fechar" type="button" data-fechar-menu>
      <span class="sr-only">Fechar menu</span>
      <span aria-hidden="true">×</span>
    </button>
  </div>
  <nav class="menu__nav" aria-label="Seções do site">
    {navegacao.celular.map((link) => <a href={`${base}#${link.ancora}`} data-link-menu>{link.rotulo}</a>)}
  </nav>
  <span class="menu__divisor" aria-hidden="true"></span>
  <p class="menu__contato">
    <a href={contato.telefone0800Link} data-evento="clique_telefone">{contato.telefone0800}</a>
    ·
    <a href={linkWhatsApp(contato.whatsappNumero, contato.mensagemWhatsAppPadrao)} target="_blank" rel="noopener" data-evento="clique_whatsapp">{contato.whatsapp}</a>
  </p>
  <div class="menu__botoes">
    <a class="pill pill--cheia" href={`${base}#contato`} data-link-menu>Solicitar orçamento</a>
    <a class="pill menu__morador" href={contato.portalMorador} data-evento="clique_area_morador">Área do morador</a>
  </div>
</dialog>

<script>
  const menu = document.querySelector<HTMLDialogElement>('[data-menu]');
  const abrir = document.querySelector<HTMLButtonElement>('[data-abrir-menu]');
  if (menu && abrir) {
    const fechar = () => menu.close();
    abrir.addEventListener('click', () => {
      menu.showModal();
      abrir.setAttribute('aria-expanded', 'true');
    });
    menu.addEventListener('close', () => {
      abrir.setAttribute('aria-expanded', 'false');
      abrir.focus({ preventScroll: true });
    });
    menu.querySelector('[data-fechar-menu]')?.addEventListener('click', fechar);
    menu.querySelectorAll('[data-link-menu]').forEach((link) => link.addEventListener('click', fechar));
    menu.addEventListener('keydown', (evento) => {
      if (evento.key !== 'Tab') return;
      const focaveis = Array.from(menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    });
  }
</script>

<style>
  .menu {
    position: fixed;
    inset: 0;
    width: 100%;
    max-width: none;
    height: 100%;
    max-height: none;
    margin: 0;
    padding: 0 0 40px;
    border: 0;
    background: rgba(11, 36, 38, 0.97);
    color: var(--text);
  }

  .menu[open] {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .menu::backdrop {
    background: rgba(8, 27, 29, 0.6);
  }

  .menu__topo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 72px;
  }

  .menu__topo :global(img) {
    width: 40px;
    height: 40px;
  }

  .menu__fechar {
    width: 44px;
    height: 44px;
    margin-right: -8px;
    border: 0;
    background: none;
    color: var(--text);
    font-size: 32px;
    font-weight: 200;
    line-height: 1;
    cursor: pointer;
  }

  .menu__nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: auto;
  }

  .menu__nav a {
    font-family: var(--font-serif);
    font-size: clamp(22px, 7vw, 28px);
    line-height: 2.05;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .menu__divisor {
    width: 40px;
    height: 1px;
    margin: 20px 0 16px;
    background: var(--accent);
  }

  .menu__contato {
    color: var(--muted);
    font-size: 13px;
    letter-spacing: 0.1em;
  }

  .menu__botoes {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-top: 22px;
    margin-bottom: auto;
  }

  .menu__morador {
    color: var(--accent);
  }
</style>
```

- [ ] **Step 7: Rodapé e WhatsApp flutuante**

`src/components/Rodape.astro`:
```astro
---
import { cidades, contato, navegacao } from '../content/site';
import { linkWhatsApp } from '../lib/formulario';

const base = import.meta.env.BASE_URL;
const ano = new Date().getFullYear();
---

<footer class="rodape">
  <div class="container">
    <p class="rodape__marca" aria-hidden="true">CM Portaria Virtual</p>
    <div class="rodape__colunas">
      <nav aria-label="Rodapé">
        <p class="rotulo">Navegação</p>
        <ul role="list">
          {navegacao.celular.map((link) => (<li><a href={`${base}#${link.ancora}`}>{link.rotulo}</a></li>))}
        </ul>
      </nav>
      <div>
        <p class="rotulo">Moradores</p>
        <ul role="list">
          <li><a class="rodape__morador" href={contato.portalMorador} data-evento="clique_area_morador">Área do morador</a></li>
        </ul>
      </div>
      <div>
        <p class="rotulo">Contato</p>
        <ul role="list">
          <li><a href={contato.telefone0800Link} data-evento="clique_telefone">{contato.telefone0800}</a></li>
          <li><a href={linkWhatsApp(contato.whatsappNumero, contato.mensagemWhatsAppPadrao)} target="_blank" rel="noopener" data-evento="clique_whatsapp">{contato.whatsapp}</a></li>
          <li><a href={`mailto:${contato.email}`}>{contato.email}</a></li>
        </ul>
      </div>
      <div>
        <p class="rotulo">Cidades</p>
        <ul role="list">
          {cidades.map((cidade) => (<li>{cidade}</li>))}
        </ul>
      </div>
    </div>
    <div class="rodape__base">
      <span>© {ano} CM Portaria Virtual</span>
      <a href={`${base}politica-de-privacidade/`}>Política de privacidade</a>
    </div>
  </div>
</footer>

<style>
  .rodape {
    padding: clamp(56px, 8vw, 80px) 0 28px;
    border-top: 1px solid var(--line);
    background: var(--bg-deep);
  }

  .rodape__marca {
    margin-bottom: clamp(36px, 5vw, 56px);
    font-family: var(--font-serif);
    font-weight: 400;
    font-size: clamp(28px, 7.6vw, 104px);
    line-height: 0.95;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: transparent;
    -webkit-text-stroke: 1px rgba(183, 208, 111, 0.5);
  }

  .rodape__colunas {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 32px;
    padding-top: 28px;
    border-top: 1px solid var(--line);
  }

  .rodape__colunas .rotulo {
    margin-bottom: 14px;
  }

  .rodape__colunas ul {
    display: grid;
    gap: 8px;
    font-size: 14px;
    overflow-wrap: anywhere;
  }

  .rodape__colunas a:hover {
    color: var(--accent);
  }

  .rodape__morador {
    color: var(--accent);
  }

  .rodape__base {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid var(--line);
    color: var(--muted);
    font-size: 11.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  @media (max-width: 899px) {
    .rodape__colunas {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 499px) {
    .rodape__colunas {
      grid-template-columns: 1fr;
    }

    .rodape__base {
      flex-direction: column;
    }
  }
</style>
```

`src/components/WhatsAppFlutuante.astro`:
```astro
---
import Icone from './Icone.astro';
import { contato } from '../content/site';
import { linkWhatsApp } from '../lib/formulario';

const href = linkWhatsApp(contato.whatsappNumero, contato.mensagemWhatsAppPadrao);
---

<a class="whatsapp-flutuante" href={href} target="_blank" rel="noopener" aria-label="Conversar no WhatsApp" data-evento="clique_whatsapp">
  <Icone nome="whatsapp" tamanho={26} />
</a>

<style>
  .whatsapp-flutuante {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 40;
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--accent);
    color: var(--on-accent);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    transition: transform 0.3s var(--ease);
  }

  .whatsapp-flutuante:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 699px) {
    .whatsapp-flutuante {
      right: 16px;
      bottom: 16px;
      width: 52px;
      height: 52px;
    }
  }
</style>
```

- [ ] **Step 8: Ligar as peças fixas no layout**

`src/layouts/Base.astro` (arquivo completo):
```astro
---
import { Font } from 'astro:assets';
import { DEPLOY_TARGET } from 'astro:env/client';
import Cabecalho from '../components/Cabecalho.astro';
import MenuCelular from '../components/MenuCelular.astro';
import Rodape from '../components/Rodape.astro';
import WhatsAppFlutuante from '../components/WhatsAppFlutuante.astro';
import '../styles/tokens.css';
import '../styles/base.css';

interface Props {
  titulo: string;
  descricao: string;
}

const { titulo, descricao } = Astro.props;
const naoIndexar = DEPLOY_TARGET === 'ghpages';
---

<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{titulo}</title>
    <meta name="description" content={descricao} />
    {naoIndexar && <meta name="robots" content="noindex, nofollow" />}
    <meta name="theme-color" content="#0b2426" />
    <Font cssVariable="--font-serif" preload={[{ weight: 400 }]} />
    <Font cssVariable="--font-sans" preload={[{ weight: 300 }]} />
    <Font cssVariable="--font-script" />
  </head>
  <body>
    <a class="pular" href="#conteudo">Pular para o conteúdo</a>
    <Cabecalho />
    <MenuCelular />
    <main id="conteudo"><slot /></main>
    <Rodape />
    <WhatsAppFlutuante />
    <script>
      const revelaveis = document.querySelectorAll('.revelar');
      const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (revelaveis.length > 0 && !reduzir && 'IntersectionObserver' in window) {
        document.documentElement.classList.add('js-revelar');
        const observador = new IntersectionObserver(
          (entradas) => {
            for (const entrada of entradas) {
              if (entrada.isIntersecting) {
                entrada.target.classList.add('is-visivel');
                observador.unobserve(entrada.target);
              }
            }
          },
          { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
        );
        revelaveis.forEach((elemento) => observador.observe(elemento));
      }
    </script>
  </body>
</html>
```

- [ ] **Step 9: Rodar e ver passar**

Run: `npx playwright test tests/e2e/estrutura.spec.ts tests/e2e/fundacao.spec.ts`
Expected: PASS em todos (os testes marcados com `skip` aparecem como pulados no outro projeto).

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: conteúdo, cabeçalho, menu do celular, rodapé e WhatsApp flutuante

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Abertura, Sobre e Como funciona

**Files:**
- Create: `src/components/Abertura.astro`, `src/components/Sobre.astro`, `src/components/ComoFunciona.astro`
- Modify: `src/pages/index.astro` (arquivo completo abaixo)
- Test: `tests/e2e/abertura.spec.ts`

**Interfaces:**
- Consumes: `abertura`, `sobre`, `comoFunciona`, `contato`, `cidades`, `seo` (de `site.ts`); `<TituloSecao>`.
- Produces: seções `#inicio`, `#sobre` e `#como-funciona`; trilho do carrossel com `data-trilho` e indicadores com `data-pontos`.

- [ ] **Step 1: Escrever os testes**

`tests/e2e/abertura.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('abertura com título, texto e botões', async ({ page }) => {
  await page.goto('./');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toContainText('Portaria virtual');
  await expect(h1).toContainText('para condomínios');
  await expect(h1).toContainText('em São José dos Campos');
  await expect(page.locator('#inicio').getByRole('link', { name: 'Solicitar orçamento' })).toHaveAttribute('href', /#contato$/);
  await expect(page.locator('#inicio').getByRole('link', { name: 'Como funciona' })).toHaveAttribute('href', /#como-funciona$/);
  await expect(page.locator('#inicio').getByRole('link', { name: /0800 672 7280/ })).toHaveAttribute('href', 'tel:08006727280');
});

test('sobre mostra os quatro diferenciais', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('#sobre li')).toHaveText(['Central própria 24h', 'Equipe técnica local', 'Atendimento humano', 'App para moradores']);
});

test('como funciona tem cinco passos em ordem', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('#como-funciona .como__passo h3')).toHaveText(['Chegada', 'Identificação', 'Confirmação', 'Liberação', 'Monitoramento']);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx playwright test tests/e2e/abertura.spec.ts`
Expected: FAIL, porque o `#inicio` e o `#sobre` não existem.

- [ ] **Step 3: Abertura**

`src/components/Abertura.astro`:
```astro
---
import { Picture } from 'astro:assets';
import foto from '../assets/fotos/abertura-torre.jpg';
import { abertura, cidades, contato } from '../content/site';

const base = import.meta.env.BASE_URL;
const linhas = abertura.titulo.split('\n');
---

<section class="abertura" id="inicio" aria-labelledby="abertura-titulo">
  <div class="abertura__foto">
    <Picture src={foto} alt={abertura.altFoto} formats={['avif', 'webp']} widths={[640, 1024, 1600, 2400]} sizes="100vw" priority />
  </div>
  <div class="abertura__veu" aria-hidden="true"></div>
  <div class="abertura__conteudo container">
    <h1 class="abertura__titulo" id="abertura-titulo">
      {linhas.map((linha, i) => (<Fragment>{i > 0 && <br />}{linha}</Fragment>))}
      <span class="abertura__manuscrito manuscrito">{abertura.manuscrito}</span>
    </h1>
    <div class="abertura__base">
      <p class="abertura__texto">{abertura.texto}</p>
      <div class="abertura__botoes">
        <a class="pill pill--cheia" href={`${base}#contato`}>{abertura.botaoPrincipal}</a>
        <a class="pill" href={`${base}#como-funciona`}>{abertura.botaoSecundario}</a>
      </div>
    </div>
    <div class="abertura__rodape">
      <a href={contato.telefone0800Link} data-evento="clique_telefone">Central 24h · {contato.telefone0800}</a>
      <span class="abertura__cidades">{cidades.join(' · ')}</span>
    </div>
  </div>
</section>

<style>
  .abertura {
    position: relative;
    display: flex;
    min-height: max(620px, 100svh);
    overflow: hidden;
  }

  .abertura__foto {
    position: absolute;
    inset: 0;
  }

  .abertura__foto :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 38%;
  }

  .abertura__veu {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(11, 36, 38, 0.93) 0%, rgba(11, 36, 38, 0.42) 30%, rgba(11, 36, 38, 0.06) 55%, rgba(11, 36, 38, 0.97) 100%);
  }

  .abertura__conteudo {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    padding-top: calc(var(--header-h) + clamp(40px, 9vh, 96px));
    padding-bottom: 28px;
  }

  .abertura__titulo {
    font-family: var(--font-serif);
    font-weight: 400;
    font-size: clamp(25px, 6.2vw, 80px);
    line-height: 1.02;
    letter-spacing: 0.06em;
    text-align: center;
    text-transform: uppercase;
  }

  .abertura__manuscrito {
    display: block;
    margin-top: 0.05em;
    font-size: 0.8em;
  }

  .abertura__base {
    max-width: 440px;
    margin-top: auto;
    padding-top: 48px;
  }

  .abertura__texto {
    margin-bottom: 26px;
    font-size: 16px;
    line-height: 1.7;
  }

  .abertura__botoes {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
  }

  .abertura__rodape {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    margin-top: 48px;
    padding-top: 16px;
    border-top: 1px solid var(--line);
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  @media (max-width: 699px) {
    .abertura__titulo {
      font-size: clamp(25px, 7.8vw, 34px);
      letter-spacing: 0.04em;
    }

    .abertura__veu {
      background: linear-gradient(180deg, rgba(11, 36, 38, 0.94) 0%, rgba(11, 36, 38, 0.45) 30%, rgba(11, 36, 38, 0.12) 46%, rgba(11, 36, 38, 0.8) 64%, rgba(11, 36, 38, 0.97) 100%);
    }

    .abertura__texto {
      font-size: 15px;
    }

    .abertura__botoes {
      flex-direction: column;
      align-items: flex-start;
    }

    .abertura__cidades {
      display: none;
    }
  }
</style>
```

- [ ] **Step 4: Sobre**

`src/components/Sobre.astro`:
```astro
---
import { Picture } from 'astro:assets';
import foto from '../assets/fotos/sobre-entrada.jpg';
import TituloSecao from './TituloSecao.astro';
import { sobre } from '../content/site';
---

<section class="secao sobre" id="sobre" aria-labelledby="sobre-titulo">
  <div class="container sobre__grade">
    <div class="sobre__foto revelar">
      <Picture src={foto} alt={sobre.altFoto} formats={['avif', 'webp']} widths={[480, 800, 1100]} sizes="(max-width: 899px) 100vw, 40vw" />
    </div>
    <div>
      <TituloSecao id="sobre-titulo" titulo={sobre.titulo} manuscrito={sobre.manuscrito} />
      {sobre.paragrafos.map((paragrafo) => (<p class="texto revelar">{paragrafo}</p>))}
      <ul class="sobre__diferenciais revelar" role="list">
        {sobre.diferenciais.map((diferencial) => (<li>{diferencial}</li>))}
      </ul>
    </div>
  </div>
</section>

<style>
  .sobre__grade {
    display: grid;
    grid-template-columns: 5fr 6fr;
    align-items: center;
    gap: clamp(40px, 6vw, 88px);
  }

  .sobre__foto {
    aspect-ratio: 4 / 5;
    overflow: hidden;
  }

  .sobre__foto :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.75) brightness(0.9);
  }

  .sobre__diferenciais {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: 44px;
    border-top: 1px solid var(--line);
  }

  .sobre__diferenciais li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 12px 20px 0;
    border-bottom: 1px solid var(--line);
    font-size: 12.5px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .sobre__diferenciais li::before {
    content: '';
    flex: none;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
  }

  @media (max-width: 899px) {
    .sobre__grade {
      grid-template-columns: 1fr;
    }

    .sobre__foto {
      aspect-ratio: 4 / 3;
    }
  }

  @media (max-width: 499px) {
    .sobre__diferenciais {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 5: Como funciona**

`src/components/ComoFunciona.astro`:
```astro
---
import TituloSecao from './TituloSecao.astro';
import { comoFunciona } from '../content/site';

const ultimo = comoFunciona.passos.length - 1;
---

<section class="secao secao--alt como" id="como-funciona" aria-labelledby="como-titulo">
  <div class="container">
    <TituloSecao id="como-titulo" titulo={comoFunciona.titulo} manuscrito={comoFunciona.manuscrito} />
  </div>
  <div class="como__trilho container" data-trilho tabindex="0" role="region" aria-label="Passos de como funciona">
    <ol class="como__lista" role="list">
      {
        comoFunciona.passos.map((passo, i) => (
          <li class:list={['como__passo', 'revelar', { 'como__passo--destaque': i === ultimo }]}>
            <h3>{passo.titulo}</h3>
            <p>{passo.texto}</p>
            <span class="como__numero" aria-hidden="true">{i + 1}</span>
          </li>
        ))
      }
    </ol>
  </div>
  <div class="como__pontos" aria-hidden="true" data-pontos>
    {comoFunciona.passos.map((_, i) => (<i class:list={[{ 'is-ativo': i === 0 }]} />))}
  </div>
</section>

<script>
  const trilho = document.querySelector<HTMLElement>('[data-trilho]');
  const pontos = document.querySelectorAll<HTMLElement>('[data-pontos] i');
  if (trilho && pontos.length > 0) {
    const passos = Array.from(trilho.querySelectorAll<HTMLElement>('.como__passo'));
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            const indice = passos.indexOf(entrada.target as HTMLElement);
            pontos.forEach((ponto, i) => ponto.classList.toggle('is-ativo', i === indice));
          }
        }
      },
      { root: trilho, threshold: 0.6 },
    );
    passos.forEach((passo) => observador.observe(passo));
  }
</script>

<style>
  .como__lista {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .como__passo {
    position: relative;
    min-height: 240px;
    margin-left: -1px;
    padding: 26px 24px;
    border: 1px solid var(--line);
  }

  .como__passo h3 {
    margin-bottom: 10px;
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: 21px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .como__passo p {
    max-width: 180px;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.6;
  }

  .como__numero {
    position: absolute;
    right: 20px;
    bottom: 10px;
    color: rgba(236, 232, 221, 0.85);
    font-family: var(--font-serif);
    font-weight: 300;
    font-size: 104px;
    line-height: 0.8;
    font-variant-numeric: lining-nums;
  }

  .como__passo--destaque {
    border-color: var(--accent);
    background: var(--accent);
  }

  .como__passo--destaque h3,
  .como__passo--destaque .como__numero {
    color: var(--on-accent);
  }

  .como__passo--destaque p {
    color: rgba(11, 36, 38, 0.8);
  }

  .como__pontos {
    display: none;
  }

  @media (max-width: 1099px) {
    .como__trilho {
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scroll-padding-inline: var(--gutter);
      scrollbar-width: none;
    }

    .como__trilho::-webkit-scrollbar {
      display: none;
    }

    .como__lista {
      display: flex;
      gap: 12px;
      width: max-content;
    }

    .como__passo {
      flex: 0 0 auto;
      width: min(78vw, 300px);
      min-height: 210px;
      margin-left: 0;
      scroll-snap-align: start;
    }

    .como__numero {
      font-size: 84px;
    }

    .como__pontos {
      display: flex;
      justify-content: center;
      gap: 6px;
      margin-top: 18px;
    }

    .como__pontos i {
      width: 6px;
      height: 6px;
      border-radius: 3px;
      background: var(--line-strong);
      transition: width 0.3s, background-color 0.3s;
    }

    .como__pontos i.is-ativo {
      width: 18px;
      background: var(--accent);
    }
  }
</style>
```

- [ ] **Step 6: Página inicial com as seções**

`src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import Abertura from '../components/Abertura.astro';
import Sobre from '../components/Sobre.astro';
import ComoFunciona from '../components/ComoFunciona.astro';
import { seo } from '../content/site';
---

<Base titulo={seo.titulo} descricao={seo.descricao}>
  <Abertura />
  <Sobre />
  <ComoFunciona />
</Base>
```

- [ ] **Step 7: Rodar e ver passar**

Run: `npx playwright test tests/e2e/abertura.spec.ts tests/e2e/estrutura.spec.ts tests/e2e/fundacao.spec.ts`
Expected: PASS.

- [ ] **Step 8: Conferência visual rápida**

Run: `npm run build && npm run preview`. Abra `http://localhost:4321/cm-portaria-virtual/` no navegador, com 1440 px e 390 px de largura (DevTools). Confira com o protótipo `estrutura-pagina.html`: título centralizado sobre o prédio, manuscrito verde e botões. Encerre o servidor com Ctrl+C.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: seções Abertura, Sobre e Como funciona

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Serviços (abas no computador, sanfona no celular)

**Files:**
- Create: `src/components/Servicos.astro`
- Modify: `src/pages/index.astro` (arquivo completo abaixo)
- Test: `tests/e2e/servicos.spec.ts`

**Interfaces:**
- Consumes: `servicos` (de `site.ts`) e as fotos `servico-*.jpg`.
- Produces: `#servicos`; abas com `role="tab"`, ids `aba-{id}` e `painel-{id}`; contêiner `data-abas`; sanfona `.servicos__sanfona details[name="servicos"]`.

- [ ] **Step 1: Escrever os testes**

`tests/e2e/servicos.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test.describe('abas no computador', () => {
  test.skip(({ isMobile }) => isMobile, 'só no computador');

  test('clique troca o painel', async ({ page }) => {
    await page.goto('./#servicos');
    const abas = page.getByRole('tab');
    await expect(abas).toHaveCount(6);
    await expect(page.getByRole('tabpanel')).toHaveCount(1);
    await abas.nth(2).click();
    await expect(abas.nth(2)).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText('Aplicativo CM Portaria');
  });

  test('setas do teclado trocam a aba', async ({ page }) => {
    await page.goto('./#servicos');
    await page.getByRole('tab').first().focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('tab').nth(1)).toBeFocused();
    await expect(page.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('End');
    await expect(page.getByRole('tabpanel')).toContainText('Resposta a emergências');
  });
});

test.describe('sanfona no celular', () => {
  test.skip(({ isMobile }) => !isMobile, 'só no celular');

  test('primeiro item aberto e só um aberto por vez', async ({ page }) => {
    await page.goto('./#servicos');
    const itens = page.locator('.servicos__sanfona details');
    await expect(itens).toHaveCount(6);
    await expect(itens.nth(0)).toHaveAttribute('open', '');
    await itens.nth(3).locator('summary').click();
    await expect(itens.nth(3)).toHaveAttribute('open', '');
    await expect(itens.nth(0)).not.toHaveAttribute('open');
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx playwright test tests/e2e/servicos.spec.ts`
Expected: FAIL, porque a seção `#servicos` ainda não existe.

- [ ] **Step 3: Implementar**

`src/components/Servicos.astro`:
```astro
---
import { Picture } from 'astro:assets';
import TituloSecao from './TituloSecao.astro';
import { servicos, type IdServico } from '../content/site';
import monitoramento from '../assets/fotos/servico-monitoramento.jpg';
import acesso from '../assets/fotos/servico-acesso.jpg';
import app from '../assets/fotos/servico-app.jpg';
import audio from '../assets/fotos/servico-audio.jpg';
import relatorios from '../assets/fotos/servico-relatorios.jpg';
import emergencias from '../assets/fotos/servico-emergencias.jpg';

const fotos: Record<IdServico, ImageMetadata> = { monitoramento, acesso, app, audio, relatorios, emergencias };
const numero = (i: number) => String(i + 1).padStart(2, '0');
---

<section class="secao secao--alt servicos" id="servicos" aria-labelledby="servicos-titulo">
  <div class="container">
    <TituloSecao id="servicos-titulo" titulo={servicos.titulo} manuscrito={servicos.manuscrito} />

    <div class="servicos__abas revelar" data-abas>
      <div class="servicos__lista" role="tablist" aria-label="Serviços" aria-orientation="vertical">
        {
          servicos.itens.map((servico, i) => (
            <button
              class="servicos__aba"
              type="button"
              role="tab"
              id={`aba-${servico.id}`}
              aria-controls={`painel-${servico.id}`}
              aria-selected={i === 0 ? 'true' : 'false'}
              tabindex={i === 0 ? 0 : -1}
            >
              <span class="servicos__num" aria-hidden="true">{numero(i)}</span>
              <span class="servicos__nome">{servico.titulo}</span>
            </button>
          ))
        }
      </div>
      <div class="servicos__paineis">
        {
          servicos.itens.map((servico) => (
            <div class="servicos__painel" role="tabpanel" id={`painel-${servico.id}`} aria-labelledby={`aba-${servico.id}`} tabindex="0" data-painel>
              <div class="servicos__foto">
                <Picture src={fotos[servico.id]} alt={servico.altFoto} formats={['avif', 'webp']} widths={[480, 800, 1200]} sizes="(max-width: 1099px) 100vw, 46vw" />
              </div>
              <h3>{servico.titulo}</h3>
              <p class="texto">{servico.texto}</p>
              <ul class="servicos__itens" role="list">
                {servico.itens.map((item) => (<li>{item}</li>))}
              </ul>
            </div>
          ))
        }
      </div>
    </div>

    <div class="servicos__sanfona revelar">
      {
        servicos.itens.map((servico, i) => (
          <details name="servicos" open={i === 0}>
            <summary>
              <span class="servicos__num" aria-hidden="true">{numero(i)}</span>
              <span>{servico.titulo}</span>
            </summary>
            <p class="texto">{servico.texto}</p>
            <ul class="servicos__itens" role="list">
              {servico.itens.map((item) => (<li>{item}</li>))}
            </ul>
          </details>
        ))
      }
    </div>
  </div>
</section>

<script>
  const grupo = document.querySelector<HTMLElement>('[data-abas]');
  if (grupo) {
    const abas = Array.from(grupo.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const paineis = Array.from(grupo.querySelectorAll<HTMLElement>('[data-painel]'));
    const ativar = (indice: number, focar = false) => {
      abas.forEach((aba, i) => {
        const ativa = i === indice;
        aba.setAttribute('aria-selected', String(ativa));
        aba.tabIndex = ativa ? 0 : -1;
        paineis[i].hidden = !ativa;
      });
      if (focar) abas[indice].focus();
    };
    abas.forEach((aba, i) => {
      aba.addEventListener('click', () => ativar(i));
      aba.addEventListener('keydown', (evento) => {
        const total = abas.length;
        const destinos: Record<string, number> = {
          ArrowDown: (i + 1) % total,
          ArrowRight: (i + 1) % total,
          ArrowUp: (i - 1 + total) % total,
          ArrowLeft: (i - 1 + total) % total,
          Home: 0,
          End: total - 1,
        };
        if (evento.key in destinos) {
          evento.preventDefault();
          ativar(destinos[evento.key], true);
        }
      });
    });
    ativar(0);
  }
</script>

<style>
  .servicos__abas {
    display: grid;
    grid-template-columns: 5fr 6fr;
    gap: clamp(40px, 6vw, 72px);
  }

  .servicos__lista {
    align-self: start;
    border-top: 1px solid var(--line);
  }

  .servicos__aba {
    position: relative;
    display: flex;
    align-items: baseline;
    gap: 22px;
    width: 100%;
    padding: 22px 0;
    border: 0;
    border-bottom: 1px solid var(--line);
    background: none;
    color: var(--muted);
    text-align: left;
    cursor: pointer;
  }

  .servicos__nome {
    font-family: var(--font-serif);
    font-size: clamp(21px, 2vw, 25px);
    letter-spacing: 0.04em;
    transition: color 0.3s;
  }

  .servicos__num {
    flex: none;
    width: 26px;
    font-family: var(--font-serif);
    font-size: 17px;
    font-variant-numeric: lining-nums;
  }

  .servicos__aba:hover .servicos__nome,
  .servicos__aba[aria-selected='true'] {
    color: var(--text);
  }

  .servicos__aba[aria-selected='true'] .servicos__num {
    color: var(--accent);
  }

  .servicos__aba[aria-selected='true']::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 1px;
    background: var(--accent);
  }

  .servicos__foto {
    aspect-ratio: 16 / 9;
    margin-bottom: 30px;
    overflow: hidden;
  }

  .servicos__foto :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.7) brightness(0.85);
  }

  .servicos__painel h3 {
    margin-bottom: 12px;
    font-family: var(--font-serif);
    font-weight: 400;
    font-size: 30px;
    letter-spacing: 0.04em;
  }

  .servicos__itens {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px 24px;
    margin-top: 22px;
  }

  .servicos__itens li {
    position: relative;
    padding-left: 18px;
    font-size: 14px;
  }

  .servicos__itens li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.85em;
    width: 8px;
    height: 1px;
    background: var(--accent);
  }

  .servicos__sanfona {
    display: none;
    border-top: 1px solid var(--line);
  }

  .servicos__sanfona details {
    border-bottom: 1px solid var(--line);
  }

  .servicos__sanfona summary {
    display: flex;
    align-items: baseline;
    gap: 14px;
    padding: 18px 0;
    color: var(--muted);
    font-family: var(--font-serif);
    font-size: 20px;
    list-style: none;
    cursor: pointer;
  }

  .servicos__sanfona summary::-webkit-details-marker {
    display: none;
  }

  .servicos__sanfona summary::after {
    content: '+';
    margin-left: auto;
    color: var(--accent);
    font-family: var(--font-sans);
  }

  .servicos__sanfona details[open] summary {
    color: var(--text);
  }

  .servicos__sanfona details[open] summary::after {
    content: '−';
  }

  .servicos__sanfona details[open] .servicos__num {
    color: var(--accent);
  }

  .servicos__sanfona details > :not(summary) {
    padding-left: 40px;
  }

  .servicos__sanfona .servicos__itens {
    grid-template-columns: 1fr;
    margin: 14px 0 22px;
  }

  @media (max-width: 899px) {
    .servicos__abas {
      display: none;
    }

    .servicos__sanfona {
      display: block;
    }
  }
</style>
```

`src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import Abertura from '../components/Abertura.astro';
import Sobre from '../components/Sobre.astro';
import Servicos from '../components/Servicos.astro';
import ComoFunciona from '../components/ComoFunciona.astro';
import { seo } from '../content/site';
---

<Base titulo={seo.titulo} descricao={seo.descricao}>
  <Abertura />
  <Sobre />
  <Servicos />
  <ComoFunciona />
</Base>
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx playwright test tests/e2e/servicos.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: seção Serviços com abas acessíveis e sanfona no celular

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Central ao vivo

**Files:**
- Create: `src/components/Central.astro`
- Modify: `src/pages/index.astro` (arquivo completo abaixo)
- Test: `tests/e2e/central.spec.ts`

**Interfaces:**
- Consumes: `central` (de `site.ts`); fotos `sobre-entrada.jpg`, `central-hall.jpg`, `abertura-torre.jpg` e `central-perimetro.jpg`.
- Produces:
  - `#central`.
  - Painel com `data-central`, `aria-hidden="true"` e `data-pronto="true"` depois de iniciar.
  - Lista de eventos `[data-lista]` e relógio `[data-relogio]`.

- [ ] **Step 1: Escrever os testes**

`tests/e2e/central.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('novos eventos aparecem na central', async ({ page }) => {
  await page.goto('./#central');
  const painel = page.locator('[data-central]');
  await expect(painel).toHaveAttribute('data-pronto', 'true');
  const eventos = painel.locator('[data-lista] li');
  await expect(eventos).toHaveCount(5);
  await expect(eventos).toHaveCount(6, { timeout: 6000 });
  await expect(painel.locator('[data-relogio]')).toHaveText(/^\d{2}:\d{2}:\d{2}$/);
});

test('com movimento reduzido a lista fica parada', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#central');
  await expect(page.locator('[data-central]')).toHaveAttribute('data-pronto', 'true');
  await page.waitForTimeout(3500);
  await expect(page.locator('[data-central] [data-lista] li')).toHaveCount(5);
});

test('o painel é escondido de leitores de tela e tem a nota de ilustração', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('[data-central]')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('#central')).toContainText('Ilustração do painel de monitoramento.');
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx playwright test tests/e2e/central.spec.ts`
Expected: FAIL, porque o `[data-central]` não existe.

- [ ] **Step 3: Implementar**

`src/components/Central.astro`:
```astro
---
import { Picture } from 'astro:assets';
import TituloSecao from './TituloSecao.astro';
import { central } from '../content/site';
import portao from '../assets/fotos/sobre-entrada.jpg';
import hall from '../assets/fotos/central-hall.jpg';
import fachada from '../assets/fotos/abertura-torre.jpg';
import perimetro from '../assets/fotos/central-perimetro.jpg';

const fotos = [portao, hall, fachada, perimetro];
const posicoes = ['50% 55%', '50% 50%', '50% 70%', '50% 80%'];
const horariosIniciais = ['19:42', '19:38', '19:35', '19:31', '19:27'];
---

<section class="secao central" id="central" aria-labelledby="central-titulo">
  <div class="container central__grade">
    <div>
      <TituloSecao id="central-titulo" titulo={central.titulo} manuscrito={central.manuscrito} />
      <p class="texto revelar">{central.texto}</p>
      <p class="rotulo central__nota revelar">{central.nota}</p>
    </div>
    <div class="central__painel revelar" aria-hidden="true" data-central data-eventos={JSON.stringify(central.eventos)}>
      <div class="central__cameras">
        {
          central.cameras.map((nome, i) => (
            <figure class="central__camera" style={`--posicao: ${posicoes[i]}`}>
              <Picture src={fotos[i]} alt="" formats={['avif', 'webp']} widths={[360, 640]} sizes="(max-width: 1099px) 45vw, 22vw" />
              <figcaption>{nome}</figcaption>
              <span class="central__rec">REC</span>
            </figure>
          ))
        }
      </div>
      <div class="central__registro">
        <p class="central__cabecalho"><span>Eventos</span><span data-relogio>19:42:10</span></p>
        <ul class="central__eventos" role="list" data-lista>
          {central.eventos.slice(0, 5).map((evento, i) => (<li><time>{horariosIniciais[i]}</time><span>{evento}</span></li>))}
        </ul>
      </div>
    </div>
  </div>
</section>

<script>
  const painel = document.querySelector<HTMLElement>('[data-central]');
  if (painel) {
    const eventos: string[] = JSON.parse(painel.dataset.eventos ?? '[]');
    const lista = painel.querySelector<HTMLUListElement>('[data-lista]');
    const relogio = painel.querySelector<HTMLElement>('[data-relogio]');
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MAXIMO = 7;
    let proximo = 0;
    let timerEventos: number | undefined;
    let timerRelogio: number | undefined;
    let visivel = false;

    const doisDigitos = (n: number) => String(n).padStart(2, '0');
    const horaMinuto = (data: Date) => `${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`;
    const criarLinha = (data: Date, texto: string) => {
      const linha = document.createElement('li');
      const hora = document.createElement('time');
      hora.textContent = horaMinuto(data);
      const descricao = document.createElement('span');
      descricao.textContent = texto;
      linha.append(hora, descricao);
      return linha;
    };

    if (lista && relogio && eventos.length > 0) {
      const agora = Date.now();
      lista.replaceChildren(...[0, 1, 2, 3, 4].map((i) => criarLinha(new Date(agora - i * 3 * 60_000), eventos[(i + 4) % eventos.length])));

      const adicionar = () => {
        const linha = criarLinha(new Date(), eventos[proximo % eventos.length]);
        proximo += 1;
        linha.classList.add('is-nova');
        lista.prepend(linha);
        while (lista.children.length > MAXIMO) lista.lastElementChild?.remove();
      };
      const atualizarRelogio = () => {
        const data = new Date();
        relogio.textContent = `${horaMinuto(data)}:${doisDigitos(data.getSeconds())}`;
      };
      const iniciar = () => {
        if (timerRelogio === undefined) {
          atualizarRelogio();
          timerRelogio = window.setInterval(atualizarRelogio, 1000);
        }
        if (!reduzir && timerEventos === undefined) timerEventos = window.setInterval(adicionar, 2600);
      };
      const parar = () => {
        window.clearInterval(timerEventos);
        window.clearInterval(timerRelogio);
        timerEventos = undefined;
        timerRelogio = undefined;
      };

      new IntersectionObserver(([entrada]) => {
        visivel = entrada.isIntersecting;
        if (visivel && !document.hidden) iniciar();
        else parar();
      }).observe(painel);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) parar();
        else if (visivel) iniciar();
      });
      atualizarRelogio();
      painel.dataset.pronto = 'true';
    }
  }
</script>

<style>
  .central__grade {
    display: grid;
    grid-template-columns: 4fr 7fr;
    align-items: start;
    gap: clamp(40px, 5vw, 64px);
  }

  .central__nota {
    margin-top: 28px;
  }

  .central__painel {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 16px;
    padding: 18px;
    border: 1px solid var(--line);
    background: var(--bg-deep);
  }

  .central__cameras {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .central__camera {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: #000;
  }

  .central__camera :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: var(--posicao);
    filter: grayscale(1) contrast(1.15) brightness(0.75);
  }

  .central__camera::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    background: rgba(144, 186, 66, 0.16);
    mix-blend-mode: screen;
  }

  .central__camera::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: -30%;
    z-index: 2;
    height: 30%;
    background: linear-gradient(180deg, transparent, rgba(183, 208, 111, 0.18), transparent);
    animation: varredura 3.6s linear infinite;
  }

  .central__camera:nth-child(2)::after {
    animation-delay: -1s;
  }

  .central__camera:nth-child(3)::after {
    animation-delay: -2s;
  }

  .central__camera:nth-child(4)::after {
    animation-delay: -2.8s;
  }

  @keyframes varredura {
    to {
      top: 110%;
    }
  }

  .central__camera figcaption {
    position: absolute;
    left: 8px;
    bottom: 7px;
    z-index: 3;
    font-size: 9.5px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .central__rec {
    position: absolute;
    right: 8px;
    top: 7px;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 9.5px;
    letter-spacing: 0.1em;
  }

  .central__rec::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #e5484d;
    animation: piscar 1.2s steps(2) infinite;
  }

  @keyframes piscar {
    50% {
      opacity: 0;
    }
  }

  .central__registro {
    display: flex;
    flex-direction: column;
    min-width: 0;
    padding-left: 16px;
    border-left: 1px solid var(--line);
  }

  .central__cabecalho {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    color: var(--accent);
    font-size: 10px;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .central__eventos {
    height: 236px;
    overflow: hidden;
  }

  .central__eventos :global(li) {
    padding: 9px 0;
    border-bottom: 1px solid var(--line);
    font-size: 12px;
    line-height: 1.45;
  }

  .central__eventos :global(li.is-nova) {
    animation: entrar 0.6s var(--ease);
  }

  .central__eventos :global(time) {
    margin-right: 8px;
    color: var(--accent);
    font-variant-numeric: tabular-nums;
  }

  .central__eventos :global(span) {
    color: var(--muted);
  }

  @keyframes entrar {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
  }

  @media (max-width: 1099px) {
    .central__grade {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 699px) {
    .central__painel {
      grid-template-columns: 1fr;
      padding: 12px;
    }

    .central__registro {
      padding: 12px 0 0;
      border-left: 0;
      border-top: 1px solid var(--line);
    }

    .central__eventos {
      height: auto;
    }

    .central__eventos :global(li:nth-child(n + 5)) {
      display: none;
    }
  }
</style>
```

`src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import Abertura from '../components/Abertura.astro';
import Sobre from '../components/Sobre.astro';
import Servicos from '../components/Servicos.astro';
import Central from '../components/Central.astro';
import ComoFunciona from '../components/ComoFunciona.astro';
import { seo } from '../content/site';
---

<Base titulo={seo.titulo} descricao={seo.descricao}>
  <Abertura />
  <Sobre />
  <Servicos />
  <Central />
  <ComoFunciona />
</Base>
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx playwright test tests/e2e/central.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: central ao vivo com câmeras e eventos em tempo real

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Contato e formulário de orçamento

**Files:**
- Create: `src/components/Contato.astro`
- Modify: `src/pages/index.astro` (arquivo completo abaixo)
- Test: `tests/e2e/formulario.spec.ts`

**Interfaces:**
- Consumes: `CIDADES_FORM`, `CAMPOS_PEDIDO`, `mascararTelefone`, `validarCampo`, `validarPedido`, `linkWhatsApp`, `mensagemWhatsAppSucesso`, `mensagemWhatsAppCompleta` e o tipo `DadosPedido` (Task 3); `contato`, `contatoSecao` (`site.ts`); `DEPLOY_TARGET`.
- Produces:
  - `#contato`.
  - Formulário `[data-form-orcamento]` com `data-modo="demo" | "php"`, `data-endpoint` e `data-whatsapp`.
  - Campos com ids `campo-{nome}`, erros em `#erro-{campo}` e campos ocultos `simulacao`, `website` e `t` (ms decorridos).
  - Painéis `[data-painel-sucesso]` (com `[data-aviso-demo]`) e `[data-painel-falha]`.
  - Escuta o evento `window` `cm:simulacao` (`detail: { resumo: string }`) e dispara `cm:evento` (`detail: { nome: 'gerar_lead' }`).

- [ ] **Step 1: Escrever os testes**

`tests/e2e/formulario.spec.ts`:
```ts
import { test, expect, type Page } from '@playwright/test';

async function preencher(page: Page) {
  await page.getByLabel('Nome', { exact: true }).fill('Ana Souza');
  await page.getByLabel('Telefone / WhatsApp').fill('12981854159');
  await page.getByLabel('E-mail', { exact: true }).fill('ana@exemplo.com');
  await page.getByLabel('Condomínio', { exact: true }).fill('Residencial Aurora');
  await page.getByLabel('Cidade', { exact: true }).selectOption('São José dos Campos');
  await page.getByLabel('Unidades', { exact: true }).fill('80');
}

async function usarModoPhp(page: Page) {
  await page.evaluate(() => {
    const form = document.querySelector<HTMLFormElement>('[data-form-orcamento]');
    if (!form) throw new Error('formulário não encontrado');
    form.dataset.modo = 'php';
    form.dataset.endpoint = '/teste/orcamento';
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto('./#contato');
});

test('mostra os erros dos campos obrigatórios', async ({ page }) => {
  await page.getByRole('button', { name: 'Enviar pedido' }).click();
  await expect(page.locator('#erro-nome')).toHaveText('Informe seu nome.');
  await expect(page.locator('#erro-telefone')).toHaveText('Informe um telefone com DDD.');
  await expect(page.locator('#erro-condominio')).toHaveText('Informe o nome do condomínio.');
  await expect(page.locator('#erro-cidade')).toHaveText('Escolha a cidade.');
  const nome = page.getByLabel('Nome', { exact: true });
  await expect(nome).toBeFocused();
  await expect(nome).toHaveAttribute('aria-invalid', 'true');
});

test('formata o telefone enquanto digita', async ({ page }) => {
  const telefone = page.getByLabel('Telefone / WhatsApp');
  await telefone.pressSequentially('12981854159');
  await expect(telefone).toHaveValue('(12) 98185-4159');
});

test('modo demonstração confirma sem enviar nada', async ({ page }) => {
  const envios: string[] = [];
  page.on('request', (requisicao) => {
    if (requisicao.method() === 'POST') envios.push(requisicao.url());
  });
  await preencher(page);
  await page.getByRole('button', { name: 'Enviar pedido' }).click();
  const painel = page.locator('[data-painel-sucesso]');
  await expect(painel).toBeVisible();
  await expect(painel).toContainText('Obrigado, Ana.');
  await expect(painel.locator('[data-aviso-demo]')).toBeVisible();
  await expect(painel.getByRole('link', { name: 'Continuar no WhatsApp' })).toHaveAttribute('href', /Ana%20Souza/);
  expect(envios).toEqual([]);
});

test('modo PHP: sucesso envia JSON e mostra a confirmação', async ({ page }) => {
  await page.route('**/teste/orcamento', (rota) => rota.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }));
  await usarModoPhp(page);
  await preencher(page);
  const [pedido] = await Promise.all([page.waitForRequest('**/teste/orcamento'), page.getByRole('button', { name: 'Enviar pedido' }).click()]);
  const corpo = pedido.postDataJSON();
  expect(corpo).toMatchObject({ nome: 'Ana Souza', telefone: '(12) 98185-4159', cidade: 'São José dos Campos', website: '' });
  expect(typeof corpo.t).toBe('number');
  await expect(page.locator('[data-painel-sucesso]')).toBeVisible();
  await expect(page.locator('[data-aviso-demo]')).toBeHidden();
});

test('modo PHP: falha oferece WhatsApp e mantém os dados', async ({ page }) => {
  await page.route('**/teste/orcamento', (rota) => rota.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ ok: false, error: 'envio' }) }));
  await usarModoPhp(page);
  await preencher(page);
  await page.getByRole('button', { name: 'Enviar pedido' }).click();
  const falha = page.locator('[data-painel-falha]');
  await expect(falha).toBeVisible();
  await expect(falha.getByRole('link', { name: 'Enviar pelo WhatsApp' })).toHaveAttribute('href', /Condom%C3%ADnio%3A%20Residencial%20Aurora/);
  await falha.getByRole('button', { name: 'Tentar de novo' }).click();
  await expect(page.getByLabel('Nome', { exact: true })).toHaveValue('Ana Souza');
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx playwright test tests/e2e/formulario.spec.ts`
Expected: FAIL, porque o `#contato` não existe.

- [ ] **Step 3: Implementar**

`src/components/Contato.astro`:
```astro
---
import { DEPLOY_TARGET } from 'astro:env/client';
import TituloSecao from './TituloSecao.astro';
import { contato, contatoSecao } from '../content/site';
import { CIDADES_FORM, linkWhatsApp } from '../lib/formulario';

const base = import.meta.env.BASE_URL;
const modo = DEPLOY_TARGET === 'hostgator' ? 'php' : 'demo';
const endpoint = `${base}api/orcamento.php`;
---

<section class="secao secao--alt contato" id="contato" aria-labelledby="contato-titulo">
  <div class="container contato__grade">
    <div>
      <TituloSecao id="contato-titulo" titulo={contatoSecao.titulo} manuscrito={contatoSecao.manuscrito} />
      <dl class="contato__lista revelar">
        <div><dt class="rotulo">Central 24h · ligação gratuita</dt><dd><a href={contato.telefone0800Link} data-evento="clique_telefone">{contato.telefone0800}</a></dd></div>
        <div><dt class="rotulo">WhatsApp</dt><dd><a href={linkWhatsApp(contato.whatsappNumero, contato.mensagemWhatsAppPadrao)} target="_blank" rel="noopener" data-evento="clique_whatsapp">{contato.whatsapp}</a></dd></div>
        <div><dt class="rotulo">E-mail</dt><dd><a href={`mailto:${contato.email}`}>{contato.email}</a></dd></div>
        <div><dt class="rotulo">Comercial</dt><dd>{contato.horarioComercial}</dd></div>
        <div><dt class="rotulo">Monitoramento e suporte</dt><dd>{contato.horarioSuporte}</dd></div>
      </dl>
    </div>

    <div class="contato__formulario revelar">
      <form
        class="form"
        method="post"
        action={modo === 'php' ? endpoint : undefined}
        novalidate
        data-form-orcamento
        data-modo={modo}
        data-endpoint={endpoint}
        data-whatsapp={contato.whatsappNumero}
      >
        <div class="form__campo">
          <label for="campo-nome">Nome</label>
          <input id="campo-nome" name="nome" type="text" autocomplete="name" required maxlength="80" aria-describedby="erro-nome" />
          <p class="form__erro" id="erro-nome" data-erro="nome"></p>
        </div>
        <div class="form__campo">
          <label for="campo-telefone">Telefone / WhatsApp</label>
          <input id="campo-telefone" name="telefone" type="tel" inputmode="tel" autocomplete="tel" required maxlength="16" aria-describedby="erro-telefone" />
          <p class="form__erro" id="erro-telefone" data-erro="telefone"></p>
        </div>
        <div class="form__campo">
          <label for="campo-email">E-mail</label>
          <input id="campo-email" name="email" type="email" autocomplete="email" maxlength="120" aria-describedby="erro-email" />
          <p class="form__erro" id="erro-email" data-erro="email"></p>
        </div>
        <div class="form__campo">
          <label for="campo-condominio">Condomínio</label>
          <input id="campo-condominio" name="condominio" type="text" required maxlength="100" aria-describedby="erro-condominio" />
          <p class="form__erro" id="erro-condominio" data-erro="condominio"></p>
        </div>
        <div class="form__campo">
          <label for="campo-cidade">Cidade</label>
          <select id="campo-cidade" name="cidade" required aria-describedby="erro-cidade">
            <option value="">Selecione</option>
            {CIDADES_FORM.map((cidade) => (<option value={cidade}>{cidade}</option>))}
          </select>
          <p class="form__erro" id="erro-cidade" data-erro="cidade"></p>
        </div>
        <div class="form__campo">
          <label for="campo-unidades">Unidades</label>
          <input id="campo-unidades" name="unidades" type="text" inputmode="numeric" maxlength="4" aria-describedby="erro-unidades" />
          <p class="form__erro" id="erro-unidades" data-erro="unidades"></p>
        </div>
        <div class="form__campo form__campo--inteiro">
          <label for="campo-mensagem">Mensagem (opcional)</label>
          <textarea id="campo-mensagem" name="mensagem" rows="3" maxlength="1000" aria-describedby="erro-mensagem"></textarea>
          <p class="form__erro" id="erro-mensagem" data-erro="mensagem"></p>
        </div>
        <input type="hidden" name="simulacao" value="" />
        <input type="hidden" name="t" value="" />
        <div class="form__isca" aria-hidden="true">
          <label for="campo-website">Não preencha este campo</label>
          <input id="campo-website" name="website" type="text" tabindex="-1" autocomplete="off" />
        </div>
        <div class="form__envio">
          <p class="form__consentimento">
            Ao enviar, você concorda com a nossa <a href={`${base}politica-de-privacidade/`}>Política de Privacidade</a>. Respondemos por e-mail ou WhatsApp.
          </p>
          <button class="pill pill--cheia" type="submit" data-enviar>{contatoSecao.botao}</button>
        </div>
      </form>

      <div class="form__painel" tabindex="-1" hidden data-painel-sucesso>
        <p class="form__painel-titulo">Pedido recebido.</p>
        <p class="texto" data-texto-sucesso>Obrigado! Nossa equipe vai entrar em contato em breve.</p>
        <p class="form__demo" hidden data-aviso-demo>Versão de demonstração: nenhum dado foi enviado. No site oficial, este pedido chega por e-mail.</p>
        <a class="pill pill--cheia" href={linkWhatsApp(contato.whatsappNumero, contato.mensagemWhatsAppPadrao)} target="_blank" rel="noopener" data-evento="clique_whatsapp" data-whatsapp-sucesso>Continuar no WhatsApp</a>
      </div>

      <div class="form__painel" tabindex="-1" hidden data-painel-falha>
        <p class="form__painel-titulo">Não conseguimos enviar agora.</p>
        <p class="texto">Você pode mandar o mesmo pedido pelo WhatsApp ou tentar de novo em instantes.</p>
        <div class="form__painel-botoes">
          <a class="pill pill--cheia" href={linkWhatsApp(contato.whatsappNumero, contato.mensagemWhatsAppPadrao)} target="_blank" rel="noopener" data-evento="clique_whatsapp" data-whatsapp-falha>Enviar pelo WhatsApp</a>
          <button class="pill" type="button" data-tentar-novamente>Tentar de novo</button>
        </div>
      </div>
    </div>
  </div>
</section>

<script>
  import {
    CAMPOS_PEDIDO,
    linkWhatsApp,
    mascararTelefone,
    mensagemWhatsAppCompleta,
    mensagemWhatsAppSucesso,
    validarCampo,
    validarPedido,
    type CampoPedido,
    type DadosPedido,
  } from '../lib/formulario';

  const form = document.querySelector<HTMLFormElement>('[data-form-orcamento]');
  const painelSucesso = document.querySelector<HTMLElement>('[data-painel-sucesso]');
  const painelFalha = document.querySelector<HTMLElement>('[data-painel-falha]');

  if (form && painelSucesso && painelFalha) {
    const numero = form.dataset.whatsapp ?? '';
    const abertoEm = Date.now();
    const botaoEnviar = form.querySelector<HTMLButtonElement>('[data-enviar]')!;
    const textoBotao = botaoEnviar.textContent ?? 'Enviar pedido';
    const campo = (nome: string) => form.elements.namedItem(nome) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;

    const ler = (): DadosPedido => {
      const valor = (nome: string) => (campo(nome)?.value ?? '').trim();
      return {
        nome: valor('nome'),
        telefone: valor('telefone'),
        email: valor('email'),
        condominio: valor('condominio'),
        cidade: valor('cidade'),
        unidades: valor('unidades'),
        mensagem: valor('mensagem'),
        simulacao: valor('simulacao'),
      };
    };

    const marcarErro = (nome: CampoPedido, mensagem?: string) => {
      const entrada = campo(nome);
      const erro = form.querySelector<HTMLElement>(`[data-erro="${nome}"]`);
      if (!entrada || !erro) return;
      erro.textContent = mensagem ?? '';
      if (mensagem) entrada.setAttribute('aria-invalid', 'true');
      else entrada.removeAttribute('aria-invalid');
    };

    const telefone = campo('telefone') as HTMLInputElement;
    telefone.addEventListener('input', () => {
      telefone.value = mascararTelefone(telefone.value);
    });

    CAMPOS_PEDIDO.forEach((nome) => {
      const entrada = campo(nome);
      entrada?.addEventListener('blur', () => {
        if (entrada.value.trim() !== '' || entrada.hasAttribute('aria-invalid')) marcarErro(nome, validarCampo(nome, entrada.value));
      });
    });

    const mostrar = (painel: HTMLElement) => {
      form.hidden = true;
      painelSucesso.hidden = painel !== painelSucesso;
      painelFalha.hidden = painel !== painelFalha;
      painel.focus();
    };

    const voltar = () => {
      form.hidden = false;
      painelSucesso.hidden = true;
      painelFalha.hidden = true;
      botaoEnviar.disabled = false;
      botaoEnviar.textContent = textoBotao;
      campo('nome')?.focus();
    };

    form.addEventListener('submit', async (evento) => {
      evento.preventDefault();
      const dados = ler();
      const erros = validarPedido(dados);
      CAMPOS_PEDIDO.forEach((nome) => marcarErro(nome, erros[nome]));
      const primeiroErro = CAMPOS_PEDIDO.find((nome) => erros[nome]);
      if (primeiroErro) {
        campo(primeiroErro)?.focus();
        return;
      }

      botaoEnviar.disabled = true;
      botaoEnviar.textContent = 'Enviando…';
      const primeiroNome = dados.nome.split(' ')[0];
      painelSucesso.querySelector<HTMLElement>('[data-texto-sucesso]')!.textContent = `Obrigado, ${primeiroNome}. Nossa equipe vai entrar em contato em breve.`;
      painelSucesso.querySelector<HTMLAnchorElement>('[data-whatsapp-sucesso]')!.href = linkWhatsApp(numero, mensagemWhatsAppSucesso(dados));
      painelFalha.querySelector<HTMLAnchorElement>('[data-whatsapp-falha]')!.href = linkWhatsApp(numero, mensagemWhatsAppCompleta(dados));

      if (form.dataset.modo !== 'php') {
        await new Promise((resolver) => window.setTimeout(resolver, 500));
        painelSucesso.querySelector<HTMLElement>('[data-aviso-demo]')!.hidden = false;
        mostrar(painelSucesso);
        return;
      }

      try {
        const controle = new AbortController();
        const limite = window.setTimeout(() => controle.abort(), 15000);
        const isca = (campo('website')?.value ?? '').trim();
        const resposta = await fetch(form.dataset.endpoint ?? '', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...dados, website: isca, t: Date.now() - abertoEm }),
          signal: controle.signal,
        });
        window.clearTimeout(limite);
        const corpo = (await resposta.json().catch(() => ({ ok: false }))) as { ok?: boolean };
        if (resposta.ok && corpo.ok) {
          painelSucesso.querySelector<HTMLElement>('[data-aviso-demo]')!.hidden = true;
          window.dispatchEvent(new CustomEvent('cm:evento', { detail: { nome: 'gerar_lead' } }));
          mostrar(painelSucesso);
        } else {
          mostrar(painelFalha);
        }
      } catch {
        mostrar(painelFalha);
      }
    });

    painelFalha.querySelector('[data-tentar-novamente]')?.addEventListener('click', voltar);

    window.addEventListener('cm:simulacao', (evento) => {
      const { resumo } = (evento as CustomEvent<{ resumo: string }>).detail;
      const simulacao = campo('simulacao') as HTMLInputElement;
      const mensagem = campo('mensagem') as HTMLTextAreaElement;
      simulacao.value = resumo;
      const restante = mensagem.value.replace(/^Simulação:.*(\n|$)/, '').trimStart();
      mensagem.value = restante ? `${resumo}\n${restante}` : resumo;
    });
  }
</script>

<style>
  .contato__grade {
    display: grid;
    grid-template-columns: 5fr 6fr;
    gap: clamp(40px, 6vw, 80px);
  }

  .contato__lista {
    border-top: 1px solid var(--line);
  }

  .contato__lista div {
    padding: 18px 0;
    border-bottom: 1px solid var(--line);
  }

  .contato__lista dt {
    margin-bottom: 6px;
  }

  .contato__lista dd {
    font-size: 17px;
    overflow-wrap: anywhere;
  }

  .contato__lista a:hover {
    color: var(--accent);
  }

  .contato__formulario {
    align-self: end;
  }

  .form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px 30px;
  }

  .form__campo--inteiro,
  .form__envio {
    grid-column: 1 / -1;
  }

  .form label {
    display: block;
    padding-top: 14px;
    color: var(--muted);
    font-size: 10.5px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .form input,
  .form select,
  .form textarea {
    width: 100%;
    padding: 10px 0 12px;
    border: 0;
    border-bottom: 1px solid var(--line-strong);
    border-radius: 0;
    background: transparent;
    color: var(--text);
    font-size: 16px;
  }

  .form textarea {
    min-height: 96px;
    resize: vertical;
  }

  .form select {
    appearance: none;
    background-image: linear-gradient(45deg, transparent 50%, var(--accent) 50%), linear-gradient(135deg, var(--accent) 50%, transparent 50%);
    background-position: calc(100% - 12px) 55%, calc(100% - 7px) 55%;
    background-size: 5px 5px;
    background-repeat: no-repeat;
  }

  .form select option {
    background: var(--bg);
    color: var(--text);
  }

  .form input:focus,
  .form select:focus,
  .form textarea:focus {
    outline: none;
    border-bottom-color: var(--accent);
    box-shadow: 0 1px 0 0 var(--accent);
  }

  .form [aria-invalid='true'] {
    border-bottom-color: #ff8a80;
  }

  .form__erro {
    min-height: 1.3em;
    margin-top: 6px;
    color: #ffb4a9;
    font-size: 12px;
  }

  .form__isca {
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  .form__envio {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-top: 22px;
  }

  .form__consentimento {
    max-width: 320px;
    color: var(--muted);
    font-size: 12px;
    line-height: 1.6;
  }

  .form__consentimento a {
    text-decoration: underline;
  }

  .form__painel {
    padding: clamp(24px, 4vw, 36px);
    border: 1px solid var(--line);
  }

  .form__painel:focus {
    outline: none;
  }

  .form__painel-titulo {
    margin-bottom: 12px;
    font-family: var(--font-serif);
    font-size: 34px;
  }

  .form__demo {
    margin-top: 18px;
    padding: 12px 16px;
    border-left: 2px solid var(--accent);
    background: rgba(183, 208, 111, 0.08);
    font-size: 13px;
  }

  .form__painel > .pill,
  .form__painel-botoes {
    margin-top: 24px;
  }

  .form__painel-botoes {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  @media (max-width: 899px) {
    .contato__grade {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 599px) {
    .form {
      grid-template-columns: 1fr;
    }

    .form__envio {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
```

`src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import Abertura from '../components/Abertura.astro';
import Sobre from '../components/Sobre.astro';
import Servicos from '../components/Servicos.astro';
import Central from '../components/Central.astro';
import ComoFunciona from '../components/ComoFunciona.astro';
import Contato from '../components/Contato.astro';
import { seo } from '../content/site';
---

<Base titulo={seo.titulo} descricao={seo.descricao}>
  <Abertura />
  <Sobre />
  <Servicos />
  <Central />
  <ComoFunciona />
  <Contato />
</Base>
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx playwright test tests/e2e/formulario.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: contato com formulário (modos demonstração e PHP) e alternativa por WhatsApp

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Simulador (interface)

**Files:**
- Create: `src/components/Simulador.astro`
- Modify: `src/pages/index.astro` (arquivo completo abaixo)
- Test: `tests/e2e/simulador.spec.ts`

**Interfaces:**
- Consumes: `PREMISSAS_PADRAO`, `ROTULO_TIPO`, `custoMensal`, `resultado`, `formatarReais`, `resumoSimulacao` e o tipo `TipoPortaria` (Task 2); `simulador` (`site.ts`); o evento `cm:simulacao`, ouvido pelo Contato (Task 8).
- Produces:
  - `#simulador`, com raiz `[data-simulador]` e `data-pronto="true"` depois de iniciar.
  - Entradas `#sim-unidades`, `#sim-diurno`, `#sim-noturno` e `#sim-valor`.
  - Saídas `[data-saida="mensal" | "unidade" | "anual" | "unidades" | "diurno" | "noturno" | "legenda"]`.
  - Dispara `cm:evento` com `uso_simulador` na primeira interação.

- [ ] **Step 1: Escrever os testes**

`tests/e2e/simulador.spec.ts`:
```ts
import { test, expect, type Page } from '@playwright/test';

const saida = (page: Page, nome: string) => page.locator(`[data-saida="${nome}"]`);

async function definir(page: Page, seletor: string, valor: string) {
  await page.locator(seletor).evaluate((elemento, novo) => {
    const entrada = elemento as HTMLInputElement;
    entrada.value = novo;
    entrada.dispatchEvent(new Event('input', { bubbles: true }));
  }, valor);
}

test.beforeEach(async ({ page }) => {
  await page.goto('./#simulador');
  await expect(page.locator('[data-simulador]')).toHaveAttribute('data-pronto', 'true');
});

test('valores padrão: portaria 24 horas', async ({ page }) => {
  await expect(saida(page, 'mensal')).toHaveText('R$ 24.480');
  await expect(saida(page, 'unidade')).toHaveText('R$ 306');
  await expect(saida(page, 'anual')).toHaveText('R$ 293.760');
});

test('troca o tipo de portaria', async ({ page }) => {
  await page.getByLabel('12h diurna', { exact: true }).check();
  await expect(saida(page, 'mensal')).toHaveText('R$ 10.800');
  await page.getByLabel('12h noturna', { exact: true }).check();
  await expect(saida(page, 'mensal')).toHaveText('R$ 13.680');
});

test('o número de unidades muda o custo por unidade', async ({ page }) => {
  await definir(page, '#sim-unidades', '100');
  await expect(saida(page, 'unidades')).toHaveText('100');
  await expect(saida(page, 'unidade')).toHaveText('R$ 245');
});

test('ajustar o custo do porteiro diurno', async ({ page }) => {
  await page.getByText('Ajustar valores').click();
  await definir(page, '#sim-diurno', '2500');
  await expect(saida(page, 'diurno')).toHaveText('R$ 2.500');
  await expect(saida(page, 'mensal')).toHaveText('R$ 22.680');
});

test('"Já sei quanto pago" usa o valor informado', async ({ page }) => {
  await page.getByLabel('Já sei quanto pago').check();
  await page.getByLabel('Valor mensal atual (R$)').fill('20000');
  await definir(page, '#sim-unidades', '100');
  await expect(saida(page, 'mensal')).toHaveText('R$ 20.000');
  await expect(saida(page, 'unidade')).toHaveText('R$ 200');
  await expect(saida(page, 'anual')).toHaveText('R$ 240.000');
});

test('o botão leva a simulação para o formulário', async ({ page }) => {
  await page.getByRole('button', { name: 'Quero saber quanto economizo' }).click();
  await expect(page.locator('input[name="simulacao"]')).toHaveValue(
    'Simulação: portaria 24 horas (2 diurnos + 2 noturnos), 80 unidades. Custo estimado: R$ 24.480/mês (R$ 306 por unidade).',
  );
  await expect(page.getByLabel('Mensagem (opcional)')).toHaveValue(/^Simulação: portaria 24 horas/);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx playwright test tests/e2e/simulador.spec.ts`
Expected: FAIL, porque o `[data-simulador]` não existe.

- [ ] **Step 3: Implementar**

`src/components/Simulador.astro`:
```astro
---
import TituloSecao from './TituloSecao.astro';
import { simulador } from '../content/site';
import { custoMensal, formatarReais, PREMISSAS_PADRAO, resultado, ROTULO_TIPO, type TipoPortaria } from '../lib/simulador';

const tipos: TipoPortaria[] = ['24h', '12h-diurna', '12h-noturna'];
const UNIDADES_PADRAO = 80;
const inicial = resultado(custoMensal('24h'), UNIDADES_PADRAO);
---

<section class="secao simulador" id="simulador" aria-labelledby="simulador-titulo">
  <div class="container">
    <TituloSecao id="simulador-titulo" titulo={simulador.titulo} manuscrito={simulador.manuscrito} />

    <div class="simulador__grade revelar" data-simulador>
      <div class="simulador__controles">
        <fieldset class="simulador__campo" data-campo-estimativa>
          <legend class="rotulo">Portaria atual</legend>
          <div class="simulador__tipos">
            {
              tipos.map((tipo, i) => (
                <label class="simulador__tipo">
                  <input type="radio" name="tipo" value={tipo} checked={i === 0} />
                  <span>{ROTULO_TIPO[tipo]}</span>
                </label>
              ))
            }
          </div>
        </fieldset>

        <div class="simulador__campo">
          <label class="rotulo simulador__rotulo" for="sim-unidades">
            Número de unidades <output for="sim-unidades" data-saida="unidades">{UNIDADES_PADRAO}</output>
          </label>
          <input id="sim-unidades" type="range" min="10" max="400" step="5" value={UNIDADES_PADRAO} />
        </div>

        <details class="simulador__ajustes" data-campo-estimativa>
          <summary>Ajustar valores</summary>
          <div class="simulador__campo">
            <label class="rotulo simulador__rotulo" for="sim-diurno">
              Custo do porteiro diurno <output for="sim-diurno" data-saida="diurno">{formatarReais(PREMISSAS_PADRAO.custoDiurno)}</output>
            </label>
            <input id="sim-diurno" type="range" min="1500" max="6000" step="50" value={PREMISSAS_PADRAO.custoDiurno} />
          </div>
          <div class="simulador__campo">
            <label class="rotulo simulador__rotulo" for="sim-noturno">
              Custo do porteiro noturno <output for="sim-noturno" data-saida="noturno">{formatarReais(PREMISSAS_PADRAO.custoNoturno)}</output>
            </label>
            <input id="sim-noturno" type="range" min="1500" max="7000" step="50" value={PREMISSAS_PADRAO.custoNoturno} />
          </div>
          <p class="simulador__nota">Encargos de 80% (FGTS, INSS, férias e 13º) já entram na conta.</p>
        </details>

        <div class="simulador__informado">
          <label class="simulador__alternar">
            <input type="checkbox" data-alternar-informado />
            <span>Já sei quanto pago</span>
          </label>
          <div class="simulador__campo" hidden data-campo-informado>
            <label class="rotulo" for="sim-valor">Valor mensal atual (R$)</label>
            <input id="sim-valor" class="simulador__valor" type="number" inputmode="numeric" min="0" step="100" placeholder="Ex.: 20000" />
          </div>
        </div>
      </div>

      <div class="simulador__resultado">
        <p class="simulador__mensal">
          <span data-saida="mensal">{formatarReais(inicial.mensal)}</span>
          <small data-saida="legenda">por mês com a portaria atual</small>
        </p>
        <div class="simulador__mini">
          <p><b data-saida="unidade">{formatarReais(inicial.porUnidade)}</b><span>por unidade / mês</span></p>
          <p><b data-saida="anual">{formatarReais(inicial.anual)}</b><span>por ano</span></p>
        </div>
        <p class="sr-only" aria-live="polite" data-anuncio></p>
        <p class="simulador__aviso">{simulador.aviso}</p>
        <button class="pill pill--cheia simulador__botao" type="button" data-cta-simulador>{simulador.botao}</button>
      </div>
    </div>
  </div>
</section>

<script>
  import { custoMensal, formatarReais, PREMISSAS_PADRAO, resultado, resumoSimulacao, type TipoPortaria } from '../lib/simulador';

  const raiz = document.querySelector<HTMLElement>('[data-simulador]');
  if (raiz) {
    const unidades = raiz.querySelector<HTMLInputElement>('#sim-unidades')!;
    const diurno = raiz.querySelector<HTMLInputElement>('#sim-diurno')!;
    const noturno = raiz.querySelector<HTMLInputElement>('#sim-noturno')!;
    const valor = raiz.querySelector<HTMLInputElement>('#sim-valor')!;
    const alternar = raiz.querySelector<HTMLInputElement>('[data-alternar-informado]')!;
    const campoInformado = raiz.querySelector<HTMLElement>('[data-campo-informado]')!;
    const camposEstimativa = raiz.querySelectorAll<HTMLElement>('[data-campo-estimativa]');
    const anuncio = raiz.querySelector<HTMLElement>('[data-anuncio]')!;
    const saida = (nome: string) => raiz.querySelector<HTMLElement>(`[data-saida="${nome}"]`)!;
    let timerAnuncio: number | undefined;
    let usou = false;

    const tipoAtual = () => (raiz.querySelector<HTMLInputElement>('input[name="tipo"]:checked')?.value ?? '24h') as TipoPortaria;

    const estado = () => {
      const informado = alternar.checked;
      const totalUnidades = Number(unidades.value);
      const mensal = informado
        ? Math.max(0, Number(valor.value) || 0)
        : custoMensal(tipoAtual(), { ...PREMISSAS_PADRAO, custoDiurno: Number(diurno.value), custoNoturno: Number(noturno.value) });
      return { informado, tipo: tipoAtual(), unidades: totalUnidades, ...resultado(mensal, totalUnidades) };
    };

    const atualizar = () => {
      const e = estado();
      saida('unidades').textContent = String(e.unidades);
      saida('diurno').textContent = formatarReais(Number(diurno.value));
      saida('noturno').textContent = formatarReais(Number(noturno.value));
      diurno.setAttribute('aria-valuetext', formatarReais(Number(diurno.value)));
      noturno.setAttribute('aria-valuetext', formatarReais(Number(noturno.value)));
      saida('mensal').textContent = formatarReais(e.mensal);
      saida('legenda').textContent = e.informado ? 'por mês, valor informado' : 'por mês com a portaria atual';
      saida('unidade').textContent = formatarReais(e.porUnidade);
      saida('anual').textContent = formatarReais(e.anual);
      window.clearTimeout(timerAnuncio);
      timerAnuncio = window.setTimeout(() => {
        anuncio.textContent = `${formatarReais(e.mensal)} por mês, ${formatarReais(e.porUnidade)} por unidade.`;
      }, 700);
    };

    const aoInteragir = () => {
      if (!usou) {
        usou = true;
        window.dispatchEvent(new CustomEvent('cm:evento', { detail: { nome: 'uso_simulador' } }));
      }
      atualizar();
    };

    alternar.addEventListener('change', () => {
      campoInformado.hidden = !alternar.checked;
      camposEstimativa.forEach((campo) => {
        campo.hidden = alternar.checked;
      });
      if (alternar.checked) valor.focus();
    });
    raiz.addEventListener('input', aoInteragir);
    raiz.addEventListener('change', aoInteragir);

    raiz.querySelector<HTMLButtonElement>('[data-cta-simulador]')!.addEventListener('click', () => {
      const e = estado();
      const resumo = resumoSimulacao({ tipo: e.tipo, unidades: e.unidades, mensal: e.mensal, informado: e.informado });
      window.dispatchEvent(new CustomEvent('cm:simulacao', { detail: { resumo } }));
      const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.getElementById('contato')?.scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth' });
      window.setTimeout(() => document.getElementById('campo-nome')?.focus({ preventScroll: true }), 600);
    });

    atualizar();
    raiz.dataset.pronto = 'true';
  }
</script>

<style>
  .simulador__grade {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border: 1px solid var(--line);
  }

  .simulador__controles {
    padding: clamp(24px, 3.4vw, 40px);
    border-right: 1px solid var(--line);
  }

  .simulador__campo {
    min-width: 0;
    margin: 0 0 30px;
    padding: 0;
    border: 0;
  }

  .simulador__campo legend {
    margin-bottom: 14px;
  }

  .simulador__rotulo {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .simulador__rotulo output {
    color: var(--text);
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.06em;
  }

  .simulador__tipos {
    display: flex;
    padding: 4px;
    border: 1px solid var(--line);
    border-radius: var(--radius-pill);
  }

  .simulador__tipo {
    position: relative;
    flex: 1;
  }

  .simulador__tipo input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
  }

  .simulador__tipo span {
    display: block;
    padding: 11px 6px;
    border-radius: var(--radius-pill);
    color: var(--muted);
    font-size: 11.5px;
    letter-spacing: 0.1em;
    text-align: center;
    text-transform: uppercase;
    transition: background-color 0.3s, color 0.3s;
  }

  .simulador__tipo input:checked + span {
    background: var(--accent);
    color: var(--on-accent);
    font-weight: 500;
  }

  .simulador__tipo input:focus-visible + span {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .simulador input[type='range'] {
    width: 100%;
    accent-color: var(--accent);
  }

  .simulador__ajustes {
    margin: -6px 0 26px;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }

  .simulador__ajustes summary {
    padding: 14px 0;
    color: var(--accent);
    font-size: 11.5px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    list-style: none;
    cursor: pointer;
  }

  .simulador__ajustes summary::-webkit-details-marker {
    display: none;
  }

  .simulador__ajustes summary::after {
    content: ' +';
  }

  .simulador__ajustes[open] summary::after {
    content: ' −';
  }

  .simulador__ajustes .simulador__campo {
    margin-bottom: 20px;
  }

  .simulador__nota {
    margin-bottom: 16px;
    color: var(--muted);
    font-size: 12px;
  }

  .simulador__alternar {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    cursor: pointer;
  }

  .simulador__alternar input {
    width: 18px;
    height: 18px;
    accent-color: var(--accent);
  }

  .simulador__informado .simulador__campo {
    margin-top: 18px;
  }

  .simulador__valor {
    width: 100%;
    padding: 10px 0 12px;
    border: 0;
    border-bottom: 1px solid var(--line-strong);
    background: transparent;
    font-family: var(--font-serif);
    font-size: 22px;
  }

  .simulador__resultado {
    display: flex;
    flex-direction: column;
    padding: clamp(24px, 3.4vw, 40px);
    background: linear-gradient(160deg, rgba(183, 208, 111, 0.07), transparent 60%);
  }

  .simulador__mensal span {
    display: block;
    font-family: var(--font-serif);
    font-weight: 300;
    font-size: clamp(48px, 6vw, 76px);
    line-height: 1;
    font-variant-numeric: lining-nums;
  }

  .simulador__mensal small {
    display: block;
    margin-top: 10px;
    color: var(--muted);
    font-size: 12px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .simulador__mini {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 28px 0;
    border-block: 1px solid var(--line);
  }

  .simulador__mini p {
    padding: 16px 0;
  }

  .simulador__mini p + p {
    padding-left: 22px;
    border-left: 1px solid var(--line);
  }

  .simulador__mini b {
    display: block;
    font-family: var(--font-serif);
    font-weight: 400;
    font-size: clamp(24px, 2.6vw, 32px);
    font-variant-numeric: lining-nums;
  }

  .simulador__mini span {
    color: var(--muted);
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .simulador__aviso {
    margin-bottom: 24px;
    color: var(--muted);
    font-size: 12px;
    line-height: 1.65;
  }

  .simulador__botao {
    align-self: flex-start;
    margin-top: auto;
  }

  @media (max-width: 899px) {
    .simulador__grade {
      grid-template-columns: 1fr;
    }

    .simulador__controles {
      border-right: 0;
      border-bottom: 1px solid var(--line);
    }

    .simulador__botao {
      align-self: stretch;
      white-space: normal;
      text-align: center;
    }
  }

  @media (max-width: 499px) {
    .simulador__tipo span {
      font-size: 10px;
      letter-spacing: 0.06em;
    }
  }
</style>
```

`src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import Abertura from '../components/Abertura.astro';
import Sobre from '../components/Sobre.astro';
import Servicos from '../components/Servicos.astro';
import Central from '../components/Central.astro';
import ComoFunciona from '../components/ComoFunciona.astro';
import Simulador from '../components/Simulador.astro';
import Contato from '../components/Contato.astro';
import { seo } from '../content/site';
---

<Base titulo={seo.titulo} descricao={seo.descricao}>
  <Abertura />
  <Sobre />
  <Servicos />
  <Central />
  <ComoFunciona />
  <Simulador />
  <Contato />
</Base>
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx playwright test tests/e2e/simulador.spec.ts tests/e2e/formulario.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: simulador de custo da portaria com resultado instantâneo

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Cobertura (mapa) e Dúvidas

**Files:**
- Create: `src/components/Cobertura.astro`, `src/components/Duvidas.astro`
- Modify: `src/pages/index.astro` (arquivo completo abaixo)
- Test: `tests/e2e/cobertura-duvidas.spec.ts`

**Interfaces:**
- Consumes: `cobertura` e `duvidas` (`site.ts`).
- Produces: `#cobertura`, com mapa SVG `role="img"` e título "Mapa do Vale do Paraíba…"; `#duvidas`, com `details[name="duvidas"]`.

- [ ] **Step 1: Escrever os testes**

`tests/e2e/cobertura-duvidas.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('cobertura lista as cinco cidades e destaca a central', async ({ page }) => {
  await page.goto('./#cobertura');
  const itens = page.locator('.cobertura__lista li');
  await expect(itens).toHaveCount(5);
  await expect(itens.first()).toContainText('São José dos Campos');
  await expect(itens.first()).toContainText('Central 24h');
  await expect(page.getByRole('img', { name: /Mapa do Vale do Paraíba/ })).toBeVisible();
});

test('dúvidas: seis perguntas, com a primeira aberta', async ({ page }) => {
  await page.goto('./#duvidas');
  const perguntas = page.locator('#duvidas details');
  await expect(perguntas).toHaveCount(6);
  await expect(perguntas.first()).toHaveAttribute('open', '');
  await perguntas.nth(4).locator('summary').click();
  await expect(perguntas.nth(4)).toHaveAttribute('open', '');
  await expect(perguntas.nth(4)).toContainText('análise técnica sem compromisso');
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx playwright test tests/e2e/cobertura-duvidas.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar**

`src/components/Cobertura.astro`:
```astro
---
import TituloSecao from './TituloSecao.astro';
import { cobertura } from '../content/site';
---

<section class="secao secao--alt cobertura" id="cobertura" aria-labelledby="cobertura-titulo">
  <div class="container">
    <TituloSecao id="cobertura-titulo" titulo={cobertura.titulo} manuscrito={cobertura.manuscrito} />
    <div class="cobertura__grade">
      <div class="revelar">
        <ul class="cobertura__lista" role="list">
          {
            cobertura.pinos.map((pino) => (
              <li class:list={[{ 'is-sede': pino.sede }]}>
                <i aria-hidden="true" />
                {pino.cidade}
                {pino.sede && <small>Central 24h</small>}
              </li>
            ))
          }
        </ul>
        <p class="rotulo cobertura__nota">{cobertura.nota}</p>
      </div>
      <figure class="cobertura__mapa revelar">
        <svg viewBox="0 0 800 420" role="img" aria-labelledby="mapa-titulo">
          <title id="mapa-titulo">Mapa do Vale do Paraíba com as cidades atendidas pela CM Portaria Virtual</title>
          <defs>
            <pattern id="mapa-grade" width="34" height="34" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
              <path d="M34 0H0V34" fill="none" stroke="rgba(236,232,221,.05)" />
            </pattern>
          </defs>
          <rect width="800" height="420" fill="url(#mapa-grade)" />
          <path d="M18 300 C90 306 140 262 200 232 S330 206 400 176 S520 146 560 122 S650 78 700 48 S770 18 792 10" fill="none" stroke="rgba(110,170,190,.35)" stroke-width="2.2" />
          <text class="mapa-rotulo mapa-rotulo--rio" x="232" y="214" transform="rotate(-14 232 214)">RIO PARAÍBA DO SUL</text>
          <path d="M30 372 L111 331 L197 246 L300 214 L392 186 L556 132 L658 62 L770 22" fill="none" stroke="rgba(236,232,221,.3)" stroke-width="1.4" stroke-dasharray="6 6" />
          <text class="mapa-rotulo" x="430" y="204" transform="rotate(-18 430 204)">RODOVIA PRESIDENTE DUTRA</text>
          <text class="mapa-rotulo mapa-rotulo--serra" x="60" y="60">SERRA DA MANTIQUEIRA</text>
          <text class="mapa-rotulo mapa-rotulo--serra" x="470" y="380">SERRA DO MAR</text>
          {
            cobertura.pinos.map((pino, i) => (
              <g>
                <circle class="mapa-pulso" cx={pino.x} cy={pino.y} r={pino.sede ? 9 : 6} style={`animation-delay: -${i * 0.5}s`} />
                <circle class="mapa-ponto" cx={pino.x} cy={pino.y} r={pino.sede ? 8 : 5} />
                <text class="mapa-cidade" x={pino.rotuloX} y={pino.rotuloY}>{pino.cidade}</text>
              </g>
            ))
          }
        </svg>
      </figure>
    </div>
  </div>
</section>

<style>
  .cobertura__grade {
    display: grid;
    grid-template-columns: 4fr 7fr;
    align-items: center;
    gap: clamp(32px, 5vw, 56px);
  }

  .cobertura__lista {
    border-top: 1px solid var(--line);
  }

  .cobertura__lista li {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 0;
    border-bottom: 1px solid var(--line);
    font-size: 15px;
  }

  .cobertura__lista i {
    flex: none;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--accent);
  }

  .cobertura__lista .is-sede i {
    width: 13px;
    height: 13px;
    box-shadow: 0 0 0 5px rgba(183, 208, 111, 0.18);
  }

  .cobertura__lista small {
    margin-left: auto;
    color: var(--muted);
    font-size: 10.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .cobertura__nota {
    margin-top: 18px;
  }

  .cobertura__mapa {
    border: 1px solid var(--line);
    background: var(--bg-deep);
  }

  .cobertura__mapa svg {
    width: 100%;
    height: auto;
  }

  .mapa-rotulo {
    fill: rgba(236, 232, 221, 0.5);
    font-family: var(--font-sans);
    font-size: 10px;
    letter-spacing: 2px;
  }

  .mapa-rotulo--rio {
    fill: rgba(140, 195, 215, 0.7);
  }

  .mapa-rotulo--serra {
    fill: rgba(236, 232, 221, 0.32);
    font-size: 11px;
    letter-spacing: 3px;
  }

  .mapa-cidade {
    fill: var(--text);
    font-family: var(--font-sans);
    font-size: 12px;
    letter-spacing: 1px;
  }

  .mapa-ponto {
    fill: var(--accent);
  }

  .mapa-pulso {
    fill: rgba(183, 208, 111, 0.45);
    transform-box: fill-box;
    transform-origin: center;
    animation: pulso 2.4s ease-out infinite;
  }

  @keyframes pulso {
    0% {
      transform: scale(0.6);
      opacity: 0.9;
    }

    100% {
      transform: scale(3.2);
      opacity: 0;
    }
  }

  @media (max-width: 899px) {
    .cobertura__grade {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 699px) {
    .mapa-rotulo {
      display: none;
    }

    .mapa-cidade {
      font-size: 24px;
    }
  }
</style>
```

`src/components/Duvidas.astro`:
```astro
---
import TituloSecao from './TituloSecao.astro';
import { duvidas } from '../content/site';
---

<section class="secao duvidas" id="duvidas" aria-labelledby="duvidas-titulo">
  <div class="container">
    <TituloSecao id="duvidas-titulo" titulo={duvidas.titulo} manuscrito={duvidas.manuscrito} />
    <div class="duvidas__lista revelar">
      {
        duvidas.perguntas.map((item, i) => (
          <details name="duvidas" open={i === 0}>
            <summary>{item.pergunta}</summary>
            <p>{item.resposta}</p>
          </details>
        ))
      }
    </div>
  </div>
</section>

<style>
  .duvidas__lista details {
    border-bottom: 1px solid var(--line);
  }

  .duvidas__lista details:first-child {
    border-top: 1px solid var(--line);
  }

  .duvidas__lista summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 24px 0;
    font-family: var(--font-serif);
    font-size: clamp(20px, 2.2vw, 25px);
    letter-spacing: 0.03em;
    list-style: none;
    cursor: pointer;
  }

  .duvidas__lista summary::-webkit-details-marker {
    display: none;
  }

  .duvidas__lista summary::after {
    content: '+';
    flex: none;
    color: var(--accent);
    font-family: var(--font-sans);
    font-weight: 300;
    font-size: 26px;
    line-height: 1;
    transition: transform 0.3s var(--ease);
  }

  .duvidas__lista details[open] summary::after {
    transform: rotate(45deg);
  }

  .duvidas__lista p {
    max-width: 760px;
    padding-bottom: 24px;
    color: var(--muted);
    font-size: 15px;
    line-height: 1.75;
  }
</style>
```

`src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import Abertura from '../components/Abertura.astro';
import Sobre from '../components/Sobre.astro';
import Servicos from '../components/Servicos.astro';
import Central from '../components/Central.astro';
import ComoFunciona from '../components/ComoFunciona.astro';
import Simulador from '../components/Simulador.astro';
import Cobertura from '../components/Cobertura.astro';
import Duvidas from '../components/Duvidas.astro';
import Contato from '../components/Contato.astro';
import { seo } from '../content/site';
---

<Base titulo={seo.titulo} descricao={seo.descricao}>
  <Abertura />
  <Sobre />
  <Servicos />
  <Central />
  <ComoFunciona />
  <Simulador />
  <Cobertura />
  <Duvidas />
  <Contato />
</Base>
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx playwright test tests/e2e/cobertura-duvidas.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: mapa de cobertura e dúvidas frequentes

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: SEO, imagens sociais, Política de Privacidade e 404

**Files:**
- Create: `src/lib/esquemas.ts`, `tests/unit/esquemas.test.ts`, `scripts/gerar-imagens-sociais.mjs`, `public/og-image.jpg`, `public/favicon.ico`, `public/favicon-32.png`, `public/apple-touch-icon.png`, `src/pages/politica-de-privacidade.astro`, `src/pages/404.astro`, `src/pages/robots.txt.ts`
- Modify: `src/layouts/Base.astro` (arquivo completo abaixo), `src/pages/index.astro` (arquivo completo abaixo)
- Test: `tests/e2e/seo.spec.ts`

**Interfaces:**
- Consumes: `cidades`, `duvidas` e `seo` (`site.ts`).
- Produces:
  - `esquemaEmpresa(url: string, cidades: string[]): Record<string, unknown>` e `esquemaPerguntas(perguntas: { pergunta: string; resposta: string }[]): Record<string, unknown>`.
  - `Base.astro` passa a aceitar as props `esquemas?: Record<string, unknown>[]` e `semIndice?: boolean`.

- [ ] **Step 1: Testes unitários dos dados estruturados**

`tests/unit/esquemas.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { esquemaEmpresa, esquemaPerguntas } from '../../src/lib/esquemas';

describe('esquemaEmpresa', () => {
  const empresa = esquemaEmpresa('https://www.cmportariavirtual.com.br/', ['São José dos Campos', 'Jacareí']);

  it('é um LocalBusiness com nome, endereço e funcionamento 24/7', () => {
    expect(empresa['@type']).toBe('LocalBusiness');
    expect(empresa.name).toBe('CM Portaria Virtual');
    expect(empresa.address).toMatchObject({ addressLocality: 'São José dos Campos', addressRegion: 'SP', addressCountry: 'BR' });
    expect(JSON.stringify(empresa.openingHoursSpecification)).toContain('23:59');
  });

  it('lista as cidades atendidas', () => {
    expect(empresa.areaServed).toEqual([
      { '@type': 'City', name: 'São José dos Campos' },
      { '@type': 'City', name: 'Jacareí' },
    ]);
  });

  it('não declara avaliações', () => {
    expect(JSON.stringify(empresa)).not.toMatch(/rating|review/i);
  });
});

describe('esquemaPerguntas', () => {
  it('converte perguntas e respostas em FAQPage', () => {
    expect(esquemaPerguntas([{ pergunta: 'P?', resposta: 'R.' }])).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [{ '@type': 'Question', name: 'P?', acceptedAnswer: { '@type': 'Answer', text: 'R.' } }],
    });
  });
});
```

Run: `npx vitest run tests/unit/esquemas.test.ts`
Expected: FAIL, com o erro de módulo não encontrado.

- [ ] **Step 2: Implementar os dados estruturados**

`src/lib/esquemas.ts`:
```ts
/** Dados estruturados (schema.org) só com informações reais: sem avaliações nem preços. */

const DIAS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function esquemaEmpresa(url: string, cidades: string[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'CM Portaria Virtual',
    description: 'Portaria virtual e monitoramento 24 horas para condomínios em São José dos Campos e no Vale do Paraíba.',
    url,
    image: `${url}og-image.jpg`,
    telephone: '+55-12-98185-4159',
    email: 'contato@cmportariavirtual.com.br',
    address: { '@type': 'PostalAddress', addressLocality: 'São José dos Campos', addressRegion: 'SP', addressCountry: 'BR' },
    areaServed: cidades.map((cidade) => ({ '@type': 'City', name: cidade })),
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: DIAS, opens: '00:00', closes: '23:59' }],
  };
}

export function esquemaPerguntas(perguntas: { pergunta: string; resposta: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: perguntas.map((item) => ({ '@type': 'Question', name: item.pergunta, acceptedAnswer: { '@type': 'Answer', text: item.resposta } })),
  };
}
```

Run: `npx vitest run tests/unit/esquemas.test.ts`
Expected: PASS (4 testes).

- [ ] **Step 3: Teste de SEO e páginas (vai falhar)**

`tests/e2e/seo.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('metadados e dados estruturados da página inicial', async ({ page, request }) => {
  await page.goto('./');
  await expect(page).toHaveTitle('Portaria Virtual em São José dos Campos | CM Portaria Virtual');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://viniciuscruz-dev.github.io/cm-portaria-virtual/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://viniciuscruz-dev.github.io/cm-portaria-virtual/og-image.jpg');
  const blocos = await page.locator('script[type="application/ld+json"]').allTextContents();
  const dados = blocos.map((bloco) => JSON.parse(bloco));
  expect(dados.map((d) => d['@type']).sort()).toEqual(['FAQPage', 'LocalBusiness']);
  expect(dados.find((d) => d['@type'] === 'FAQPage').mainEntity).toHaveLength(6);
  for (const arquivo of ['favicon.ico', 'favicon-32.png', 'apple-touch-icon.png', 'og-image.jpg', 'robots.txt']) {
    const resposta = await request.get(arquivo);
    expect(resposta.status(), arquivo).toBe(200);
  }
});

test('política de privacidade abre e volta para o início', async ({ page }) => {
  await page.goto('./politica-de-privacidade/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Política de privacidade');
  await expect(page.locator('main')).toContainText('art. 18');
  await page.getByRole('link', { name: 'Voltar ao início' }).click();
  await expect(page).toHaveURL(/\/cm-portaria-virtual\/$/);
});

test('página inexistente mostra a 404 própria', async ({ page }) => {
  const resposta = await page.goto('./pagina-que-nao-existe/');
  expect(resposta?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Página não encontrada');
});
```

Run: `npx playwright test tests/e2e/seo.spec.ts`
Expected: FAIL, porque ainda não há canonical, favicons nem a política.

- [ ] **Step 4: Gerar favicons e a imagem de compartilhamento**

`scripts/gerar-imagens-sociais.mjs`:
```js
// Gera favicons (a partir do logo) e a imagem de compartilhamento 1200x630 (abertura + título).
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { chromium } from '@playwright/test';

const LOGO = 'src/assets/logo-cm.png';
const FOTO = 'src/assets/fotos/abertura-torre.jpg';

function criarIco(imagens) {
  const cabecalho = Buffer.alloc(6);
  cabecalho.writeUInt16LE(0, 0);
  cabecalho.writeUInt16LE(1, 2);
  cabecalho.writeUInt16LE(imagens.length, 4);
  let deslocamento = 6 + 16 * imagens.length;
  const entradas = imagens.map(({ tamanho, png }) => {
    const entrada = Buffer.alloc(16);
    entrada.writeUInt8(tamanho, 0);
    entrada.writeUInt8(tamanho, 1);
    entrada.writeUInt8(0, 2);
    entrada.writeUInt8(0, 3);
    entrada.writeUInt16LE(1, 4);
    entrada.writeUInt16LE(32, 6);
    entrada.writeUInt32LE(png.length, 8);
    entrada.writeUInt32LE(deslocamento, 12);
    deslocamento += png.length;
    return entrada;
  });
  return Buffer.concat([cabecalho, ...entradas, ...imagens.map((imagem) => imagem.png)]);
}

await sharp(LOGO).resize(32, 32).png().toFile('public/favicon-32.png');
const png16 = await sharp(LOGO).resize(16, 16).png().toBuffer();
const png32 = await sharp(LOGO).resize(32, 32).png().toBuffer();
await writeFile('public/favicon.ico', criarIco([{ tamanho: 16, png: png16 }, { tamanho: 32, png: png32 }]));
const logo140 = await sharp(LOGO).resize(140, 140).png().toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#0b2426' } })
  .composite([{ input: logo140, gravity: 'center' }])
  .png()
  .toFile('public/apple-touch-icon.png');

const foto = (await sharp(FOTO).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82 }).toBuffer()).toString('base64');
const logo = (await readFile(LOGO)).toString('base64');
const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400&family=Great+Vibes&family=Manrope:wght@500&display=block" rel="stylesheet">
<style>
  body{margin:0;width:1200px;height:630px;position:relative;overflow:hidden;background:#0b2426;color:#ece8dd}
  .foto{position:absolute;inset:0;background:url(data:image/jpeg;base64,${foto}) center/cover}
  .veu{position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,36,38,.92) 0%,rgba(11,36,38,.55) 45%,rgba(11,36,38,.92) 100%)}
  .conteudo{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
  img{width:96px;height:96px;margin-bottom:22px}
  h1{margin:0;font:400 72px/1.02 'Cormorant Garamond',serif;letter-spacing:.06em;text-transform:uppercase}
  p{margin:8px 0 0;font:58px/1 'Great Vibes',cursive;color:#b7d06f;transform:rotate(-3deg)}
  small{position:absolute;left:0;right:0;bottom:34px;text-align:center;font:500 16px 'Manrope',sans-serif;letter-spacing:.2em;text-transform:uppercase;opacity:.85}
</style></head><body>
<div class="foto"></div><div class="veu"></div>
<div class="conteudo"><img src="data:image/png;base64,${logo}" alt=""><h1>Portaria virtual<br>para condomínios</h1><p>em São José dos Campos</p></div>
<small>CM Portaria Virtual · Central 24h · 0800 672 7280</small>
</body></html>`;

const navegador = await chromium.launch({ channel: 'chrome' });
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
await pagina.setContent(html, { waitUntil: 'networkidle' });
await pagina.evaluate(() => document.fonts.ready);
await pagina.screenshot({ path: 'public/og-image.jpg', type: 'jpeg', quality: 86 });
await navegador.close();
console.log('Favicons e imagem de compartilhamento gravados em public/.');
```

Run:
```bash
mkdir -p public
node scripts/gerar-imagens-sociais.mjs
```
Expected: os arquivos `public/og-image.jpg`, `public/favicon.ico`, `public/favicon-32.png` e `public/apple-touch-icon.png`. Abra o `og-image.jpg` e confira: título em serifa, manuscrito verde e logo.

- [ ] **Step 5: Layout com SEO completo**

`src/layouts/Base.astro` (arquivo completo):
```astro
---
import { Font } from 'astro:assets';
import { DEPLOY_TARGET } from 'astro:env/client';
import Cabecalho from '../components/Cabecalho.astro';
import MenuCelular from '../components/MenuCelular.astro';
import Rodape from '../components/Rodape.astro';
import WhatsAppFlutuante from '../components/WhatsAppFlutuante.astro';
import '../styles/tokens.css';
import '../styles/base.css';

interface Props {
  titulo: string;
  descricao: string;
  esquemas?: Record<string, unknown>[];
  semIndice?: boolean;
}

const { titulo, descricao, esquemas = [], semIndice = false } = Astro.props;
const base = import.meta.env.BASE_URL;
const naoIndexar = semIndice || DEPLOY_TARGET === 'ghpages';
const canonico = new URL(Astro.url.pathname, Astro.site).href;
const imagemSocial = new URL(`${base}og-image.jpg`, Astro.site).href;
const json = (dado: unknown) => JSON.stringify(dado).replace(/</g, '\\u003c');
---

<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{titulo}</title>
    <meta name="description" content={descricao} />
    {naoIndexar && <meta name="robots" content="noindex, nofollow" />}
    <link rel="canonical" href={canonico} />
    <meta name="theme-color" content="#0b2426" />
    <link rel="icon" href={`${base}favicon.ico`} sizes="32x32" />
    <link rel="icon" href={`${base}favicon-32.png`} type="image/png" />
    <link rel="apple-touch-icon" href={`${base}apple-touch-icon.png`} />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="CM Portaria Virtual" />
    <meta property="og:title" content={titulo} />
    <meta property="og:description" content={descricao} />
    <meta property="og:url" content={canonico} />
    <meta property="og:image" content={imagemSocial} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <Font cssVariable="--font-serif" preload={[{ weight: 400 }]} />
    <Font cssVariable="--font-sans" preload={[{ weight: 300 }]} />
    <Font cssVariable="--font-script" />
    {esquemas.map((esquema) => <script is:inline type="application/ld+json" set:html={json(esquema)} />)}
  </head>
  <body>
    <a class="pular" href="#conteudo">Pular para o conteúdo</a>
    <Cabecalho />
    <MenuCelular />
    <main id="conteudo"><slot /></main>
    <Rodape />
    <WhatsAppFlutuante />
    <script>
      const revelaveis = document.querySelectorAll('.revelar');
      const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (revelaveis.length > 0 && !reduzir && 'IntersectionObserver' in window) {
        document.documentElement.classList.add('js-revelar');
        const observador = new IntersectionObserver(
          (entradas) => {
            for (const entrada of entradas) {
              if (entrada.isIntersecting) {
                entrada.target.classList.add('is-visivel');
                observador.unobserve(entrada.target);
              }
            }
          },
          { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
        );
        revelaveis.forEach((elemento) => observador.observe(elemento));
      }
    </script>
  </body>
</html>
```

`src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import Abertura from '../components/Abertura.astro';
import Sobre from '../components/Sobre.astro';
import Servicos from '../components/Servicos.astro';
import Central from '../components/Central.astro';
import ComoFunciona from '../components/ComoFunciona.astro';
import Simulador from '../components/Simulador.astro';
import Cobertura from '../components/Cobertura.astro';
import Duvidas from '../components/Duvidas.astro';
import Contato from '../components/Contato.astro';
import { cidades, duvidas, seo } from '../content/site';
import { esquemaEmpresa, esquemaPerguntas } from '../lib/esquemas';

const url = new URL(import.meta.env.BASE_URL, Astro.site).href;
const esquemas = [esquemaEmpresa(url, cidades), esquemaPerguntas(duvidas.perguntas)];
---

<Base titulo={seo.titulo} descricao={seo.descricao} esquemas={esquemas}>
  <Abertura />
  <Sobre />
  <Servicos />
  <Central />
  <ComoFunciona />
  <Simulador />
  <Cobertura />
  <Duvidas />
  <Contato />
</Base>
```

- [ ] **Step 6: Política de Privacidade, 404 e robots.txt**

`src/pages/politica-de-privacidade.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import { contato } from '../content/site';

const base = import.meta.env.BASE_URL;
const atualizadaEm = '17 de outubro de 2026';
---

<Base titulo="Política de Privacidade | CM Portaria Virtual" descricao="Como a CM Portaria Virtual trata os dados enviados pelo site.">
  <article class="politica container">
    <h1 class="politica__titulo">Política de privacidade</h1>
    <p class="rotulo">Última atualização: {atualizadaEm}</p>

    <h2>1. Quem somos</h2>
    <p>
      Este site é da CM Portaria Virtual, com sede em São José dos Campos (SP). Razão social e CNPJ: a confirmar. Para falar sobre seus dados, escreva para
      <a href={`mailto:${contato.email}`}>{contato.email}</a>.
    </p>

    <h2>2. Quais dados coletamos</h2>
    <p>
      Quando você pede um orçamento, recebemos os dados que você preenche no formulário: nome, telefone, e-mail (se informado), nome do condomínio, cidade, número de unidades,
      mensagem e, se você usou o simulador, o resumo da simulação.
    </p>
    <p>Se você aceitar os cookies de medição, o Google Analytics registra dados de navegação, como páginas visitadas, tipo de aparelho e cidade aproximada.</p>

    <h2>3. Para que usamos</h2>
    <ul>
      <li>Responder ao seu pedido e preparar a proposta (art. 7º, V, da LGPD: procedimentos preliminares a um contrato).</li>
      <li>Entender como o site é usado e melhorá-lo, apenas com o seu consentimento (art. 7º, I, da LGPD).</li>
    </ul>

    <h2>4. Com quem compartilhamos</h2>
    <p>
      Usamos fornecedores que ajudam a operar o site: a empresa de hospedagem, o serviço de e-mail e, se você aceitar, o Google Analytics. Não vendemos nem cedemos seus dados para
      outras finalidades.
    </p>

    <h2>5. Por quanto tempo guardamos</h2>
    <p>Os pedidos de orçamento ficam guardados por até 12 meses após o último contato, salvo se virarem contrato, quando seguem os prazos legais.</p>

    <h2>6. Seus direitos</h2>
    <p>
      Você pode pedir a confirmação, o acesso, a correção ou a exclusão dos seus dados, além das demais garantias do art. 18 da LGPD, pelo e-mail
      <a href={`mailto:${contato.email}`}>{contato.email}</a>.
    </p>

    <h2>7. Cookies</h2>
    <p>O site só usa cookies de medição se você clicar em “Aceitar” no aviso. Você pode mudar de ideia limpando os dados do site no seu navegador.</p>

    <p class="politica__voltar"><a class="pill" href={base}>Voltar ao início</a></p>
  </article>
</Base>

<style>
  .politica {
    max-width: calc(760px + 2 * var(--gutter));
    padding-top: calc(var(--header-h) + clamp(48px, 8vw, 96px));
    padding-bottom: clamp(72px, 10vw, 120px);
  }

  .politica__titulo {
    margin-bottom: 12px;
    font-family: var(--font-serif);
    font-weight: 400;
    font-size: clamp(32px, 5vw, 52px);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .politica h2 {
    margin: 40px 0 12px;
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: 24px;
    letter-spacing: 0.03em;
  }

  .politica p,
  .politica li {
    color: var(--muted);
    line-height: 1.8;
  }

  .politica p + p {
    margin-top: 12px;
  }

  .politica ul {
    display: grid;
    gap: 8px;
    padding-left: 1.2em;
  }

  .politica p a {
    color: var(--accent);
    text-decoration: underline;
  }

  .politica__voltar {
    margin-top: 48px;
  }
</style>
```

`src/pages/404.astro`:
```astro
---
import Base from '../layouts/Base.astro';

const base = import.meta.env.BASE_URL;
---

<Base titulo="Página não encontrada | CM Portaria Virtual" descricao="A página que você procurou não existe." semIndice>
  <section class="erro container">
    <h1 class="erro__titulo">
      Página não encontrada
      <span class="erro__manuscrito manuscrito">vamos te levar de volta</span>
    </h1>
    <a class="pill pill--cheia" href={base}>Ir para o início</a>
  </section>
</Base>

<style>
  .erro {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 48px;
    min-height: 100svh;
    padding-top: var(--header-h);
    text-align: center;
  }

  .erro__titulo {
    font-family: var(--font-serif);
    font-weight: 400;
    font-size: clamp(32px, 6vw, 64px);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .erro__manuscrito {
    display: block;
    margin-top: 0.2em;
    font-size: 0.7em;
  }
</style>
```

`src/pages/robots.txt.ts`:
```ts
import type { APIRoute } from 'astro';
import { DEPLOY_TARGET } from 'astro:env/client';

export const GET: APIRoute = ({ site }) => {
  const corpo =
    DEPLOY_TARGET === 'hostgator'
      ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`
      : 'User-agent: *\nDisallow: /\n';
  return new Response(corpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
```

- [ ] **Step 7: Rodar e ver passar**

Run: `npx vitest run && npx playwright test tests/e2e/seo.spec.ts`
Expected: PASS. Se o preview do Astro não devolver status 404 para a rota inexistente, rode `npm run build` e confira que existe `dist/404.html`; a verificação final de status acontece no GitHub Pages (Task 15).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: SEO, dados estruturados, imagens sociais, política de privacidade e 404

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: Medição (GA4) com aviso de cookies

**Files:**
- Create: `src/lib/consentimento.ts`, `tests/unit/consentimento.test.ts`, `src/components/AvisoCookies.astro`
- Modify: `src/layouts/Base.astro` (duas inserções exatas abaixo)

**Interfaces:**
- Consumes: `GA_ID` (`astro:env/client`); atributos `data-evento` e o evento `cm:evento` (Tasks 4, 8 e 9).
- Produces: `type Escolha = 'aceito' | 'recusado'`; `CHAVE_CONSENTIMENTO = 'cm-consentimento'`; `lerEscolha(armazenamento): Escolha | null`; `salvarEscolha(armazenamento, escolha): void`; o componente `<AvisoCookies />` (só renderiza quando há `GA_ID`).

- [ ] **Step 1: Escrever os testes**

`tests/unit/consentimento.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { CHAVE_CONSENTIMENTO, lerEscolha, salvarEscolha } from '../../src/lib/consentimento';

function memoria() {
  const dados = new Map<string, string>();
  return {
    getItem: (chave: string) => dados.get(chave) ?? null,
    setItem: (chave: string, valor: string) => {
      dados.set(chave, valor);
    },
  };
}

describe('consentimento', () => {
  it('sem escolha salva, retorna null', () => expect(lerEscolha(memoria())).toBeNull());
  it('salva e lê a escolha', () => {
    const armazenamento = memoria();
    salvarEscolha(armazenamento, 'aceito');
    expect(lerEscolha(armazenamento)).toBe('aceito');
  });
  it('ignora valores desconhecidos', () => {
    const armazenamento = memoria();
    armazenamento.setItem(CHAVE_CONSENTIMENTO, 'talvez');
    expect(lerEscolha(armazenamento)).toBeNull();
  });
  it('funciona sem armazenamento', () => {
    expect(lerEscolha(null)).toBeNull();
    expect(() => salvarEscolha(null, 'recusado')).not.toThrow();
  });
  it('não quebra se o armazenamento lançar erro', () => {
    const quebrado = {
      getItem: () => {
        throw new Error('bloqueado');
      },
      setItem: () => {
        throw new Error('bloqueado');
      },
    };
    expect(lerEscolha(quebrado)).toBeNull();
    expect(() => salvarEscolha(quebrado, 'aceito')).not.toThrow();
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run tests/unit/consentimento.test.ts`
Expected: FAIL, com o erro de módulo não encontrado.

- [ ] **Step 3: Implementar a lógica**

`src/lib/consentimento.ts`:
```ts
/** Guarda a escolha do visitante sobre os cookies de medição. */

export type Escolha = 'aceito' | 'recusado';

export const CHAVE_CONSENTIMENTO = 'cm-consentimento';

export function lerEscolha(armazenamento: Pick<Storage, 'getItem'> | null): Escolha | null {
  try {
    const valor = armazenamento?.getItem(CHAVE_CONSENTIMENTO);
    return valor === 'aceito' || valor === 'recusado' ? valor : null;
  } catch {
    return null;
  }
}

export function salvarEscolha(armazenamento: Pick<Storage, 'setItem'> | null, escolha: Escolha): void {
  try {
    armazenamento?.setItem(CHAVE_CONSENTIMENTO, escolha);
  } catch {
    // Sem armazenamento disponível: o aviso volta a aparecer na próxima visita.
  }
}
```

Run: `npx vitest run tests/unit/consentimento.test.ts`
Expected: PASS (5 testes).

- [ ] **Step 4: Componente do aviso**

`src/components/AvisoCookies.astro`:
```astro
---
import { GA_ID } from 'astro:env/client';

const base = import.meta.env.BASE_URL;
---

{
  GA_ID && (
    <div class="aviso-cookies" role="region" aria-label="Aviso de cookies" hidden data-aviso-cookies data-ga={GA_ID}>
      <p>
        Usamos cookies para medir as visitas e melhorar o site. <a href={`${base}politica-de-privacidade/`}>Saiba mais</a>
      </p>
      <div class="aviso-cookies__botoes">
        <button class="pill" type="button" data-recusar>
          Recusar
        </button>
        <button class="pill pill--cheia" type="button" data-aceitar>
          Aceitar
        </button>
      </div>
    </div>
  )
}

<script>
  import { lerEscolha, salvarEscolha } from '../lib/consentimento';

  const aviso = document.querySelector<HTMLElement>('[data-aviso-cookies]');
  if (aviso) {
    const id = aviso.dataset.ga ?? '';
    const armazenamento = (() => {
      try {
        return window.localStorage;
      } catch {
        return null;
      }
    })();
    const janela = window as unknown as { dataLayer: unknown[]; gtag: (...args: unknown[]) => void };

    const carregar = () => {
      janela.dataLayer = janela.dataLayer || [];
      janela.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        janela.dataLayer.push(arguments);
      };
      janela.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
      janela.gtag('consent', 'update', { analytics_storage: 'granted' });
      janela.gtag('js', new Date());
      janela.gtag('config', id);
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
      document.head.append(script);
      const enviar = (nome: string) => janela.gtag('event', nome);
      document.addEventListener('click', (evento) => {
        const alvo = (evento.target as Element | null)?.closest<HTMLElement>('[data-evento]');
        if (alvo?.dataset.evento) enviar(alvo.dataset.evento);
      });
      window.addEventListener('cm:evento', (evento) => enviar((evento as CustomEvent<{ nome: string }>).detail.nome));
    };

    const escolha = lerEscolha(armazenamento);
    if (escolha === 'aceito') carregar();
    else if (escolha === null) aviso.hidden = false;

    aviso.querySelector('[data-aceitar]')?.addEventListener('click', () => {
      salvarEscolha(armazenamento, 'aceito');
      aviso.hidden = true;
      carregar();
    });
    aviso.querySelector('[data-recusar]')?.addEventListener('click', () => {
      salvarEscolha(armazenamento, 'recusado');
      aviso.hidden = true;
    });
  }
</script>

<style>
  .aviso-cookies {
    position: fixed;
    left: 16px;
    right: 16px;
    bottom: 16px;
    z-index: 60;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    max-width: 720px;
    padding: 16px 20px;
    border: 1px solid var(--line-strong);
    background: var(--bg-deep);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
    font-size: 13px;
  }

  .aviso-cookies a {
    color: var(--accent);
    text-decoration: underline;
  }

  .aviso-cookies__botoes {
    display: flex;
    flex: none;
    gap: 10px;
  }

  .aviso-cookies .pill {
    min-height: 44px;
    padding: 0 18px;
  }

  @media (max-width: 599px) {
    .aviso-cookies {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
```

- [ ] **Step 5: Ligar o aviso no layout**

Em `src/layouts/Base.astro`, logo abaixo da linha `import WhatsAppFlutuante from '../components/WhatsAppFlutuante.astro';`, adicione:
```astro
import AvisoCookies from '../components/AvisoCookies.astro';
```
E, logo abaixo da linha `<WhatsAppFlutuante />`, adicione:
```astro
    <AvisoCookies />
```

- [ ] **Step 6: Verificar que só aparece com GA_ID**

```bash
npm run build
node -e "const h=require('fs').readFileSync('dist/index.html','utf8'); if(h.includes('data-aviso-cookies')) {console.error('ERRO: aviso sem GA_ID'); process.exit(1)} console.log('ok: sem GA_ID não há aviso')"
npx cross-env GA_ID=G-TESTE12345 npm run build
node -e "const h=require('fs').readFileSync('dist/index.html','utf8'); if(!h.includes('data-aviso-cookies')||!h.includes('G-TESTE12345')) {console.error('ERRO: aviso ausente com GA_ID'); process.exit(1)} console.log('ok: com GA_ID o aviso aparece')"
npm run build
```
Expected: as duas linhas começam com `ok:`. O último `npm run build` devolve o `dist/` sem GA.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: medição GA4 opcional com aviso de cookies e consentimento

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: Arquivos de produção para a HostGator (não implantados)

**Files:**
- Create: `scripts/verificar-php.mjs`, `scripts/pos-build.mjs`
- Create: `servidor/hostgator/api/orcamento.php`, `servidor/hostgator/api/lib/.htaccess`, `servidor/hostgator/config.exemplo.php`, `servidor/hostgator/.htaccess`, `servidor/hostgator/LEIA-ME.md`
- Create (vendor): `servidor/hostgator/api/lib/PHPMailer/{Exception.php,PHPMailer.php,SMTP.php,LICENSE}`

**Interfaces:**
- Consumes: o payload JSON do formulário (Task 8): `{ nome, telefone, email, condominio, cidade, unidades, mensagem, simulacao, website, t }`.
- Produces:
  - Respostas `200 {ok:true}`, `422 {ok:false,error:'validacao',campos:[...]}`, `429 {ok:false,error:'limite'}` e `502 {ok:false,error:'envio'}`.
  - Sem `Accept: application/json`, devolve uma página HTML simples.
  - `npm run build:producao` gera o `dist/` com `api/` e `.htaccess`.

- [ ] **Step 1: Verificador de sintaxe PHP (o teste desta task)**

`scripts/verificar-php.mjs`:
```js
// Verifica a sintaxe dos arquivos PHP próprios (não há PHP instalado na máquina).
import { readFileSync } from 'node:fs';
import phpParser from 'php-parser';

const Engine = phpParser.Engine ?? phpParser.default ?? phpParser;
const ARQUIVOS = ['servidor/hostgator/api/orcamento.php', 'servidor/hostgator/config.exemplo.php'];
const analisador = new Engine({ parser: { php8: true, extractDoc: false, suppressErrors: false }, ast: { withPositions: false } });

let falhou = false;
for (const arquivo of ARQUIVOS) {
  try {
    analisador.parseCode(readFileSync(arquivo, 'utf8'), arquivo);
    console.log(`ok   ${arquivo}`);
  } catch (erro) {
    falhou = true;
    console.error(`ERRO ${arquivo}: ${erro.message}`);
  }
}
process.exit(falhou ? 1 : 0);
```

Run: `npm run verificar:php`
Expected: FAIL, porque os arquivos ainda não existem (`ENOENT`).

- [ ] **Step 2: Endpoint do formulário**

`servidor/hostgator/api/orcamento.php`:
```php
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
```

`servidor/hostgator/config.exemplo.php`:
```php
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
```

- [ ] **Step 3: PHPMailer (fornecedor)**

```bash
mkdir -p servidor/hostgator/api/lib/PHPMailer
for f in src/Exception.php src/PHPMailer.php src/SMTP.php LICENSE; do
  curl -sSfL -o "servidor/hostgator/api/lib/PHPMailer/$(basename $f)" "https://raw.githubusercontent.com/PHPMailer/PHPMailer/v7.1.1/$f"
done
ls servidor/hostgator/api/lib/PHPMailer
```
Expected: os arquivos `Exception.php`, `LICENSE`, `PHPMailer.php` e `SMTP.php`.

`servidor/hostgator/api/lib/.htaccess`:
```apache
Require all denied
```

- [ ] **Step 4: Regras do Apache e instruções**

`servidor/hostgator/.htaccess`:
```apache
# CM Portaria Virtual — regras do site novo (copiado para a raiz de public_html)
Options -Indexes
DirectoryIndex index.html
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
  RewriteEngine On

  # Força HTTPS e www
  RewriteCond %{HTTPS} !=on [OR]
  RewriteCond %{HTTP_HOST} !^www\. [NC]
  RewriteRule ^ https://www.cmportariavirtual.com.br%{REQUEST_URI} [L,R=301,NE]

  # Endereços do site antigo
  RewriteCond %{THE_REQUEST} \s/index\.html[\s?] [NC]
  RewriteRule ^index\.html$ / [L,R=301]
  RewriteRule ^paginas/ /#servicos [L,R=301,NE]
  RewriteRule ^recursos/ / [L,R=301]
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  <If "%{REQUEST_URI} =~ m#^/_astro/#">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </If>
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain application/javascript application/json image/svg+xml
</IfModule>
```

`servidor/hostgator/LEIA-ME.md`:
```markdown
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
```

- [ ] **Step 5: Cópia pós-build**

`scripts/pos-build.mjs`:
```js
// Copia os arquivos da HostGator para dist/ (só usado em `npm run build:producao`).
import { cp } from 'node:fs/promises';

await cp('servidor/hostgator/api', 'dist/api', { recursive: true });
await cp('servidor/hostgator/.htaccess', 'dist/.htaccess');
console.log('Arquivos da HostGator copiados para dist/.');
```

- [ ] **Step 6: Rodar as verificações**

Run: `npm run verificar:php`
Expected: `ok   servidor/hostgator/api/orcamento.php` e `ok   servidor/hostgator/config.exemplo.php`, com saída 0.

Run: `npm run build:producao`
Expected: build concluído e as mensagens `Arquivos da HostGator copiados para dist/.`. Confira que existem `dist/api/orcamento.php`, `dist/.htaccess` e `dist/sitemap-index.xml`, e que `dist/index.html` **não** contém `noindex` e contém `data-modo="php"`:
```bash
node -e "const h=require('fs').readFileSync('dist/index.html','utf8'); console.log(h.includes('noindex')?'ERRO: noindex na produção':'ok: indexável', h.includes('data-modo=\"php\"')?'ok: formulário em PHP':'ERRO: modo do formulário')"
```

Volte o `dist/` para a demonstração:
Run: `npm run build`

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: arquivos de produção da HostGator (PHP, PHPMailer, .htaccess)

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 14: Qualidade (larguras, erros, âncoras, acessibilidade, desempenho)

**Files:**
- Create: `tests/e2e/ajuda.ts`, `tests/e2e/qualidade.spec.ts`
- Modify: somente o que os testes apontarem. Cada correção é feita no componente afetado.

**Interfaces:**
- Consumes: todas as páginas e componentes.
- Produces: `vigiarErros(page): string[]`.

- [ ] **Step 1: Escrever os testes**

`tests/e2e/ajuda.ts`:
```ts
import type { Page } from '@playwright/test';

export function vigiarErros(page: Page): string[] {
  const erros: string[] = [];
  page.on('pageerror', (erro) => erros.push(`pageerror: ${erro.message}`));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') erros.push(`console: ${mensagem.text()}`);
  });
  page.on('response', (resposta) => {
    if (resposta.status() >= 400 && new URL(resposta.url()).hostname === 'localhost') erros.push(`${resposta.status()} ${resposta.url()}`);
  });
  return erros;
}
```

`tests/e2e/qualidade.spec.ts`:
```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { vigiarErros } from './ajuda';

const LARGURAS = [320, 360, 390, 768, 1024, 1280, 1440, 1920];

test('sem rolagem lateral em nenhuma largura', async ({ page, isMobile }) => {
  test.skip(isMobile, 'as larguras são testadas no projeto desktop');
  await page.goto('./');
  for (const largura of LARGURAS) {
    await page.setViewportSize({ width: largura, height: 900 });
    await page.waitForTimeout(200);
    const cabe = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(cabe, `largura ${largura}px`).toBe(true);
  }
});

test('página inicial e política sem erros nem arquivos faltando', async ({ page }) => {
  const erros = vigiarErros(page);
  await page.goto('./');
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((resolver) => setTimeout(resolver, 60));
    }
  });
  await page.waitForLoadState('networkidle');
  await page.goto('./politica-de-privacidade/');
  await page.waitForLoadState('networkidle');
  expect(erros).toEqual([]);
});

test('todas as âncoras internas existem', async ({ page }) => {
  await page.goto('./');
  const alvos = await page.$$eval('a[href*="#"]', (links) => links.map((link) => new URL((link as HTMLAnchorElement).href).hash.slice(1)).filter(Boolean));
  for (const alvo of new Set(alvos)) {
    await expect(page.locator(`[id="${alvo}"]`), `#${alvo}`).toHaveCount(1);
  }
});

test('acessibilidade sem violações sérias ou críticas', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const caminho of ['./', './politica-de-privacidade/']) {
    await page.goto(caminho);
    const resultado = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    const graves = resultado.violations.filter((violacao) => violacao.impact === 'serious' || violacao.impact === 'critical');
    expect(graves.map((violacao) => `${violacao.id}: ${violacao.nodes.map((n) => n.target.join(' ')).join(' | ')}`), caminho).toEqual([]);
  }
});
```

- [ ] **Step 2: Rodar**

Run: `npx playwright test tests/e2e/qualidade.spec.ts`
Expected: PASS. Se algo falhar, a mensagem indica a largura, o recurso ou o seletor. Corrija no componente responsável. Por exemplo:
- **Contraste de cor:** suba a opacidade do texto em questão para que o contraste chegue a pelo menos 4,5:1.
- **Rolagem lateral:** limite a largura do elemento com `max-width: 100%` ou permita a quebra de linha.

Depois rode de novo até passar.

- [ ] **Step 3: Rodar todos os testes**

Run: `npx vitest run && npx playwright test`
Expected: tudo PASS.

- [ ] **Step 4: Lighthouse local (celular)**

Run: `npm run build && npm run preview` (deixe rodando em outro terminal, ou em segundo plano).

Run (outro terminal):
```bash
npx lighthouse http://localhost:4321/cm-portaria-virtual/ --form-factor=mobile --only-categories=performance,accessibility,best-practices --output=json --output-path=./lighthouse-local.json --chrome-flags="--headless=new" --quiet
node -e "const r=require('./lighthouse-local.json'); for (const [k,v] of Object.entries(r.categories)) console.log(k, Math.round(v.score*100)); console.log('LCP', r.audits['largest-contentful-paint'].displayValue, 'CLS', r.audits['cumulative-layout-shift'].displayValue)"
```
Expected:
- Acessibilidade e boas práticas ≥ 95.
- Desempenho ≥ 90.
- O preview local não comprime arquivos, então valores de desempenho perto do limite são reavaliados na publicação (Task 15).

Encerre o preview.

- [ ] **Step 5: Revisão visual final**

Com `npm run preview`, compare a página em 1440 px e em 390 px com os protótipos aprovados (`estrutura-pagina.html` e `versao-celular.html`). Confira:
- espaçamentos;
- manuscritos que não cobrem texto importante;
- foto da abertura;
- menu do celular.

Ajuste o CSS do componente, se precisar, e rode `npx playwright test` de novo.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
test: verificações de qualidade (larguras, erros, âncoras e acessibilidade)

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 15: Publicação da demonstração no GitHub Pages

**Files:**
- Create: `.github/workflows/pages.yml`, `README.md`

**Interfaces:**
- Consumes: os scripts `npm test`, `npm run verificar:php` e `npm run build`; a conta `gh` autenticada como `ViniciusCruz-dev`.
- Produces: o site em `https://viniciuscruz-dev.github.io/cm-portaria-virtual/`.

- [ ] **Step 1: Workflow**

`.github/workflows/pages.yml`:
```yaml
name: Publicar no GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  testes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run verificar:php

  build:
    needs: testes
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: withastro/action@v6
        env:
          DEPLOY_TARGET: ghpages

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Publicar
        id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 2: README**

`README.md`:
```markdown
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
```

- [ ] **Step 3: Conferir tudo e mesclar na main**

```bash
npx vitest run && npm run verificar:php && npx playwright test
git add -A
git commit -m "$(cat <<'EOF'
ci: publicação da demonstração no GitHub Pages e README

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
EOF
)"
git checkout main
git merge --ff-only feat/site-v1
git status --short
git ls-files | grep -E '^(analise|logos|\.superpowers)/' && echo "ERRO: arquivo interno versionado" || echo "ok: nada interno no repositório"
```
Expected: testes PASS; merge fast-forward; `ok: nada interno no repositório`.

- [ ] **Step 4: Criar o repositório público e ativar o Pages**

```bash
gh repo create ViniciusCruz-dev/cm-portaria-virtual --public --source=. --remote=origin --description "Novo site da CM Portaria Virtual (demonstração)"
gh api -X POST repos/ViniciusCruz-dev/cm-portaria-virtual/pages -f build_type=workflow
git push -u origin main
```
Expected: repositório criado, Pages configurado com origem "workflow" e push concluído.

- [ ] **Step 5: Acompanhar a publicação**

O workflow leva alguns segundos para aparecer após o push. Confira se ele já está listado:
```bash
gh run list --repo ViniciusCruz-dev/cm-portaria-virtual --limit 1
```
Quando aparecer, acompanhe até o fim:
```bash
gh run watch "$(gh run list --repo ViniciusCruz-dev/cm-portaria-virtual --limit 1 --json databaseId -q '.[0].databaseId')" --repo ViniciusCruz-dev/cm-portaria-virtual --exit-status
```
Expected: os jobs `testes`, `build` e `deploy` concluídos com sucesso.

- [ ] **Step 6: Verificar o site no ar**

```bash
curl -s -o /dev/null -w "home %{http_code}\n" https://viniciuscruz-dev.github.io/cm-portaria-virtual/
curl -s -o /dev/null -w "politica %{http_code}\n" https://viniciuscruz-dev.github.io/cm-portaria-virtual/politica-de-privacidade/
curl -s -o /dev/null -w "404 %{http_code}\n" https://viniciuscruz-dev.github.io/cm-portaria-virtual/nao-existe/
curl -s https://viniciuscruz-dev.github.io/cm-portaria-virtual/ | grep -o '<meta name="robots" content="noindex, nofollow">'
npx lighthouse https://viniciuscruz-dev.github.io/cm-portaria-virtual/ --form-factor=mobile --only-categories=performance,accessibility,best-practices --output=json --output-path=./lighthouse-publicado.json --chrome-flags="--headless=new" --quiet
node -e "const r=require('./lighthouse-publicado.json'); for (const [k,v] of Object.entries(r.categories)) console.log(k, Math.round(v.score*100)); console.log('LCP', r.audits['largest-contentful-paint'].displayValue, 'CLS', r.audits['cumulative-layout-shift'].displayValue)"
```
Expected:
- `home 200`, `politica 200` e `404 404`, além da meta `noindex` presente.
- Lighthouse no celular: desempenho ≥ 90, acessibilidade ≥ 95, LCP ≤ 2,5 s e CLS ≤ 0,05.

Se o desempenho ficar abaixo de 90, reduza `widths`/qualidade das fotos acima da dobra ou o peso das fontes, faça um commit na `main`, dê push e meça de novo.

- [ ] **Step 7: Encerrar**

Abra o endereço no celular e no computador e faça um último teste manual:
- menu;
- abas;
- simulador;
- formulário em modo demonstração;
- Área do morador.

Depois envie o link para o usuário mostrar ao chefe.
