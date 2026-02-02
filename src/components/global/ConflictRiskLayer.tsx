/**
 * 🌐 GLOBAL POWER, CONFLICT & RISK LAYER
 * 
 * MASTER EXECUTION BLOCK 37 — Non-Operative Implementation
 * 
 * This component displays structural risk and power distribution
 * WITHOUT enabling military planning or operational use.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, AlertTriangle, Globe, TrendingUp, Users, Landmark,
  Info, Lock, ChevronRight, BarChart3, MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ETHICS_DISCLAIMER,
  CONFLICT_DRIVERS,
  CAPACITY_CATEGORIES,
  RISK_INDICATORS,
  CONFLICT_LAYER_HEADER,
  CONFLICT_LAYER_FOOTER,
  DRILL_DOWN_LIMITS,
  type AllowedDrillLevel,
  type ConflictDriver,
} from '@/config/conflictRiskConfig';

// ============================================================
// TYPES
// ============================================================

type Language = 'sv' | 'en';

interface ConflictRiskLayerProps {
  language?: Language;
  onNavigate?: (section: string) => void;
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

/** Mandatory ethics banner - ALWAYS visible */
function EthicsBanner({ language }: { language: Language }) {
  return (
    <Alert className="bg-amber-50 border-amber-200 mb-6">
      <AlertTriangle className="h-5 w-5 text-amber-600" />
      <AlertTitle className="text-amber-800 font-semibold">
        {language === 'sv' ? 'Viktig begränsning' : 'Important limitation'}
      </AlertTitle>
      <AlertDescription className="text-amber-700">
        {ETHICS_DISCLAIMER[language].banner}
      </AlertDescription>
    </Alert>
  );
}

/** Limitations box - shows what this does NOT cover */
function LimitationsBox({ language }: { language: Language }) {
  const disclaimer = ETHICS_DISCLAIMER[language];
  
  return (
    <Card className="border-slate-200 bg-slate-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-slate-700">
          <Lock className="h-4 w-4" />
          {disclaimer.limitations_title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {disclaimer.limitations.map((limitation, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="text-red-500 mt-0.5">✗</span>
              {limitation}
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-sm font-medium text-slate-700">{disclaimer.purpose_title}</p>
          <p className="text-sm text-slate-600 mt-1">{disclaimer.purpose}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/** Conflict driver card */
function DriverCard({ driver, language }: { driver: ConflictDriver; language: Language }) {
  const iconMap: Record<string, React.ElementType> = {
    economic: TrendingUp,
    governance: Landmark,
    social: Users,
    strategic: Shield,
  };
  const IconComponent = iconMap[driver.category] || Globe;
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <IconComponent className="h-5 w-5 text-slate-600" />
          </div>
          <Badge variant="outline" className="text-xs">
            {driver.category}
          </Badge>
        </div>
        <CardTitle className="text-base mt-3">{driver.name[language]}</CardTitle>
        <CardDescription>{driver.description[language]}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600 italic">
          <Info className="h-4 w-4 inline mr-2 text-slate-400" />
          {driver.historical_note[language]}
        </div>
      </CardContent>
    </Card>
  );
}

/** Capacity category display */
function CapacityDisplay({ language }: { language: Language }) {
  // Mock data - in production this would come from the database
  const mockCapacities = [
    { id: 'personnel_index', value: 65, global_avg: 50 },
    { id: 'budget_ppp', value: 78, global_avg: 50 },
    { id: 'tech_breadth', value: 82, global_avg: 50 },
    { id: 'global_reach', value: 45, global_avg: 50 },
    { id: 'logistic_endurance', value: 58, global_avg: 50 },
  ];

  return (
    <div className="space-y-4">
      {CAPACITY_CATEGORIES.map((category) => {
        const data = mockCapacities.find(c => c.id === category.id);
        const value = data?.value || 50;
        
        return (
          <div key={category.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">
                {category.name[language]}
              </span>
              <Badge variant="secondary" className="text-xs">
                {language === 'sv' ? 'Indexerat' : 'Indexed'}
              </Badge>
            </div>
            <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-slate-400 rounded-full transition-all"
                style={{ width: `${value}%` }}
              />
              {/* Global average marker */}
              <div 
                className="absolute h-full w-0.5 bg-slate-600"
                style={{ left: '50%' }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {category.limitations[language]}
            </p>
          </div>
        );
      })}
      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-slate-400 rounded" />
          <span>{language === 'sv' ? 'Relativt värde' : 'Relative value'}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-0.5 h-3 bg-slate-600" />
          <span>{language === 'sv' ? 'Globalt genomsnitt' : 'Global average'}</span>
        </div>
      </div>
    </div>
  );
}

/** Risk indicator with user-adjustable weights */
function RiskIndicatorPanel({ language }: { language: Language }) {
  const [weights, setWeights] = useState<Record<string, number>>(
    Object.fromEntries(RISK_INDICATORS.map(r => [r.id, 50]))
  );

  const handleWeightChange = (id: string, value: number[]) => {
    setWeights(prev => ({ ...prev, [id]: value[0] }));
  };

  const totalRisk = Object.values(weights).reduce((a, b) => a + b, 0) / RISK_INDICATORS.length;

  return (
    <div className="space-y-6">
      {/* Risk gauge */}
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            {language === 'sv' ? 'Sammansatt riskindex' : 'Composite risk index'}
          </span>
          <span className="text-2xl font-semibold text-slate-700">
            {Math.round(totalRisk)}
          </span>
        </div>
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400"
            style={{ width: `${totalRisk}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2 italic">
          {language === 'sv' 
            ? 'Denna modell illustrerar känslighet, inte utfall.'
            : 'This model illustrates sensitivity, not outcomes.'}
        </p>
      </div>

      {/* Individual indicators */}
      {RISK_INDICATORS.map((indicator) => (
        <div key={indicator.id} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{indicator.name[language]}</span>
            <span className="text-sm text-muted-foreground">{weights[indicator.id]}</span>
          </div>
          <Slider
            value={[weights[indicator.id]]}
            onValueChange={(value) => handleWeightChange(indicator.id, value)}
            max={100}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">{indicator.description[language]}</p>
        </div>
      ))}

      {/* Data sources */}
      <div className="text-xs text-muted-foreground pt-4 border-t">
        <span className="font-medium">{language === 'sv' ? 'Datakällor: ' : 'Data sources: '}</span>
        {Array.from(new Set(RISK_INDICATORS.flatMap(r => r.data_sources))).join(', ')}
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function ConflictRiskLayer({ language = 'en', onNavigate }: ConflictRiskLayerProps) {
  const [drillLevel, setDrillLevel] = useState<AllowedDrillLevel>('global');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Shield className="h-4 w-4" />
            <span>{language === 'sv' ? 'Strategiskt lager' : 'Strategic layer'}</span>
          </div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            {CONFLICT_LAYER_HEADER.title[language]}
          </h1>
          <p className="text-lg text-muted-foreground">
            {CONFLICT_LAYER_HEADER.subtitle[language]}
          </p>

          {/* Drill-down selector */}
          <div className="flex items-center gap-3 mt-6">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Select value={drillLevel} onValueChange={(v) => setDrillLevel(v as AllowedDrillLevel)}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DRILL_DOWN_LIMITS.allowed.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">
              {DRILL_DOWN_LIMITS.reason[language]}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* MANDATORY: Ethics banner */}
        <EthicsBanner language={language} />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              {language === 'sv' ? 'Översikt' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="drivers">
              {language === 'sv' ? 'Konfliktdrivare' : 'Conflict drivers'}
            </TabsTrigger>
            <TabsTrigger value="capacity">
              {language === 'sv' ? 'Kapacitet' : 'Capacity'}
            </TabsTrigger>
            <TabsTrigger value="risk">
              {language === 'sv' ? 'Riskmodell' : 'Risk model'}
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'sv' 
                        ? 'Varför konflikter uppstår — datadrivet'
                        : 'Why conflicts arise — data-driven'}
                    </CardTitle>
                    <CardDescription>
                      {language === 'sv'
                        ? 'Strukturella faktorer som historiskt sammanfaller med ökad instabilitet.'
                        : 'Structural factors that historically coincide with increased instability.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="prose prose-slate max-w-none">
                    <p className="text-muted-foreground">
                      {language === 'sv'
                        ? 'Historisk data visar att väpnad konflikt oftast uppstår där flera stressfaktorer sammanfaller över tid. Inga enskilda orsaker, utan kombinationer av ekonomisk stress, institutionell svaghet och säkerhetsdilemman.'
                        : 'Historical data shows that armed conflict most often emerges where multiple stressors coincide over time. No single causes, but combinations of economic stress, institutional weakness, and security dilemmas.'}
                    </p>
                    <Button variant="outline" className="mt-4" onClick={() => onNavigate?.('drivers')}>
                      {language === 'sv' ? 'Se konfliktdrivare' : 'View conflict drivers'}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <LimitationsBox language={language} />
            </div>

            {/* Key insight */}
            <Card className="border-slate-300 bg-slate-50">
              <CardContent className="py-6">
                <p className="text-center text-lg text-slate-700 italic">
                  {language === 'sv'
                    ? '"Data indikerar att ett litet antal stater upprätthåller en oproportionerligt stor andel av global militär kapacitet, särskilt inom logistik, flygmakt och marin räckvidd."'
                    : '"Data indicates that a small number of states maintain a disproportionate share of global military capacity, particularly in logistics, air power, and naval reach."'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DRIVERS TAB */}
          <TabsContent value="drivers">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CONFLICT_DRIVERS.map((driver) => (
                <motion.div
                  key={driver.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <DriverCard driver={driver} language={language} />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* CAPACITY TAB */}
          <TabsContent value="capacity">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {language === 'sv' ? 'Relativa kapacitetsnivåer' : 'Relative capacity levels'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'sv'
                      ? 'Indexerade värden mot globalt genomsnitt. Visar bredd, inte djup.'
                      : 'Indexed values against global average. Shows breadth, not depth.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CapacityDisplay language={language} />
                </CardContent>
              </Card>
              <LimitationsBox language={language} />
            </div>
          </TabsContent>

          {/* RISK TAB */}
          <TabsContent value="risk">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'sv' ? 'Justerbar riskmodell' : 'Adjustable risk model'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'sv'
                      ? 'Viktning av stressfaktorer för känslighetsanalys. Inga prognoser.'
                      : 'Weighting of stress factors for sensitivity analysis. No predictions.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RiskIndicatorPanel language={language} />
                </CardContent>
              </Card>
              <LimitationsBox language={language} />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-slate-50 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
            {CONFLICT_LAYER_FOOTER.disclaimer[language]}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default ConflictRiskLayer;
