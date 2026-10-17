// Copia os arquivos da HostGator para dist/ (só usado em `npm run build:producao`).
import { cp } from 'node:fs/promises';

await cp('servidor/hostgator/api', 'dist/api', { recursive: true });
await cp('servidor/hostgator/.htaccess', 'dist/.htaccess');
console.log('Arquivos da HostGator copiados para dist/.');
