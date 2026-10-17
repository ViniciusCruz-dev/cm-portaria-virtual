// Baixa as fotos de banco (licenças Unsplash/Pexels: uso comercial gratuito) e gera os créditos.
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DESTINO = 'src/assets/fotos';

function pexels(id) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2000`;
}

const FOTOS = [
  { arquivo: 'abertura-torre.jpg', url: 'https://images.unsplash.com/photo-1755896409740-0f28922c0997?w=2400&q=80&fm=jpg&fit=crop', pagina: 'https://unsplash.com/photos/tall-apartment-building-with-glowing-windows-at-night-KhRTqpJUWtA', licenca: 'Unsplash License', uso: 'Abertura; câmera "Fachada"' },
  { arquivo: 'sobre-entrada.jpg', url: pexels(34973377), pagina: 'https://www.pexels.com/photo/modern-building-entrance-at-night-with-cleaner-34973377/', licenca: 'Pexels License', uso: 'Sobre; câmera "Portão social"' },
  { arquivo: 'servico-monitoramento.jpg', url: pexels(3205737), pagina: 'https://www.pexels.com/photo/white-surveillance-camera-3205737/', licenca: 'Pexels License', uso: 'Serviço: Monitoramento 24 horas' },
  { arquivo: 'servico-acesso.jpg', url: pexels(37538043), pagina: 'https://www.pexels.com/photo/modern-fingerprint-access-control-system-37538043/', licenca: 'Pexels License', uso: 'Serviço: Controle de acesso facial' },
  { arquivo: 'servico-app.jpg', url: pexels(6943441), pagina: 'https://www.pexels.com/photo/a-person-using-mobile-phone-6943441/', licenca: 'Pexels License', uso: 'Serviço: Aplicativo CM Portaria' },
  { arquivo: 'servico-audio.jpg', url: pexels(9461758), pagina: 'https://www.pexels.com/photo/man-in-black-long-sleeve-shirt-pressing-a-button-on-intercom-9461758/', licenca: 'Pexels License', uso: 'Serviço: Comunicação por áudio' },
  { arquivo: 'servico-relatorios.jpg', url: pexels(17279853), pagina: 'https://www.pexels.com/photo/graphics-on-the-laptop-screen-17279853/', licenca: 'Pexels License', uso: 'Serviço: Relatórios gerenciais' },
  { arquivo: 'servico-emergencias.jpg', url: pexels(14984574), pagina: 'https://www.pexels.com/photo/police-car-driving-on-night-road-14984574/', licenca: 'Pexels License', uso: 'Serviço: Resposta a emergências' },
  { arquivo: 'central-hall.jpg', url: pexels(31737862), pagina: 'https://www.pexels.com/photo/modern-house-entrance-at-night-illuminated-31737862/', licenca: 'Pexels License', uso: 'Câmera "Hall"' },
  { arquivo: 'central-perimetro.jpg', url: pexels(18362805), pagina: 'https://www.pexels.com/photo/modern-apartment-building-18362805/', licenca: 'Pexels License', uso: 'Câmera "Perímetro"' },
];

await mkdir(DESTINO, { recursive: true });
for (const foto of FOTOS) {
  const resposta = await fetch(foto.url);
  if (!resposta.ok) throw new Error(`Falha ao baixar ${foto.arquivo}: HTTP ${resposta.status}`);
  await writeFile(join(DESTINO, foto.arquivo), Buffer.from(await resposta.arrayBuffer()));
  console.log(`ok  ${foto.arquivo}`);
}

const linhas = [
  '# Créditos das imagens',
  '',
  'Fotos de banco usadas provisoriamente até a chegada das fotos reais da CM.',
  'As licenças Unsplash e Pexels permitem uso comercial gratuito, sem atribuição obrigatória.',
  '',
  '| Arquivo | Uso no site | Origem | Licença |',
  '|---|---|---|---|',
  ...FOTOS.map((f) => `| \`${f.arquivo}\` | ${f.uso} | ${f.pagina} | ${f.licenca} |`),
  '',
];
await writeFile('docs/creditos-imagens.md', linhas.join('\n'));
console.log('Créditos gravados em docs/creditos-imagens.md');
