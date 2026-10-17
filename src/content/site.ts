/**
 * Fonte única dos textos e dados do site.
 * Para trocar um texto, altere aqui: os componentes só leem estes valores.
 */

export const contato = {
  telefone0800: '0800 672 7280',
  telefone0800Link: 'tel:08006727280',
  whatsapp: '(12) 98185-4159',
  whatsappNumero: '5512981854159',
  email: 'contato@cmportariavirtual.com.br',
  portalMorador: 'https://portal.cmportariavirtual.com.br',
  horarioComercial: 'Seg. a sex. 8h–18h · Sáb. 8h–12h',
  horarioSuporte: '24 horas, todos os dias',
  mensagemWhatsAppPadrao: 'Olá! Vim pelo site e gostaria de mais informações sobre a portaria virtual.',
} as const;

export const cidades = ['São José dos Campos', 'Jacareí', 'Caçapava', 'Taubaté', 'Pindamonhangaba'];

export interface LinkNavegacao {
  rotulo: string;
  ancora: string;
}

export const navegacao: { computador: LinkNavegacao[]; celular: LinkNavegacao[] } = {
  computador: [
    { rotulo: 'Serviços', ancora: 'servicos' },
    { rotulo: 'Como funciona', ancora: 'como-funciona' },
    { rotulo: 'Simulador', ancora: 'simulador' },
    { rotulo: 'Contato', ancora: 'contato' },
  ],
  celular: [
    { rotulo: 'Serviços', ancora: 'servicos' },
    { rotulo: 'Como funciona', ancora: 'como-funciona' },
    { rotulo: 'Simulador', ancora: 'simulador' },
    { rotulo: 'Cobertura', ancora: 'cobertura' },
    { rotulo: 'Dúvidas', ancora: 'duvidas' },
    { rotulo: 'Contato', ancora: 'contato' },
  ],
};

export const seo = {
  titulo: 'Portaria Virtual em São José dos Campos | CM Portaria Virtual',
  descricao:
    'Portaria virtual para condomínios em São José dos Campos e Vale do Paraíba: central própria 24 horas, reconhecimento facial e atendimento humano. Peça seu orçamento.',
};

export const abertura = {
  titulo: 'Portaria virtual\npara condomínios',
  manuscrito: 'em São José dos Campos',
  texto: 'Central própria 24 horas, reconhecimento facial e atendimento humano, sem encargos trabalhistas, férias ou faltas.',
  botaoPrincipal: 'Solicitar orçamento',
  botaoSecundario: 'Como funciona',
  altFoto: 'Prédio residencial à noite, com janelas acesas',
};

export const sobre = {
  titulo: 'Segurança que\nnão tira folga',
  manuscrito: 'sobre a CM',
  paragrafos: [
    'A CM Portaria Virtual cuida da entrada do seu condomínio a partir de uma central de monitoramento própria em São José dos Campos. Operadores treinados atendem visitantes, falam com os moradores e liberam o acesso a distância, com registro de tudo.',
    'Instalação, manutenção e suporte são feitos pela nossa própria equipe, que está na região e chega rápido quando precisa.',
  ],
  diferenciais: ['Central própria 24h', 'Equipe técnica local', 'Atendimento humano', 'App para moradores'],
  altFoto: 'Entrada iluminada de um edifício à noite',
};

export type IdServico = 'monitoramento' | 'acesso' | 'app' | 'audio' | 'relatorios' | 'emergencias';

export interface Servico {
  id: IdServico;
  titulo: string;
  texto: string;
  itens: string[];
  altFoto: string;
}

export const servicos: { titulo: string; manuscrito: string; itens: Servico[] } = {
  titulo: 'Tudo que a sua portaria faz',
  manuscrito: 'e um pouco mais',
  itens: [
    {
      id: 'monitoramento',
      titulo: 'Monitoramento 24 horas',
      texto: 'Operadores acompanham as câmeras do condomínio dia e noite, com alertas em tempo real e gravação em nuvem.',
      itens: ['Câmeras HD com visão noturna', 'Gravação em nuvem', 'Alertas em tempo real'],
      altFoto: 'Câmera de segurança instalada na fachada de um prédio',
    },
    {
      id: 'acesso',
      titulo: 'Controle de acesso facial',
      texto: 'Moradores entram por reconhecimento facial. Visitantes e prestadores são cadastrados e liberados a distância.',
      itens: ['Reconhecimento facial automático', 'Abertura remota de portões', 'Cadastro digital de visitantes', 'Histórico completo de acessos'],
      altFoto: 'Terminal de controle de acesso na entrada de um edifício',
    },
    {
      id: 'app',
      titulo: 'Aplicativo CM Portaria',
      texto: 'Pelo celular, o morador libera visitantes, recebe comunicados, faz reservas e registra ocorrências.',
      itens: ['Liberação de visitantes', 'Comunicados e avisos', 'Acesso a câmeras externas', 'Reservas e ocorrências'],
      altFoto: 'Pessoa usando o celular à noite',
    },
    {
      id: 'audio',
      titulo: 'Comunicação por áudio',
      texto: 'Interfone IP com áudio nos dois sentidos: o visitante fala direto com a central e recebe instruções claras.',
      itens: ['Áudio bidirecional HD', 'Atendimento personalizado', 'Instruções claras aos visitantes'],
      altFoto: 'Visitante usando o interfone na entrada do prédio',
    },
    {
      id: 'relatorios',
      titulo: 'Relatórios gerenciais',
      texto: 'Relatórios para síndicos e administradoras com estatísticas de acesso, ocorrências e análise de segurança.',
      itens: ['Estatísticas de acesso', 'Registro de ocorrências', 'Análise de segurança'],
      altFoto: 'Notebook exibindo gráficos',
    },
    {
      id: 'emergencias',
      titulo: 'Resposta a emergências',
      texto: 'Protocolos para cada tipo de ocorrência, com acionamento rápido das autoridades e dos contatos de segurança.',
      itens: ['Botão de pânico', 'Contato direto com a polícia', 'Procedimentos de evacuação'],
      altFoto: 'Viatura policial com as luzes acesas à noite',
    },
  ],
};

export const central = {
  titulo: 'Uma central\nque não dorme',
  manuscrito: '24 horas, 7 dias',
  texto:
    'Enquanto o condomínio dorme, nossa equipe acompanha cada entrada. Cada chamado é atendido por uma pessoa, e cada acesso fica registrado para o síndico consultar quando quiser.',
  nota: 'Ilustração do painel de monitoramento.',
  cameras: ['Portão social', 'Hall', 'Fachada', 'Perímetro'],
  eventos: [
    'Visitante liberado · Bloco B',
    'Entrega recebida · Portaria',
    'Morador reconhecido · Garagem',
    'Ronda de câmeras concluída',
    'Prestador autorizado pelo app · Bloco A',
    'Portão social fechado',
    'Visitante aguardando confirmação',
    'Acesso negado · cadastro inexistente',
    'Morador reconhecido · Portão social',
  ],
};

export interface Passo {
  titulo: string;
  texto: string;
}

export const comoFunciona: { titulo: string; manuscrito: string; passos: Passo[] } = {
  titulo: 'Como funciona',
  manuscrito: 'em cinco passos',
  passos: [
    { titulo: 'Chegada', texto: 'O visitante toca o interfone e é atendido pela central.' },
    { titulo: 'Identificação', texto: 'O operador vê e ouve o visitante pelas câmeras e pelo áudio.' },
    { titulo: 'Confirmação', texto: 'O morador autoriza pelo aplicativo ou por telefone.' },
    { titulo: 'Liberação', texto: 'O acesso é liberado a distância e fica registrado.' },
    { titulo: 'Monitoramento', texto: 'As áreas comuns seguem acompanhadas o tempo todo.' },
  ],
};

export const simulador = {
  titulo: 'Quanto custa a sua\nportaria hoje?',
  manuscrito: 'faça a conta',
  aviso:
    'Cálculo estimado baseado em médias do mercado. Valores incluem salários, encargos trabalhistas (FGTS, INSS, férias, 13º), benefícios e substituições. O valor final pode variar conforme especificidades do condomínio.',
  botao: 'Quero saber quanto economizo',
};

export interface PinoMapa {
  cidade: string;
  x: number;
  y: number;
  rotuloX: number;
  rotuloY: number;
  sede?: boolean;
}

export const cobertura: { titulo: string; manuscrito: string; nota: string; pinos: PinoMapa[] } = {
  titulo: 'Onde atendemos',
  manuscrito: 'Vale do Paraíba',
  nota: 'Outras cidades da região: consulte.',
  pinos: [
    { cidade: 'São José dos Campos', x: 197, y: 239, rotuloX: 214, rotuloY: 262, sede: true },
    { cidade: 'Jacareí', x: 111, y: 331, rotuloX: 124, rotuloY: 352 },
    { cidade: 'Caçapava', x: 392, y: 182, rotuloX: 364, rotuloY: 164 },
    { cidade: 'Taubaté', x: 556, y: 128, rotuloX: 528, rotuloY: 110 },
    { cidade: 'Pindamonhangaba', x: 658, y: 54, rotuloX: 560, rotuloY: 40 },
  ],
};

export interface Pergunta {
  pergunta: string;
  resposta: string;
}

export const duvidas: { titulo: string; manuscrito: string; perguntas: Pergunta[] } = {
  titulo: 'Dúvidas frequentes',
  manuscrito: 'sem rodeios',
  perguntas: [
    {
      pergunta: 'Como funciona a portaria virtual 24 horas?',
      resposta:
        'Nossa central em São José dos Campos atende os visitantes por câmeras e áudio, confirma com o morador e libera o acesso a distância. Os moradores usam o aplicativo CM Portaria, e todas as ocorrências geram registro.',
    },
    {
      pergunta: 'Os moradores têm aplicativo?',
      resposta: 'Sim. Pelo app CM Portaria o morador autoriza visitantes, recebe avisos, acessa câmeras externas, faz reservas e registra ocorrências.',
    },
    {
      pergunta: 'A portaria virtual atende emergências?',
      resposta: 'Sim. A central tem protocolos para cada tipo de ocorrência e aciona polícia, bombeiros e SAMU quando necessário.',
    },
    {
      pergunta: 'A CM tem equipe técnica na região?',
      resposta: 'Sim. Instalação, manutenção e suporte são feitos pela nossa própria equipe, baseada em São José dos Campos.',
    },
    {
      pergunta: 'Quanto custa?',
      resposta:
        'Depende do porte do condomínio e dos equipamentos necessários. Fazemos uma análise técnica sem compromisso e enviamos a proposta. No simulador acima você vê quanto a portaria atual custa hoje.',
    },
    {
      pergunta: 'Quais cidades vocês atendem?',
      resposta: 'São José dos Campos, Jacareí, Caçapava, Taubaté e Pindamonhangaba. Para outras cidades do Vale do Paraíba, consulte.',
    },
  ],
};

export const contatoSecao = {
  titulo: 'Fale com a CM',
  manuscrito: 'sem compromisso',
  botao: 'Enviar pedido',
};
