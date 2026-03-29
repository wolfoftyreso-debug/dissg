/**
 * ============================================================================
 * DISSG NATION EXPLORER
 * Diagnostic Information System for Societal Governance
 * ============================================================================
 *
 * Hierarchy Level: NATION (Level 2 of 7)
 * Path: Civilisation → Världsdel → [Nation] → Region → System → Indikator → Datapunkt
 *
 * Live WorldBank data — NOLL mockdata.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCountry, useCountries } from '@/hooks/useGlobalData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, BarChart, Bar,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import { ClickableSourceCitation } from '@/components/ui/ClickableSourceCitation';
import { ClickableIndexCard } from '@/components/data';
import {
  getWorldBankData,
  getCountryIndicators,
  latestValue,
  WB_INDICATORS,
  type WorldBankDataPoint,
} from '@/lib/dataSources';
import { LiveDataWidget } from '@/components/data/LiveDataWidget';

// Indicator definitions — each maps to a WorldBank code
const AVAILABLE_INDICATORS = [
  { code: 'life_exp',    name: 'Medellivslängd',      unit: 'år',       wbCode: WB_INDICATORS.LIFE_EXPECTANCY,  category: 'health' },
  { code: 'gdp_pc',     name: 'BNP per capita',       unit: 'USD',      wbCode: WB_INDICATORS.GDP_PER_CAPITA,   category: 'economy' },
  { code: 'unemployment',name: 'Arbetslöshet',         unit: '%',        wbCode: WB_INDICATORS.UNEMPLOYMENT,     category: 'economy' },
  { code: 'inflation',  name: 'Inflation',             unit: '%',        wbCode: WB_INDICATORS.INFLATION,        category: 'economy' },
  { code: 'co2_pc',     name: 'CO₂ per capita',        unit: 'ton',      wbCode: WB_INDICATORS.CO2_EMISSIONS,    category: 'environment' },
  { code: 'internet',   name: 'Internetanvändare',     unit: '%',        wbCode: WB_INDICATORS.INTERNET_USERS,   category: 'technology' },
  { code: 'infant_mort',name: 'Spädbarnsdödlighet',    unit: 'per 1000', wbCode: 'SP.DYN.IMRT.IN',              category: 'health' },
  { code: 'fertility',  name: 'Fertilitet',            unit: 'barn/kvinna', wbCode: 'SP.DYN.TFRT.IN',           category: 'demography' },
  { code: 'gini',       name: 'Gini-koefficient',      unit: 'index',    wbCode: WB_INDICATORS.GINI_INDEX,       category: 'equality' },
  { code: 'literacy',   name: 'Läskunnighet',          unit: '%',        wbCode: WB_INDICATORS.LITERACY_RATE,    category: 'education' },
];

const COMPARISON_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

// WorldBank historical series → [{year, value}]
function wbToTimeSeries(data: WorldBankDataPoint[]): Array<{ year: number; value: number }> {
  return data
    .filter(d => d.value !== null)
    .map(d => ({ year: Number(d.date), value: d.value as number }))
    .sort((a, b) => a.year - b.year);
}

// Normalize value into a 0-100 score using min/max bounds per indicator
function normalizeWB(code: string, value: number | null): number {
  if (value === null) return 0;
  const bounds: Record<string, [number, number]> = {
    life_exp:     [40, 85],
    gdp_pc:       [500, 80000],
    unemployment: [0, 30],
    inflation:    [0, 20],
    co2_pc:       [0, 20],
    internet:     [0, 100],
    infant_mort:  [0, 100],
    fertility:    [1, 7],
    gini:         [20, 65],
    literacy:     [0, 100],
  };
  const [min, max] = bounds[code] || [0, 100];
  // For "higher is worse" indicators, invert
  const invertCodes = ['unemployment', 'inflation', 'co2_pc', 'infant_mort', 'gini', 'fertility'];
  const ratio = (value - min) / (max - min);
  const clamped = Math.max(0, Math.min(1, ratio));
  return invertCodes.includes(code) ? Math.round((1 - clamped) * 100) : Math.round(clamped * 100);
}

export default function CountryExplorer() {
  const { code } = useParams<{ code: string }>();
  const countryCode = code?.toUpperCase() || 'SE';

  const { data: country, isLoading: loadingCountry } = useCountry(countryCode);
  const { data: allCountries } = useCountries();

  // Graph sandbox state
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['life_exp']);
  const [comparisonCountries, setComparisonCountries] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('sandbox');

  // Live WorldBank state for graph sandbox
  const [chartData, setChartData] = useState<Array<Record<string, number | string>>>([]);
  const [chartLoading, setChartLoading] = useState(false);

  // Live WorldBank state for radar + key indicators
  const [liveIndicators, setLiveIndicators] = useState<Record<string, number | null>>({});
  const [indicatorsLoading, setIndicatorsLoading] = useState(true);

  // Fetch all indicators once for radar + key indicators
  useEffect(() => {
    let cancelled = false;
    async function loadIndicators() {
      setIndicatorsLoading(true);
      try {
        const wbCodes = AVAILABLE_INDICATORS.map(i => i.wbCode);
        const results = await getCountryIndicators(countryCode, wbCodes);
        if (cancelled) return;
        const mapped: Record<string, number | null> = {};
        AVAILABLE_INDICATORS.forEach(ind => {
          mapped[ind.code] = latestValue(results[ind.wbCode] || []);
        });
        setLiveIndicators(mapped);
      } catch (err) {
        console.error('Indicators load failed:', err);
      } finally {
        if (!cancelled) setIndicatorsLoading(false);
      }
    }
    loadIndicators();
    return () => { cancelled = true; };
  }, [countryCode]);

  // Fetch historical data for selected indicator & comparison countries
  useEffect(() => {
    let cancelled = false;
    const primaryInd = AVAILABLE_INDICATORS.find(i => i.code === selectedIndicators[0]);
    if (!primaryInd) return;

    async function loadChart() {
      setChartLoading(true);
      try {
        const allTargetCountries = [countryCode, ...comparisonCountries];
        const fetches = allTargetCountries.map(cc =>
          getWorldBankData(primaryInd!.wbCode, cc)
        );
        const results = await Promise.allSettled(fetches);
        if (cancelled) return;

        if (comparisonCountries.length === 0) {
          // Single country
          const r = results[0];
          if (r.status === 'fulfilled') {
            setChartData(wbToTimeSeries(r.value.data));
          } else {
            setChartData([]);
          }
        } else {
          // Multi-country comparison: merge by year
          const byYear: Record<number, Record<string, number | string>> = {};
          results.forEach((r, idx) => {
            const cc = allTargetCountries[idx];
            if (r.status === 'fulfilled') {
              r.value.data
                .filter(d => d.value !== null)
                .forEach(d => {
                  const yr = Number(d.date);
                  if (!byYear[yr]) byYear[yr] = { year: yr };
                  byYear[yr][cc] = d.value as number;
                });
            }
          });
          const merged = Object.values(byYear).sort((a, b) => (a.year as number) - (b.year as number));
          setChartData(merged);
        }
      } catch (err) {
        console.error('Chart load failed:', err);
        setChartData([]);
      } finally {
        if (!cancelled) setChartLoading(false);
      }
    }
    loadChart();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCode, selectedIndicators[0], JSON.stringify(comparisonCountries)]);

  // Toggle indicator selection
  const toggleIndicator = (indCode: string) => {
    setSelectedIndicators(prev =>
      prev.includes(indCode)
        ? prev.filter(c => c !== indCode)
        : [...prev, indCode].slice(0, 4)
    );
  };

  const toggleComparisonCountry = (cc: string) => {
    setComparisonCountries(prev =>
      prev.includes(cc)
        ? prev.filter(c => c !== cc)
        : [...prev, cc].slice(0, 4)
    );
  };

  const primaryIndicator = AVAILABLE_INDICATORS.find(i => i.code === selectedIndicators[0]);
  const allComparisonCountries = [countryCode, ...comparisonCountries];

  // Radar chart data from live indicators
  const radarData = useMemo(() => {
    return [
      { domain: 'Hälsa',      value: normalizeWB('life_exp',     liveIndicators.life_exp),     fullMark: 100 },
      { domain: 'Utbildning', value: normalizeWB('literacy',      liveIndicators.literacy),     fullMark: 100 },
      { domain: 'Ekonomi',    value: normalizeWB('gdp_pc',        liveIndicators.gdp_pc),       fullMark: 100 },
      { domain: 'Miljö',      value: normalizeWB('co2_pc',        liveIndicators.co2_pc),       fullMark: 100 },
      { domain: 'Jämlikhet',  value: normalizeWB('gini',          liveIndicators.gini),         fullMark: 100 },
      { domain: 'Tech',       value: normalizeWB('internet',      liveIndicators.internet),     fullMark: 100 },
    ];
  }, [liveIndicators]);

  // Key indicators for display
  const keyIndicators = useMemo(() => [
    {
      code: 'GDP/cap',
      value: liveIndicators.gdp_pc !== null && liveIndicators.gdp_pc !== undefined
        ? `$${((liveIndicators.gdp_pc as number) / 1000).toFixed(0)}k`
        : '—',
      label: 'WorldBank',
    },
    {
      code: 'Livslängd',
      value: liveIndicators.life_exp !== null && liveIndicators.life_exp !== undefined
        ? `${(liveIndicators.life_exp as number).toFixed(1)} år`
        : '—',
      label: 'WorldBank',
    },
    {
      code: 'Arbetslöshet',
      value: liveIndicators.unemployment !== null && liveIndicators.unemployment !== undefined
        ? `${(liveIndicators.unemployment as number).toFixed(1)}%`
        : '—',
      label: 'WorldBank',
    },
    {
      code: 'Inflation',
      value: liveIndicators.inflation !== null && liveIndicators.inflation !== undefined
        ? `${(liveIndicators.inflation as number).toFixed(1)}%`
        : '—',
      label: 'WorldBank',
    },
    {
      code: 'Internet',
      value: liveIndicators.internet !== null && liveIndicators.internet !== undefined
        ? `${(liveIndicators.internet as number).toFixed(1)}%`
        : '—',
      label: 'WorldBank',
    },
    {
      code: 'CO₂/cap',
      value: liveIndicators.co2_pc !== null && liveIndicators.co2_pc !== undefined
        ? `${(liveIndicators.co2_pc as number).toFixed(1)} t`
        : '—',
      label: 'WorldBank',
    },
  ], [liveIndicators]);

  if (loadingCountry) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const displayName = country?.name || countryCode;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1 font-mono">
                <Link to="/" className="hover:text-primary">[CIV]</Link>
                <span>/</span>
                <span>[{country?.region || 'Region'}]</span>
                <span>/</span>
                <span className="text-foreground">[{countryCode}]</span>
              </div>
              <h1 className="text-2xl font-bold">{displayName}</h1>
              <p className="text-sm text-muted-foreground">
                Utforska indikatorer, index och jämförelsedata
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="font-mono">{countryCode}</Badge>
              {country?.data_depth && (
                <Badge variant="secondary">Data: {country.data_depth}</Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Live data widget */}
      <div className="container mx-auto px-4 pt-4">
        <Card>
          <CardContent className="pt-4">
            <LiveDataWidget countryCode={countryCode} showTitle={true} />
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="sandbox" className="font-mono text-xs">[GRAF]</TabsTrigger>
            <TabsTrigger value="indices" className="font-mono text-xs">[INDEX]</TabsTrigger>
            <TabsTrigger value="timeline" className="font-mono text-xs">[TIDSLINJE]</TabsTrigger>
          </TabsList>

          {/* GRAPH SANDBOX */}
          <TabsContent value="sandbox" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono">[VÄLJ INDIKATOR]</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {AVAILABLE_INDICATORS.map(indicator => (
                    <label
                      key={indicator.code}
                      className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded transition-colors"
                    >
                      <Checkbox
                        checked={selectedIndicators.includes(indicator.code)}
                        onCheckedChange={() => toggleIndicator(indicator.code)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{indicator.name}</p>
                        <p className="text-xs text-muted-foreground">{indicator.unit} · {indicator.wbCode}</p>
                      </div>
                    </label>
                  ))}
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-mono">
                      [{primaryIndicator?.name.toUpperCase() || 'GRAF'}] — WORLDBANK LIVE
                    </CardTitle>
                    <ClickableSourceCitation sourceKey="undp-worldbank-who" />
                  </div>
                </CardHeader>
                <CardContent>
                  {chartLoading ? (
                    <div className="h-80 flex items-center justify-center text-muted-foreground text-sm font-mono">
                      HÄMTAR WORLDBANK-DATA…
                    </div>
                  ) : chartData.length === 0 ? (
                    <div className="h-80 flex items-center justify-center text-muted-foreground text-sm font-mono">
                      INGEN DATA TILLGÄNGLIG — {primaryIndicator?.wbCode}
                    </div>
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="year" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                          <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px',
                            }}
                          />
                          <Legend />
                          {comparisonCountries.length > 0 ? (
                            allComparisonCountries.map((cc, idx) => (
                              <Line
                                key={cc}
                                type="monotone"
                                dataKey={cc}
                                name={cc}
                                stroke={COMPARISON_COLORS[idx % COMPARISON_COLORS.length]}
                                strokeWidth={cc === countryCode ? 3 : 1.5}
                                dot={false}
                                connectNulls
                              />
                            ))
                          ) : (
                            <Line
                              type="monotone"
                              dataKey="value"
                              name={displayName}
                              stroke="hsl(var(--primary))"
                              strokeWidth={2}
                              dot={false}
                              connectNulls
                            />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Comparison country selector */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs font-mono text-muted-foreground mb-2">[LÄGG TILL JÄMFÖRELSELAND]</p>
                    <div className="flex flex-wrap gap-2">
                      {allCountries?.filter(c => c.code !== countryCode).slice(0, 12).map(c => (
                        <Button
                          key={c.code}
                          size="sm"
                          variant={comparisonCountries.includes(c.code) ? 'default' : 'outline'}
                          className="text-xs h-7"
                          onClick={() => toggleComparisonCountry(c.code)}
                        >
                          {c.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* INDEX VIEW */}
          <TabsContent value="indices" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Radar chart — live WorldBank data */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono">[DOMÄNPROFIL — WORLDBANK LIVE]</CardTitle>
                </CardHeader>
                <CardContent>
                  {indicatorsLoading ? (
                    <div className="h-80 flex items-center justify-center text-muted-foreground text-sm font-mono">
                      HÄMTAR DATA…
                    </div>
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid className="stroke-muted" />
                          <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                          <Radar
                            name={displayName}
                            dataKey="value"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.3}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Key indicators — live WorldBank */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono">[NYCKELINDIKATORER — WORLDBANK LIVE]</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {indicatorsLoading ? (
                    <div className="text-sm text-muted-foreground font-mono">HÄMTAR DATA…</div>
                  ) : (
                    keyIndicators.map(ind => (
                      <div key={ind.code} className="flex items-center justify-between py-2 border-b last:border-0">
                        <span className="text-sm font-medium">{ind.code}</span>
                        <div className="text-right">
                          <span className="text-lg font-bold font-mono">{ind.value}</span>
                          <p className="text-xs text-muted-foreground">{ind.label}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <ClickableSourceCitation sourceKey="undp-worldbank-who" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TIMELINE VIEW */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono">[HISTORISK LIVSLÄNGD — WORLDBANK LIVE]</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Historisk medellivslängd för {displayName} — källa WorldBank ({WB_INDICATORS.LIFE_EXPECTANCY}).
                </p>
                {chartLoading ? (
                  <div className="h-80 flex items-center justify-center text-muted-foreground text-sm font-mono">
                    HÄMTAR DATA…
                  </div>
                ) : chartData.length === 0 ? (
                  <div className="h-80 flex items-center justify-center text-muted-foreground text-sm font-mono">
                    INGEN HISTORISK DATA TILLGÄNGLIG
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name={primaryIndicator?.name || 'Indikator'}
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={false}
                          connectNulls
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <ClickableSourceCitation sourceKey="undp-worldbank-who" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
