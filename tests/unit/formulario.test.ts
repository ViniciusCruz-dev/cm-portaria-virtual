import { describe, it, expect } from 'vitest';
import {
  linkWhatsApp,
  mascararTelefone,
  mensagemWhatsAppCompleta,
  mensagemWhatsAppSucesso,
  validarCampo,
  validarPedido,
  type DadosPedido,
} from '../../src/lib/formulario';

const valido: DadosPedido = {
  nome: 'Ana Souza',
  telefone: '(12) 98185-4159',
  email: 'ana@exemplo.com',
  condominio: 'Residencial Aurora',
  cidade: 'São José dos Campos',
  unidades: '80',
  mensagem: '',
  simulacao: '',
};

describe('mascararTelefone', () => {
  it('formata celular com 11 dígitos', () => expect(mascararTelefone('12981854159')).toBe('(12) 98185-4159'));
  it('formata fixo com 10 dígitos', () => expect(mascararTelefone('1239211234')).toBe('(12) 3921-1234'));
  it('formata enquanto a pessoa digita', () => {
    expect(mascararTelefone('1')).toBe('(1');
    expect(mascararTelefone('129')).toBe('(12) 9');
  });
  it('ignora letras e corta o excesso', () => expect(mascararTelefone('12a98185415999')).toBe('(12) 98185-4159'));
  it('vazio continua vazio', () => expect(mascararTelefone('')).toBe(''));
});

describe('validarPedido', () => {
  it('aceita um pedido completo', () => expect(validarPedido(valido)).toEqual({}));
  it('exige nome, telefone, condomínio e cidade', () => {
    const erros = validarPedido({ ...valido, nome: '', telefone: '', condominio: '', cidade: '' });
    expect(Object.keys(erros).sort()).toEqual(['cidade', 'condominio', 'nome', 'telefone']);
  });
  it('e-mail é opcional, mas precisa ser válido se preenchido', () => {
    expect(validarPedido({ ...valido, email: '' })).toEqual({});
    expect(validarPedido({ ...valido, email: 'ana@' }).email).toBe('Confira o e-mail.');
  });
  it('unidades precisa ser um número entre 1 e 5000', () => {
    expect(validarPedido({ ...valido, unidades: '' })).toEqual({});
    expect(validarPedido({ ...valido, unidades: '0' }).unidades).toBe('Use um número entre 1 e 5000.');
    expect(validarPedido({ ...valido, unidades: '5001' }).unidades).toBe('Use um número entre 1 e 5000.');
    expect(validarPedido({ ...valido, unidades: 'abc' }).unidades).toBe('Use um número entre 1 e 5000.');
  });
  it('cidade precisa ser uma das opções', () => {
    expect(validarPedido({ ...valido, cidade: 'Rio de Janeiro' }).cidade).toBe('Escolha a cidade.');
  });
  it('mensagem tem limite de 1000 caracteres', () => {
    expect(validarPedido({ ...valido, mensagem: 'a'.repeat(1001) }).mensagem).toBe('Use até 1000 caracteres.');
  });
});

describe('validarCampo', () => {
  it('telefone curto pede o DDD', () => expect(validarCampo('telefone', '(12) 9818')).toBe('Informe um telefone com DDD.'));
  it('campo válido não tem mensagem', () => expect(validarCampo('nome', 'Ana')).toBeUndefined());
});

describe('links do WhatsApp', () => {
  it('monta a URL com o texto codificado', () => {
    expect(linkWhatsApp('5512981854159', 'Olá! Tudo bem?')).toBe('https://wa.me/5512981854159?text=Ol%C3%A1!%20Tudo%20bem%3F');
  });
  it('a mensagem de sucesso cita nome, condomínio e cidade', () => {
    expect(mensagemWhatsAppSucesso(valido)).toBe(
      'Olá! Acabei de pedir um orçamento pelo site. Sou Ana Souza, do condomínio Residencial Aurora (São José dos Campos).',
    );
  });
  it('a mensagem completa leva todos os campos preenchidos', () => {
    const texto = mensagemWhatsAppCompleta({ ...valido, mensagem: 'Temos 2 portões.', simulacao: 'Simulação: teste.' });
    expect(texto).toBe(
      [
        'Olá! Gostaria de um orçamento de portaria virtual.',
        'Nome: Ana Souza',
        'Telefone: (12) 98185-4159',
        'E-mail: ana@exemplo.com',
        'Condomínio: Residencial Aurora',
        'Cidade: São José dos Campos',
        'Unidades: 80',
        'Mensagem: Temos 2 portões.',
        'Simulação: teste.',
      ].join('\n'),
    );
  });
  it('a mensagem completa omite campos vazios e não repete a simulação', () => {
    const texto = mensagemWhatsAppCompleta({ ...valido, email: '', unidades: '', mensagem: 'Simulação: teste.', simulacao: 'Simulação: teste.' });
    expect(texto).not.toContain('E-mail');
    expect(texto).not.toContain('Unidades');
    expect(texto.match(/Simulação: teste\./g)).toHaveLength(1);
  });
});
