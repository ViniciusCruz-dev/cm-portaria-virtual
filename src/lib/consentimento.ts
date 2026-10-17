/** Guarda a escolha do visitante sobre os cookies de medição. */

export type Escolha = 'aceito' | 'recusado';

export const CHAVE_CONSENTIMENTO = 'cm-consentimento';

export function lerEscolha(armazenamento: Pick<Storage, 'getItem'> | null): Escolha | null {
  try {
    const valor = armazenamento?.getItem(CHAVE_CONSENTIMENTO);
    return valor === 'aceito' || valor === 'recusado' ? valor : null;
  } catch {
    return null;
  }
}

export function salvarEscolha(armazenamento: Pick<Storage, 'setItem'> | null, escolha: Escolha): void {
  try {
    armazenamento?.setItem(CHAVE_CONSENTIMENTO, escolha);
  } catch {
    // Sem armazenamento disponível: o aviso volta a aparecer na próxima visita.
  }
}
