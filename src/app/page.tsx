'use client';

import { useState } from 'react';
import { VoucherForm } from './components/VoucherForm';
import { VoucherPreview } from './components/VoucherPreview';

interface FormData {
  winnerName: string;
  companionName: string;
  cpf: string;
  email: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    winnerName: '',
    companionName: '',
    cpf: '',
    email: '',
  });
  const [previewImage, setPreviewImage] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFormChange = (data: FormData) => {
    setFormData(data);
  };

  const handleSubmit = async (data: FormData) => {
    try {
      setIsGenerating(true);
      const response = await fetch('/api/generate-voucher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Download the image
        const link = document.createElement('a');
        link.href = result.image;
        link.download = `voucher-${data.cpf}-${data.winnerName.toLowerCase().replace(/\s+/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Update preview
        setPreviewImage(result.image);
      } else {
        console.error('Failed to generate voucher');
        alert('Erro ao gerar voucher. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Error generating voucher:', error);
      alert('Erro ao gerar voucher. Por favor, tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Gerador de Voucher</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <VoucherForm 
              onFormChange={handleFormChange}
              onSubmit={handleSubmit}
              isGenerating={isGenerating}
            />
          </div>
          
          <div className="hidden md:block">
            <VoucherPreview {...formData} previewImage={previewImage} />
          </div>
        </div>
      </div>
    </div>
  );
}
