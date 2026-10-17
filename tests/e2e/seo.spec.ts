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
