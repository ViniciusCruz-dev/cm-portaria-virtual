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
