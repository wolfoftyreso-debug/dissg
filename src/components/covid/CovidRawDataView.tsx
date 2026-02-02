/**
 * COVID-19 REALITY LAYER - Raw Data View
 * Shows raw data with method change markers
 */

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { CovidDataType } from '@/types/covid';

// Demo data for visualization
const DEMO_DATA = [
  { date: '2020-03', cases: 1500, deaths: 50, tests: 15000 },
  { date: '2020-04', cases: 8500, deaths: 350, tests: 45000 },
  { date: '2020-05', cases: 4200, deaths: 180, tests: 80000 },
  { date: '2020-06', cases: 1800, deaths: 60, tests: 120000 },
  { date: '2020-07', cases: 2100, deaths: 45, tests: 150000 },
  { date: '2020-08', cases: 3500, deaths: 55, tests: 180000 },
  { date: '2020-09', cases: 5800, deaths: 75, tests: 200000 },
  { date: '2020-10', cases: 12000, deaths: 150, tests: 220000 },
  { date: '2020-11', cases: 18000, deaths: 280, tests: 250000 },
  { date: '2020-12', cases: 22000, deaths: 380, tests: 280000 },
];

const METHOD_CHANGES = [
  { date: '2020-05', type: 'Test Strategy', severity: 'major' as const, description: 'Expanded testing to symptomatic individuals' },
  { date: '2020-09', type: 'Death Definition', severity: 'moderate' as const, description: 'Changed from 30-day to 28-day window' },
];

const DATA_TYPES: { value: CovidDataType; label: string }[] = [
  { value: 'confirmed_cases', label: 'Confirmed Cases' },
  { value: 'deaths', label: 'Deaths' },
  { value: 'hospitalizations', label: 'Hospitalizations' },
  { value: 'icu', label: 'ICU Admissions' },
  { value: 'tests', label: 'Tests Performed' },
  { value: 'positivity', label: 'Test Positivity' },
];

export function CovidRawDataView() {
  const [selectedCountry, setSelectedCountry] = useState('SE');
  const [selectedDataType, setSelectedDataType] = useState<CovidDataType>('confirmed_cases');
  const [showMethodChanges, setShowMethodChanges] = useState(true);
  const [showPolicyPeriods, setShowPolicyPeriods] = useState(false);

  const dataKey = useMemo(() => {
    switch (selectedDataType) {
      case 'confirmed_cases': return 'cases';
      case 'deaths': return 'deaths';
      case 'tests': return 'tests';
      default: return 'cases';
    }
  }, [selectedDataType]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4">
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

            <div className="space-y-2">
              <Label>Data Type</Label>
              <Select value={selectedDataType} onValueChange={(v) => setSelectedDataType(v as CovidDataType)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATA_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch 
                  id="method-changes" 
                  checked={showMethodChanges}
                  onCheckedChange={setShowMethodChanges}
                />
                <Label htmlFor="method-changes" className="text-sm">Show Method Changes</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  id="policy-periods" 
                  checked={showPolicyPeriods}
                  onCheckedChange={setShowPolicyPeriods}
                />
                <Label htmlFor="policy-periods" className="text-sm">Show Policy Periods</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Method Changes Warning */}
      {showMethodChanges && METHOD_CHANGES.length > 0 && (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Method changes in this period</p>
                <div className="space-y-1">
                  {METHOD_CHANGES.map((change, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className={
                        change.severity === 'major' ? 'border-orange-500 text-orange-500' :
                        change.severity === 'moderate' ? 'border-yellow-500 text-yellow-500' :
                        'border-blue-500 text-blue-500'
                      }>
                        {change.date}
                      </Badge>
                      <span>{change.type}: {change.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Raw Data: {DATA_TYPES.find(t => t.value === selectedDataType)?.label}
            <Badge variant="outline" className="font-normal">
              {selectedCountry}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DEMO_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip 
                  formatter={(value: number) => [value.toLocaleString(), DATA_TYPES.find(t => t.value === selectedDataType)?.label]}
                  labelFormatter={(label) => `Period: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey={dataKey}
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                {/* Method change markers */}
                {showMethodChanges && METHOD_CHANGES.map((change, i) => (
                  <ReferenceLine 
                    key={i}
                    x={change.date} 
                    stroke={change.severity === 'major' ? 'orange' : 'yellow'}
                    strokeDasharray="5 5"
                    label={{ 
                      value: '⚠️', 
                      position: 'top',
                      fontSize: 14 
                    }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Data Definition Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="w-4 h-4" />
            What this data shows
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Definition</p>
              <p className="text-sm">
                {selectedDataType === 'confirmed_cases' && 'Laboratory-confirmed cases of SARS-CoV-2 infection'}
                {selectedDataType === 'deaths' && 'Deaths within 30 days of positive test (varies by period)'}
                {selectedDataType === 'tests' && 'Number of PCR tests performed'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Reporter</p>
              <p className="text-sm">National Health Agency</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Reporting Lag</p>
              <p className="text-sm">1-3 days (varies by period)</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Known Limitations</p>
              <p className="text-sm">Testing capacity varied significantly during 2020</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs font-medium text-muted-foreground">What this data does NOT show</p>
            <ul className="mt-1 text-sm text-muted-foreground list-disc list-inside">
              <li>True infection prevalence (limited by testing capacity)</li>
              <li>Causation between interventions and outcomes</li>
              <li>Valid comparison with countries using different definitions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
