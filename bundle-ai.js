import fs from 'fs';
import path from 'path';

// Pasta onde o relatório final será salvo
const OUTPUT_DIR = './.ai-context'; 
const FILE_PREFIX = 'contexto-rpg-vtt-';
const DIRECTORY_TO_SCAN = './'; 

const agora = new Date();
const dataFormated = agora.toISOString().split('T')[0]; 
const horaFormated = String(agora.getHours()).padStart(2, '0') + '-' + String(agora.getMinutes()).padStart(2, '0'); 
const TIMESTAMP = `${dataFormated}_${horaFormated}`;
const OUTPUT_FILE = path.join(OUTPUT_DIR, `${FILE_PREFIX}${TIMESTAMP}.md`);

// Arquivos e pastas que NÃO devem entrar no pacote para não pesar a IA
const IGNORE_LIST = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.DS_Store',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'bundle-ai.js',
  '.ai-context'
];

const BINARY_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.svg',
  '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.mov', '.zip'
];

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function limparContextosAntigos() {
  const arquivos = fs.readdirSync(OUTPUT_DIR);
  arquivos.forEach(arquivo => {
    if (arquivo.startsWith(FILE_PREFIX) && arquivo.endsWith('.md')) {
      try {
        fs.unlinkSync(path.join(OUTPUT_DIR, arquivo));
      } catch (err) {
        console.warn(`⚠️ Não foi possível deletar o arquivo antigo: ${arquivo}`);
      }
    }
  });
}

const buildHeader = () => {
  return `# CONTEXTO DO PROJETO - MEU RPG VTT / FICHA DIGITAL
> 🗓️ **Última Atualização:** ${agora.toLocaleDateString('pt-BR')} às ${agora.toLocaleTimeString('pt-BR')}

Olá! Este arquivo contém a estrutura de arquivos e o código-fonte atualizado do projeto **Meu RPG VTT** (incluindo componentes, rascunhos em TSX/HTML e configurações).

---

## 📁 ESTRUTURA DE ARQUIVOS
`;
};

function generateTree(dir, prefix = '') {
  let tree = '';
  const files = fs.readdirSync(dir);

  files.forEach((file, index) => {
    const relativePath = path.relative('./', path.join(dir, file)).replace(/\\/g, '/');
    if (IGNORE_LIST.includes(file) || IGNORE_LIST.includes(relativePath)) return;

    const filePath = path.join(dir, file);
    const isDirectory = fs.statSync(filePath).isDirectory();
    const isLast = index === files.length - 1;

    tree += `${prefix}${isLast ? '└── ' : '├── '}${file}\n`;

    if (isDirectory) {
      tree += generateTree(filePath, prefix + (isLast ? '    ' : '│   '));
    }
  });

  return tree;
}

function concatFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const relativePath = path.relative('./', path.join(dir, file)).replace(/\\/g, '/');
    if (IGNORE_LIST.includes(file) || IGNORE_LIST.includes(relativePath)) return;

    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      concatFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (!BINARY_EXTENSIONS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

function buildContext() {
  console.log('🧹 Limpando histórico em .ai-context...');
  limparContextosAntigos();

  console.log('🔄 Empacotando arquivos do RPG VTT...');
  
  try {
    let outputContent = buildHeader();

    outputContent += '```text\n';
    outputContent += generateTree(DIRECTORY_TO_SCAN);
    outputContent += '```\n\n---\n\n## 📝 CÓDIGO-FONTE DOS ARQUIVOS\n\n';

    const allFiles = concatFiles(DIRECTORY_TO_SCAN);

    allFiles.forEach(filePath => {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(DIRECTORY_TO_SCAN, filePath);
      const fileExtension = path.extname(filePath).replace('.', '') || 'text';

      outputContent += `### 📄 Arquivo: \`${relativePath}\`\n`;
      outputContent += `\`\`\`${fileExtension}\n`;
      outputContent += fileContent;
      outputContent += '\n\`\`\`\n\n';
    });

    fs.writeFileSync(OUTPUT_FILE, outputContent, 'utf8');
    console.log(`\n✅ Sucesso! Contexto gerado em: "${OUTPUT_FILE}"`);
    console.log('💡 Abra a pasta .ai-context e copie o arquivo .md gerado para enviar para a IA!');

  } catch (error) {
    console.error('❌ Erro ao rodar o empacotador:', error);
  }
}

buildContext();