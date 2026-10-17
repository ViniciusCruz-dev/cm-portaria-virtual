/** Cálculo do custo da portaria atual. Valores informados pela CM (site antigo). */

export type TipoPortaria = '24h' | '12h-diurna' | '12h-noturna';

export interface Premissas {
  custoDiurno: number;
  custoNoturno: number;
  fatorEncargos: number;
}

export interface ResultadoSimulacao {
  mensal: number;
  porUnidade: number;
  anual: number;
}

export const PREMISSAS_PADRAO: Premissas = { custoDiurno: 3000, custoNoturno: 3800, fatorEncargos: 1.8 };

const PORTEIROS: Record<TipoPortaria, { diurnos: number; noturnos: number }> = {
  '24h': { diurnos: 2, noturnos: 2 },
  '12h-diurna': { diurnos: 2, noturnos: 0 },
  '12h-noturna': { diurnos: 0, noturnos: 2 },
};

export const ROTULO_TIPO: Record<TipoPortaria, string> = {
  '24h': '24 horas',
  '12h-diurna': '12h diurna',
  '12h-noturna': '12h noturna',
};

const formatador = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

export function custoMensal(tipo: TipoPortaria, premissas: Premissas = PREMISSAS_PADRAO): number {
  const { diurnos, noturnos } = PORTEIROS[tipo];
  return Math.round((diurnos * premissas.custoDiurno + noturnos * premissas.custoNoturno) * premissas.fatorEncargos);
}

export function resultado(mensal: number, unidades: number): ResultadoSimulacao {
  const divisor = Math.max(1, Math.round(unidades));
  return { mensal: Math.round(mensal), porUnidade: Math.round(mensal / divisor), anual: Math.round(mensal * 12) };
}

export function formatarReais(valor: number): string {
  return `R$ ${formatador.format(Math.round(valor))}`;
}

export function descricaoPorteiros(tipo: TipoPortaria): string {
  const { diurnos, noturnos } = PORTEIROS[tipo];
  const partes: string[] = [];
  if (diurnos > 0) partes.push(`${diurnos} diurnos`);
  if (noturnos > 0) partes.push(`${noturnos} noturnos`);
  return partes.join(' + ');
}

export function resumoSimulacao(e: { tipo: TipoPortaria; unidades: number; mensal: number; informado: boolean }): string {
  const r = resultado(e.mensal, e.unidades);
  const descricao = e.informado
    ? `valor atual informado pelo síndico, ${e.unidades} unidades. Custo informado`
    : `portaria ${ROTULO_TIPO[e.tipo]} (${descricaoPorteiros(e.tipo)}), ${e.unidades} unidades. Custo estimado`;
  return `Simulação: ${descricao}: ${formatarReais(r.mensal)}/mês (${formatarReais(r.porUnidade)} por unidade).`;
}
