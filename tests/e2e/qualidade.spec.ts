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
