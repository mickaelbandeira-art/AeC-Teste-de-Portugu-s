import { Gauge, Target, FileText } from 'lucide-react';

interface TestStatsProps {
  wpm: number;
  accuracy: number;
  wordsTyped: number;
}

const TestStats = ({ wpm, accuracy, wordsTyped }: TestStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-ceu/10 to-cobalto/10 p-4 rounded-lg border border-ceu/20">
        <div className="flex items-center gap-2 mb-2">
          <Gauge className="w-5 h-5 text-ceu" />
          <span className="text-sm font-medium text-foreground/70">Velocidade</span>
        </div>
        <div className="text-3xl font-bold text-ceu">{wpm}</div>
        <div className="text-xs text-foreground/60 mt-1">palavras/min</div>
      </div>

      <div className="bg-gradient-to-br from-verde/10 to-verde/20 p-4 rounded-lg border border-verde/20">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-verde" />
          <span className="text-sm font-medium text-foreground/70">Precisão</span>
        </div>
        <div className="text-3xl font-bold text-verde">{accuracy}%</div>
        <div className="text-xs text-foreground/60 mt-1">acertos</div>
      </div>

      <div className="bg-gradient-to-br from-amarelo/10 to-amarelo/20 p-4 rounded-lg border border-amarelo/20">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-amarelo" />
          <span className="text-sm font-medium text-foreground/70">Palavras</span>
        </div>
        <div className="text-3xl font-bold text-amarelo">{wordsTyped}</div>
        <div className="text-xs text-foreground/60 mt-1">digitadas</div>
      </div>
    </div>
  );
};

export default TestStats;
