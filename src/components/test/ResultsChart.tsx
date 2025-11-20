import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultsChartProps {
  wpm: number;
  accuracy: number;
  errorsCount: number;
}

const ResultsChart = ({ wpm, accuracy, errorsCount }: ResultsChartProps) => {
  const data = [
    {
      name: 'Velocidade',
      value: Math.min(wpm, 100), // Normalizar para 0-100
      fullValue: wpm,
      color: 'hsl(var(--ceu))',
      unit: 'WPM',
    },
    {
      name: 'Precisão',
      value: accuracy,
      fullValue: accuracy,
      color: 'hsl(var(--verde))',
      unit: '%',
    },
    {
      name: 'Erros',
      value: Math.max(0, 100 - errorsCount * 2), // Inverter escala
      fullValue: errorsCount,
      color: 'hsl(var(--rosa))',
      unit: 'erros',
    },
  ];

  return (
    <div className="w-full h-[300px] bg-background border border-border rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--foreground) / 0.7)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--foreground) / 0.7)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold text-foreground">{data.name}</p>
                    <p className="text-sm text-foreground/70">
                      {data.fullValue} {data.unit}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultsChart;
