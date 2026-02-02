import { useState, useMemo } from 'react';
import { Action } from '@/types/action';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  ArrowUpDown,
  Check,
  X,
  Minus,
  Target,
  DollarSign,
  Shield,
  RotateCcw,
  Clock,
  Building2,
  TrendingUp,
  Columns,
  LayoutGrid,
  Star,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface ComparisonAction {
  id: string;
  title: string;
  description: string;
  category: string;
  timeframe: string;
  effect: { score: number; description: string; magnitude: string; confidence: number };
  cost: { score: number; estimate: string; type: string };
  risk: { score: number; factors: string[]; mitigation: string };
  implementation: {
    complexity: string;
    responsible_ministry: string;
    key_stakeholders: string[];
    first_steps: string[];
  };
  dependencies: string[];
  side_effects: { positive: string[]; negative: string[] };
  priority_score: number;
  reversibility?: number;
}

interface ActionComparisonMatrixProps {
  actions: ComparisonAction[];
  recommendedActionId?: string;
  onSelectAction?: (actionId: string) => void;
}

type SortField = 'effect' | 'cost' | 'risk' | 'priority' | 'timeframe' | 'complexity';
type SortDirection = 'asc' | 'desc';

const COMPARISON_DIMENSIONS = [
  { key: 'effect', label: 'Effekt', icon: Target, description: 'Förväntad påverkan på indikatorn' },
  { key: 'cost', label: 'Kostnad', icon: DollarSign, description: 'Ekonomisk investering' },
  { key: 'risk', label: 'Risk', icon: Shield, description: 'Risknivå vid implementering' },
  { key: 'reversibility', label: 'Reversibilitet', icon: RotateCcw, description: 'Möjlighet att ändra kurs' },
  { key: 'timeframe', label: 'Tidsram', icon: Clock, description: 'Tid till effekt' },
  { key: 'complexity', label: 'Komplexitet', icon: Building2, description: 'Implementeringssvårighet' },
] as const;

const TIMEFRAME_ORDER = {
  'immediate': 1,
  'short_term': 2,
  'medium_term': 3,
  'long_term': 4,
};

const COMPLEXITY_ORDER = {
  'low': 1,
  'medium': 2,
  'high': 3,
};

function getScoreColor(score: number, inverted = false): string {
  const effectiveScore = inverted ? 10 - score : score;
  if (effectiveScore >= 7) return 'text-status-positive';
  if (effectiveScore >= 4) return 'text-status-warning';
  return 'text-status-critical';
}

function getScoreBgColor(score: number, inverted = false): string {
  const effectiveScore = inverted ? 10 - score : score;
  if (effectiveScore >= 7) return 'bg-status-positive/20';
  if (effectiveScore >= 4) return 'bg-status-warning/20';
  return 'bg-status-critical/20';
}

function ScoreCell({ score, max = 10, inverted = false, showBar = true }: { 
  score: number; 
  max?: number; 
  inverted?: boolean;
  showBar?: boolean;
}) {
  const percentage = (score / max) * 100;
  const colorClass = getScoreColor(score, inverted);
  const bgClass = getScoreBgColor(score, inverted);
  
  return (
    <div className="flex items-center gap-2">
      {showBar && (
        <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all", bgClass.replace('/20', ''))}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
      <span className={cn("text-sm font-bold tabular-nums", colorClass)}>
        {score.toFixed(0)}
      </span>
    </div>
  );
}

function ComparisonIndicator({ value, bestValue, worstValue, inverted = false }: {
  value: number;
  bestValue: number;
  worstValue: number;
  inverted?: boolean;
}) {
  const isBest = inverted ? value === worstValue : value === bestValue;
  const isWorst = inverted ? value === bestValue : value === worstValue;
  
  if (isBest) {
    return (
      <div className="flex items-center gap-1 text-status-positive">
        <Check className="h-3 w-3" />
        <span className="text-[10px] font-medium">Bäst</span>
      </div>
    );
  }
  
  if (isWorst) {
    return (
      <div className="flex items-center gap-1 text-status-critical">
        <X className="h-3 w-3" />
        <span className="text-[10px] font-medium">Sämst</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <Minus className="h-3 w-3" />
    </div>
  );
}

function WinnerBadge({ wins, total }: { wins: number; total: number }) {
  const percentage = (wins / total) * 100;
  
  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
      percentage >= 66 ? "bg-status-positive/20 text-status-positive" :
      percentage >= 33 ? "bg-status-warning/20 text-status-warning" :
      "bg-muted text-muted-foreground"
    )}>
      <TrendingUp className="h-3 w-3" />
      {wins}/{total} vinster
    </div>
  );
}

// Export functionality
function ExportMenu({ actions }: { actions: ComparisonAction[] }) {
  const exportToCSV = () => {
    const headers = ['Åtgärd', 'Kategori', 'Effekt', 'Kostnad', 'Risk', 'Tidsram', 'Komplexitet', 'Prioritet'];
    const rows = actions.map(action => [
      action.title,
      action.category,
      action.effect.score.toString(),
      action.cost.score.toString(),
      action.risk.score.toString(),
      action.timeframe,
      action.implementation.complexity,
      action.priority_score.toString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jämförelsematris_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // Create a printable HTML document
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Jämförelsematris - Export</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; font-size: 18px; margin-bottom: 10px; }
          .meta { color: #666; font-size: 12px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .score-high { color: #16a34a; }
          .score-mid { color: #ca8a04; }
          .score-low { color: #dc2626; }
          .footer { margin-top: 20px; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h1>Jämförelsematris för åtgärder</h1>
        <p class="meta">Exporterad: ${new Date().toLocaleString('sv-SE')} | Antal åtgärder: ${actions.length}</p>
        <table>
          <thead>
            <tr>
              <th>Åtgärd</th>
              <th>Kategori</th>
              <th>Effekt</th>
              <th>Kostnad</th>
              <th>Risk</th>
              <th>Tidsram</th>
              <th>Komplexitet</th>
              <th>Prioritet</th>
            </tr>
          </thead>
          <tbody>
            ${actions.map(action => `
              <tr>
                <td><strong>${action.title}</strong></td>
                <td>${action.category}</td>
                <td class="${action.effect.score >= 7 ? 'score-high' : action.effect.score >= 4 ? 'score-mid' : 'score-low'}">${action.effect.score}/10</td>
                <td class="${action.cost.score <= 3 ? 'score-high' : action.cost.score <= 6 ? 'score-mid' : 'score-low'}">${action.cost.score}/10</td>
                <td class="${action.risk.score <= 3 ? 'score-high' : action.risk.score <= 6 ? 'score-mid' : 'score-low'}">${action.risk.score}/10</td>
                <td>${action.timeframe === 'immediate' ? 'Nu' : action.timeframe === 'short_term' ? '0-6 mån' : action.timeframe === 'medium_term' ? '6-18 mån' : '18+ mån'}</td>
                <td>${action.implementation.complexity === 'low' ? 'Låg' : action.implementation.complexity === 'medium' ? 'Medel' : 'Hög'}</td>
                <td><strong>${action.priority_score}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Genererad av Global Infinity System | Notera: Effekt = högre är bättre, Kostnad/Risk = lägre är bättre</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 px-2 text-xs gap-1">
          <Download className="h-3 w-3" />
          Exportera
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToPDF} className="gap-2">
          <FileText className="h-4 w-4" />
          Exportera som PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToCSV} className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Exportera som CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ActionComparisonMatrix({
  actions, 
  recommendedActionId,
  onSelectAction 
}: ActionComparisonMatrixProps) {
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>(
    actions.slice(0, 3).map(a => a.id)
  );
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showDetails, setShowDetails] = useState(false);

  const selectedActions = useMemo(() => 
    actions.filter(a => selectedActionIds.includes(a.id)),
    [actions, selectedActionIds]
  );

  const sortedActions = useMemo(() => {
    return [...selectedActions].sort((a, b) => {
      let aVal: number, bVal: number;
      
      switch (sortField) {
        case 'effect':
          aVal = a.effect.score;
          bVal = b.effect.score;
          break;
        case 'cost':
          aVal = a.cost.score;
          bVal = b.cost.score;
          break;
        case 'risk':
          aVal = a.risk.score;
          bVal = b.risk.score;
          break;
        case 'priority':
          aVal = a.priority_score;
          bVal = b.priority_score;
          break;
        case 'timeframe':
          aVal = TIMEFRAME_ORDER[a.timeframe as keyof typeof TIMEFRAME_ORDER] || 99;
          bVal = TIMEFRAME_ORDER[b.timeframe as keyof typeof TIMEFRAME_ORDER] || 99;
          break;
        case 'complexity':
          aVal = COMPLEXITY_ORDER[a.implementation.complexity as keyof typeof COMPLEXITY_ORDER] || 99;
          bVal = COMPLEXITY_ORDER[b.implementation.complexity as keyof typeof COMPLEXITY_ORDER] || 99;
          break;
        default:
          return 0;
      }
      
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [selectedActions, sortField, sortDirection]);

  // Calculate best/worst values for each dimension
  const dimensionStats = useMemo(() => {
    if (selectedActions.length === 0) return null;
    
    const effectScores = selectedActions.map(a => a.effect.score);
    const costScores = selectedActions.map(a => a.cost.score);
    const riskScores = selectedActions.map(a => a.risk.score);
    
    return {
      effect: { best: Math.max(...effectScores), worst: Math.min(...effectScores) },
      cost: { best: Math.min(...costScores), worst: Math.max(...costScores) },
      risk: { best: Math.min(...riskScores), worst: Math.max(...riskScores) },
    };
  }, [selectedActions]);

  // Calculate wins per action
  const actionWins = useMemo(() => {
    if (!dimensionStats || selectedActions.length < 2) return {};
    
    const wins: Record<string, number> = {};
    
    selectedActions.forEach(action => {
      let count = 0;
      if (action.effect.score === dimensionStats.effect.best) count++;
      if (action.cost.score === dimensionStats.cost.best) count++;
      if (action.risk.score === dimensionStats.risk.best) count++;
      wins[action.id] = count;
    });
    
    return wins;
  }, [selectedActions, dimensionStats]);

  const toggleAction = (actionId: string) => {
    setSelectedActionIds(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className={cn(
        "h-7 px-2 text-xs gap-1",
        sortField === field && "bg-accent"
      )}
    >
      {label}
      {sortField === field && (
        sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
      )}
    </Button>
  );

  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Columns className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Jämför åtgärder</CardTitle>
            <Badge variant="secondary" className="text-[10px]">
              {selectedActions.length} valda
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <ExportMenu actions={sortedActions} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
              className="h-7 px-2"
            >
              {viewMode === 'table' ? (
                <LayoutGrid className="h-4 w-4" />
              ) : (
                <Columns className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="h-7 px-2 text-xs"
            >
              {showDetails ? 'Kompakt' : 'Detaljer'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Action Selector */}
        <div className="flex flex-wrap gap-2">
          {actions.map(action => (
            <label 
              key={action.id}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all",
                selectedActionIds.includes(action.id) 
                  ? "border-primary bg-primary/10" 
                  : "border-border hover:bg-muted"
              )}
            >
              <Checkbox
                checked={selectedActionIds.includes(action.id)}
                onCheckedChange={() => toggleAction(action.id)}
              />
              <span className="text-xs font-medium truncate max-w-[150px]">
                {action.title}
              </span>
              {action.id === recommendedActionId && (
                <Star className="h-3 w-3 text-primary fill-primary" />
              )}
            </label>
          ))}
        </div>

        {selectedActions.length < 2 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">Välj minst 2 åtgärder för att jämföra</span>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="rounded-lg border overflow-hidden">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[200px] sticky left-0 bg-muted/50 z-10">
                      <span className="text-xs font-medium">Åtgärd</span>
                    </TableHead>
                    <TableHead className="text-center">
                      <SortButton field="effect" label="Effekt" />
                    </TableHead>
                    <TableHead className="text-center">
                      <SortButton field="cost" label="Kostnad" />
                    </TableHead>
                    <TableHead className="text-center">
                      <SortButton field="risk" label="Risk" />
                    </TableHead>
                    <TableHead className="text-center">
                      <SortButton field="timeframe" label="Tid" />
                    </TableHead>
                    <TableHead className="text-center">
                      <SortButton field="complexity" label="Komplexitet" />
                    </TableHead>
                    <TableHead className="text-center">
                      <SortButton field="priority" label="Totalt" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedActions.map((action, index) => (
                    <TableRow 
                      key={action.id}
                      className={cn(
                        "cursor-pointer hover:bg-accent/50",
                        action.id === recommendedActionId && "bg-primary/5"
                      )}
                      onClick={() => onSelectAction?.(action.id)}
                    >
                      <TableCell className="sticky left-0 bg-card z-10">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
                              {index + 1}
                            </span>
                            <span className="text-sm font-medium truncate max-w-[140px]">
                              {action.title}
                            </span>
                            {action.id === recommendedActionId && (
                              <Star className="h-3 w-3 text-primary fill-primary flex-shrink-0" />
                            )}
                          </div>
                          {dimensionStats && (
                            <WinnerBadge wins={actionWins[action.id] || 0} total={3} />
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <ScoreCell score={action.effect.score} />
                          {dimensionStats && (
                            <ComparisonIndicator 
                              value={action.effect.score}
                              bestValue={dimensionStats.effect.best}
                              worstValue={dimensionStats.effect.worst}
                            />
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <ScoreCell score={action.cost.score} inverted />
                          {dimensionStats && (
                            <ComparisonIndicator 
                              value={action.cost.score}
                              bestValue={dimensionStats.cost.best}
                              worstValue={dimensionStats.cost.worst}
                              inverted
                            />
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <ScoreCell score={action.risk.score} inverted />
                          {dimensionStats && (
                            <ComparisonIndicator 
                              value={action.risk.score}
                              bestValue={dimensionStats.risk.best}
                              worstValue={dimensionStats.risk.worst}
                              inverted
                            />
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-[10px]">
                          {action.timeframe === 'immediate' ? 'Nu' :
                           action.timeframe === 'short_term' ? '0-6 mån' :
                           action.timeframe === 'medium_term' ? '6-18 mån' : '18+ mån'}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[10px]",
                            action.implementation.complexity === 'low' && "border-status-positive text-status-positive",
                            action.implementation.complexity === 'medium' && "border-status-warning text-status-warning",
                            action.implementation.complexity === 'high' && "border-status-critical text-status-critical"
                          )}
                        >
                          {action.implementation.complexity === 'low' ? 'Låg' :
                           action.implementation.complexity === 'medium' ? 'Medel' : 'Hög'}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-bold text-foreground">
                            {action.priority_score.toFixed(0)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">poäng</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        ) : (
          /* Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedActions.map((action, index) => (
              <Card 
                key={action.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  action.id === recommendedActionId && "border-primary"
                )}
                onClick={() => onSelectAction?.(action.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {index + 1}
                      </span>
                      {action.id === recommendedActionId && (
                        <Star className="h-4 w-4 text-primary fill-primary" />
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold">{action.priority_score.toFixed(0)}</span>
                      <p className="text-[10px] text-muted-foreground">poäng</p>
                    </div>
                  </div>
                  <CardTitle className="text-sm leading-tight">{action.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {dimensionStats && (
                    <WinnerBadge wins={actionWins[action.id] || 0} total={3} />
                  )}
                  
                  <div className="grid grid-cols-3 gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex flex-col items-center p-2 rounded bg-muted/50">
                            <Target className="h-3 w-3 text-muted-foreground mb-1" />
                            <span className={cn("text-sm font-bold", getScoreColor(action.effect.score))}>
                              {action.effect.score}
                            </span>
                            <span className="text-[10px] text-muted-foreground">Effekt</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{action.effect.description}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex flex-col items-center p-2 rounded bg-muted/50">
                            <DollarSign className="h-3 w-3 text-muted-foreground mb-1" />
                            <span className={cn("text-sm font-bold", getScoreColor(action.cost.score, true))}>
                              {action.cost.score}
                            </span>
                            <span className="text-[10px] text-muted-foreground">Kostnad</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{action.cost.estimate}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex flex-col items-center p-2 rounded bg-muted/50">
                            <Shield className="h-3 w-3 text-muted-foreground mb-1" />
                            <span className={cn("text-sm font-bold", getScoreColor(action.risk.score, true))}>
                              {action.risk.score}
                            </span>
                            <span className="text-[10px] text-muted-foreground">Risk</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {action.risk.factors?.join(', ') || 'Inga identifierade riskfaktorer'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {showDetails && (
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Tidsram:</span>
                        <span className="font-medium">
                          {action.timeframe === 'immediate' ? 'Omedelbart' :
                           action.timeframe === 'short_term' ? '0-6 månader' :
                           action.timeframe === 'medium_term' ? '6-18 månader' : '18+ månader'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Komplexitet:</span>
                        <span className={cn(
                          "font-medium",
                          action.implementation.complexity === 'low' && "text-status-positive",
                          action.implementation.complexity === 'medium' && "text-status-warning",
                          action.implementation.complexity === 'high' && "text-status-critical"
                        )}>
                          {action.implementation.complexity === 'low' ? 'Låg' :
                           action.implementation.complexity === 'medium' ? 'Medel' : 'Hög'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Ansvar:</span>
                        <span className="font-medium truncate max-w-[120px]">
                          {action.implementation.responsible_ministry}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-status-positive" />
            <span>Bra (7-10)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-status-warning" />
            <span>Medel (4-6)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-status-critical" />
            <span>Låg (0-3)</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Star className="h-3 w-3 text-primary fill-primary" />
            <span>Rekommenderad åtgärd</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
