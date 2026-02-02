import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  ExternalLink,
  Copy
} from 'lucide-react';
import { 
  type LearningObject, 
  formatLearning,
  getReplicationStrength,
  REPLICATION_THRESHOLDS 
} from '@/config/learningLibraryConfig';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface LearningCardProps {
  learning: LearningObject;
  onViewDetails?: () => void;
  onViewReplications?: () => void;
  className?: string;
}

export function LearningCard({ 
  learning, 
  onViewDetails, 
  onViewReplications,
  className 
}: LearningCardProps) {
  const [copied, setCopied] = useState(false);
  const formatted = formatLearning(learning);
  const strength = getReplicationStrength(learning.replications, learning.counterexamples);
  
  const getStrengthColor = () => {
    switch (strength) {
      case 'strong': return 'text-status-positive border-status-positive';
      case 'moderate': return 'text-status-warning border-status-warning';
      case 'weak': return 'text-orange-500 border-orange-500';
      case 'contested': return 'text-status-critical border-status-critical';
    }
  };
  
  const getGradeColor = () => {
    switch (learning.evidenceGrade) {
      case 'high': return 'bg-status-positive text-white';
      case 'moderate': return 'bg-status-warning text-white';
      case 'low': return 'bg-orange-500 text-white';
      case 'preliminary': return 'bg-muted text-muted-foreground';
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(learning.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={cn('bg-card border-border', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <Badge className={cn('text-xs', getGradeColor())}>
              {learning.evidenceGrade === 'high' ? 'Hög evidens' :
               learning.evidenceGrade === 'moderate' ? 'Moderat evidens' :
               learning.evidenceGrade === 'low' ? 'Låg evidens' : 'Preliminär'}
            </Badge>
          </div>
          <Badge variant="outline" className={cn('text-xs', getStrengthColor())}>
            {REPLICATION_THRESHOLDS[strength].label}
          </Badge>
        </div>
        <CardTitle className="text-base leading-snug mt-2">
          {formatted.headline}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Context */}
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Kontext:</span> {formatted.context}
        </div>
        
        {/* Replication stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-status-positive" />
            <div>
              <div className="text-lg font-bold">{learning.replications}</div>
              <div className="text-xs text-muted-foreground">Replikationer</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-status-critical" />
            <div>
              <div className="text-lg font-bold">{learning.counterexamples}</div>
              <div className="text-xs text-muted-foreground">Motexempel</div>
            </div>
          </div>
        </div>
        
        {/* Confidence bar */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Konfidens</span>
            <span>{(learning.effectConfidence * 100).toFixed(0)}%</span>
          </div>
          <Progress 
            value={learning.effectConfidence * 100} 
            className="h-2"
          />
        </div>
        
        {/* Conditions */}
        {learning.requiredConditions.length > 0 && (
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Villkor</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {learning.requiredConditions.slice(0, 3).map((condition, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {condition}
                </Badge>
              ))}
              {learning.requiredConditions.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{learning.requiredConditions.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border">
          {onViewDetails && (
            <Button variant="outline" size="sm" onClick={onViewDetails} className="flex-1">
              Detaljer <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          )}
          {onViewReplications && (
            <Button variant="outline" size="sm" onClick={onViewReplications} className="flex-1">
              <RefreshCw className="h-3 w-3 mr-1" />
              Replikationer
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopy}
            className="px-2"
          >
            {copied ? (
              <CheckCircle className="h-4 w-4 text-status-positive" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Last validated */}
        {learning.lastValidated && (
          <div className="text-xs text-muted-foreground text-center">
            Senast validerad: {new Date(learning.lastValidated).toLocaleDateString('sv-SE')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface LearningLibraryGridProps {
  learnings: LearningObject[];
  minGrade?: LearningObject['evidenceGrade'];
  onViewDetails?: (id: string) => void;
  onViewReplications?: (id: string) => void;
}

export function LearningLibraryGrid({ 
  learnings, 
  minGrade = 'preliminary',
  onViewDetails,
  onViewReplications
}: LearningLibraryGridProps) {
  const gradeOrder = ['high', 'moderate', 'low', 'preliminary'];
  const minGradeIndex = gradeOrder.indexOf(minGrade);
  
  const filteredLearnings = learnings
    .filter(l => gradeOrder.indexOf(l.evidenceGrade) <= minGradeIndex)
    .sort((a, b) => {
      // Sort by evidence grade first, then by replications
      const gradeA = gradeOrder.indexOf(a.evidenceGrade);
      const gradeB = gradeOrder.indexOf(b.evidenceGrade);
      if (gradeA !== gradeB) return gradeA - gradeB;
      return b.replications - a.replications;
    });

  if (filteredLearnings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p>Inga lärdomar matchar kriterierna</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredLearnings.map(learning => (
        <LearningCard
          key={learning.id}
          learning={learning}
          onViewDetails={onViewDetails ? () => onViewDetails(learning.id) : undefined}
          onViewReplications={onViewReplications ? () => onViewReplications(learning.id) : undefined}
        />
      ))}
    </div>
  );
}
