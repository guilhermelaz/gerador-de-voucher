import { NextResponse } from 'next/server';
import { createVoucher } from '@/app/services/voucherService';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { buffer, code } = await createVoucher(data);
    
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
