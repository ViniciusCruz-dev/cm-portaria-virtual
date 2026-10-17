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
