// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const ALVOS = {
  ghpages: { site: 'https://viniciuscruz-dev.github.io', base: '/cm-portaria-virtual/' },
  hostgator: { site: 'https://www.cmportariavirtual.com.br', base: '/' },
};
const alvo = process.env.DEPLOY_TARGET === 'hostgator' ? 'hostgator' : 'ghpages';

export default defineConfig({
  site: ALVOS[alvo].site,
  base: ALVOS[alvo].base,
  trailingSlash: 'always',
  integrations: alvo === 'hostgator' ? [sitemap()] : [],
  env: {
    schema: {
      DEPLOY_TARGET: envField.enum({ context: 'client', access: 'public', values: ['ghpages', 'hostgator'], default: 'ghpages' }),
      GA_ID: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
  fonts: [
    { provider: fontProviders.google(), name: 'Cormorant Garamond', cssVariable: '--font-serif', weights: [300, 400, 500], styles: ['normal'], subsets: ['latin'], fallbacks: ['Georgia', 'serif'] },
    { provider: fontProviders.google(), name: 'Manrope', cssVariable: '--font-sans', weights: [300, 400, 500, 600], styles: ['normal'], subsets: ['latin'], fallbacks: ['system-ui', 'sans-serif'] },
    { provider: fontProviders.google(), name: 'Great Vibes', cssVariable: '--font-script', weights: [400], styles: ['normal'], subsets: ['latin'], fallbacks: ['cursive'] },
  ],
});
