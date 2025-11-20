import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { TextError } from '@/lib/textAnalysis';

interface ErrorListProps {
  errors: TextError[];
}

const ErrorList = ({ errors }: ErrorListProps) => {
  const errorTypeLabels: Record<string, string> = {
    ortografia: 'Ortografia',
    pontuacao: 'Pontuação',
    acentuacao: 'Acentuação',
    maiuscula: 'Maiúscula',
    espacamento: 'Espaçamento',
  };

  const errorTypeColors: Record<string, string> = {
    ortografia: 'text-rosa',
    pontuacao: 'text-amarelo',
    acentuacao: 'text-ceu',
    maiuscula: 'text-verde',
    espacamento: 'text-cobalto',
  };

  if (errors.length === 0) {
    return (
      <div className="flex items-center gap-3 p-6 bg-verde/10 border border-verde/20 rounded-lg">
        <CheckCircle2 className="w-6 h-6 text-verde flex-shrink-0" />
        <div>
          <p className="font-semibold text-verde">Parabéns! Texto perfeito!</p>
          <p className="text-sm text-foreground/70 mt-1">
            Nenhum erro detectado. Excelente domínio da língua portuguesa!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-rosa" />
        Erros Detectados ({errors.length})
      </h3>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {errors.map((error, index) => (
          <div
            key={index}
            className="p-4 bg-background border border-border rounded-lg hover:border-cobalto/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-sm font-semibold ${errorTypeColors[error.type]}`}>
                    {errorTypeLabels[error.type]}
                  </span>
                  <span className="text-xs text-foreground/50">
                    Posição {error.position}
                  </span>
                </div>
                
                <p className="text-sm text-foreground/70 mb-2">
                  {error.context}
                </p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-foreground/60">Erro: </span>
                    <span className="font-mono bg-rosa/10 text-rosa px-2 py-1 rounded">
                      {error.error}
                    </span>
                  </div>
                  <div>
                    <span className="text-foreground/60">Sugestão: </span>
                    <span className="font-mono bg-verde/10 text-verde px-2 py-1 rounded">
                      {error.suggestion}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorList;
