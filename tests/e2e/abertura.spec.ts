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
