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
// No lucide icons - using text-based indicators per design doctrine
import {
  DEMOGRAPHIC_INDICATORS,
  SOCIETAL_OUTCOMES,
  TIME_PERIODS,
  GEO_LEVELS,
  COUNTRIES,
  getRegionsForCountry,
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
import { ControlVariableCard } from './ControlVariableCard';
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
  const [selectedCountry, setSelectedCountry] = useState('se');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showCrossCountry, setShowCrossCountry] = useState(false);

  const selectedDemographic = DEMOGRAPHIC_INDICATORS.find(i => i.id === demographicIndicator);
  const selectedSocietal = SOCIETAL_OUTCOMES.find(o => o.id === societalOutcome);
  const selectedTimePeriod = TIME_PERIODS.find(t => t.id === timePeriod);
  const selectedGeoLevel = GEO_LEVELS.find(g => g.id === geoLevel);
  const selectedCountryData = COUNTRIES.find(c => c.id === selectedCountry);
  const availableRegions = getRegionsForCountry(selectedCountry);

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
        <AlertDescription className="whitespace-pre-line">
          <span className="font-mono text-xs mr-2">[OBS]</span>
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
              <label className="text-sm font-medium">
                Demografisk indikator
              </label>
              <Select value={demographicIndicator} onValueChange={setDemographicIndicator}>
                <SelectTrigger className="min-h-[44px]">
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
              <label className="text-sm font-medium">
                Samhällsutfall
              </label>
              <Select value={societalOutcome} onValueChange={setSocietalOutcome}>
                <SelectTrigger className="min-h-[44px]">
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

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {/* Time Period */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Analysperiod</label>
              <Select value={timePeriod} onValueChange={(v) => setTimePeriod(v as TimePeriod)}>
                <SelectTrigger className="min-h-[44px]">
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
                <div className="flex items-start gap-2 text-xs text-destructive">
                  <span className="font-mono">[!]</span>
                  {selectedTimePeriod.warning}
                </div>
              )}
            </div>

            {/* Geographic Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Geografisk nivå</label>
              <Select value={geoLevel} onValueChange={(v) => {
                setGeoLevel(v as GeoLevel);
                // Reset region when changing level
                if (v === 'national') setSelectedRegion(null);
              }}>
                <SelectTrigger className="min-h-[44px]">
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
                <div className="flex items-start gap-2 text-xs text-destructive">
                  <span className="font-mono">[!]</span>
                  {selectedGeoLevel.warning}
                </div>
              )}
            </div>
          </div>

          {/* COUNTRY / REGION SELECTORS - NEW */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {/* Country selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Land</label>
              <Select value={selectedCountry} onValueChange={(v) => {
                setSelectedCountry(v);
                setSelectedRegion(null); // Reset region when country changes
              }}>
                <SelectTrigger className="min-h-[44px]">
                  <SelectValue placeholder="Välj land..." />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(country => (
                    <SelectItem key={country.id} value={country.id}>
                      <div className="flex items-center justify-between w-full gap-2">
                        <span>{country.labelSv}</span>
                        <Badge variant="outline" className="text-xs ml-2">
                          Tier {country.dataTier}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCountryData && (
                <p className="text-xs text-muted-foreground">
                  Datatillförlitlighet: Tier {selectedCountryData.dataTier}
                  {selectedCountryData.dataTier === 'A' && ' (Hög kvalitet)'}
                  {selectedCountryData.dataTier === 'B' && ' (God kvalitet)'}
                </p>
              )}
            </div>

            {/* Region selector - only show when regional/municipal level */}
            {(geoLevel === 'regional' || geoLevel === 'municipal') && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Region</label>
                <Select 
                  value={selectedRegion || ''} 
                  onValueChange={setSelectedRegion}
                  disabled={availableRegions.length === 0}
                >
                  <SelectTrigger className="min-h-[44px]">
                    <SelectValue placeholder={
                      availableRegions.length === 0 
                        ? 'Inga regioner för detta land' 
                        : 'Välj region...'
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRegions.map(region => (
                      <SelectItem key={region.id} value={region.id}>
                        <div className="flex items-center justify-between w-full gap-2">
                          <span>{region.labelSv}</span>
                          <Badge variant="outline" className="text-xs ml-2">
                            Tier {region.dataTier}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {availableRegions.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Regiondata finns ännu inte för {selectedCountryData?.labelSv || 'detta land'}.
                  </p>
                )}
              </div>
            )}
          </div>

          <Button 
            className="w-full mt-4 min-h-[48px]" 
            onClick={() => setShowAnalysis(true)}
          >
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
                  <div className="text-destructive flex items-center gap-1">
                    <span className="font-mono">[EST]</span>
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
              <CardTitle className="text-lg">
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
              <CardTitle className="text-lg">
                {CONTROL_VARIABLES_HEADER.sv}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {CONTROL_VARIABLES.map(cv => (
                  <ControlVariableCard 
                    key={cv.id} 
                    variable={cv}
                    language="sv"
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Klicka på en faktor för att se observation, mekanism, metod, begränsningar och källor.
              </p>
            </CardContent>
          </Card>

          {/* What This Does NOT Show */}
          <Alert variant="destructive" className="bg-destructive/5 border-destructive/30">
            <AlertTitle className="flex items-center gap-2">
              <span className="font-mono text-xs">[EJ]</span>
              {WHAT_THIS_DOES_NOT_SHOW.title.sv}
            </AlertTitle>
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
                className="w-full min-h-[48px] justify-between"
                onClick={() => setShowCrossCountry(!showCrossCountry)}
              >
                <span>{CROSS_COUNTRY_PROMPT.sv}</span>
                <span className={`transition-transform font-mono text-xs ${showCrossCountry ? 'rotate-90' : ''}`}>[+]</span>
              </Button>
              
              {showCrossCountry && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-3">Internationell jämförelse visar att:</p>
                  <ul className="space-y-2">
                    {['Mönster är sällan unika för ett land', 'Kontext spelar stor roll', 'Institutioner spelar stor roll'].map((insight, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="font-mono text-primary text-xs">[+]</span>
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
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-mono text-primary text-xs">[+]</span>
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
