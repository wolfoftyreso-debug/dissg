/**
 * 📚 SOURCE TRANSPARENCY PANEL
 * 
 * MASTER EXECUTION BLOCK 40 — Source Registry UI
 * 
 * Features:
 * - View sources as list, timeline, or per data point
 * - Show methodology, limitations, coverage
 * - Cross-source validation display
 * - Version history
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Calendar, ExternalLink, Info, AlertTriangle,
  CheckCircle, FileText, List, Grid, ChevronDown,
  Shield, Archive
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DOMAIN_SOURCES,
  SOURCE_UI_TEXT,
  CROSS_SOURCE_VALIDATION,
  VERSIONING_RULES,
  type HistoricalSource,
  type DomainCategory,
  type SourceMethodology,
} from '@/config/historicalSourcesConfig';

// ============================================================
// TYPES
// ============================================================

type Language = 'sv' | 'en';
type ViewMode = 'list' | 'timeline' | 'datapoint';

interface SourceTransparencyPanelProps {
  language?: Language;
  domain?: DomainCategory;
  indicator_id?: string;
  show_all_domains?: boolean;
}

// ============================================================
// HELPERS
// ============================================================

function getMethodologyBadge(method: SourceMethodology, language: Language): { label: string; variant: 'default' | 'secondary' | 'outline' } {
  const labels: Record<SourceMethodology, { sv: string; en: string }> = {
    observation: { sv: 'Observation', en: 'Observation' },
    survey: { sv: 'Undersökning', en: 'Survey' },
    estimate: { sv: 'Estimat', en: 'Estimate' },
    reconstruction: { sv: 'Rekonstruktion', en: 'Reconstruction' },
    proxy: { sv: 'Proxy', en: 'Proxy' },
    compilation: { sv: 'Sammanställning', en: 'Compilation' },
  };
  
  const variants: Record<SourceMethodology, 'default' | 'secondary' | 'outline'> = {
    observation: 'default',
    survey: 'default',
    estimate: 'secondary',
    reconstruction: 'outline',
    proxy: 'outline',
    compilation: 'secondary',
  };

  return { label: labels[method][language], variant: variants[method] };
}

function getLicenseBadge(license: string): { color: string; icon: React.ElementType } {
  const config: Record<string, { color: string; icon: React.ElementType }> = {
    open: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
    attribution: { color: 'bg-blue-100 text-blue-700', icon: FileText },
    non_commercial: { color: 'bg-amber-100 text-amber-700', icon: Shield },
    restricted: { color: 'bg-slate-100 text-slate-600', icon: AlertTriangle },
  };
  return config[license] || config.restricted;
}

function getDomainLabel(domain: DomainCategory, language: Language): string {
  const labels: Record<DomainCategory, { sv: string; en: string }> = {
    economy: { sv: 'Ekonomi', en: 'Economy' },
    labor_productivity: { sv: 'Arbete & produktivitet', en: 'Labor & productivity' },
    energy_resources: { sv: 'Energi & resurser', en: 'Energy & resources' },
    health_demography: { sv: 'Hälsa & demografi', en: 'Health & demography' },
    education: { sv: 'Utbildning', en: 'Education' },
    institutions: { sv: 'Institutioner', en: 'Institutions' },
    conflict: { sv: 'Konflikt', en: 'Conflict' },
  };
  return labels[domain][language];
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

/** Single source card */
function SourceCard({ source, language }: { source: HistoricalSource; language: Language }) {
  const [isOpen, setIsOpen] = useState(false);
  const methodBadge = getMethodologyBadge(source.methodology, language);
  const licenseBadge = getLicenseBadge(source.license);
  const LicenseIcon = licenseBadge.icon;

  return (
    <Card className={`transition-all ${source.deprecated ? 'opacity-60 border-dashed' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium">{source.title}</CardTitle>
              {source.is_primary && (
                <Badge variant="outline" className="text-xs">
                  {language === 'sv' ? 'Primär' : 'Primary'}
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs">{source.publisher}</CardDescription>
          </div>
          <Badge variant={methodBadge.variant} className="text-xs shrink-0">
            {methodBadge.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Coverage & version */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {source.coverage_years.start}–{source.coverage_years.end}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Archive className="h-3 w-3" />
            v{source.version}
          </span>
          <span className={`flex items-center gap-1 px-1.5 rounded ${licenseBadge.color}`}>
            <LicenseIcon className="h-3 w-3" />
            {source.license}
          </span>
        </div>

        {/* Deprecated warning */}
        {source.deprecated && (
          <Alert className="bg-amber-50 border-amber-200 py-2">
            <AlertTriangle className="h-3 w-3 text-amber-600" />
            <AlertDescription className="text-xs text-amber-700">
              {source.deprecation_reason || (language === 'sv' ? 'Källa ersatt' : 'Source deprecated')}
            </AlertDescription>
          </Alert>
        )}

        {/* Expandable details */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between text-xs">
              {language === 'sv' ? 'Visa detaljer' : 'Show details'}
              <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-3">
            {/* Limitations */}
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {SOURCE_UI_TEXT.limitations[language]}:
              </p>
              <ul className="text-xs text-slate-600 space-y-1">
                {source.known_limitations.map((lim, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="w-1 h-1 bg-slate-400 rounded-full mt-1.5 shrink-0" />
                    {lim}
                  </li>
                ))}
              </ul>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">{SOURCE_UI_TEXT.last_verified[language]}:</span>
                <p className="font-medium">{source.last_verified}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{SOURCE_UI_TEXT.coverage[language]}:</span>
                <p className="font-medium capitalize">{source.geographic_scope}</p>
              </div>
            </div>

            {/* External link */}
            {source.url && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                {language === 'sv' ? 'Öppna källa' : 'Open source'}
              </a>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

/** Timeline view of sources */
function SourceTimeline({ sources }: { sources: HistoricalSource[]; language?: Language }) {
  const sortedSources = [...sources].sort((a, b) => a.coverage_years.start - b.coverage_years.start);
  
  const minYear = Math.min(...sources.map(s => s.coverage_years.start));
  const maxYear = Math.max(...sources.map(s => s.coverage_years.end));
  const range = maxYear - minYear;

  return (
    <div className="space-y-4">
      {/* Timeline axis */}
      <div className="relative h-8">
        <div className="absolute inset-x-0 top-1/2 h-1 bg-slate-200 rounded-full" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{minYear}</span>
          <span>{maxYear}</span>
        </div>
      </div>

      {/* Source bars */}
      <div className="space-y-2">
        {sortedSources.map((source, index) => {
          const startPercent = ((source.coverage_years.start - minYear) / range) * 100;
          const widthPercent = ((source.coverage_years.end - source.coverage_years.start) / range) * 100;
          
          return (
            <TooltipProvider key={source.source_id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative h-6"
                  >
                    <div
                      className="absolute h-full rounded bg-primary/20 hover:bg-primary/30 transition-colors cursor-pointer"
                      style={{
                        left: `${startPercent}%`,
                        width: `${Math.max(widthPercent, 2)}%`,
                      }}
                    >
                      <span className="absolute inset-0 flex items-center px-2 text-xs font-medium text-primary truncate">
                        {source.title.split(' ').slice(0, 2).join(' ')}
                      </span>
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="font-medium">{source.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {source.coverage_years.start}–{source.coverage_years.end}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}

/** Cross-source validation notice */
function CrossSourceNotice({ count, language }: { count: number; language: Language }) {
  if (count < 2) return null;

  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-sm text-blue-700">
        {CROSS_SOURCE_VALIDATION.disclaimer[language].replace('Three', String(count))}
      </AlertDescription>
    </Alert>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function SourceTransparencyPanel({
  language = 'en',
  domain,
  show_all_domains = false,
}: SourceTransparencyPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Get sources
  const sources = useMemo(() => {
    if (show_all_domains) {
      return Object.values(DOMAIN_SOURCES).flat();
    }
    if (domain) {
      return DOMAIN_SOURCES[domain] || [];
    }
    return [];
  }, [domain, show_all_domains]);

  // Group by domain for display
  const groupedSources = useMemo(() => {
    if (!show_all_domains && domain) {
      return { [domain]: sources };
    }
    return Object.entries(DOMAIN_SOURCES).reduce((acc, [key, srcs]) => {
      acc[key as DomainCategory] = srcs;
      return acc;
    }, {} as Record<DomainCategory, HistoricalSource[]>);
  }, [sources, domain, show_all_domains]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            {SOURCE_UI_TEXT.source_list[language]}
          </h2>
          <p className="text-muted-foreground mt-1">
            {sources.length} {language === 'sv' ? 'registrerade källor' : 'registered sources'}
          </p>
        </div>
      </div>

      {/* View mode tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="list" className="flex items-center gap-1">
            <List className="h-4 w-4" />
            {SOURCE_UI_TEXT.source_list[language]}
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {SOURCE_UI_TEXT.source_timeline[language]}
          </TabsTrigger>
          <TabsTrigger value="datapoint" className="flex items-center gap-1">
            <Grid className="h-4 w-4" />
            {SOURCE_UI_TEXT.per_datapoint[language]}
          </TabsTrigger>
        </TabsList>

        {/* List view */}
        <TabsContent value="list" className="space-y-6 mt-6">
          {Object.entries(groupedSources).map(([domainKey, domainSources]) => (
            <div key={domainKey}>
              <h3 className="text-lg font-medium mb-3">
                {getDomainLabel(domainKey as DomainCategory, language)}
              </h3>
              <CrossSourceNotice count={domainSources.length} language={language} />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                {domainSources.map((source, index) => (
                  <motion.div
                    key={source.source_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <SourceCard source={source} language={language} />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Timeline view */}
        <TabsContent value="timeline" className="space-y-6 mt-6">
          {Object.entries(groupedSources).map(([domainKey, domainSources]) => (
            <Card key={domainKey}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {getDomainLabel(domainKey as DomainCategory, language)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SourceTimeline sources={domainSources} language={language} />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Per-datapoint view placeholder */}
        <TabsContent value="datapoint" className="mt-6">
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="py-8 text-center">
              <Info className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {language === 'sv'
                  ? 'Välj en specifik indikator för att se källan per datapunkt.'
                  : 'Select a specific indicator to see the source per data point.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Version disclaimer */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="py-4 text-center">
          <p className="text-sm text-slate-600 italic">
            "{VERSIONING_RULES.principle[language]}"
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default SourceTransparencyPanel;
