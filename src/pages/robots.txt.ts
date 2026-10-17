import type { APIRoute } from 'astro';
import { DEPLOY_TARGET } from 'astro:env/client';

export const GET: APIRoute = ({ site }) => {
  const corpo =
    DEPLOY_TARGET === 'hostgator'
      ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`
      : 'User-agent: *\nDisallow: /\n';
  return new Response(corpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
