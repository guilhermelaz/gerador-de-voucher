import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Configurações do arquivo de códigos
const CODES_FILE_PATH = path.join(process.cwd(), 'src/app/data/voucher-codes.json');

// Configurações de posicionamento do texto
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 500;

// Configurações do nome da cortesia
const COURTESY_NAME_CONFIG = {
  x: CANVAS_WIDTH / 2,
  y: 177,
  maxWidth: 500,
  fontSize: 14,
  color: '#000000'
};

// Configurações individuais para cada campo
const WINNER_NAME_CONFIG = {
  x: 610,
  y: 247,
  fontSize: 24,
  color: '#FFFFFF'
};

const COMPANION_NAME_CONFIG = {
  x: 660,
  y: 299,
  fontSize: 24,
  color: '#FFFFFF'
};

const CPF_CONFIG = {
  x: 500,
  y: 353,
  fontSize: 24,
  color: '#FFFFFF'
};

const EMAIL_CONFIG = {
  x: 420,
  y: 397,
  fontSize: 20,
  color: '#FFFFFF'
};

const VOUCHER_CODE_CONFIG = {
  x: 920,
  y: 410,
  fontSize: 20,
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
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  const usedCodes = getUsedCodes();

  do {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (usedCodes.includes(code));

  saveCode(code);
  return code;
}

// Funções para gerenciar códigos usados
function getUsedCodes(): string[] {
  try {
    if (!fs.existsSync(CODES_FILE_PATH)) {
      fs.writeFileSync(CODES_FILE_PATH, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(CODES_FILE_PATH, 'utf8');
    const codes = JSON.parse(data);
    return Array.isArray(codes) ? codes : [];
  } catch (error) {
    console.error('Error reading codes file:', error);
    return [];
  }
}

function saveCode(code: string): void {
  try {
    const codes = getUsedCodes();
    codes.push(code);
    fs.writeFileSync(CODES_FILE_PATH, JSON.stringify(codes, null, 2));
  } catch (error) {
    console.error('Error saving code:', error);
  }
}

// Função para gerar a imagem do voucher
export async function generateVoucherImage(data: VoucherData): Promise<Buffer> {
  const code = generateUniqueCode();
  const svgText = `
    <svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}">
      <style>
        .text { font-family: Intro bold; fill: white; }
        .black-text { font-family: Intro bold; fill: black; }
      </style>
      <text x="${COURTESY_NAME_CONFIG.x}" y="${COURTESY_NAME_CONFIG.y}" 
            class="black-text" text-anchor="middle" font-size="${COURTESY_NAME_CONFIG.fontSize}px">
        ${data.courtesyName.toUpperCase()}
      </text>
      <text x="${WINNER_NAME_CONFIG.x}" y="${WINNER_NAME_CONFIG.y}" 
            class="text" font-size="${WINNER_NAME_CONFIG.fontSize}px">
        ${data.winnerName}
      </text>
      <text x="${COMPANION_NAME_CONFIG.x}" y="${COMPANION_NAME_CONFIG.y}" 
            class="text" font-size="${COMPANION_NAME_CONFIG.fontSize}px">
        ${data.companionName}
      </text>
      <text x="${CPF_CONFIG.x}" y="${CPF_CONFIG.y}" 
            class="text" font-size="${CPF_CONFIG.fontSize}px">
        ${data.cpf}
      </text>
      <text x="${EMAIL_CONFIG.x}" y="${EMAIL_CONFIG.y}" 
            class="text" font-size="${EMAIL_CONFIG.fontSize}px">
        ${data.email}
      </text>
      <text x="${VOUCHER_CODE_CONFIG.x}" y="${VOUCHER_CODE_CONFIG.y}" 
            class="text" font-size="${VOUCHER_CODE_CONFIG.fontSize}px">
        ${code}
      </text>
    </svg>
  `;

  const imageBuffer = await sharp(path.join(process.cwd(), 'public/voucher-template.png'))
    .composite([{
      input: Buffer.from(svgText),
      top: 0,
      left: 0
    }])
    .toBuffer();

  return imageBuffer;
}

export async function createVoucher(data: VoucherData): Promise<{ buffer: Buffer; code: string }> {
  const code = generateUniqueCode();
  const buffer = await generateVoucherImage({ ...data });
  return { buffer, code };
}
