interface VoucherPreviewProps {
  courtesyName: string;
  winnerName: string;
  companionName: string;
  cpf: string;
  email: string;
  previewImage?: string;
}

export function VoucherPreview({ 
  courtesyName,
  winnerName, 
  companionName, 
  cpf, 
  email,
  previewImage 
}: VoucherPreviewProps) {
  if (previewImage) {
    return (
      <div className="border rounded-lg overflow-hidden shadow-lg">
        <img 
          src={previewImage} 
          alt="Voucher Preview" 
          className="w-full h-auto"
        />
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-8 bg-white shadow-lg w-full max-w-md">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Preview do Voucher</h2>
        
        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-semibold">Cortesia:</span>
            <br />
            {courtesyName || 'Nome da cortesia'}
          </p>

          <p className="text-gray-600">
            <span className="font-semibold">Ganhador:</span>
            <br />
            {winnerName || 'Nome do ganhador'}
          </p>
          
          <p className="text-gray-600">
            <span className="font-semibold">Acompanhante:</span>
            <br />
            {companionName || 'Nome do acompanhante'}
          </p>
          
          <p className="text-gray-600">
            <span className="font-semibold">CPF:</span>
            <br />
            {cpf || '000.000.000-00'}
          </p>
          
          <p className="text-gray-600">
            <span className="font-semibold">Email:</span>
            <br />
            {email || 'email@exemplo.com'}
          </p>
        </div>
        
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            Este voucher é pessoal e intransferível
          </p>
        </div>
      </div>
    </div>
  );
}
