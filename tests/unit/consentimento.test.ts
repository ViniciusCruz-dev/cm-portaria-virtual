import { describe, it, expect } from 'vitest';
import { CHAVE_CONSENTIMENTO, lerEscolha, salvarEscolha } from '../../src/lib/consentimento';

function memoria() {
  const dados = new Map<string, string>();
  return {
    getItem: (chave: string) => dados.get(chave) ?? null,
    setItem: (chave: string, valor: string) => {
      dados.set(chave, valor);
    },
  };
}

describe('consentimento', () => {
  it('sem escolha salva, retorna null', () => expect(lerEscolha(memoria())).toBeNull());
  it('salva e lê a escolha', () => {
    const armazenamento = memoria();
    salvarEscolha(armazenamento, 'aceito');
    expect(lerEscolha(armazenamento)).toBe('aceito');
  });
  it('ignora valores desconhecidos', () => {
    const armazenamento = memoria();
    armazenamento.setItem(CHAVE_CONSENTIMENTO, 'talvez');
    expect(lerEscolha(armazenamento)).toBeNull();
  });
  it('funciona sem armazenamento', () => {
    expect(lerEscolha(null)).toBeNull();
    expect(() => salvarEscolha(null, 'recusado')).not.toThrow();
  });
  it('não quebra se o armazenamento lançar erro', () => {
    const quebrado = {
      getItem: () => {
        throw new Error('bloqueado');
      },
      setItem: () => {
        throw new Error('bloqueado');
      },
    };
    expect(lerEscolha(quebrado)).toBeNull();
    expect(() => salvarEscolha(quebrado, 'aceito')).not.toThrow();
  });
});
