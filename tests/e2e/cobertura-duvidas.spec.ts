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
