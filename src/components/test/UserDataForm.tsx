import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, IdCard } from 'lucide-react';

const userDataSchema = z.object({
  nome: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  email: z.string().trim().email('Email inválido').max(255, 'Email muito longo'),
  matricula: z.string()
    .trim()
    .regex(/^\d{4,10}$/, 'Matrícula deve conter apenas números (4-10 dígitos)')
    .min(4, 'Matrícula deve ter no mínimo 4 dígitos')
    .max(10, 'Matrícula deve ter no máximo 10 dígitos'),
});

type UserData = z.infer<typeof userDataSchema>;

interface UserDataFormProps {
  onSubmit: (data: UserData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const UserDataForm = ({ onSubmit, onCancel, isSubmitting }: UserDataFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>({
    resolver: zodResolver(userDataSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="nome" className="text-foreground flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-cobalto" />
            Nome Completo
          </Label>
          <Input
            id="nome"
            {...register('nome')}
            placeholder="Seu nome completo"
            className="w-full"
            disabled={isSubmitting}
          />
          {errors.nome && (
            <p className="text-sm text-rosa mt-1">{errors.nome.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="text-foreground flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-cobalto" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="seu.email@exemplo.com"
            className="w-full"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-rosa mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="matricula" className="text-foreground flex items-center gap-2 mb-2">
            <IdCard className="w-4 h-4 text-cobalto" />
            Matrícula
          </Label>
          <Input
            id="matricula"
            {...register('matricula')}
            placeholder="Ex: 123456"
            className="w-full"
            disabled={isSubmitting}
            maxLength={10}
          />
          {errors.matricula && (
            <p className="text-sm text-rosa mt-1">{errors.matricula.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-cobalto hover:bg-noite text-white"
        >
          {isSubmitting ? 'Continuando...' : 'Continuar'}
        </Button>
      </div>
    </form>
  );
};

export default UserDataForm;
