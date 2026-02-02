/**
 * ⚖️ RISK INDICATOR PANEL
 * 
 * MASTER EXECUTION BLOCK 38 — Safe-by-Design UI
 * 
 * Displays the 8 structural risk domains with:
 * - User-adjustable weights
 * - Sensitivity analysis
 * - Mandatory disclaimers
 * - Anti-misuse constraints
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Landmark, Users, Fuel, Heart, Shield, CloudLightning,
  Newspaper, Info, AlertTriangle, ChevronDown, ChevronUp,
  HelpCircle, Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  RISK_DOMAINS,
  RISK_INDEX_CONFIG,
  RISK_PRINCIPLES,
  RISK_UI_TEXT,
  type RiskDomain,
} from '@/config/riskIndicatorConfig';

// ============================================================
// TYPES
// ============================================================

type Language = 'sv' | 'en';

interface DomainState {
  enabled: boolean;
  weight: number;
  value: number; // Simulated current value 0-100
}

interface RiskIndicatorPanelProps {
  language?: Language;
  initialValues?: Record<string, number>;
  onStateChange?: (state: Record<string, DomainState>) => void;
}

// ============================================================
// ICON MAPPING
// ============================================================

const DOMAIN_ICONS: Record<string, React.ElementType> = {
  economic_stress: TrendingUp,
  institutional_capacity: Landmark,
  demographic_imbalance: Users,
  resource_dependency: Fuel,
  social_fragmentation: Heart,
  security_dynamics: Shield,
  external_shocks: CloudLightning,
  legitimacy_stress: Newspaper,
};

// ============================================================
// SAFE COLOR SCALE (No alarming red)
// ============================================================

function getRiskColor(value: number): string {
  if (value < 33) return 'bg-emerald-100 text-emerald-700';
  if (value < 66) return 'bg-amber-100 text-amber-700';
  return 'bg-slate-200 text-slate-700'; // Muted, not alarming
}

function getRiskBarColor(value: number): string {
  if (value < 33) return 'bg-emerald-400';
  if (value < 66) return 'bg-amber-400';
  return 'bg-slate-400'; // Muted, not red
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

/** Mandatory disclaimer banner */
function MandatoryDisclaimer({ language }: { language: Language }) {
  return (
    <Alert className="bg-slate-50 border-slate-200 mb-6">
      <Info className="h-4 w-4 text-slate-600" />
      <AlertDescription className="text-slate-600 text-sm">
        {RISK_INDEX_CONFIG.mandatory_disclaimer[language]}
      </AlertDescription>
    </Alert>
  );
}

/** Single domain card with controls */
function DomainCard({
  domain,
  state,
  language,
  onToggle,
  onWeightChange,
}: {
  domain: RiskDomain;
  state: DomainState;
  language: Language;
  onToggle: () => void;
  onWeightChange: (value: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const IconComponent = DOMAIN_ICONS[domain.id] || Info;

  return (
    <Card className={`transition-all duration-200 ${!state.enabled ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRiskColor(state.value)}`}>
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">{domain.name[language]}</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {domain.description[language]}
              </CardDescription>
            </div>
          </div>
          <Switch checked={state.enabled} onCheckedChange={onToggle} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Value bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{language === 'sv' ? 'Aktuellt värde' : 'Current value'}</span>
            <span>{Math.round(state.value)}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${getRiskBarColor(state.value)}`}
              style={{ width: `${state.value}%` }}
            />
          </div>
        </div>

        {/* Weight slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{language === 'sv' ? 'Viktning' : 'Weight'}</span>
            <span>{state.weight}%</span>
          </div>
          <Slider
            value={[state.weight]}
            onValueChange={(v) => onWeightChange(v[0])}
            min={0}
            max={100}
            step={5}
            disabled={!state.enabled}
            className="w-full"
          />
        </div>

        {/* Expandable details */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between text-xs">
              {language === 'sv' ? 'Visa detaljer' : 'Show details'}
              {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-3">
            {/* Interpretation */}
            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600">
              <p className="font-medium mb-1">{language === 'sv' ? 'Tolkning:' : 'Interpretation:'}</p>
              <p className="italic">{domain.interpretation[language]}</p>
            </div>
            
            {/* What this does NOT mean */}
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-700">
              <p className="font-medium mb-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {language === 'sv' ? 'Vad detta INTE betyder:' : 'What this does NOT mean:'}
              </p>
              <p>{domain.what_this_does_not_mean[language]}</p>
            </div>

            {/* Indicators list */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                {language === 'sv' ? 'Indikatorer:' : 'Indicators:'}
              </p>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {domain.indicators.map((ind) => (
                  <li key={ind.id} className="flex items-center gap-1">
                    <span className="w-1 h-1 bg-slate-400 rounded-full" />
                    {ind.name[language]}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p>{ind.description[language]}</p>
                          <p className="text-xs mt-1 text-muted-foreground">
                            {language === 'sv' ? 'Källor:' : 'Sources:'} {ind.sources.join(', ')}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                ))}
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

/** Composite risk index display */
function CompositeRiskIndex({
  domainStates,
  language,
}: {
  domainStates: Record<string, DomainState>;
  language: Language;
}) {
  // Calculate weighted composite index
  const { totalRisk, topDrivers } = useMemo(() => {
    let totalWeight = 0;
    let weightedSum = 0;
    const contributions: { domain: RiskDomain; contribution: number }[] = [];

    RISK_DOMAINS.forEach((domain) => {
      const state = domainStates[domain.id];
      if (state?.enabled) {
        const contribution = (state.value * state.weight) / 100;
        weightedSum += contribution;
        totalWeight += state.weight;
        contributions.push({ domain, contribution });
      }
    });

    const totalRisk = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
    const topDrivers = contributions
      .sort((a, b) => b.contribution - a.contribution)
      .slice(0, 3);

    return { totalRisk, topDrivers };
  }, [domainStates]);

  return (
    <Card className="bg-slate-50 border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {language === 'sv' ? 'Sammansatt riskindex' : 'Composite risk index'}
          <Badge variant="outline" className="ml-auto">
            {language === 'sv' ? 'Strukturellt' : 'Structural'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main gauge */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-4xl font-semibold text-slate-700">
              {Math.round(totalRisk)}
            </span>
            <span className="text-sm text-muted-foreground">/ 100</span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getRiskBarColor(totalRisk)}`}
              style={{ width: `${totalRisk}%` }}
            />
          </div>
        </div>

        {/* Top drivers */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            {RISK_UI_TEXT.what_drives_label[language]}:
          </p>
          {topDrivers.map(({ domain, contribution }) => {
            const IconComponent = DOMAIN_ICONS[domain.id] || Info;
            return (
              <div key={domain.id} className="flex items-center gap-2 text-sm">
                <IconComponent className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1">{domain.name[language]}</span>
                <span className="text-muted-foreground">
                  {Math.round(contribution)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mandatory sensitivity note */}
        <p className="text-xs text-muted-foreground italic border-t border-slate-200 pt-3">
          {language === 'sv'
            ? 'Denna modell illustrerar känslighet, inte utfall.'
            : 'This model illustrates sensitivity, not outcomes.'}
        </p>
      </CardContent>
    </Card>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function RiskIndicatorPanel({
  language = 'en',
  initialValues,
  onStateChange,
}: RiskIndicatorPanelProps) {
  // Initialize domain states with defaults or provided values
  const [domainStates, setDomainStates] = useState<Record<string, DomainState>>(() => {
    const states: Record<string, DomainState> = {};
    RISK_DOMAINS.forEach((domain) => {
      states[domain.id] = {
        enabled: true,
        weight: domain.default_weight,
        value: initialValues?.[domain.id] ?? Math.random() * 60 + 20, // Mock data
      };
    });
    return states;
  });

  const handleToggle = (domainId: string) => {
    setDomainStates((prev) => {
      const newState = {
        ...prev,
        [domainId]: { ...prev[domainId], enabled: !prev[domainId].enabled },
      };
      onStateChange?.(newState);
      return newState;
    });
  };

  const handleWeightChange = (domainId: string, weight: number) => {
    setDomainStates((prev) => {
      const newState = {
        ...prev,
        [domainId]: { ...prev[domainId], weight },
      };
      onStateChange?.(newState);
      return newState;
    });
  };

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            {RISK_UI_TEXT.section_title[language]}
          </h2>
          <p className="text-muted-foreground mt-1">
            {RISK_PRINCIPLES.mandatory_statement[language]}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Lock className="h-3 w-3" />
          {language === 'sv' ? 'Icke-operativ' : 'Non-operative'}
        </Badge>
      </div>

      {/* Mandatory disclaimer */}
      <MandatoryDisclaimer language={language} />

      {/* Main layout: Composite index + Domain cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Composite index (sticky on desktop) */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6 space-y-4">
            <CompositeRiskIndex domainStates={domainStates} language={language} />
            
            {/* Data sources */}
            <Card>
              <CardContent className="py-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  {RISK_UI_TEXT.sources_label[language]}:
                </p>
                <div className="flex flex-wrap gap-1">
                  {['SIPRI', 'World Bank', 'IMF', 'UN', 'OECD', 'V-Dem'].map((source) => (
                    <Badge key={source} variant="secondary" className="text-xs">
                      {source}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Domain cards grid */}
        <div className="lg:col-span-2">
          <div className="grid md:grid-cols-2 gap-4">
            {RISK_DOMAINS.map((domain, index) => (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <DomainCard
                  domain={domain}
                  state={domainStates[domain.id]}
                  language={language}
                  onToggle={() => handleToggle(domain.id)}
                  onWeightChange={(w) => handleWeightChange(domain.id, w)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Historical response note */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="py-4">
          <p className="text-sm text-slate-600 italic text-center">
            "{RISK_UI_TEXT.historical_response[language]}"
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default RiskIndicatorPanel;
