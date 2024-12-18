import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

interface VoucherSpreadsheetData {
  cortesia: string;
  ganhador: string;
  acompanhante: string;
  cpf: string;
  email: string;
  codigo: string;
  status: 'Utilizado' | 'Não Utilizado';
}

export class SpreadsheetService {
  private doc: GoogleSpreadsheet;

  constructor() {
    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, auth);
  }

  async initialize() {
    await this.doc.loadInfo();
  }

  async addVoucherRow(data: VoucherSpreadsheetData) {
    try {
      await this.initialize();
      
      const sheet = this.doc.sheetsByIndex[0]; // Usa a primeira planilha
      await sheet.addRow({
        'Cortesia': data.cortesia,
        'Ganhador': data.ganhador,
        'Acompanhante': data.acompanhante,
        'CPF': data.cpf,
        'Email': data.email,
        'Código': data.codigo,
        'Status': data.status
      });

      return true;
    } catch (error) {
      console.error('Erro ao adicionar linha na planilha:', error);
      throw error;
    }
  }

  async updateVoucherStatus(codigo: string, novoStatus: 'Utilizado' | 'Não Utilizado') {
    try {
      await this.initialize();
      
      const sheet = this.doc.sheetsByIndex[0];
      const rows = await sheet.getRows();
      
      const voucherRow = rows.find(row => row.get('Código') === codigo);
      if (voucherRow) {
        voucherRow.set('Status', novoStatus);
        await voucherRow.save();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao atualizar status do voucher:', error);
      throw error;
    }
  }
}
