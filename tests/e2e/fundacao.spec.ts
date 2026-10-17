import { test, expect } from '@playwright/test';

test('página inicial abre com idioma, título e noindex da demonstração', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveTitle(/CM Portaria Virtual/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
});
