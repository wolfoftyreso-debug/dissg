import React, { useState } from 'react';
import { useCountries, useCountry } from '@/hooks/useGlobalData';
import { gmiPillars, DataQuality } from '@/config/gmiConfig';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Globe, 
  BarChart3, 
  LineChart,
  Settings2,
  ArrowLeft
} from 'lucide-react';

import { GlobalDashboard } from '@/components/global/GlobalDashboard';
import { GMIOverview } from '@/components/global/GMIOverview';
import { GMIPillarDetail } from '@/components/global/GMIPillarDetail';
import { GMITimeline } from '@/components/global/GMITimeline';
import { GMIWeightEditor } from '@/components/global/GMIWeightEditor';
import { DataDepthIndicator } from '@/components/global/DataDepthIndicator';

// Mock data generators
function generateMockPillarScores() {
  return gmiPillars.map(pillar => ({
    pillarId: pillar.id,
    value: 50 + Math.random() * 40,
    normalizedValue: 50 + Math.random() * 40,
    trend: (['up', 'down', 'stable'] as const)[Math.floor(Math.random() * 3)],
    trendPercent: (Math.random() - 0.5) * 10,
    dataQuality: (['high', 'medium', 'low'] as const)[Math.floor(Math.random() * 3)] as DataQuality,
    indicatorCount: pillar.indicators.length,
    indicatorsAvailable: Math.floor(Math.random() * pillar.indicators.length) + 1,
  }));
}

function generateMockIndicatorValues(pillarId: string) {
  const pillar = gmiPillars.find(p => p.id === pillarId);
  if (!pillar) return [];
  
  return pillar.indicators.map(ind => ({
    code: ind.code,
    value: Math.random() > 0.2 ? 30 + Math.random() * 60 : null,
    normalizedValue: Math.random() > 0.2 ? 30 + Math.random() * 60 : null,
    trend: (['up', 'down', 'stable'] as const)[Math.floor(Math.random() * 3)],
    trendPercent: (Math.random() - 0.5) * 15,
    source: ind.source,
    lastUpdated: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
    isEstimated: Math.random() > 0.8,
    uncertainty: Math.random() > 0.5 ? Math.random() * 5 : undefined,
  }));
}

function generateMockTimelineData() {
  const data = [];
  const now = new Date();
  
  for (let i = 60; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: 65 + Math.sin(i / 10) * 5 + Math.random() * 3,
      uncertainty: 2 + Math.random() * 3,
      isEstimated: i > 55,
    });
  }
  
  return data;
}

export default function GlobalMasterIndex() {
  const [selectedCountry, setSelectedCountry] = useState<string>('SE');
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [weights, setWeights] = useState<Record<string, number>>(
    gmiPillars.reduce((acc, p) => ({ ...acc, [p.id]: p.defaultWeight }), {})
  );

  const { data: countries } = useCountries();
  const { data: country } = useCountry(selectedCountry);

  const pillarScores = generateMockPillarScores();
  const gmiScore = pillarScores.reduce((sum, p) => {
    const weight = weights[p.pillarId] || 0;
    return sum + p.normalizedValue * weight;
  }, 0);

  const timelineData = generateMockTimelineData();
  const comparisonData = [
    {
      label: 'EU genomsnitt',
      data: generateMockTimelineData(),
      color: '#3b82f6',
    },
    {
      label: 'OECD genomsnitt',
      data: generateMockTimelineData(),
      color: '#10b981',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Global Master Index</h1>
                <p className="text-sm text-muted-foreground">
                  Ett gemensamt språk för hur samhällen utvecklas
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries?.map(c => (
                    <SelectItem key={c.code} value={c.code}>
                      <span className="flex items-center gap-2">
                        <span>{c.name}</span>
                        <Badge variant="outline" className="text-xs">{c.code}</Badge>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {country && (
                <DataDepthIndicator depth={country.data_depth} size="sm" />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {selectedPillar ? (
          // Pillar detail view
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedPillar(null)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tillbaka till översikt
            </Button>
            
            <GMIPillarDetail
              pillarId={selectedPillar}
              countryCode={selectedCountry}
              countryName={country?.name || selectedCountry}
              pillarScore={pillarScores.find(p => p.pillarId === selectedPillar)?.normalizedValue || 0}
              pillarTrend={pillarScores.find(p => p.pillarId === selectedPillar)?.trend || 'stable'}
              indicators={generateMockIndicatorValues(selectedPillar)}
              dataQuality={pillarScores.find(p => p.pillarId === selectedPillar)?.dataQuality || 'medium'}
              weight={weights[selectedPillar] || 0.2}
            />
          </div>
        ) : (
          // Main view with tabs
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">
                <BarChart3 className="h-4 w-4 mr-2" />
                Översikt
              </TabsTrigger>
              <TabsTrigger value="timeline">
                <LineChart className="h-4 w-4 mr-2" />
                Tidslinje
              </TabsTrigger>
              <TabsTrigger value="weights">
                <Settings2 className="h-4 w-4 mr-2" />
                Vikter
              </TabsTrigger>
              <TabsTrigger value="global">
                <Globe className="h-4 w-4 mr-2" />
                Global vy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <GMIOverview
                countryCode={selectedCountry}
                countryName={country?.name || selectedCountry}
                gmiScore={gmiScore}
                gmiTrend="up"
                gmiTrendPercent={2.3}
                pillarScores={pillarScores}
                dataQuality={country?.data_depth === 'national_deep' ? 'high' : 'medium'}
                comparability="full"
                lastUpdated={new Date().toISOString()}
                onPillarClick={setSelectedPillar}
              />
            </TabsContent>

            <TabsContent value="timeline">
              <GMITimeline
                countryCode={selectedCountry}
                countryName={country?.name || selectedCountry}
                data={timelineData}
                currentValue={gmiScore}
                trend="up"
                trendPercent={2.3}
                acceleration="accelerating"
                comparisonData={comparisonData}
              />
            </TabsContent>

            <TabsContent value="weights">
              <div className="grid gap-6 md:grid-cols-2">
                <GMIWeightEditor
                  currentWeights={weights}
                  onWeightsChange={setWeights}
                  countryCode={selectedCountry}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Viktpåverkan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Se hur olika vikter påverkar GMI-poängen för {country?.name || selectedCountry}.
                    </p>
                    
                    <div className="space-y-3">
                      {pillarScores.map(score => {
                        const pillar = gmiPillars.find(p => p.id === score.pillarId);
                        const weight = weights[score.pillarId] || 0;
                        const contribution = score.normalizedValue * weight;
                        
                        return (
                          <div key={score.pillarId} className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <span>{pillar?.icon}</span>
                              <span>{pillar?.name}</span>
                            </span>
                            <div className="text-right">
                              <span className="font-mono">
                                {score.normalizedValue.toFixed(1)} × {(weight * 100).toFixed(0)}% = 
                              </span>
                              <span className="font-mono font-bold ml-1">
                                {contribution.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      
                      <div className="border-t pt-3 flex items-center justify-between font-bold">
                        <span>Totalt GMI</span>
                        <span className="font-mono text-lg">{gmiScore.toFixed(1)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="global">
              <GlobalDashboard />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
