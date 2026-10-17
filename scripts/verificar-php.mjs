// Verifica a sintaxe dos arquivos PHP próprios (não há PHP instalado na máquina).
import { readFileSync } from 'node:fs';
import phpParser from 'php-parser';

const Engine = phpParser.Engine ?? phpParser.default ?? phpParser;
const ARQUIVOS = ['servidor/hostgator/api/orcamento.php', 'servidor/hostgator/config.exemplo.php'];
const analisador = new Engine({ parser: { php8: true, extractDoc: false, suppressErrors: false }, ast: { withPositions: false } });

let falhou = false;
for (const arquivo of ARQUIVOS) {
  try {
    analisador.parseCode(readFileSync(arquivo, 'utf8'), arquivo);
    console.log(`ok   ${arquivo}`);
  } catch (erro) {
    falhou = true;
    console.error(`ERRO ${arquivo}: ${erro.message}`);
  }
}
process.exit(falhou ? 1 : 0);
