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
