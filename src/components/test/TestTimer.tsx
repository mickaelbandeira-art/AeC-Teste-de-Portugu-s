import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TestTimerProps {
  isRunning: boolean;
  startTime: number | null;
  onTimeUpdate?: (seconds: number) => void;
  maxTime?: number; // em segundos
  onTimeEnd?: () => void;
}

const TestTimer = ({ isRunning, startTime, onTimeUpdate, maxTime, onTimeEnd }: TestTimerProps) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isRunning || !startTime) {
      return;
    }

    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      setElapsed(seconds);
      onTimeUpdate?.(seconds);
      
      // Verifica se o tempo máximo foi atingido
      if (maxTime && seconds >= maxTime) {
        onTimeEnd?.();
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, startTime, onTimeUpdate, maxTime, onTimeEnd]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isNearEnd = maxTime && elapsed >= maxTime - 30;
  
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
      isNearEnd ? 'bg-rosa/10 border-rosa/20' : 'bg-cobalto/10 border-cobalto/20'
    }`}>
      <Clock className={`w-5 h-5 ${isNearEnd ? 'text-rosa' : 'text-cobalto'}`} />
      <span className={`text-2xl font-mono font-bold ${isNearEnd ? 'text-rosa' : 'text-cobalto'}`}>
        {formatTime(elapsed)}
        {maxTime && ` / ${formatTime(maxTime)}`}
      </span>
    </div>
  );
};

export default TestTimer;
