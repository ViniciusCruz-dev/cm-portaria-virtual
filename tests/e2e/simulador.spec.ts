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
