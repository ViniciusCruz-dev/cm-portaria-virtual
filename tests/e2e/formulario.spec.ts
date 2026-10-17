import { test, expect, type Page } from '@playwright/test';

async function preencher(page: Page) {
  await page.getByLabel('Nome', { exact: true }).fill('Ana Souza');
  await page.getByLabel('Telefone / WhatsApp').fill('12981854159');
  await page.getByLabel('E-mail', { exact: true }).fill('ana@exemplo.com');
  await page.getByLabel('Condomínio', { exact: true }).fill('Residencial Aurora');
  await page.getByLabel('Cidade', { exact: true }).selectOption('São José dos Campos');
  await page.getByLabel('Unidades', { exact: true }).fill('80');
}

async function usarModoPhp(page: Page) {
  await page.evaluate(() => {
    const form = document.querySelector<HTMLFormElement>('[data-form-orcamento]');
    if (!form) throw new Error('formulário não encontrado');
    form.dataset.modo = 'php';
    form.dataset.endpoint = '/teste/orcamento';
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto('./#contato');
});

test('mostra os erros dos campos obrigatórios', async ({ page }) => {
  await page.getByRole('button', { name: 'Enviar pedido' }).click();
  await expect(page.locator('#erro-nome')).toHaveText('Informe seu nome.');
  await expect(page.locator('#erro-telefone')).toHaveText('Informe um telefone com DDD.');
  await expect(page.locator('#erro-condominio')).toHaveText('Informe o nome do condomínio.');
  await expect(page.locator('#erro-cidade')).toHaveText('Escolha a cidade.');
  const nome = page.getByLabel('Nome', { exact: true });
  await expect(nome).toBeFocused();
  await expect(nome).toHaveAttribute('aria-invalid', 'true');
});

test('formata o telefone enquanto digita', async ({ page }) => {
  const telefone = page.getByLabel('Telefone / WhatsApp');
  await telefone.pressSequentially('12981854159');
  await expect(telefone).toHaveValue('(12) 98185-4159');
});

test('modo demonstração confirma sem enviar nada', async ({ page }) => {
  const envios: string[] = [];
  page.on('request', (requisicao) => {
    if (requisicao.method() === 'POST') envios.push(requisicao.url());
  });
  await preencher(page);
  await page.getByRole('button', { name: 'Enviar pedido' }).click();
  const painel = page.locator('[data-painel-sucesso]');
  await expect(painel).toBeVisible();
  await expect(painel).toContainText('Obrigado, Ana.');
  await expect(painel.locator('[data-aviso-demo]')).toBeVisible();
  await expect(painel.getByRole('link', { name: 'Continuar no WhatsApp' })).toHaveAttribute('href', /Ana%20Souza/);
  expect(envios).toEqual([]);
});

test('modo PHP: sucesso envia JSON e mostra a confirmação', async ({ page }) => {
  await page.route('**/teste/orcamento', (rota) => rota.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }));
  await usarModoPhp(page);
  await preencher(page);
  const [pedido] = await Promise.all([page.waitForRequest('**/teste/orcamento'), page.getByRole('button', { name: 'Enviar pedido' }).click()]);
  const corpo = pedido.postDataJSON();
  expect(corpo).toMatchObject({ nome: 'Ana Souza', telefone: '(12) 98185-4159', cidade: 'São José dos Campos', website: '' });
  expect(typeof corpo.t).toBe('number');
  await expect(page.locator('[data-painel-sucesso]')).toBeVisible();
  await expect(page.locator('[data-aviso-demo]')).toBeHidden();
});

test('modo PHP: falha oferece WhatsApp e mantém os dados', async ({ page }) => {
  await page.route('**/teste/orcamento', (rota) => rota.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ ok: false, error: 'envio' }) }));
  await usarModoPhp(page);
  await preencher(page);
  await page.getByRole('button', { name: 'Enviar pedido' }).click();
  const falha = page.locator('[data-painel-falha]');
  await expect(falha).toBeVisible();
  await expect(falha.getByRole('link', { name: 'Enviar pelo WhatsApp' })).toHaveAttribute('href', /Condom%C3%ADnio%3A%20Residencial%20Aurora/);
  await falha.getByRole('button', { name: 'Tentar de novo' }).click();
  await expect(page.getByLabel('Nome', { exact: true })).toHaveValue('Ana Souza');
});
