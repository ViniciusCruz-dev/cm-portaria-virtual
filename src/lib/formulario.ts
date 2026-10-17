/** Regras do formulário de orçamento, compartilhadas pelo navegador e pelos testes. */

export const CIDADES_FORM = ['São José dos Campos', 'Jacareí', 'Caçapava', 'Taubaté', 'Pindamonhangaba', 'Outra cidade da região'] as const;

export type CampoPedido = 'nome' | 'telefone' | 'email' | 'condominio' | 'cidade' | 'unidades' | 'mensagem';

export interface DadosPedido {
  nome: string;
  telefone: string;
  email: string;
  condominio: string;
  cidade: string;
  unidades: string;
  mensagem: string;
  simulacao: string;
}

export type ErrosPedido = Partial<Record<CampoPedido, string>>;

export const CAMPOS_PEDIDO: CampoPedido[] = ['nome', 'telefone', 'email', 'condominio', 'cidade', 'unidades', 'mensagem'];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, '');
}

export function mascararTelefone(valor: string): string {
  const d = apenasDigitos(valor).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function validarCampo(campo: CampoPedido, valorBruto: string): string | undefined {
  const valor = valorBruto.trim();
  switch (campo) {
    case 'nome':
      return valor.length < 2 || valor.length > 80 ? 'Informe seu nome.' : undefined;
    case 'telefone': {
      const digitos = apenasDigitos(valor).length;
      return digitos < 10 || digitos > 11 ? 'Informe um telefone com DDD.' : undefined;
    }
    case 'email':
      return valor !== '' && !EMAIL.test(valor) ? 'Confira o e-mail.' : undefined;
    case 'condominio':
      return valor.length < 2 || valor.length > 100 ? 'Informe o nome do condomínio.' : undefined;
    case 'cidade':
      return (CIDADES_FORM as readonly string[]).includes(valor) ? undefined : 'Escolha a cidade.';
    case 'unidades': {
      if (valor === '') return undefined;
      const numero = Number(valor);
      return /^\d+$/.test(valor) && numero >= 1 && numero <= 5000 ? undefined : 'Use um número entre 1 e 5000.';
    }
    case 'mensagem':
      return valor.length > 1000 ? 'Use até 1000 caracteres.' : undefined;
    default:
      return undefined;
  }
}

export function validarPedido(dados: DadosPedido): ErrosPedido {
  const erros: ErrosPedido = {};
  for (const campo of CAMPOS_PEDIDO) {
    const mensagem = validarCampo(campo, dados[campo]);
    if (mensagem) erros[campo] = mensagem;
  }
  return erros;
}

export function linkWhatsApp(numero: string, texto: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

export function mensagemWhatsAppSucesso(d: DadosPedido): string {
  return `Olá! Acabei de pedir um orçamento pelo site. Sou ${d.nome}, do condomínio ${d.condominio} (${d.cidade}).`;
}

export function mensagemWhatsAppCompleta(d: DadosPedido): string {
  const linhas = ['Olá! Gostaria de um orçamento de portaria virtual.', `Nome: ${d.nome}`, `Telefone: ${d.telefone}`];
  if (d.email) linhas.push(`E-mail: ${d.email}`);
  linhas.push(`Condomínio: ${d.condominio}`, `Cidade: ${d.cidade}`);
  if (d.unidades) linhas.push(`Unidades: ${d.unidades}`);
  if (d.mensagem) linhas.push(`Mensagem: ${d.mensagem}`);
  if (d.simulacao && !d.mensagem.includes(d.simulacao)) linhas.push(d.simulacao);
  return linhas.join('\n');
}
