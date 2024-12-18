import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage, registerFont } from 'canvas';

// Configurações do arquivo de códigos
const CODES_FILE_PATH = path.join(process.cwd(), 'src/app/data/voucher-codes.json');

// Configurações de fonte
const FONT_PATH = path.join(process.cwd(), 'public/fonts/Intro.ttf');
registerFont(FONT_PATH, { family: 'Intro' });

// Configurações de posicionamento do texto
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 500;

// Configurações do nome da cortesia
const COURTESY_NAME_CONFIG = {
  x: CANVAS_WIDTH / 2,
  y: 177,
  maxWidth: 500,
  lineHeight: 20,
  fontSize: 14,
  fontFamily: 'Intro',
  color: '#000000'
};

// Configurações individuais para cada campo
const WINNER_NAME_CONFIG = {
  x: 610,
  y: 247,
  fontSize: 24,
  fontFamily: 'Intro',
  color: '#FFFFFF'
};

const COMPANION_NAME_CONFIG = {
  x: 660,
  y: 299,
  fontSize: 24,
  fontFamily: 'Intro',
  color: '#FFFFFF'
};

const CPF_CONFIG = {
  x: 500,
  y: 353,
  fontSize: 24,
  fontFamily: 'Intro',
  color: '#FFFFFF'
};

const EMAIL_CONFIG = {
  x: 415,
  y: 398,
  fontSize: 24,
  fontFamily: 'Intro',
  color: '#FFFFFF'
};

// Configurações do código do voucher
const VOUCHER_CODE_CONFIG = {
  x: 960,
  y: 410,
  fontSize: 20,
  fontFamily: 'Intro',
  color: '#FFFFFF'
};

interface VoucherData {
  courtesyName: string;
  winnerName: string;
  companionName: string;
  cpf: string;
  email: string;
}

// Função para gerar código aleatório
function generateUniqueCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code: string;
  const usedCodes = getUsedCodes();

  do {
    code = Array.from({ length: 4 }, () => 
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
  } while (usedCodes.includes(code));

  saveCode(code);
  return code;
}

// Funções para gerenciar códigos usados
function getUsedCodes(): string[] {
  try {
    const data = fs.readFileSync(CODES_FILE_PATH, 'utf-8');
    return JSON.parse(data).usedCodes;
  } catch (error) {
    return [];
  }
}

function saveCode(code: string): void {
  try {
    const data = getUsedCodes();
    data.push(code);
    fs.writeFileSync(CODES_FILE_PATH, JSON.stringify({ usedCodes: data }, null, 2));
  } catch (error) {
    console.error('Erro ao salvar código:', error);
  }
}

function wrapText(context: any, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  const maxWordsPerLine = 3; // Máximo de palavras por linha
  let lines = [];
  
  // Divide as palavras em grupos de maxWordsPerLine
  for (let i = 0; i < words.length; i += maxWordsPerLine) {
    const lineWords = words.slice(i, i + maxWordsPerLine);
    lines.push(lineWords.join(' '));
  }

  // Ajusta a posição Y inicial baseado no número de linhas
  const totalHeight = lines.length * lineHeight;
  const startY = y - (totalHeight / 2) + (lineHeight / 2);

  // Centraliza e desenha cada linha
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    context.fillText(line, x, startY + (i * lineHeight));
  }

  return lines.length;
}

// Função para gerar a imagem do voucher
export async function generateVoucherImage(data: VoucherData): Promise<Buffer> {
  // Criar canvas com as dimensões da imagem
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const ctx = canvas.getContext('2d');

  // Carregar a imagem de fundo
  const backgroundImage = await loadImage(path.join(process.cwd(), 'public/voucher-template.png'));
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  // Configurar e escrever o nome da cortesia
  ctx.fillStyle = COURTESY_NAME_CONFIG.color;
  ctx.font = `bold ${COURTESY_NAME_CONFIG.fontSize}px ${COURTESY_NAME_CONFIG.fontFamily}`;
  ctx.textAlign = 'center';
  wrapText(
    ctx, 
    data.courtesyName.toUpperCase(), 
    COURTESY_NAME_CONFIG.x, 
    COURTESY_NAME_CONFIG.y, 
    COURTESY_NAME_CONFIG.maxWidth, 
    COURTESY_NAME_CONFIG.lineHeight
  );

  // Configurar texto para dados do ganhador
  ctx.textAlign = 'left';

  // Nome do ganhador
  ctx.fillStyle = WINNER_NAME_CONFIG.color;
  ctx.font = `${WINNER_NAME_CONFIG.fontSize}px ${WINNER_NAME_CONFIG.fontFamily}`;
  ctx.fillText(data.winnerName, WINNER_NAME_CONFIG.x, WINNER_NAME_CONFIG.y);

  // Nome do acompanhante
  ctx.fillStyle = COMPANION_NAME_CONFIG.color;
  ctx.font = `${COMPANION_NAME_CONFIG.fontSize}px ${COMPANION_NAME_CONFIG.fontFamily}`;
  ctx.fillText(data.companionName, COMPANION_NAME_CONFIG.x, COMPANION_NAME_CONFIG.y);

  // CPF
  ctx.fillStyle = CPF_CONFIG.color;
  ctx.font = `${CPF_CONFIG.fontSize}px ${CPF_CONFIG.fontFamily}`;
  ctx.fillText(data.cpf, CPF_CONFIG.x, CPF_CONFIG.y);

  // Email
  ctx.fillStyle = EMAIL_CONFIG.color;
  ctx.font = `${EMAIL_CONFIG.fontSize}px ${EMAIL_CONFIG.fontFamily}`;
  ctx.fillText(data.email, EMAIL_CONFIG.x, EMAIL_CONFIG.y);

  // Configurar e escrever o código do voucher
  const code = generateUniqueCode();
  ctx.fillStyle = VOUCHER_CODE_CONFIG.color;
  ctx.font = `${VOUCHER_CODE_CONFIG.fontSize}px ${VOUCHER_CODE_CONFIG.fontFamily}`;
  ctx.fillText(code, VOUCHER_CODE_CONFIG.x, VOUCHER_CODE_CONFIG.y);

  // Retornar o buffer da imagem
  return canvas.toBuffer('image/png');
}

export async function createVoucher(data: VoucherData): Promise<{ buffer: Buffer; code: string }> {
  const code = generateUniqueCode();
  const imageBuffer = await generateVoucherImage({ ...data });
  return { buffer: imageBuffer, code };
}
