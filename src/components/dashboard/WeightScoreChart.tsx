import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Weights {
  effect: number;
  cost: number;
  risk: number;
  reversibility: number;
}

interface ScoreInputs {
  effect: number;      // 0-100
  cost: number;        // 0-100
  risk: number;        // 0-100 (higher = more risk)
  reversibility: number; // 0-100
}

interface WeightScoreChartProps {
  weights: Weights;
  scores?: ScoreInputs;
}

const COLORS = {
  effect: 'hsl(var(--chart-1))',
  cost: 'hsl(var(--chart-2))',
  risk: 'hsl(var(--chart-3))',
  reversibility: 'hsl(var(--chart-4))',
};

const LABELS = {
  effect: 'Effekt',
  cost: 'Kostnad',
  risk: 'Risk',
  reversibility: 'Reversibilitet',
};

// Example scores if none provided
const DEFAULT_SCORES: ScoreInputs = {
  effect: 65,
  cost: 80,
  risk: 35,
  reversibility: 75,
};

export function WeightScoreChart({ 
  weights, 
  scores = DEFAULT_SCORES 
}: WeightScoreChartProps) {
  
  const calculatedData = useMemo(() => {
    // Calculate weighted contributions
    const effectContrib = scores.effect * (weights.effect / 100);
    const costContrib = scores.cost * (weights.cost / 100);
    const riskContrib = (100 - scores.risk) * (weights.risk / 100); // Inverted
    const reversContrib = scores.reversibility * (weights.reversibility / 100);
    
    const totalScore = effectContrib + costContrib + riskContrib + reversContrib;
    
    return {
      contributions: [
        { name: LABELS.effect, value: effectContrib, weight: weights.effect, score: scores.effect, fill: COLORS.effect },
        { name: LABELS.cost, value: costContrib, weight: weights.cost, score: scores.cost, fill: COLORS.cost },
        { name: LABELS.risk, value: riskContrib, weight: weights.risk, score: 100 - scores.risk, fill: COLORS.risk },
        { name: LABELS.reversibility, value: reversContrib, weight: weights.reversibility, score: scores.reversibility, fill: COLORS.reversibility },
      ],
      totalScore: Math.round(totalScore * 100) / 100,
      breakdown: [
        { dimension: 'Effekt', raw: scores.effect, weight: weights.effect, weighted: effectContrib },
        { dimension: 'Kostnad', raw: scores.cost, weight: weights.cost, weighted: costContrib },
        { dimension: 'Risk (inv)', raw: 100 - scores.risk, weight: weights.risk, weighted: riskContrib },
        { dimension: 'Reversibilitet', raw: scores.reversibility, weight: weights.reversibility, weighted: reversContrib },
      ],
    };
  }, [weights, scores]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-muted-foreground">
            Vikt: <span className="font-mono">{data.weight}%</span>
          </p>
          <p className="text-muted-foreground">
            Poäng: <span className="font-mono">{Math.round(data.score)}</span>
          </p>
          <p className="font-medium mt-1">
            Bidrag: <span className="font-mono">{data.value.toFixed(1)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Poängfördelning</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Total poäng:</span>
            <span className="text-2xl font-bold tabular-nums">
              {calculatedData.totalScore.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">/ 100</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pie" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="pie">Cirkeldiagram</TabsTrigger>
            <TabsTrigger value="bar">Stapeldiagram</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pie" className="mt-0">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={calculatedData.contributions}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={300}
                  >
                    {calculatedData.contributions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    formatter={(value, entry: any) => (
                      <span className="text-sm">
                        {value} ({entry.payload.value.toFixed(1)})
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="bar" className="mt-0">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={calculatedData.breakdown}
                  layout="vertical"
                  margin={{ left: 80, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 50]} />
                  <YAxis 
                    type="category" 
                    dataKey="dimension" 
                    tick={{ fontSize: 12 }}
                    width={75}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(1)} poäng`,
                      name === 'weighted' ? 'Viktat bidrag' : 'Råpoäng'
                    ]}
                  />
                  <Bar 
                    dataKey="weighted" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 4, 4, 0]}
                    animationDuration={300}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        {/* Score breakdown table */}
        <div className="mt-4 border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-2 font-medium">Dimension</th>
                <th className="text-right p-2 font-medium">Råpoäng</th>
                <th className="text-right p-2 font-medium">Vikt</th>
                <th className="text-right p-2 font-medium">Bidrag</th>
              </tr>
            </thead>
            <tbody>
              {calculatedData.breakdown.map((row, i) => (
                <tr key={row.dimension} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                  <td className="p-2">{row.dimension}</td>
                  <td className="text-right p-2 font-mono">{row.raw}</td>
                  <td className="text-right p-2 font-mono">{row.weight}%</td>
                  <td className="text-right p-2 font-mono font-medium">{row.weighted.toFixed(1)}</td>
                </tr>
              ))}
              <tr className="bg-muted font-medium">
                <td className="p-2">Totalt</td>
                <td className="text-right p-2">–</td>
                <td className="text-right p-2 font-mono">100%</td>
                <td className="text-right p-2 font-mono">{calculatedData.totalScore.toFixed(1)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default WeightScoreChart;
