// Gera favicons (a partir do logo) e a imagem de compartilhamento 1200x630 (abertura + título).
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { chromium } from '@playwright/test';

const LOGO = 'src/assets/logo-cm.png';
const FOTO = 'src/assets/fotos/abertura-torre.jpg';

function criarIco(imagens) {
  const cabecalho = Buffer.alloc(6);
  cabecalho.writeUInt16LE(0, 0);
  cabecalho.writeUInt16LE(1, 2);
  cabecalho.writeUInt16LE(imagens.length, 4);
  let deslocamento = 6 + 16 * imagens.length;
  const entradas = imagens.map(({ tamanho, png }) => {
    const entrada = Buffer.alloc(16);
    entrada.writeUInt8(tamanho, 0);
    entrada.writeUInt8(tamanho, 1);
    entrada.writeUInt8(0, 2);
    entrada.writeUInt8(0, 3);
    entrada.writeUInt16LE(1, 4);
    entrada.writeUInt16LE(32, 6);
    entrada.writeUInt32LE(png.length, 8);
    entrada.writeUInt32LE(deslocamento, 12);
    deslocamento += png.length;
    return entrada;
  });
  return Buffer.concat([cabecalho, ...entradas, ...imagens.map((imagem) => imagem.png)]);
}

await sharp(LOGO).resize(32, 32).png().toFile('public/favicon-32.png');
const png16 = await sharp(LOGO).resize(16, 16).png().toBuffer();
const png32 = await sharp(LOGO).resize(32, 32).png().toBuffer();
await writeFile('public/favicon.ico', criarIco([{ tamanho: 16, png: png16 }, { tamanho: 32, png: png32 }]));
const logo140 = await sharp(LOGO).resize(140, 140).png().toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#0b2426' } })
  .composite([{ input: logo140, gravity: 'center' }])
  .png()
  .toFile('public/apple-touch-icon.png');

const foto = (await sharp(FOTO).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82 }).toBuffer()).toString('base64');
const logo = (await readFile(LOGO)).toString('base64');
const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400&family=Great+Vibes&family=Manrope:wght@500&display=block" rel="stylesheet">
<style>
  body{margin:0;width:1200px;height:630px;position:relative;overflow:hidden;background:#0b2426;color:#ece8dd}
  .foto{position:absolute;inset:0;background:url(data:image/jpeg;base64,${foto}) center/cover}
  .veu{position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,36,38,.92) 0%,rgba(11,36,38,.55) 45%,rgba(11,36,38,.92) 100%)}
  .conteudo{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
  img{width:96px;height:96px;margin-bottom:22px}
  h1{margin:0;font:400 72px/1.02 'Cormorant Garamond',serif;letter-spacing:.06em;text-transform:uppercase}
  p{margin:8px 0 0;font:58px/1 'Great Vibes',cursive;color:#b7d06f;transform:rotate(-3deg)}
  small{position:absolute;left:0;right:0;bottom:34px;text-align:center;font:500 16px 'Manrope',sans-serif;letter-spacing:.2em;text-transform:uppercase;opacity:.85}
</style></head><body>
<div class="foto"></div><div class="veu"></div>
<div class="conteudo"><img src="data:image/png;base64,${logo}" alt=""><h1>Portaria virtual<br>para condomínios</h1><p>em São José dos Campos</p></div>
<small>CM Portaria Virtual · Central 24h · 0800 672 7280</small>
</body></html>`;

const navegador = await chromium.launch({ channel: 'chrome' });
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
await pagina.setContent(html, { waitUntil: 'networkidle' });
await pagina.evaluate(() => document.fonts.ready);
await pagina.screenshot({ path: 'public/og-image.jpg', type: 'jpeg', quality: 86 });
await navegador.close();
console.log('Favicons e imagem de compartilhamento gravados em public/.');
