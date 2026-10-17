# Site CM Portaria Virtual — v1 (landing page) — Especificação de design

- **Data:** 17/10/2026
- **Status:** design aprovado no brainstorming; aguardando revisão desta especificação
- **Protótipos de referência (locais):** `.superpowers/brainstorm/<sessão>/content/` (`direcao-visual.html`, `estrutura-pagina.html`, `versao-celular.html`, `area-do-morador.html`)

## 1. Objetivo

Criar uma landing page nova para a CM Portaria Virtual. O ponto de partida são os textos do site atual, com visual profissional, leve e inovador, inspirado numa landing page de referência: fundo verde-petróleo, serifa em caixa alta, acentos manuscritos, muito respiro e cartões numerados.

Esta versão é uma **demonstração** para o dono da empresa aprovar. Ela fica publicada num endereço gratuito, e o site oficial (HostGator) não é alterado. O código já sai pronto para produção.

**Critérios de sucesso**
1. O dono aprova a demonstração.
2. Nenhum link interno quebrado e nenhuma imagem faltando.
3. Sem rolagem horizontal entre 320 px e 1920 px de largura.
4. Lighthouse no celular com desempenho ≥ 90 e acessibilidade ≥ 95.
5. Em produção, 100% dos pedidos do formulário chegam por e-mail ou ficam registrados.

## 2. Escopo

**Dentro (v1)**
- Página única com 9 seções, cabeçalho e rodapé.
- Página de Política de Privacidade.
- Página 404 própria.
- Os três elementos interativos: central ao vivo, simulador e mapa de cobertura.
- Formulário de orçamento em dois modos: demonstração e produção (PHP).
- Botão "Área do morador".
- SEO técnico, acessibilidade e desempenho.
- Arquivos de produção para a HostGator (PHP, `.htaccess`), escritos mas **não implantados**.
- Publicação da demonstração no GitHub Pages.

**Fora (fases seguintes)**
- Páginas de produtos (Hikvision, Intelbras, PPA) e guias.
- Números da empresa e depoimentos, que dependem de dados reais.
- Preços e planos da CM.
- CMS.
- Fotos reais.

## 3. Decisões tomadas

| Tema | Decisão |
|---|---|
| Escopo | Uma página só (one-page) + Política de Privacidade + 404 |
| Fotos | Banco gratuito (Pexels/Unsplash), tratadas no tom do site; trocar pelas reais depois |
| Logo | Mantido exatamente como está (PNG com fundo transparente do site atual) |
| Pedidos | Produção: e-mail via PHP/SMTP + cópia em arquivo + botão de WhatsApp na confirmação. Demonstração: não envia nada e avisa isso |
| Conteúdo | Sem números da empresa e sem depoimentos |
| Preços | Não são exibidos. O simulador mostra só o custo da portaria atual |
| Direção visual | "A": petróleo + verde suave derivado do logo |
| Movimento | "Editorial vivo": aparições suaves + central ao vivo + simulador instantâneo + mapa com pulsos |
| Área do morador | Link para `https://portal.cmportariavirtual.com.br` no cabeçalho, menu do celular e rodapé |
| Tecnologia | Astro (site estático), TypeScript, CSS próprio, fontes hospedadas no próprio site |
| Medição | Google Analytics 4 com aviso de cookies; fica desligado até existir a conta (ID) |
| Páginas antigas | Em produção, redirecionamento 301 para a home até a fase 2 |
| Demonstração | GitHub Pages, repositório público `ViniciusCruz-dev/cm-portaria-virtual`, `noindex` |

## 4. Identidade visual

### 4.1 Cores (tokens)

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#0B2426` | Fundo principal |
| `--bg-2` | `#0D2A2C` | Seções alternadas |
| `--bg-deep` | `#081B1D` | Painéis, mapa, rodapé |
| `--line` | `rgba(236,232,221,.13)` | Linhas finas e bordas |
| `--text` | `#ECE8DD` | Texto principal (marfim) |
| `--muted` | `rgba(236,232,221,.64)` | Texto secundário |
| `--accent` | `#B7D06F` | Acento: botões, manuscrito, destaques |
| `--accent-logo` | `#90BA42` | Verde original do logo (uso pontual) |
| `--on-accent` | `#0B2426` | Texto sobre o acento |

Contraste mínimo de 4,5:1 para texto normal (WCAG AA). O `--muted` sobre `--bg` precisa ser conferido na implementação.

### 4.2 Tipografia
- **Títulos:** Cormorant Garamond (300/400/500), caixa alta, `letter-spacing: .06em`, algarismos alinhados (`lining-nums`).
- **Acentos manuscritos:** Great Vibes, sempre com 22 px ou mais, girados −3°, sobrepondo levemente o canto do título (como na referência).
- **Texto e interface:** Manrope (variável, 300–600). Rótulos em caixa alta com `letter-spacing: .16em`.
- As fontes são baixadas na compilação pela API de fontes do Astro e servidas pelo próprio site. O visitante nunca acessa o Google Fonts.

### 4.3 Elementos recorrentes
- Botões em pílula: preenchido (acento) para a ação principal e contorno para a secundária.
- Linhas finas de 1 px como divisórias, sem sombras pesadas.
- Cartões numerados com algarismos grandes em serifa fina. O último cartão fica destacado em cor de acento.
- Fotos com leve dessaturação e degradê petróleo por cima, para unificar o banco de imagens.
- Ícones lineares simples (SVG). Nada de emojis.

### 4.4 Responsividade

| Faixa | Layout |
|---|---|
| ≥ 1100 px | Computador: cabeçalho completo, grades de 2 colunas, 5 cartões em linha |
| 700–1099 px | Tablet: cabeçalho de celular (menu em tela cheia); seções em 1 coluna onde o conteúdo pedir; cartões em carrossel |
| < 700 px | Celular: tudo em 1 coluna; sanfona em Serviços; botões empilhados; margens laterais de 20 px |

## 5. Estrutura e conteúdo

A ordem é fixa. As âncoras ficam entre parênteses.

### 5.0 Cabeçalho
- **Computador:**
  - Logo + "CM / Portaria Virtual".
  - Links: Serviços · Como funciona · Simulador · Contato.
  - "Área do morador" (ícone de pessoa, verde, sem borda) e o botão "Orçamento" (pílula preenchida).
- **Celular:** logo · pílula compacta "Morador" · botão de menu (duas linhas).
- **Menu do celular (tela cheia):**
  - Links centralizados em serifa: Serviços, Como funciona, Simulador, Cobertura, Dúvidas, Contato.
  - Divisória curta, telefones, e os botões "Solicitar orçamento" e "Área do morador".
- **Comportamento:** transparente sobre a abertura; após 80 px de rolagem ganha fundo petróleo a 96% com desfoque. Fica sempre visível.
- **Quebra:** abaixo de 1100 px o cabeçalho passa para o formato de celular (ver §4.4).

### 5.1 Abertura (`#inicio`)
- Foto do prédio à noite em tela cheia, com degradê.
- H1 "Portaria virtual para condomínios" e o manuscrito "em São José dos Campos".
- Texto: "Central própria 24 horas, reconhecimento facial e atendimento humano, sem encargos trabalhistas, férias ou faltas."
- Botões: "Solicitar orçamento" (→ `#contato`) e "Como funciona" (→ `#como-funciona`).
- Faixa inferior: "Central 24h · 0800 672 7280" (link `tel:08006727280`) e "São José dos Campos · Jacareí · Caçapava · Taubaté · Pindamonhangaba". No celular, só o telefone.

### 5.2 Sobre (`#sobre`)
- H2 "Segurança que não tira folga" / manuscrito "sobre a CM".
- Parágrafo 1: "A CM Portaria Virtual cuida da entrada do seu condomínio a partir de uma central de monitoramento própria em São José dos Campos. Operadores treinados atendem visitantes, falam com os moradores e liberam o acesso a distância, com registro de tudo."
- Parágrafo 2: "Instalação, manutenção e suporte são feitos pela nossa própria equipe, que está na região e chega rápido quando precisa."
- Diferenciais (grade 2×2 com marcador verde): Central própria 24h · Equipe técnica local · Atendimento humano · App para moradores.
- Foto vertical à esquerda (entrada de edifício à noite).

### 5.3 Serviços (`#servicos`)
- H2 "Tudo que a sua portaria faz" / manuscrito "e um pouco mais".
- **Computador:** abas à esquerda (01–06) e à direita foto + título + texto + marcadores do item ativo.
- **Celular e tablet (abaixo de 900 px):** lista sanfonada, com o primeiro item aberto.

| # | Título | Texto | Marcadores |
|---|---|---|---|
| 01 | Monitoramento 24 horas | Operadores acompanham as câmeras do condomínio dia e noite, com alertas em tempo real e gravação em nuvem. | Câmeras HD com visão noturna · Gravação em nuvem · Alertas em tempo real |
| 02 | Controle de acesso facial | Moradores entram por reconhecimento facial. Visitantes e prestadores são cadastrados e liberados a distância. | Reconhecimento facial automático · Abertura remota de portões · Cadastro digital de visitantes · Histórico completo de acessos |
| 03 | Aplicativo CM Portaria | Pelo celular, o morador libera visitantes, recebe comunicados, faz reservas e registra ocorrências. | Liberação de visitantes · Comunicados e avisos · Acesso a câmeras externas · Reservas e ocorrências |
| 04 | Comunicação por áudio | Interfone IP com áudio nos dois sentidos: o visitante fala direto com a central e recebe instruções claras. | Áudio bidirecional HD · Atendimento personalizado · Instruções claras aos visitantes |
| 05 | Relatórios gerenciais | Relatórios para síndicos e administradoras com estatísticas de acesso, ocorrências e análise de segurança. | Estatísticas de acesso · Registro de ocorrências · Análise de segurança |
| 06 | Resposta a emergências | Protocolos para cada tipo de ocorrência, com acionamento rápido das autoridades e dos contatos de segurança. | Botão de pânico · Contato direto com a polícia · Procedimentos de evacuação |

Cada item tem uma foto própria de banco, escolhida na implementação.

### 5.4 Central ao vivo (`#central`)
- H2 "Uma central que não dorme" / manuscrito "24 horas, 7 dias".
- Texto: "Enquanto o condomínio dorme, nossa equipe acompanha cada entrada. Cada chamado é atendido por uma pessoa, e cada acesso fica registrado para o síndico consultar quando quiser."
- Nota: "Ilustração do painel de monitoramento."
- **Painel:**
  - 4 câmeras (Portão social, Hall, Fachada, Perímetro): foto em tons de verde, linha de varredura animada e "REC" piscando.
  - Coluna "Eventos" com relógio real (HH:MM:SS). Um evento novo entra a cada 2,6 s, com no máximo 7 linhas.
- **Lista de eventos (em rodízio):** Visitante liberado · Bloco B / Entrega recebida · Portaria / Morador reconhecido · Garagem / Ronda de câmeras concluída / Prestador autorizado pelo app · Bloco A / Portão social fechado / Visitante aguardando confirmação / Acesso negado · cadastro inexistente / Morador reconhecido · Portão social.
- **Comportamento:**
  - A animação só roda com o painel visível na tela e pausa com a aba oculta.
  - Com movimento reduzido, a lista fica estática e sem varredura.
  - O painel recebe `aria-hidden="true"`, porque o texto ao lado já descreve o serviço.
- **Celular:** câmeras em 2×2 e eventos embaixo, com 4 linhas.

### 5.5 Como funciona (`#como-funciona`)
- H2 "Como funciona" / manuscrito "em cinco passos".
- **Computador:** 5 cartões numerados em linha. O 5º fica destacado em acento.
- **Celular:** carrossel horizontal com `scroll-snap` e indicadores.

| # | Título | Texto |
|---|---|---|
| 1 | Chegada | O visitante toca o interfone e é atendido pela central. |
| 2 | Identificação | O operador vê e ouve o visitante pelas câmeras e pelo áudio. |
| 3 | Confirmação | O morador autoriza pelo aplicativo ou por telefone. |
| 4 | Liberação | O acesso é liberado a distância e fica registrado. |
| 5 | Monitoramento | As áreas comuns seguem acompanhadas o tempo todo. |

### 5.6 Simulador (`#simulador`)
H2 "Quanto custa a sua portaria hoje?" / manuscrito "faça a conta".

**Controles**
- **Portaria atual** (seletor em pílula): 24 horas | 12h diurna | 12h noturna. Padrão: 24 horas.
- **Número de unidades:** controle deslizante de 10 a 400, passo 5, padrão 80.
- **"Ajustar valores"** (recolhido por padrão):
  - Custo do porteiro diurno: R$ 1.500–6.000, passo 50, padrão **R$ 3.000**.
  - Custo do porteiro noturno: R$ 1.500–7.000, passo 50, padrão **R$ 3.800**.
  - O texto informa que os encargos fixos são de 80%.
- **"Já sei quanto pago":** troca a estimativa por um campo "Valor mensal atual (R$)".

**Cálculo** (valores do site antigo, informados pela empresa)

```
porteiros:  24h        → 2 diurnos + 2 noturnos
            12h diurna → 2 diurnos
            12h noturna→ 2 noturnos
mensal      = (nDiurnos × custoDiurno + nNoturnos × custoNoturno) × 1,8
porUnidade  = mensal / unidades
anual       = mensal × 12
modo "já sei quanto pago": mensal = valor informado (porUnidade e anual iguais)
```

| Caso de teste | Esperado |
|---|---|
| 24 horas, padrões | R$ 24.480/mês |
| 12h diurna, padrões | R$ 10.800/mês |
| 12h noturna, padrões | R$ 13.680/mês |
| 24 horas, 80 unidades | R$ 306 por unidade/mês |
| 24 horas, anual | R$ 293.760 |

Valores arredondados para reais, no formato `pt-BR`.

**Resultado**
- Número grande "R$ 24.480 / por mês com a portaria atual".
- Linha com "por unidade / mês" e "por ano".
- Atualiza a cada mudança, sem botão. O resultado também fica numa região `aria-live="polite"`.
- Aviso (texto original): "Cálculo estimado baseado em médias do mercado. Valores incluem salários, encargos trabalhistas (FGTS, INSS, férias, 13º), benefícios e substituições. O valor final pode variar conforme especificidades do condomínio."
- Botão "Quero saber quanto economizo": rola até `#contato` e preenche o campo oculto `simulacao` e o início da mensagem com o resumo, por exemplo: "Simulação: portaria 24 horas (2 diurnos + 2 noturnos), 80 unidades. Custo estimado: R$ 24.480/mês (R$ 306 por unidade)."

### 5.7 Cobertura (`#cobertura`)
- H2 "Onde atendemos" / manuscrito "Vale do Paraíba".
- **Legenda:** São José dos Campos ("Central 24h", marcador maior), Jacareí, Caçapava, Taubaté, Pindamonhangaba. Nota: "Outras cidades da região: consulte."
- **Mapa:** SVG estilizado, sem serviço externo.
  - Grade sutil, rio Paraíba do Sul, Rodovia Presidente Dutra tracejada e rótulos das serras.
  - Pinos com pulso animado nas posições do protótipo: SJC (197,239), Jacareí (111,331), Caçapava (392,182), Taubaté (556,128), Pinda (658,54), em viewBox 800×420.

### 5.8 Dúvidas (`#duvidas`)
H2 "Dúvidas frequentes" / manuscrito "sem rodeios". Sanfona com `<details>`/`<summary>`, com a primeira aberta.

1. **Como funciona a portaria virtual 24 horas?** Nossa central em São José dos Campos atende os visitantes por câmeras e áudio, confirma com o morador e libera o acesso a distância. Os moradores usam o aplicativo CM Portaria, e todas as ocorrências geram registro.
2. **Os moradores têm aplicativo?** Sim. Pelo app CM Portaria o morador autoriza visitantes, recebe avisos, acessa câmeras externas, faz reservas e registra ocorrências.
3. **A portaria virtual atende emergências?** Sim. A central tem protocolos para cada tipo de ocorrência e aciona polícia, bombeiros e SAMU quando necessário.
4. **A CM tem equipe técnica na região?** Sim. Instalação, manutenção e suporte são feitos pela nossa própria equipe, baseada em São José dos Campos.
5. **Quanto custa?** Depende do porte do condomínio e dos equipamentos necessários. Fazemos uma análise técnica sem compromisso e enviamos a proposta. No simulador acima você vê quanto a portaria atual custa hoje.
6. **Quais cidades vocês atendem?** São José dos Campos, Jacareí, Caçapava, Taubaté e Pindamonhangaba. Para outras cidades do Vale do Paraíba, consulte.

### 5.9 Contato (`#contato`)
H2 "Fale com a CM" / manuscrito "sem compromisso".

**Coluna de informações**
- Central 24h · ligação gratuita — 0800 672 7280
- WhatsApp — (12) 98185-4159
- E-mail — contato@cmportariavirtual.com.br
- Comercial — Seg. a sex. 8h–18h · Sáb. 8h–12h
- Monitoramento e suporte — 24 horas, todos os dias

**Formulário:** campos em linha fina, rótulo pequeno em caixa alta. A especificação completa está no §7.

### 5.10 Rodapé
- Marca d'água "CM Portaria Virtual" em serifa vazada (contorno verde a 42%).
- Colunas: navegação · Área do morador · contatos · cidades.
- Linha final: "© 2026 CM Portaria Virtual" · "Política de privacidade".

### 5.11 Elementos fixos
- **Botão flutuante de WhatsApp:** canto inferior direito, círculo de acento, `aria-label="Conversar no WhatsApp"`. Mensagem: "Olá! Vim pelo site e gostaria de mais informações sobre a portaria virtual."
- **Aviso de cookies:** só aparece quando há ID do GA4 (ver §8).

### 5.12 Página Política de Privacidade (`/politica-de-privacidade/`)
Mesmo cabeçalho e rodapé, com texto em coluna de leitura. Seções:
1. Quem somos — "CM Portaria Virtual", com razão social e CNPJ **a confirmar**.
2. Dados coletados — formulário e, com consentimento, dados de navegação.
3. Finalidades e bases legais — responder o pedido de orçamento (art. 7º, V da LGPD) e medição de audiência com consentimento (art. 7º, I).
4. Compartilhamento — hospedagem, e-mail e, se aceito, Google Analytics.
5. Retenção — 12 meses após o último contato, salvo contrato.
6. Direitos do titular (art. 18) e canal: contato@cmportariavirtual.com.br.
7. Cookies.
8. Data da última atualização.

O texto deve ser revisado por um advogado antes da produção.

### 5.13 Página 404
Fundo petróleo, título "Página não encontrada", manuscrito "vamos te levar de volta" e botão para a home.

## 6. Comportamentos interativos

- **Aparições ao rolar:** títulos, parágrafos e cartões sobem 16 px e aparecem com opacidade em 0,6 s, uma única vez, via `IntersectionObserver`. O estado inicial oculto só é aplicado por JS, então sem JS tudo aparece.
- **Abas de serviços:** padrão ARIA de abas (setas ←/→, Home, End). Sem JS, todos os painéis aparecem em sequência.
- **Menu do celular:** diálogo modal (`aria-modal`), foco preso dentro dele, fecha com Esc, com o X ou ao clicar num link, e trava a rolagem do fundo.
- **Simulador:** cálculo instantâneo. Os controles deslizantes usam `aria-valuetext` em reais.
- **Movimento reduzido** (`prefers-reduced-motion`): desliga aparições, varredura, pulsos e o rodízio de eventos.
- **Links externos:** a Área do morador abre na mesma aba. O WhatsApp abre em nova aba (`rel="noopener"`).

## 7. Formulário de orçamento

### 7.1 Campos e validação

| Campo | Obrigatório | Regra |
|---|---|---|
| Nome | sim | 2–80 caracteres |
| Telefone / WhatsApp | sim | máscara `(12) 98185-4159`; 10–11 dígitos |
| E-mail | não | formato válido se preenchido |
| Condomínio | sim | 2–100 caracteres |
| Cidade | sim | seleção: São José dos Campos, Jacareí, Caçapava, Taubaté, Pindamonhangaba, Outra cidade da região |
| Unidades | não | inteiro 1–5000 |
| Mensagem | não | até 1000 caracteres |
| `simulacao` | oculto | preenchido pelo simulador |
| `website` | oculto | armadilha antispam (honeypot); deve chegar vazio |
| `t` | oculto | milissegundos desde a abertura do formulário, calculados no navegador (armadilha de tempo; ausente sem JS) |

- As mensagens de erro aparecem abaixo do campo ao sair dele e no envio, ligadas via `aria-describedby`, com `aria-invalid`.
- Texto antes do botão: "Ao enviar, você concorda com a nossa Política de Privacidade. Respondemos por e-mail ou WhatsApp."
- Botão: "Enviar pedido". Durante o envio, mostra "Enviando…" e fica desativado (evita duplicidade).

### 7.2 Resultados
- **Sucesso:** o painel substitui o formulário com "Pedido recebido." / "Obrigado, {nome}. Nossa equipe vai entrar em contato em breve." e o botão "Continuar no WhatsApp". Mensagem do WhatsApp: "Olá! Acabei de pedir um orçamento pelo site. Sou {nome}, do condomínio {condominio} ({cidade})."
- **Falha** (rede, servidor ou limite de envios): "Não conseguimos enviar agora." com os botões "Enviar pelo WhatsApp" (com todos os campos na mensagem) e "Tentar de novo", que volta ao formulário com os dados preservados.
- **Modo demonstração:** valida normalmente e mostra o painel de sucesso com o selo "Versão de demonstração: nenhum dado foi enviado. No site oficial, este pedido chega por e-mail."

### 7.3 Modos (definidos na compilação)
- **`demo`:** GitHub Pages; não faz requisição de rede.
- **`php`:** HostGator; `POST {base}api/orcamento.php` com `Accept: application/json`.

### 7.4 Endpoint PHP (produção — escrito, não implantado)
- Aceita só `POST`; confere `Origin`/`Referer` com o domínio oficial; aceita JSON ou formulário tradicional.
- Revalida todos os campos (§7.1) e limpa os textos.
- **Antispam:** honeypot preenchido ou envio com menos de 3 s após abrir o formulário → responde sucesso falso, sem enviar. Limite de 5 envios por hora por IP, com registro em arquivo fora da pasta pública.
- **E-mail via PHPMailer (SMTP autenticado), usando uma caixa do domínio:**
  - Para: contato@cmportariavirtual.com.br.
  - Responder para: e-mail do visitante, se houver.
  - Assunto: "Novo pedido de orçamento — {condomínio} ({cidade})".
  - Corpo em texto e HTML, com todos os campos, a simulação, data e hora.
- Cada pedido também é gravado em `leads.jsonl` **fora da pasta pública**.
- As credenciais SMTP ficam num arquivo de configuração fora da pasta pública. No projeto vai só o `config.exemplo.php`.
- **Respostas:** `200 {ok:true}`; `422 {ok:false,error:"validacao",campos:[…]}`; `429 {ok:false,error:"limite"}`; `502 {ok:false,error:"envio"}`. No `502`, o pedido fica gravado e o front oferece o WhatsApp.
- **Sem JS:** responde uma página HTML simples ("Pedido recebido" ou erro) com link de volta.

## 8. Medição (GA4)
- Só ativa quando a variável `GA_ID` (astro:env) está definida. **Na demonstração fica desligada.**
- Consent Mode v2 com tudo negado por padrão.
- Aviso discreto no rodapé da tela: "Usamos cookies para medir as visitas e melhorar o site." [Aceitar] [Recusar]. A escolha fica salva no `localStorage`.
- O `gtag` só carrega após aceite.
- Eventos: `gerar_lead` (envio com sucesso), `clique_whatsapp`, `clique_telefone`, `clique_area_morador`, `uso_simulador` (primeira interação).

## 9. SEO

| Item | Demonstração (`ghpages`) | Produção (`hostgator`) |
|---|---|---|
| `site` / `base` | `https://viniciuscruz-dev.github.io` / `/cm-portaria-virtual/` | `https://www.cmportariavirtual.com.br` / `/` |
| Indexação | `noindex, nofollow` | indexável; `sitemap.xml` + `robots.txt` |
| Canonical | URL da demonstração | `https://www.cmportariavirtual.com.br/` |

- **Título:** "Portaria Virtual em São José dos Campos | CM Portaria Virtual".
- **Descrição:** "Portaria virtual para condomínios em São José dos Campos e Vale do Paraíba: central própria 24 horas, reconhecimento facial e atendimento humano. Peça seu orçamento."
- **Imagem de compartilhamento:** 1200×630 (abertura + título), gerada como arquivo estático.
- **Favicons:** 32 px, 180 px (Apple) e `.ico`, gerados a partir do logo.
- **Dados estruturados:**
  - `LocalBusiness`: nome, URL, telefone, área atendida, horário 24/7.
  - `FAQPage`, igual às perguntas visíveis.
  - **Sem** `Product` nem `AggregateRating`.
- **Redirecionamentos 301 (produção, `.htaccess`):**
  - `/index.html` → `/`
  - `/paginas/*` → `/#servicos`
  - `/recursos/*` → `/`
  - HTTPS e `www` forçados.
- Página 404 própria configurada no `.htaccess`.

## 10. Acessibilidade e desempenho

**Acessibilidade (WCAG 2.2 AA)**
- Link "Pular para o conteúdo" e foco visível (contorno de 2 px no acento).
- Um H1 só, com H2 por seção.
- Textos alternativos nas fotos de conteúdo; fotos decorativas com `alt=""`.
- Contraste conferido.
- Alvos de toque com 44 px ou mais.

**Desempenho**
- Fotos via `astro:assets` em AVIF/WebP, com larguras 480/960/1600. A da abertura tem `fetchpriority="high"`; as outras usam `loading="lazy"`.
- Fontes com subconjunto latino, `font-display: swap` e pré-carregamento das duas principais.

**Orçamentos (celular)**

| Métrica | Limite |
|---|---|
| LCP | ≤ 2,5 s |
| CLS | ≤ 0,05 |
| JS próprio | ≤ 35 KB gzip |
| Primeira carga | ≤ 1,5 MB |

## 11. Arquitetura técnica

- **Astro 7.x** em modo estático, TypeScript estrito e sem framework de interface. Os scripts de cliente ficam em `<script>` dos componentes, empacotados pelo Astro.
- **Configuração por ambiente (na compilação):**
  - `DEPLOY_TARGET=ghpages|hostgator` define `site`, `base`, indexação e modo do formulário.
  - `GA_ID` é opcional.
- **Links internos e caminhos** sempre via `import.meta.env.BASE_URL`, porque a demonstração roda em subpasta.

```
/
├─ src/
│  ├─ content/site.ts          # todos os textos e dados (fonte única)
│  ├─ lib/config.ts            # leitura do ambiente
│  ├─ lib/simulador.ts         # cálculo e formatação (puro, testado)
│  ├─ lib/formulario.ts        # validação, máscara, resumo, links de WhatsApp (puro, testado)
│  ├─ layouts/Base.astro       # <head>, SEO, dados estruturados, fontes, cabeçalho, rodapé
│  ├─ components/              # Cabecalho, MenuCelular, Abertura, Sobre, Servicos, Central,
│  │                           # ComoFunciona, Simulador, Cobertura, Duvidas, Contato, Rodape,
│  │                           # WhatsAppFlutuante, AvisoCookies, TituloSecao
│  ├─ styles/tokens.css, base.css
│  ├─ assets/                  # logo e fotos (otimizadas na compilação)
│  └─ pages/index.astro, politica-de-privacidade.astro, 404.astro
├─ public/                     # favicons, imagem de compartilhamento
├─ servidor/hostgator/         # orcamento.php, lib/PHPMailer, config.exemplo.php, .htaccess, LEIA-ME.md
├─ scripts/pos-build.mjs       # copia servidor/hostgator para dist/ só no alvo hostgator
├─ tests/unit/                 # Vitest
├─ tests/e2e/                  # Playwright
├─ docs/creditos-imagens.md    # origem e licença de cada foto
└─ .github/workflows/pages.yml # build + testes + publicação no GitHub Pages
```

## 12. Testes

**Unitários (Vitest)**
- Simulador: todos os casos do §5.6, formatação e "já sei quanto pago".
- Validação de cada campo, máscara de telefone, resumo da simulação e URLs do WhatsApp (codificação).

**Ponta a ponta (Playwright, Chromium; 1440×900 e 390×844)**
1. Carrega sem erros no console e sem arquivos 404; todas as âncoras internas existem.
2. Sem rolagem horizontal em 320, 390, 768, 1024 e 1440 px.
3. Menu do celular: abre, prende o foco, fecha com Esc e ao clicar num link.
4. Serviços: troca por clique e por setas; sanfona no celular.
5. Simulador:
   - O padrão mostra R$ 24.480.
   - Trocar o tipo e as unidades atualiza o resultado.
   - "Já sei quanto pago" funciona.
   - O botão preenche o formulário.
6. Formulário:
   - Erros de obrigatórios e máscara.
   - Modo demonstração mostra o selo.
   - Modo PHP com rota simulada: sucesso mostra o painel; 500 mostra o WhatsApp com a mensagem completa.
7. Área do morador aponta para `https://portal.cmportariavirtual.com.br` no cabeçalho, celular, menu e rodapé.
8. Movimento reduzido: rodízio de eventos parado.
9. axe-core: nenhuma violação séria ou crítica.

**Lighthouse (celular)** no build local: desempenho ≥ 90 e acessibilidade ≥ 95. O SEO é medido no alvo `hostgator`.

**PHP:** verificação de sintaxe com `php-parser` (npm). O teste funcional fica para a primeira publicação na HostGator (não há PHP local).

## 13. Publicação da demonstração
- `git init` local com `.gitignore` excluindo `node_modules/`, `dist/`, `.astro/`, `analise/`, `logos/`, `.superpowers/`, `.env*` e os relatórios de teste.
- Repositório público `ViniciusCruz-dev/cm-portaria-virtual` (criado com `gh`).
- GitHub Pages com origem "GitHub Actions". O workflow roda a cada push na `main`: instala, testa (unitários), compila com `DEPLOY_TARGET=ghpages` e publica.
- **URL esperada:** `https://viniciuscruz-dev.github.io/cm-portaria-virtual/`

## 14. Pendências antes da produção
1. Razão social e CNPJ (Política de Privacidade).
2. Caixa de e-mail do domínio para envio (ex.: site@cmportariavirtual.com.br) e senha SMTP.
3. ID do GA4 na conta do dono.
4. Fotos reais: central, equipe, instalações.
5. Confirmar as afirmações do serviço: central própria, equipe própria e app para moradores.
6. Confirmar os valores do simulador (R$ 3.000 / R$ 3.800 / 80%).
7. Revisão jurídica da Política de Privacidade.
8. Backup completo do site atual antes da troca.

## 15. Riscos
- **Fotos de banco** podem parecer genéricas; o tratamento de cor ameniza até chegarem as reais.
- **O repositório é público:** código e textos ficam visíveis. Nenhuma credencial vai para o repositório.
- **O PHP só é testado de verdade na HostGator.**
- **GitHub Pages em subpasta:** links montados sem `BASE_URL` quebram. Os testes de ponta a ponta cobrem isso.
