import type { Page } from '@playwright/test';

export function vigiarErros(page: Page): string[] {
  const erros: string[] = [];
  page.on('pageerror', (erro) => erros.push(`pageerror: ${erro.message}`));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') erros.push(`console: ${mensagem.text()}`);
  });
  page.on('response', (resposta) => {
    if (resposta.status() >= 400 && new URL(resposta.url()).hostname === 'localhost') erros.push(`${resposta.status()} ${resposta.url()}`);
  });
  return erros;
}
