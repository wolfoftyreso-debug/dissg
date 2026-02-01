import { useState, useMemo } from 'react';
import { Users, Building2, Target, AlertTriangle, ChevronDown, ChevronRight, TrendingDown, TrendingUp, Minus, Shield, Award, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { KPI, CATEGORIES } from '@/types/kpi';
import { cn } from '@/lib/utils';

interface ResponsibilityPanelProps {
  kpis: KPI[];
}

interface Department {
  id: string;
  name: string;
  minister: string;
  role: string;
  kpiIds: string[];
  description: string;
  contact?: string;
  priority: 'high' | 'medium' | 'low';
}

const DEPARTMENTS: Department[] = [
  {
    id: 'finansdepartementet',
    name: 'Finansdepartementet',
    minister: 'Elisabeth Svantesson',
    role: 'Finansminister',
    kpiIds: ['fd9918a5-ae65-4375-98dd-a3cab51390dc', '6fc7b55d-2ab9-4b3f-9378-c8dcdff3bb8c', 'bb3001d3-b351-40b2-87b0-4b05af61310f'],
    description: 'Ansvarar för ekonomisk politik, skatter och statsbudget',
    priority: 'high',
  },
  {
    id: 'arbetsmarknadsdepartementet',
    name: 'Arbetsmarknadsdepartementet',
    minister: 'Johan Pehrson',
    role: 'Arbetsmarknadsminister',
    kpiIds: ['9a6ef79a-a719-4133-be03-76bdc4bccf0a', 'f6718a4b-5f81-4f7d-8b81-c9382d167cf3', '9061350b-be73-4e50-a2cb-e36d07c6f764'],
    description: 'Ansvarar för arbetsmarknad, arbetslöshet och integration',
    priority: 'high',
  },
  {
    id: 'justitiedepartementet',
    name: 'Justitiedepartementet',
    minister: 'Gunnar Strömmer',
    role: 'Justitieminister',
    kpiIds: ['5987e149-c730-4e07-9c66-61533eeaacd7', 'e03641b6-e183-4af7-a330-b0eb1a5abc4f', 'ebe5e4a7-f507-4f72-9c1e-517582e50af1'],
    description: 'Ansvarar för rättsväsende, brottsbekämpning och migration',
    priority: 'high',
  },
  {
    id: 'socialdepartementet',
    name: 'Socialdepartementet',
    minister: 'Jakob Forssmed',
    role: 'Socialminister',
    kpiIds: ['d6788eb6-ccff-4112-8967-37330aaa158b', '2746ac6d-e3d8-455c-8635-0af8e416af7c', '47a0800c-a5eb-42dc-9790-2d7d5d581dbf', 'ffa4018d-6861-4c84-9782-a6057c0c2342'],
    description: 'Ansvarar för hälso- och sjukvård, socialförsäkring och folkhälsa',
    priority: 'medium',
  },
  {
    id: 'utbildningsdepartementet',
    name: 'Utbildningsdepartementet',
    minister: 'Lotta Edholm',
    role: 'Skolminister',
    kpiIds: ['62983e23-343f-4dc5-951d-9b3799c4f70c'],
    description: 'Ansvarar för utbildning, forskning och skola',
    priority: 'medium',
  },
  {
    id: 'klimatdepartementet',
    name: 'Klimat- och näringslivsdepartementet',
    minister: 'Ebba Busch',
    role: 'Energi- och näringsminister',
    kpiIds: ['c063a645-b198-4f9b-9f70-bbebe736dff4', '362ddb45-91ff-4427-856b-39b40b5cb131', 'b6b35c35-c639-44b1-8355-52755b5446ef'],
    description: 'Ansvarar för näringsliv, energi och bostäder',
    priority: 'medium',
  },
  {
    id: 'statsradsberedningen',
    name: 'Statsrådsberedningen',
    minister: 'Ulf Kristersson',
    role: 'Statsminister',
    kpiIds: ['b0c0e05b-00da-4a89-8f74-c1792bf6b34f', 'b4506f87-b18b-4367-823d-fd2cd2b3e543', 'b6b13cba-542d-47c6-a85a-ea56c91d1c39'],
    description: 'Koordinerar regeringsarbetet och systemövergripande frågor',
    priority: 'high',
  },
];

interface EscalationLevel {
  level: number;
  name: string;
  description: string;
  criteria: string;
  action: string;
}

const ESCALATION_LEVELS: EscalationLevel[] = [
  {
    level: 1,
    name: 'Operativ nivå',
    description: 'Tjänstemannanivå',
    criteria: 'KPI avviker < 5% från mål',
    action: 'Analys och åtgärdsförslag inom 2 veckor',
  },
  {
    level: 2,
    name: 'Departementsnivå',
    description: 'Statssekreterare',
    criteria: 'KPI avviker 5-10% eller trend > 3 månader',
    action: 'Åtgärdsplan presenteras inom 1 vecka',
  },
  {
    level: 3,
    name: 'Ministernivå',
    description: 'Ansvarigt statsråd',
    criteria: 'KPI kritisk status eller trend > 6 månader',
    action: 'Handlingsplan och resurstilldelning',
  },
  {
    level: 4,
    name: 'Regeringsnivå',
    description: 'Statsministern',
    criteria: 'Systemisk risk eller multipla kritiska KPI:er',
    action: 'Regeringsbeslut och samordnad insats',
  },
];

export function ResponsibilityPanel({ kpis }: ResponsibilityPanelProps) {
  const [expandedDept, setExpandedDept] = useState<string | null>('finansdepartementet');
  const [activeView, setActiveView] = useState<'departments' | 'matrix' | 'escalation'>('departments');

  const getDepartmentStats = (dept: Department) => {
    const deptKPIs = kpis.filter(k => dept.kpiIds.includes(k.id));
    const critical = deptKPIs.filter(k => k.status === 'critical').length;
    const warning = deptKPIs.filter(k => k.status === 'warning').length;
    const positive = deptKPIs.filter(k => k.status === 'positive').length;
    const avgConfidence = deptKPIs.length > 0 
      ? Math.round(deptKPIs.reduce((acc, k) => acc + k.confidence, 0) / deptKPIs.length)
      : 0;
    
    return { critical, warning, positive, total: deptKPIs.length, avgConfidence, kpis: deptKPIs };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4" />;
      case 'down': return <TrendingDown className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const getOverallScore = (dept: Department) => {
    const stats = getDepartmentStats(dept);
    if (stats.total === 0) return 0;
    return Math.round(((stats.positive * 100) + (stats.warning * 50)) / stats.total);
  };

  const getEscalationLevel = (dept: Department) => {
    const stats = getDepartmentStats(dept);
    if (stats.critical >= 2 || stats.total >= 3 && stats.critical >= 1 && stats.warning >= 1) return 4;
    if (stats.critical >= 1) return 3;
    if (stats.warning >= 2) return 2;
    if (stats.warning >= 1) return 1;
    return 0;
  };

  // Calculate total stats
  const totalStats = useMemo(() => {
    const critical = kpis.filter(k => k.status === 'critical').length;
    const warning = kpis.filter(k => k.status === 'warning').length;
    const positive = kpis.filter(k => k.status === 'positive').length;
    const deptsWithCritical = DEPARTMENTS.filter(d => getDepartmentStats(d).critical > 0).length;
    
    return { critical, warning, positive, deptsWithCritical };
  }, [kpis]);

  // Sorted departments by severity
  const sortedDepartments = useMemo(() => {
    return [...DEPARTMENTS].sort((a, b) => {
      const aStats = getDepartmentStats(a);
      const bStats = getDepartmentStats(b);
      // Sort by critical first, then warning
      if (aStats.critical !== bStats.critical) return bStats.critical - aStats.critical;
      if (aStats.warning !== bStats.warning) return bStats.warning - aStats.warning;
      return 0;
    });
  }, [kpis]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Ansvarsfördelning
          </h2>
          <p className="text-muted-foreground mt-1">
            Departementens ansvar för respektive nyckeltal
          </p>
        </div>
        
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as typeof activeView)}>
          <TabsList>
            <TabsTrigger value="departments">Departement</TabsTrigger>
            <TabsTrigger value="matrix">Matris</TabsTrigger>
            <TabsTrigger value="escalation">Eskalering</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className={cn(totalStats.critical > 0 && "border-red-200 dark:border-red-800")}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kritiska KPI:er</p>
                <p className="text-2xl font-bold text-red-600">{totalStats.critical}</p>
              </div>
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Departement m. kritiska</p>
                <p className="text-2xl font-bold text-amber-600">{totalStats.deptsWithCritical}</p>
              </div>
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <Building2 className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Under observation</p>
                <p className="text-2xl font-bold">{totalStats.warning}</p>
              </div>
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Positiv utveckling</p>
                <p className="text-2xl font-bold text-emerald-600">{totalStats.positive}</p>
              </div>
              <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <Award className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Principen */}
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Ansvarsprincipen</p>
              <p className="text-sm text-muted-foreground">
                Varje KPI har en primär ansvarig enhet. När ett nyckeltal försämras utan 
                registrerade åtgärder, synliggörs detta automatiskt i ansvarsspegeln. 
                Eskalering sker automatiskt baserat på allvarlighetsgrad.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {activeView === 'departments' && (
        /* Department View */
        <div className="space-y-4">
          {sortedDepartments.map((dept) => {
            const stats = getDepartmentStats(dept);
            const score = getOverallScore(dept);
            const escalationLevel = getEscalationLevel(dept);
            const isExpanded = expandedDept === dept.id;
            
            return (
              <Card key={dept.id} className={cn(
                "transition-all",
                stats.critical > 0 && "border-red-200 bg-red-50/30 dark:border-red-800 dark:bg-red-950/10"
              )}>
                <Collapsible open={isExpanded} onOpenChange={() => setExpandedDept(isExpanded ? null : dept.id)}>
                  <CollapsibleTrigger className="w-full">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            stats.critical > 0 ? "bg-red-100 dark:bg-red-900/30" : "bg-primary/10"
                          )}>
                            <Building2 className={cn(
                              "h-5 w-5",
                              stats.critical > 0 ? "text-red-600" : "text-primary"
                            )} />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold">{dept.name}</h3>
                            <p className="text-sm text-muted-foreground">{dept.minister} • {dept.role}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {escalationLevel > 0 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      "gap-1",
                                      escalationLevel >= 3 && "text-red-600 border-red-300",
                                      escalationLevel === 2 && "text-amber-600 border-amber-300",
                                      escalationLevel === 1 && "text-blue-600 border-blue-300"
                                    )}
                                  >
                                    <Shield className="h-3 w-3" />
                                    Nivå {escalationLevel}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{ESCALATION_LEVELS[escalationLevel - 1]?.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          
                          <div className="flex items-center gap-2">
                            {stats.critical > 0 && (
                              <Badge variant="destructive" className="gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {stats.critical}
                              </Badge>
                            )}
                            {stats.warning > 0 && (
                              <Badge variant="outline" className="text-amber-600 border-amber-300">
                                {stats.warning} varning
                              </Badge>
                            )}
                            <Badge variant="outline">
                              {stats.total} KPI:er
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 w-24">
                            <Progress value={score} className="h-2" />
                            <span className="text-sm font-mono">{score}%</span>
                          </div>
                          
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-4">
                      <div className="border-t pt-4 mt-2">
                        <p className="text-sm text-muted-foreground mb-4">{dept.description}</p>
                        
                        <div className="space-y-2">
                          {stats.kpis.map((kpi) => (
                            <div 
                              key={kpi.id}
                              className={cn(
                                "flex items-center justify-between p-3 rounded-lg",
                                kpi.status === 'critical' ? "bg-red-50 dark:bg-red-950/20" :
                                kpi.status === 'warning' ? "bg-amber-50 dark:bg-amber-950/20" : "bg-muted/50"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-2 h-2 rounded-full",
                                  kpi.status === 'positive' && 'bg-emerald-500',
                                  kpi.status === 'warning' && 'bg-amber-500',
                                  kpi.status === 'critical' && 'bg-red-500',
                                  kpi.status === 'neutral' && 'bg-muted-foreground'
                                )} />
                                <div>
                                  <p className="font-medium text-sm">{kpi.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {kpi.value.toLocaleString('sv-SE')} {kpi.unit}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <div className={cn(
                                  "flex items-center gap-1 text-sm",
                                  kpi.trend === 'up' && (kpi.inverted ? 'text-red-600' : 'text-emerald-600'),
                                  kpi.trend === 'down' && (kpi.inverted ? 'text-emerald-600' : 'text-red-600'),
                                  kpi.trend === 'stable' && 'text-muted-foreground'
                                )}>
                                  {getTrendIcon(kpi.trend)}
                                  {kpi.trendPercent > 0 && '+'}{kpi.trendPercent.toFixed(1)}%
                                </div>
                                
                                <Badge variant="outline" className="text-xs">
                                  {kpi.confidence}% konfidens
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      )}

      {activeView === 'matrix' && (
        /* Matrix View */
        <Card>
          <CardContent className="pt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Departement</th>
                  {CATEGORIES.map(cat => (
                    <th key={cat.id} className="text-center py-2 px-2 min-w-[80px]">
                      <div className="text-xs font-medium">{cat.code}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[80px]">
                        {cat.name.split(' ')[0]}
                      </div>
                    </th>
                  ))}
                  <th className="text-center py-2 px-2">Totalt</th>
                </tr>
              </thead>
              <tbody>
                {sortedDepartments.map((dept) => {
                  const deptStats = getDepartmentStats(dept);
                  return (
                    <tr key={dept.id} className={cn(
                      "border-b hover:bg-muted/50",
                      deptStats.critical > 0 && "bg-red-50/30 dark:bg-red-950/10"
                    )}>
                      <td className="py-3 px-3">
                        <div className="font-medium">{dept.name.replace('departementet', '.')}</div>
                        <div className="text-xs text-muted-foreground">{dept.minister}</div>
                      </td>
                      {CATEGORIES.map(cat => {
                        const deptKPIsInCategory = kpis.filter(
                          k => dept.kpiIds.includes(k.id) && k.category === cat.id
                        );
                        const hasKPIs = deptKPIsInCategory.length > 0;
                        const hasCritical = deptKPIsInCategory.some(k => k.status === 'critical');
                        const hasWarning = deptKPIsInCategory.some(k => k.status === 'warning');
                        
                        return (
                          <td key={cat.id} className="text-center py-3 px-2">
                            {hasKPIs ? (
                              <div className={cn(
                                "inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium",
                                hasCritical && "bg-red-100 text-red-700 dark:bg-red-900/30",
                                !hasCritical && hasWarning && "bg-amber-100 text-amber-700 dark:bg-amber-900/30",
                                !hasCritical && !hasWarning && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30"
                              )}>
                                {deptKPIsInCategory.length}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">–</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="text-center py-3 px-2">
                        <Badge variant="outline">{deptStats.total}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {activeView === 'escalation' && (
        /* Escalation View */
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Eskaleringsnivåer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ESCALATION_LEVELS.map((level) => (
                  <div 
                    key={level.level} 
                    className={cn(
                      "p-4 rounded-lg border",
                      level.level === 4 && "border-red-200 bg-red-50/30 dark:border-red-800 dark:bg-red-950/10",
                      level.level === 3 && "border-amber-200 bg-amber-50/30 dark:border-amber-800 dark:bg-amber-950/10",
                      level.level === 2 && "border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-950/10",
                      level.level === 1 && "border-muted"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline"
                          className={cn(
                            level.level === 4 && "text-red-600 border-red-300",
                            level.level === 3 && "text-amber-600 border-amber-300",
                            level.level === 2 && "text-blue-600 border-blue-300"
                          )}
                        >
                          Nivå {level.level}
                        </Badge>
                        <span className="font-medium">{level.name}</span>
                        <span className="text-sm text-muted-foreground">({level.description})</span>
                      </div>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Kriterier: </span>
                        <span>{level.criteria}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Åtgärd: </span>
                        <span>{level.action}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aktuell eskaleringsstatus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedDepartments
                  .filter(d => getEscalationLevel(d) > 0)
                  .map((dept) => {
                    const level = getEscalationLevel(dept);
                    const stats = getDepartmentStats(dept);
                    return (
                      <div 
                        key={dept.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="outline"
                            className={cn(
                              level >= 3 && "text-red-600 border-red-300",
                              level === 2 && "text-amber-600 border-amber-300",
                              level === 1 && "text-blue-600 border-blue-300"
                            )}
                          >
                            Nivå {level}
                          </Badge>
                          <div>
                            <p className="font-medium">{dept.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {stats.critical} kritiska, {stats.warning} varning
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {ESCALATION_LEVELS[level - 1]?.action}
                        </div>
                      </div>
                    );
                  })}
                {sortedDepartments.filter(d => getEscalationLevel(d) > 0).length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Inga aktiva eskaleringar just nu
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
