import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';

interface FormData {
  courtesyName: string;
  winnerName: string;
  companionName: string;
  cpf: string;
  email: string;
}

interface VoucherFormProps {
  onFormChange: (data: FormData) => void;
  onSubmit: (data: FormData) => void;
  isGenerating: boolean;
}

export function VoucherForm({ onFormChange, onSubmit, isGenerating }: VoucherFormProps) {
  const [formData, setFormData] = useState<FormData>({
    courtesyName: '',
    winnerName: '',
    companionName: '',
    cpf: '',
    email: '',
  });

  useEffect(() => {
    onFormChange(formData);
  }, [formData, onFormChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const formattedCPF = formatCPF(value);
    setFormData((prev) => ({
      ...prev,
      cpf: formattedCPF,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div className="space-y-2">
        <Label htmlFor="courtesyName">Nome da Cortesia</Label>
        <Input
          id="courtesyName"
          name="courtesyName"
          value={formData.courtesyName}
          onChange={handleInputChange}
          required
          disabled={isGenerating}
          placeholder="Ex: Jantar Romântico para Duas Pessoas"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="winnerName">Nome completo ganhador</Label>
        <Input
          id="winnerName"
          name="winnerName"
          value={formData.winnerName}
          onChange={handleInputChange}
          required
          disabled={isGenerating}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="companionName">Nome completo acompanhante</Label>
        <Input
          id="companionName"
          name="companionName"
          value={formData.companionName}
          onChange={handleInputChange}
          required
          disabled={isGenerating}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cpf">CPF ganhador</Label>
        <Input
          id="cpf"
          name="cpf"
          value={formData.cpf}
          onChange={handleCPFChange}
          maxLength={14}
          placeholder="000.000.000-00"
          required
          disabled={isGenerating}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={isGenerating}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isGenerating}
      >
        {isGenerating ? 'Gerando Voucher...' : 'Gerar Voucher'}
      </Button>
    </form>
  );
}
