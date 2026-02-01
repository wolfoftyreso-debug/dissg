import { useState } from 'react';
import { Users, Building2, Target, AlertTriangle, ChevronDown, ChevronRight, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPI, CATEGORIES } from '@/types/kpi';
import { cn } from '@/lib/utils';

interface ResponsibilityPanelProps {
  kpis: KPI[];
}

interface Department {
  id: string;
  name: string;
  minister: string;
  kpiIds: string[];
  description: string;
}

const DEPARTMENTS: Department[] = [
  {
    id: 'finansdepartementet',
    name: 'Finansdepartementet',
    minister: 'Elisabeth Svantesson',
    kpiIds: ['fd9918a5-ae65-4375-98dd-a3cab51390dc', '6fc7b55d-2ab9-4b3f-9378-c8dcdff3bb8c', 'bb3001d3-b351-40b2-87b0-4b05af61310f'],
    description: 'Ansvarar för ekonomisk politik, skatter och statsbudget',
  },
  {
    id: 'arbetsmarknadsdepartementet',
    name: 'Arbetsmarknadsdepartementet',
    minister: 'Johan Pehrson',
    kpiIds: ['9a6ef79a-a719-4133-be03-76bdc4bccf0a', 'f6718a4b-5f81-4f7d-8b81-c9382d167cf3', '9061350b-be73-4e50-a2cb-e36d07c6f764'],
    description: 'Ansvarar för arbetsmarknad, arbetslöshet och integration',
  },
  {
    id: 'justitiedepartementet',
    name: 'Justitiedepartementet',
    minister: 'Gunnar Strömmer',
    kpiIds: ['5987e149-c730-4e07-9c66-61533eeaacd7', 'e03641b6-e183-4af7-a330-b0eb1a5abc4f', 'ebe5e4a7-f507-4f72-9c1e-517582e50af1'],
    description: 'Ansvarar för rättsväsende, brottsbekämpning och migration',
  },
  {
    id: 'socialdepartementet',
    name: 'Socialdepartementet',
    minister: 'Jakob Forssmed',
    kpiIds: ['d6788eb6-ccff-4112-8967-37330aaa158b', '2746ac6d-e3d8-455c-8635-0af8e416af7c', '47a0800c-a5eb-42dc-9790-2d7d5d581dbf', 'ffa4018d-6861-4c84-9782-a6057c0c2342'],
    description: 'Ansvarar för hälso- och sjukvård, socialförsäkring och folkhälsa',
  },
  {
    id: 'utbildningsdepartementet',
    name: 'Utbildningsdepartementet',
    minister: 'Lotta Edholm',
    kpiIds: ['62983e23-343f-4dc5-951d-9b3799c4f70c'],
    description: 'Ansvarar för utbildning, forskning och skola',
  },
  {
    id: 'klimatdepartementet',
    name: 'Klimat- och näringslivsdepartementet',
    minister: 'Ebba Busch',
    kpiIds: ['c063a645-b198-4f9b-9f70-bbebe736dff4', '362ddb45-91ff-4427-856b-39b40b5cb131', 'b6b35c35-c639-44b1-8355-52755b5446ef'],
    description: 'Ansvarar för näringsliv, energi och bostäder',
  },
  {
    id: 'statsradsberedningen',
    name: 'Statsrådsberedningen',
    minister: 'Ulf Kristersson',
    kpiIds: ['b0c0e05b-00da-4a89-8f74-c1792bf6b34f', 'b4506f87-b18b-4367-823d-fd2cd2b3e543', 'b6b13cba-542d-47c6-a85a-ea56c91d1c39'],
    description: 'Koordinerar regeringsarbetet och systemövergripande frågor',
  },
];

export function ResponsibilityPanel({ kpis }: ResponsibilityPanelProps) {
  const [expandedDept, setExpandedDept] = useState<string | null>('finansdepartementet');
  const [activeView, setActiveView] = useState<'departments' | 'matrix'>('departments');

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive': return 'text-emerald-600';
      case 'warning': return 'text-amber-600';
      case 'critical': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getOverallScore = (dept: Department) => {
    const stats = getDepartmentStats(dept);
    if (stats.total === 0) return 0;
    return Math.round(((stats.positive * 100) + (stats.warning * 50)) / stats.total);
  };

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
          </TabsList>
        </Tabs>
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
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {activeView === 'departments' ? (
        /* Department View */
        <div className="space-y-4">
          {DEPARTMENTS.map((dept) => {
            const stats = getDepartmentStats(dept);
            const score = getOverallScore(dept);
            const isExpanded = expandedDept === dept.id;
            
            return (
              <Card key={dept.id} className={cn(
                "transition-all",
                stats.critical > 0 && "border-red-200 bg-red-50/30 dark:bg-red-950/10"
              )}>
                <Collapsible open={isExpanded} onOpenChange={() => setExpandedDept(isExpanded ? null : dept.id)}>
                  <CollapsibleTrigger className="w-full">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold">{dept.name}</h3>
                            <p className="text-sm text-muted-foreground">{dept.minister}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
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
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
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
      ) : (
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
                </tr>
              </thead>
              <tbody>
                {DEPARTMENTS.map((dept) => (
                  <tr key={dept.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-3">
                      <div className="font-medium">{dept.name.replace('departementet', '.')}</div>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {DEPARTMENTS.reduce((acc, d) => acc + getDepartmentStats(d).critical, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Kritiska KPI:er totalt</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Target className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {DEPARTMENTS.reduce((acc, d) => acc + getDepartmentStats(d).warning, 0)}
                </div>
                <div className="text-sm text-muted-foreground">KPI:er under observation</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{DEPARTMENTS.length}</div>
                <div className="text-sm text-muted-foreground">Ansvariga departement</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
