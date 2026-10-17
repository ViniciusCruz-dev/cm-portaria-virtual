import { describe, it, expect } from 'vitest';
import { esquemaEmpresa, esquemaPerguntas } from '../../src/lib/esquemas';

describe('esquemaEmpresa', () => {
  const empresa = esquemaEmpresa('https://www.cmportariavirtual.com.br/', ['São José dos Campos', 'Jacareí']);

  it('é um LocalBusiness com nome, endereço e funcionamento 24/7', () => {
    expect(empresa['@type']).toBe('LocalBusiness');
    expect(empresa.name).toBe('CM Portaria Virtual');
    expect(empresa.address).toMatchObject({ addressLocality: 'São José dos Campos', addressRegion: 'SP', addressCountry: 'BR' });
    expect(JSON.stringify(empresa.openingHoursSpecification)).toContain('23:59');
  });

  it('lista as cidades atendidas', () => {
    expect(empresa.areaServed).toEqual([
      { '@type': 'City', name: 'São José dos Campos' },
      { '@type': 'City', name: 'Jacareí' },
    ]);
  });

  it('não declara avaliações', () => {
    expect(JSON.stringify(empresa)).not.toMatch(/rating|review/i);
  });
});

describe('esquemaPerguntas', () => {
  it('converte perguntas e respostas em FAQPage', () => {
    expect(esquemaPerguntas([{ pergunta: 'P?', resposta: 'R.' }])).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [{ '@type': 'Question', name: 'P?', acceptedAnswer: { '@type': 'Answer', text: 'R.' } }],
    });
  });
});
