/**
 * COVID-19 REALITY LAYER - Excess Mortality View
 * Side-by-side comparison of reported deaths and excess mortality
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Info, AlertTriangle } from 'lucide-react';
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';

// Demo data
const DEMO_DATA = [
  { period: '2020-W10', reportedCovid: 10, excess: 50, expected: 1800, observed: 1850 },
  { period: '2020-W11', reportedCovid: 25, excess: 120, expected: 1800, observed: 1920 },
  { period: '2020-W12', reportedCovid: 80, excess: 350, expected: 1800, observed: 2150 },
  { period: '2020-W13', reportedCovid: 180, excess: 580, expected: 1800, observed: 2380 },
  { period: '2020-W14', reportedCovid: 320, excess: 850, expected: 1800, observed: 2650 },
  { period: '2020-W15', reportedCovid: 380, excess: 920, expected: 1800, observed: 2720 },
  { period: '2020-W16', reportedCovid: 350, excess: 750, expected: 1800, observed: 2550 },
  { period: '2020-W17', reportedCovid: 280, excess: 520, expected: 1800, observed: 2320 },
  { period: '2020-W18', reportedCovid: 180, excess: 280, expected: 1800, observed: 2080 },
  { period: '2020-W19', reportedCovid: 120, excess: 150, expected: 1800, observed: 1950 },
];

export function CovidExcessMortalityView() {
  const [selectedCountry, setSelectedCountry] = useState('SE');

  return (
    <div className="space-y-6">
      {/* Warning */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Interpretation Caution</p>
              <p className="text-xs text-muted-foreground">
                Excess mortality includes all causes and cannot be fully attributed to any single factor 
                without additional analysis. The gap between reported COVID deaths and excess mortality 
                may reflect under-reporting, indirect effects, or other causes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label>Country</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SE">Sweden</SelectItem>
                  <SelectItem value="NO">Norway</SelectItem>
                  <SelectItem value="DK">Denmark</SelectItem>
                  <SelectItem value="FI">Finland</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Reported COVID Deaths vs Excess Mortality
            <Badge variant="outline" className="font-normal">{selectedCountry}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={DEMO_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    value.toLocaleString(),
                    name === 'reportedCovid' ? 'Reported COVID Deaths' :
                    name === 'excess' ? 'Excess Deaths (all causes)' : name
                  ]}
                />
                <Legend />
                <Bar 
                  dataKey="excess" 
                  name="Excess Deaths (all causes)"
                  fill="hsl(var(--muted))" 
                  opacity={0.6}
                />
                <Line 
                  type="monotone" 
                  dataKey="reportedCovid"
                  name="Reported COVID Deaths"
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <ReferenceLine y={0} stroke="hsl(var(--border))" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Methodology Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="w-4 h-4" />
            Methodology
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Expected Deaths Baseline</p>
              <p className="text-sm">Average weekly deaths 2015-2019, age-standardized</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Season Adjustment</p>
              <p className="text-sm">Yes (accounts for typical seasonal variation)</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">COVID Death Definition</p>
              <p className="text-sm">Death within 30 days of positive test</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Data Source</p>
              <p className="text-sm">National mortality registers, WHO</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs font-medium text-muted-foreground">What this comparison does NOT show</p>
            <ul className="mt-1 text-sm text-muted-foreground list-disc list-inside">
              <li>Causation (other factors may explain excess mortality)</li>
              <li>Direct vs indirect COVID effects</li>
              <li>Effects of healthcare system strain or delayed care</li>
              <li>Changes in cause-of-death coding practices</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
