import { describe, it, expect } from 'vitest';
import { custoMensal, descricaoPorteiros, formatarReais, PREMISSAS_PADRAO, resultado, resumoSimulacao } from '../../src/lib/simulador';

describe('custoMensal', () => {
  it('portaria 24 horas com os valores padrão custa R$ 24.480', () => {
    expect(custoMensal('24h')).toBe(24480);
  });
  it('portaria 12h diurna usa 2 porteiros diurnos', () => {
    expect(custoMensal('12h-diurna')).toBe(10800);
  });
  it('portaria 12h noturna usa 2 porteiros noturnos', () => {
    expect(custoMensal('12h-noturna')).toBe(13680);
  });
  it('aceita custos ajustados pelo síndico', () => {
    expect(custoMensal('24h', { ...PREMISSAS_PADRAO, custoDiurno: 2500 })).toBe(22680);
  });
});

describe('resultado', () => {
  it('divide pelo número de unidades e multiplica por 12 meses', () => {
    expect(resultado(24480, 80)).toEqual({ mensal: 24480, porUnidade: 306, anual: 293760 });
  });
  it('nunca divide por zero', () => {
    expect(resultado(1000, 0).porUnidade).toBe(1000);
  });
});

describe('formatarReais', () => {
  it('usa o formato brasileiro, sem centavos', () => {
    expect(formatarReais(24480)).toBe('R$ 24.480');
    expect(formatarReais(306.4)).toBe('R$ 306');
  });
});

describe('descricaoPorteiros', () => {
  it('descreve a equipe de cada tipo', () => {
    expect(descricaoPorteiros('24h')).toBe('2 diurnos + 2 noturnos');
    expect(descricaoPorteiros('12h-diurna')).toBe('2 diurnos');
    expect(descricaoPorteiros('12h-noturna')).toBe('2 noturnos');
  });
});

describe('resumoSimulacao', () => {
  it('descreve a estimativa', () => {
    expect(resumoSimulacao({ tipo: '24h', unidades: 80, mensal: 24480, informado: false })).toBe(
      'Simulação: portaria 24 horas (2 diurnos + 2 noturnos), 80 unidades. Custo estimado: R$ 24.480/mês (R$ 306 por unidade).',
    );
  });
  it('descreve o valor informado pelo síndico', () => {
    expect(resumoSimulacao({ tipo: '24h', unidades: 100, mensal: 20000, informado: true })).toBe(
      'Simulação: valor atual informado pelo síndico, 100 unidades. Custo informado: R$ 20.000/mês (R$ 200 por unidade).',
    );
  });
});
