import { NextResponse } from 'next/server';
import { createVoucher } from '@/app/services/voucherService';
import { SpreadsheetService } from '@/app/services/spreadsheetService';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { buffer, code } = await createVoucher(data);
    
    // Adicionar à planilha
    const spreadsheetService = new SpreadsheetService();
    await spreadsheetService.addVoucherRow({
      cortesia: data.courtesyName,
      ganhador: data.winnerName,
      acompanhante: data.companionName,
      cpf: data.cpf,
      email: data.email,
      codigo: code,
      status: 'Não Utilizado'
    });
    
    // Converter o buffer para base64
    const base64Image = buffer.toString('base64');
    
    return NextResponse.json({ 
      success: true, 
      image: `data:image/png;base64,${base64Image}`,
      code 
    });
  } catch (error) {
    console.error('Error generating voucher:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate voucher' },
      { status: 500 }
    );
  }
}
