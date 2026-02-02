/**
 * SVERIGE CORE VIEW — DEFAULT NATIONAL DASHBOARD
 * 
 * "Hur mår Sverige – och varför ser det ut som det gör?"
 * 
 * Ingång för alla: medborgare, journalister, beslutsfattare, forskare.
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Info, 
  ChevronRight,
  Eye,
  EyeOff,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Briefcase,
  Shield,
  Home,
  Zap,
  Heart,
  DollarSign,
  Plane,
  Scale
} from 'lucide-react';
import {
  KEY_CURVES,
  STANDARD_CORRELATIONS,
  CORRELATION_HEADER,
  TEXT_LAYERS,
  YEAR_PERSPECTIVE_WARNING,
  GOVERNMENT_PERIODS,
  GOVERNMENT_PERIOD_HEADER,
  NATIONAL_STATUS_OPTIONS,
  NATIONAL_STATUS_SUBTITLE,
  CORE_VIEW_PRINCIPLES,
  type KeyCurveConfig
} from '@/config/swedenCoreViewConfig';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Icon mapping for curve categories
const CURVE_ICONS: Record<string, React.ReactNode> = {
  population_demography: <Users className="h-5 w-5" />,
  immigration_flow_stock: <Plane className="h-5 w-5" />,
  labor_market: <Briefcase className="h-5 w-5" />,
  violence_safety: <Shield className="h-5 w-5" />,
  economic_capacity: <DollarSign className="h-5 w-5" />,
  housing_overcrowding: <Home className="h-5 w-5" />,
  energy_living_conditions: <Zap className="h-5 w-5" />,
  human_wellbeing_index: <Heart className="h-5 w-5" />
};

// Generate mock data for a curve
const generateMockCurveData = (years: number = 25) => {
  const data = [];
  const startYear = 2024 - years;
  
  for (let i = 0; i <= years; i++) {
    const year = startYear + i;
    data.push({
      year,
      primary: 50 + Math.sin(i * 0.3) * 15 + i * 0.5 + Math.random() * 5,
      secondary: 30 + Math.cos(i * 0.2) * 10 + i * 0.3 + Math.random() * 3,
      tertiary: 20 + Math.sin(i * 0.4) * 8 + Math.random() * 4
    });
  }
  return data;
};

// Get color for curve type
const getCurveColor = (colorType: string): string => {
  switch (colorType) {
    case 'primary': return 'hsl(var(--primary))';
    case 'secondary': return 'hsl(var(--muted-foreground))';
    case 'tertiary': return 'hsl(210, 70%, 60%)';
    default: return 'hsl(var(--primary))';
  }
};

// Component for a single key curve section
const KeyCurveCard: React.FC<{ config: KeyCurveConfig; data: any[] }> = ({ config, data }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {CURVE_ICONS[config.id]}
            </div>
            <div>
              <CardTitle className="text-lg">{config.titleSv}</CardTitle>
              <CardDescription className="text-xs mt-1">{config.description}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {config.order}/8
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              {config.curves.map((curve, idx) => (
                <Line
                  key={curve.id}
                  type="monotone"
                  dataKey={['primary', 'secondary', 'tertiary'][idx] || 'primary'}
                  stroke={getCurveColor(curve.color)}
                  strokeWidth={2}
                  name={curve.nameSv}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {config.note && (
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
            <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
            {config.note}
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-xs"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
          {showDetails ? 'Dölj detaljer' : 'Visa detaljer & källor'}
        </Button>
        
        {showDetails && (
          <div className="text-xs text-muted-foreground space-y-2 pt-2 border-t">
            <div className="grid grid-cols-2 gap-2">
              {config.curves.map(curve => (
                <div key={curve.id} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getCurveColor(curve.color) }}
                  />
                  <span>{curve.nameSv} ({curve.unit})</span>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <div>Källa: SCB, BRÅ (demonstrationsdata)</div>
              <div>Period: 1999–2024</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Text layer component
const TextLayerSection: React.FC<{ curveId: string }> = ({ curveId }) => {
  return (
    <div className="grid gap-3 md:grid-cols-3 text-sm">
      {TEXT_LAYERS.map(layer => (
        <div key={layer.type} className="p-3 border rounded-lg bg-card">
          <div className="flex items-center gap-2 font-medium mb-2">
            <span>{layer.icon}</span>
            <span>{layer.titleSv}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {layer.type === 'what_we_see' && 'Kurvan visar utvecklingen över tid med alla datapunkter synliga.'}
            {layer.type === 'what_this_doesnt_say' && 'Visar inte orsakssamband, individuella fall eller framtida utveckling.'}
            {layer.type === 'explore_further' && 'Klicka på kurvan för att se underliggande data och jämförelser.'}
          </p>
        </div>
      ))}
    </div>
  );
};

// Standard correlation button
const CorrelationButton: React.FC<{ 
  correlation: typeof STANDARD_CORRELATIONS[0];
  onClick: () => void;
}> = ({ correlation, onClick }) => {
  return (
    <Button 
      variant="outline" 
      className="justify-between h-auto py-3 px-4"
      onClick={onClick}
    >
      <span className="text-sm">
        {correlation.indicator1Sv} ↔ {correlation.indicator2Sv}
      </span>
      <ChevronRight className="h-4 w-4 ml-2" />
    </Button>
  );
};

// Main component
const SwedenCoreView: React.FC = () => {
  const [selectedYearRange, setSelectedYearRange] = useState<'5y' | '10y' | '20y' | 'max'>('max');
  const [showPrinciples, setShowPrinciples] = useState(false);
  const [selectedCorrelation, setSelectedCorrelation] = useState<string | null>(null);
  const [showGovernments, setShowGovernments] = useState(false);
  
  // Current national status (mock)
  const currentStatus = NATIONAL_STATUS_OPTIONS.stressed;
  
  // Generate mock data for all curves
  const curveData = useMemo(() => {
    const years = selectedYearRange === '5y' ? 5 : 
                  selectedYearRange === '10y' ? 10 : 
                  selectedYearRange === '20y' ? 20 : 25;
    return generateMockCurveData(years);
  }, [selectedYearRange]);
  
  const startYear = curveData[0]?.year || 1999;
  const endYear = curveData[curveData.length - 1]?.year || 2024;
  
  // Filter relevant government periods
  const relevantGovernments = GOVERNMENT_PERIODS.filter(
    g => g.endYear >= startYear && g.startYear <= endYear
  );

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl">🇸🇪</span>
          <h1 className="text-2xl font-bold">Sverige</h1>
        </div>
        <p className="text-muted-foreground">
          Hur mår Sverige – och varför ser det ut som det gör?
        </p>
      </div>

      {/* National Status Panel */}
      <Card className="border-2" style={{ borderColor: currentStatus.color }}>
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <span className="text-lg font-semibold">Nationellt läge:</span>
              <Badge 
                className="text-lg px-4 py-1"
                style={{ backgroundColor: currentStatus.color }}
              >
                {currentStatus.labelSv}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              {NATIONAL_STATUS_SUBTITLE.sv}
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <Button variant="outline" size="sm">
                <Eye className="h-3 w-3 mr-1" />
                Visa varför
              </Button>
              <Button variant="outline" size="sm">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Visa osäkerheter
              </Button>
              <Button variant="outline" size="sm">
                <Clock className="h-3 w-3 mr-1" />
                Visa lång sikt
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Principles Toggle */}
      <div className="flex justify-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowPrinciples(!showPrinciples)}
        >
          <Scale className="h-4 w-4 mr-2" />
          {showPrinciples ? 'Dölj principer' : 'Visa systemets principer'}
        </Button>
      </div>
      
      {showPrinciples && (
        <Card className="bg-muted/30">
          <CardContent className="pt-4">
            <div className="grid gap-2 md:grid-cols-5">
              {CORE_VIEW_PRINCIPLES.sv.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-xs">{i + 1}</Badge>
                  {p}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Year Range Selector */}
      <div className="flex flex-col items-center gap-3">
        <Tabs value={selectedYearRange} onValueChange={(v) => setSelectedYearRange(v as any)}>
          <TabsList>
            <TabsTrigger value="5y">5 år</TabsTrigger>
            <TabsTrigger value="10y">10 år</TabsTrigger>
            <TabsTrigger value="20y">20 år</TabsTrigger>
            <TabsTrigger value="max">Max</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {selectedYearRange !== 'max' && (
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs whitespace-pre-line">
              {YEAR_PERSPECTIVE_WARNING.sv(startYear, endYear)}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Government Periods */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowGovernments(!showGovernments)}
        >
          {showGovernments ? 'Dölj mandatperioder' : 'Visa mandatperioder'}
          <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${showGovernments ? 'rotate-90' : ''}`} />
        </Button>
      </div>
      
      {showGovernments && (
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{GOVERNMENT_PERIOD_HEADER.sv}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-3">
              {relevantGovernments.map(gov => (
                <div key={gov.startYear} className="p-3 border rounded-lg text-sm">
                  <div className="font-medium">{gov.government}</div>
                  <div className="text-xs text-muted-foreground">
                    {gov.startYear}–{gov.endYear} • {gov.coalition}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* 8 Key Curves Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-center">
          8 obligatoriska nyckelkurvor
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {KEY_CURVES.map(curve => (
            <KeyCurveCard key={curve.id} config={curve} data={curveData} />
          ))}
        </div>
      </div>

      <Separator />

      {/* Standard Correlations */}
      <div>
        <h2 className="text-lg font-semibold mb-2 text-center">
          Standardkorrelationer (1 klick)
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-4">
          Färdiga, neutrala jämförelser
        </p>
        
        <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-5">
          {STANDARD_CORRELATIONS.map(corr => (
            <CorrelationButton 
              key={corr.id} 
              correlation={corr}
              onClick={() => setSelectedCorrelation(corr.id)}
            />
          ))}
        </div>
        
        {selectedCorrelation && (
          <Card className="mt-4">
            <CardHeader>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="whitespace-pre-line">
                  {CORRELATION_HEADER.sv}
                </AlertDescription>
              </Alert>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={curveData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="primary"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name={STANDARD_CORRELATIONS.find(c => c.id === selectedCorrelation)?.indicator1Sv}
                      dot={false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="secondary"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={2}
                      name={STANDARD_CORRELATIONS.find(c => c.id === selectedCorrelation)?.indicator2Sv}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Text Layers */}
              <div className="mt-4">
                <TextLayerSection curveId={selectedCorrelation} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Global Template Note */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4 text-center">
          <p className="text-sm text-muted-foreground">
            🌍 Denna vy är mall för alla länder. Skillnader: datatäthet och osäkerhetsmarkering.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SwedenCoreView;
