/**
 * ANSVARSKARTAN FÖR SVERIGE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Komplett visualisering av:
 * - 14 samhällsområden
 * - 3 mandatnivåer (nationell, regional, kommunal)
 * - Primära KPI:er per område
 * - Aktuella mandatinnehavare
 */

import { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  ChevronDown, 
  ChevronRight,
  Activity,
  Briefcase,
  GraduationCap,
  Shield,
  Landmark,
  Home,
  HeartHandshake,
  Leaf,
  Swords,
  Globe,
  Wallet,
  Factory,
  Palette,
  Wifi,
  
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  RESPONSIBILITY_AREAS, 
  MANDATE_LEVELS,
  type ResponsibilityArea,
  type ResponsibilityLevel 
} from '@/config/responsibilityModel';
import {
  AREA_LABELS,
  LEVEL_LABELS,
  SWEDISH_GOVERNANCE_PERIODS,
  PARTY_COLORS,
  getGovernancePeriodForDate
} from '@/config/responsibilityMatrixConfig';

const AREA_ICONS: Record<ResponsibilityArea, typeof Activity> = {
  halsa: Activity,
  arbete: Briefcase,
  utbildning: GraduationCap,
  trygghet: Shield,
  ekonomi: Landmark,
  infrastruktur: Home,
  integration: HeartHandshake,
  miljo: Leaf,
  forsvar: Swords,
  utrikes: Globe,
  social: Wallet,
  naringsliv: Factory,
  kultur: Palette,
  digitalisering: Wifi,
};

const LEVEL_ICONS: Record<ResponsibilityLevel, typeof Building2> = {
  nationell: Building2,
  regional: MapPin,
  kommunal: Users,
};

interface AreaCardProps {
  area: typeof RESPONSIBILITY_AREAS[0];
  isExpanded: boolean;
  onToggle: () => void;
}

function AreaCard({ area, isExpanded, onToggle }: AreaCardProps) {
  const Icon = AREA_ICONS[area.code] || Activity;
  const areaLabel = AREA_LABELS[area.code as keyof typeof AREA_LABELS];
  const currentPeriod = getGovernancePeriodForDate(new Date(), 'nationell');
  const minister = currentPeriod?.keyMinisters?.find(m => m.area === area.code);

  return (
    <Card className={cn(
      "transition-all",
      isExpanded && "ring-2 ring-primary/20"
    )}>
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger className="w-full text-left">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {areaLabel?.icon} {area.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {area.description}
                  </p>
                </div>
              </div>
              {isExpanded ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {/* Ansvarsnivåer */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Mandatnivåer
              </p>
              <div className="grid gap-2">
                {/* Nationell */}
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nationell</p>
                    <p className="text-xs text-muted-foreground">{area.nationalAuthority}</p>
                  </div>
                  {minister && (
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ borderColor: PARTY_COLORS[minister.party] }}
                    >
                      {minister.name} ({minister.party})
                    </Badge>
                  )}
                </div>

                {/* Regional */}
                {area.regionalAuthority && (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <MapPin className="h-4 w-4 text-amber-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Regional</p>
                      <p className="text-xs text-muted-foreground">{area.regionalAuthority}</p>
                    </div>
                  </div>
                )}

                {/* Kommunal */}
                {area.municipalAuthority && (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <Users className="h-4 w-4 text-emerald-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Kommunal</p>
                      <p className="text-xs text-muted-foreground">{area.municipalAuthority}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Primära KPI:er */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Primära indikatorer
              </p>
              <div className="flex flex-wrap gap-1.5">
                {area.primaryKpiCodes.map(code => (
                  <Badge key={code} variant="secondary" className="text-xs">
                    {code.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sekundära KPI:er */}
            {area.secondaryKpiCodes.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Sekundära indikatorer
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {area.secondaryKpiCodes.map(code => (
                    <Badge key={code} variant="outline" className="text-xs">
                      {code.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Relaterade områden */}
            {area.relatedAreas.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Relaterade områden
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {area.relatedAreas.map(code => {
                    const relatedLabel = AREA_LABELS[code as keyof typeof AREA_LABELS];
                    return (
                      <Badge key={code} variant="outline" className="text-xs gap-1">
                        {relatedLabel?.icon} {relatedLabel?.sv || code}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

function LevelOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {MANDATE_LEVELS.map(level => {
        const Icon = LEVEL_ICONS[level.level];
        const levelLabel = LEVEL_LABELS[level.level];
        const areasAtLevel = RESPONSIBILITY_AREAS.filter(a => {
          if (level.level === 'nationell') return true;
          if (level.level === 'regional') return !!a.regionalAuthority;
          if (level.level === 'kommunal') return !!a.municipalAuthority;
          return false;
        });

        return (
          <Card key={level.level} className="relative overflow-hidden">
            <div className={cn(
              "absolute top-0 left-0 right-0 h-1",
              level.level === 'nationell' && "bg-blue-500",
              level.level === 'regional' && "bg-amber-500",
              level.level === 'kommunal' && "bg-emerald-500"
            )} />
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  level.level === 'nationell' && "bg-blue-100 dark:bg-blue-900/30",
                  level.level === 'regional' && "bg-amber-100 dark:bg-amber-900/30",
                  level.level === 'kommunal' && "bg-emerald-100 dark:bg-emerald-900/30"
                )}>
                  <Icon className={cn(
                    "h-5 w-5",
                    level.level === 'nationell' && "text-blue-600",
                    level.level === 'regional' && "text-amber-600",
                    level.level === 'kommunal' && "text-emerald-600"
                  )} />
                </div>
                <div>
                  <CardTitle className="text-base">{level.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{levelLabel?.sv}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="text-muted-foreground">{level.description}</p>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Högsta position</span>
                  <span className="font-medium">{level.topPosition}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Mandatperiod</span>
                  <span className="font-medium">{level.mandatePeriod}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Ansvarsområden</span>
                  <span className="font-medium">{areasAtLevel.length} st</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function GovernanceTimeline() {
  const currentPeriod = getGovernancePeriodForDate(new Date(), 'nationell');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Building2 className="h-4 w-4" />
        <span>Nuvarande regering:</span>
        <Badge variant="secondary" className="gap-1">
          {currentPeriod?.name}
        </Badge>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-3 pr-4">
          {SWEDISH_GOVERNANCE_PERIODS.map((period, index) => {
            const isCurrent = period.endDate === null;
            const startYear = new Date(period.startDate).getFullYear();
            const endYear = period.endDate ? new Date(period.endDate).getFullYear() : 'nu';

            return (
              <Card 
                key={period.id} 
                className={cn(
                  "relative",
                  isCurrent && "ring-2 ring-primary/30 bg-primary/5"
                )}
              >
                {/* Timeline line */}
                {index < SWEDISH_GOVERNANCE_PERIODS.length - 1 && (
                  <div className="absolute left-6 top-full w-0.5 h-3 bg-border" />
                )}

                <CardContent className="py-3">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-3 h-3 rounded-full ring-2 ring-background"
                        style={{ backgroundColor: PARTY_COLORS[period.parties[0]] }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm">{period.name}</h4>
                        {isCurrent && (
                          <Badge variant="default" className="text-xs">Nuvarande</Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {period.primeMinister} • {startYear}–{endYear}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {period.parties.map(party => (
                          <Badge 
                            key={party} 
                            variant="outline" 
                            className="text-xs"
                            style={{ borderColor: PARTY_COLORS[party], color: PARTY_COLORS[party] }}
                          >
                            {party}
                          </Badge>
                        ))}
                      </div>

                      {period.keyMinisters && period.keyMinisters.length > 0 && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs text-muted-foreground mb-1">Nyckelministrar:</p>
                          <div className="grid grid-cols-2 gap-1">
                            {period.keyMinisters.slice(0, 4).map((minister, idx) => {
                              const areaLabel = AREA_LABELS[minister.area as keyof typeof AREA_LABELS];
                              return (
                                <div key={idx} className="text-xs flex items-center gap-1">
                                  <span>{areaLabel?.icon}</span>
                                  <span className="truncate">{minister.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

function ResponsibilityMatrix() {
  const levels: ResponsibilityLevel[] = ['nationell', 'regional', 'kommunal'];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-3 font-semibold">Område</th>
            {levels.map(level => (
              <th key={level} className="text-center py-2 px-3 font-semibold">
                {LEVEL_LABELS[level]?.sv.split(' ')[0]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RESPONSIBILITY_AREAS.map(area => {
            const areaLabel = AREA_LABELS[area.code as keyof typeof AREA_LABELS];
            return (
              <tr key={area.code} className="border-b hover:bg-muted/50">
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <span>{areaLabel?.icon}</span>
                    <span className="font-medium">{area.name}</span>
                  </div>
                </td>
                <td className="py-2 px-3 text-center">
                  <Badge variant="default" className="text-xs">
                    {area.nationalAuthority.split(' ')[0]}
                  </Badge>
                </td>
                <td className="py-2 px-3 text-center">
                  {area.regionalAuthority ? (
                    <Badge variant="secondary" className="text-xs">
                      ✓
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="py-2 px-3 text-center">
                  {area.municipalAuthority ? (
                    <Badge variant="secondary" className="text-xs">
                      ✓
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function SwedenResponsibilityMap() {
  const [expandedArea, setExpandedArea] = useState<ResponsibilityArea | null>('halsa');
  const [activeTab, setActiveTab] = useState<'areas' | 'levels' | 'timeline' | 'matrix'>('areas');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          Ansvarskartan för Sverige
        </h2>
        <p className="text-muted-foreground mt-1">
          Komplett mappning av samhällsområden, mandat och ansvarsnivåer
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Samhällsområden</p>
                <p className="text-2xl font-bold">{RESPONSIBILITY_AREAS.length}</p>
              </div>
              <div className="p-2 rounded-full bg-primary/10">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mandatnivåer</p>
                <p className="text-2xl font-bold">{MANDATE_LEVELS.length}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Styrperioder</p>
                <p className="text-2xl font-bold">{SWEDISH_GOVERNANCE_PERIODS.length}</p>
              </div>
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <Landmark className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Primära KPI:er</p>
                <p className="text-2xl font-bold">
                  {RESPONSIBILITY_AREAS.reduce((acc, a) => acc + a.primaryKpiCodes.length, 0)}
                </p>
              </div>
              <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="areas">Områden</TabsTrigger>
          <TabsTrigger value="levels">Nivåer</TabsTrigger>
          <TabsTrigger value="timeline">Tidslinje</TabsTrigger>
          <TabsTrigger value="matrix">Matris</TabsTrigger>
        </TabsList>

        <TabsContent value="areas" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {RESPONSIBILITY_AREAS.map(area => (
              <AreaCard
                key={area.code}
                area={area}
                isExpanded={expandedArea === area.code}
                onToggle={() => setExpandedArea(
                  expandedArea === area.code ? null : area.code
                )}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="levels" className="mt-6">
          <LevelOverview />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <GovernanceTimeline />
        </TabsContent>

        <TabsContent value="matrix" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ansvarsmatris</CardTitle>
              <p className="text-sm text-muted-foreground">
                Översikt över vilka nivåer som har mandat inom respektive område
              </p>
            </CardHeader>
            <CardContent>
              <ResponsibilityMatrix />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Principle footer */}
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm">
              <p className="font-medium">Ansvarsprincipen</p>
              <p className="text-muted-foreground">
                Systemet visar vem som bar mandatet – utan att anklaga. Varje beslut 
                och utfall kopplas till ansvarig nivå och aktör via offentliga källor 
                och verifierbara tidslinjer.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
