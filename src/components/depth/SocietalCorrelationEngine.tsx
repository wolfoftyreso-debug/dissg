/**
 * DEMOGRAPHY & SOCIETAL CORRELATION ENGINE (DSCE)
 * 
 * "Visa hur demografiska förändringar samvarierar med samhällsutfall 
 *  – korrekt och begripligt."
 * 
 * Detta är en av de mest känsliga modulerna → därför måste den vara den mest rigorösa.
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  Info, 
  TrendingUp, 
  Globe, 
  Shield,
  ChevronRight,
  XCircle,
  Eye,
  Scale,
  Users,
  Building
} from 'lucide-react';
import {
  DEMOGRAPHIC_INDICATORS,
  SOCIETAL_OUTCOMES,
  TIME_PERIODS,
  GEO_LEVELS,
  CORRELATION_DISCLAIMER,
  WHAT_THIS_DOES_NOT_SHOW,
  CONTROL_VARIABLES,
  CONTROL_VARIABLES_HEADER,
  MULTIPLE_FACTORS_NOTE,
  CROSS_COUNTRY_PROMPT,
  VIABILITY_CONNECTION,
  TRANSPARENCY_PRINCIPLES,
  TRANSPARENCY_OUTCOME,
  getCorrelationText,
  type TimePeriod,
  type GeoLevel
} from '@/config/demographyCorrelationConfig';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Seeded random for reproducible indicator-specific data
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Hash string to number for seeding
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Generate unique data based on indicator selections
const generateMockData = (
  startYear: number, 
  endYear: number, 
  demographicId: string, 
  societalId: string
) => {
  const data = [];
  const seed1 = hashString(demographicId);
  const seed2 = hashString(societalId);
  
  // Different base values and trends per indicator
  let demographic = 30 + seededRandom(seed1) * 40;
  let societal = 20 + seededRandom(seed2) * 50;
  
  // Trend factors unique to each indicator
  const demographicTrend = (seededRandom(seed1 + 1) - 0.5) * 0.3;
  const societalTrend = (seededRandom(seed2 + 1) - 0.5) * 0.25;
  
  for (let year = startYear; year <= endYear; year++) {
    const yearSeed = year * 1000;
    
    // Add historical events/noise
    const historicalNoise = year < 1900 ? 0.5 : year < 1950 ? 0.3 : 0.1;
    
    demographic += demographicTrend + (seededRandom(seed1 + yearSeed) - 0.5) * (5 + historicalNoise * 10);
    societal += societalTrend + (seededRandom(seed2 + yearSeed) - 0.5) * (4 + historicalNoise * 8);
    
    // Mark pre-1850 as estimates
    const isEstimate = year < 1850;
    
    data.push({
      year,
      demographic: Math.max(0, Math.min(100, demographic)),
      societal: Math.max(0, Math.min(100, societal)),
      isEstimate
    });
  }
  return data;
};

// Calculate start year based on time period selection
const getStartYear = (timePeriod: TimePeriod): number => {
  switch (timePeriod) {
    case '5y': return 2019;
    case '10y': return 2014;
    case '20y': return 2004;
    case 'max': return 1800; // Much longer historical view
    default: return 1800;
  }
};

export const SocietalCorrelationEngine: React.FC = () => {
  const [demographicIndicator, setDemographicIndicator] = useState(DEMOGRAPHIC_INDICATORS[0].id);
  const [societalOutcome, setSocietalOutcome] = useState(SOCIETAL_OUTCOMES[0].id);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('max');
  const [geoLevel, setGeoLevel] = useState<GeoLevel>('national');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showCrossCountry, setShowCrossCountry] = useState(false);

  const selectedDemographic = DEMOGRAPHIC_INDICATORS.find(i => i.id === demographicIndicator);
  const selectedSocietal = SOCIETAL_OUTCOMES.find(o => o.id === societalOutcome);
  const selectedTimePeriod = TIME_PERIODS.find(t => t.id === timePeriod);
  const selectedGeoLevel = GEO_LEVELS.find(g => g.id === geoLevel);

  const startYear = getStartYear(timePeriod);
  const endYear = 2024;
  const mockData = useMemo(
    () => generateMockData(startYear, endYear, demographicIndicator, societalOutcome), 
    [startYear, demographicIndicator, societalOutcome]
  );
  
  // Mock correlation coefficient
  const mockCorrelation = 0.52;

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold">Demographic Correlation Analysis</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Statistical covariation analysis between demographic indicators and societal outcomes over extended time periods
        </p>
      </div>

      {/* Mandatory Disclaimer - Always Visible */}
      <Alert className="border-primary/50 bg-primary/5">
        <Info className="h-4 w-4" />
        <AlertDescription className="whitespace-pre-line">
          {CORRELATION_DISCLAIMER.sv}
        </AlertDescription>
      </Alert>

      {/* Selection Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Indicator Selection</CardTitle>
          <CardDescription>Configure analysis parameters in 3-4 steps</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Demographic Indicator */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Demographic Indicator
              </label>
              <Select value={demographicIndicator} onValueChange={setDemographicIndicator}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEMOGRAPHIC_INDICATORS.map(ind => (
                    <SelectItem key={ind.id} value={ind.id}>
                      {ind.nameSv}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDemographic && (
                <p className="text-xs text-muted-foreground">{selectedDemographic.description}</p>
              )}
            </div>

            {/* Societal Outcome */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Building className="h-4 w-4" />
                Societal Outcome Metric
              </label>
              <Select value={societalOutcome} onValueChange={setSocietalOutcome}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOCIETAL_OUTCOMES.map(out => (
                    <SelectItem key={out.id} value={out.id}>
                      {out.nameSv}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSocietal && (
                <p className="text-xs text-muted-foreground">{selectedSocietal.description}</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            {/* Time Period */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Analysis Period</label>
              <Select value={timePeriod} onValueChange={(v) => setTimePeriod(v as TimePeriod)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_PERIODS.map(tp => (
                    <SelectItem key={tp.id} value={tp.id}>
                      {tp.labelSv}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTimePeriod?.warning && (
                <div className="flex items-start gap-2 text-xs text-warning">
                  <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  {selectedTimePeriod.warning}
                </div>
              )}
            </div>

            {/* Geographic Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Geographic Granularity</label>
              <Select value={geoLevel} onValueChange={(v) => setGeoLevel(v as GeoLevel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GEO_LEVELS.map(gl => (
                    <SelectItem key={gl.id} value={gl.id}>
                      {gl.labelSv}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedGeoLevel?.warning && (
                <div className="flex items-start gap-2 text-xs text-warning">
                  <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  {selectedGeoLevel.warning}
                </div>
              )}
            </div>
          </div>

          <Button 
            className="w-full mt-4" 
            onClick={() => setShowAnalysis(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Visa samvariation
          </Button>
        </CardContent>
      </Card>

      {/* Analysis View */}
      {showAnalysis && (
        <>
          {/* Correlation Chart */}
          <Card>
            <CardHeader>
              <div className="space-y-3">
                <CardTitle className="text-lg">
                  {selectedDemographic?.nameSv} × {selectedSocietal?.nameSv}
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{selectedTimePeriod?.labelSv}</Badge>
                  <Badge variant="outline">{selectedGeoLevel?.labelSv}</Badge>
                </div>
                {/* Mandatory text above graph */}
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {CORRELATION_DISCLAIMER.sv}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="demographic" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name={selectedDemographic?.nameSv}
                      dot={false}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="societal" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={2}
                      name={selectedSocietal?.nameSv}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Data footer */}
              <div className="mt-4 pt-4 border-t text-xs text-muted-foreground space-y-1">
                <div>Period: {mockData[0]?.year}–{mockData[mockData.length - 1]?.year}</div>
                {startYear < 1850 && (
                  <div className="text-yellow-600 dark:text-yellow-500 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Data före 1850 är rekonstruerade estimat
                  </div>
                )}
                <div>Källa: SCB, BRÅ, Eurostat (demonstrationsdata)</div>
                <div>Senast uppdaterad: 2024-01-15</div>
              </div>
            </CardContent>
          </Card>

          {/* Text Explanation (Not Numbers) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Vad visar detta?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                {getCorrelationText(mockCorrelation)}
              </p>
              <p className="text-sm text-muted-foreground">
                {MULTIPLE_FACTORS_NOTE.sv}
              </p>
            </CardContent>
          </Card>

          {/* Control Variables */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Scale className="h-5 w-5" />
                {CONTROL_VARIABLES_HEADER.sv}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {CONTROL_VARIABLES.map(cv => (
                  <div key={cv.id} className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">{cv.nameSv}</div>
                    <div className="text-xs text-muted-foreground">{cv.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What This Does NOT Show */}
          <Alert variant="destructive" className="bg-destructive/5 border-destructive/30">
            <XCircle className="h-4 w-4" />
            <AlertTitle>{WHAT_THIS_DOES_NOT_SHOW.title.sv}</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {WHAT_THIS_DOES_NOT_SHOW.items.map((item, i) => (
                  <li key={i}>{item.sv}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>

          {/* Cross-Country Comparison */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowCrossCountry(!showCrossCountry)}
              >
                <Globe className="h-4 w-4 mr-2" />
                {CROSS_COUNTRY_PROMPT.sv}
                <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${showCrossCountry ? 'rotate-90' : ''}`} />
              </Button>
              
              {showCrossCountry && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-3">Internationell jämförelse visar att:</p>
                  <ul className="space-y-2">
                    {['Mönster är sällan unika för ett land', 'Kontext spelar stor roll', 'Institutioner spelar stor roll'].map((insight, i) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <Shield className="h-3 w-3 text-primary" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Viability Connection */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30">
            <CardHeader>
              <CardTitle className="text-lg">Koppling till mänsklig levbarhet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm font-medium">
                {VIABILITY_CONNECTION.question.sv}
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Fokus på:</p>
                  <div className="flex flex-wrap gap-1">
                    {VIABILITY_CONNECTION.focus.sv.map(f => (
                      <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Inte om:</p>
                  <div className="flex flex-wrap gap-1">
                    {VIABILITY_CONNECTION.notAbout.sv.map(n => (
                      <Badge key={n} variant="outline" className="text-xs line-through opacity-50">{n}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transparency Principles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transparensprinciper</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2">
                {TRANSPARENCY_PRINCIPLES.sv.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-primary" />
                    {p}
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <p className="text-center text-sm font-medium text-primary">
                {TRANSPARENCY_OUTCOME.sv}
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SocietalCorrelationEngine;
