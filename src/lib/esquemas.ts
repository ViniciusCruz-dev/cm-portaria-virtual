/** Dados estruturados (schema.org) só com informações reais: sem avaliações nem preços. */

const DIAS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function esquemaEmpresa(url: string, cidades: string[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'CM Portaria Virtual',
    description: 'Portaria virtual e monitoramento 24 horas para condomínios em São José dos Campos e no Vale do Paraíba.',
    url,
    image: `${url}og-image.jpg`,
    telephone: '+55-12-98185-4159',
    email: 'contato@cmportariavirtual.com.br',
    address: { '@type': 'PostalAddress', addressLocality: 'São José dos Campos', addressRegion: 'SP', addressCountry: 'BR' },
    areaServed: cidades.map((cidade) => ({ '@type': 'City', name: cidade })),
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: DIAS, opens: '00:00', closes: '23:59' }],
  };
}

export function esquemaPerguntas(perguntas: { pergunta: string; resposta: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: perguntas.map((item) => ({ '@type': 'Question', name: item.pergunta, acceptedAnswer: { '@type': 'Answer', text: item.resposta } })),
  };
}
