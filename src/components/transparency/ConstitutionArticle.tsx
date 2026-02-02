import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Info, 
  Flag,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { type ConstitutionArticle as ArticleType } from '@/config/dataConstitutionConfig';
import { cn } from '@/lib/utils';

interface ConstitutionArticleProps {
  article: ArticleType;
  showExamples?: boolean;
  className?: string;
}

export function ConstitutionArticleCard({ 
  article, 
  showExamples = true,
  className 
}: ConstitutionArticleProps) {
  const getEnforcementBadge = () => {
    switch (article.enforcementType) {
      case 'hard_block':
        return { color: 'bg-status-critical text-white', label: 'Hårt block', icon: Shield };
      case 'warning':
        return { color: 'bg-status-warning text-white', label: 'Varning', icon: AlertTriangle };
      case 'disclosure':
        return { color: 'bg-blue-500 text-white', label: 'Disclosure', icon: Info };
      case 'flag':
        return { color: 'bg-orange-500 text-white', label: 'Flagga', icon: Flag };
    }
  };

  const enforcement = getEnforcementBadge();
  const EnforcementIcon = enforcement.icon;

  return (
    <Card className={cn('bg-card border-border', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="font-mono text-xs">
                Artikel {article.articleNumber}
              </Badge>
              <Badge className={cn('text-xs', enforcement.color)}>
                <EnforcementIcon className="h-3 w-3 mr-1" />
                {enforcement.label}
              </Badge>
              {article.automatedCheck && (
                <Badge variant="secondary" className="text-xs">
                  Automatisk kontroll
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg">{article.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Principle */}
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-md">
          <p className="text-sm font-medium">{article.principle}</p>
        </div>
        
        {/* Rationale */}
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Motivering</span>
          <p className="mt-1 text-sm text-muted-foreground">{article.rationale}</p>
        </div>
        
        {showExamples && (
          <>
            {/* Valid examples */}
            {article.examples.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-status-positive" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Giltiga exempel
                  </span>
                </div>
                <ul className="space-y-1">
                  {article.examples.map((example, i) => (
                    <li key={i} className="text-sm text-status-positive/90 pl-6">
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Violations */}
            {article.violations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-4 w-4 text-status-critical" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Överträdelser
                  </span>
                </div>
                <ul className="space-y-1">
                  {article.violations.map((violation, i) => (
                    <li key={i} className="text-sm text-status-critical/90 pl-6">
                      {violation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Violation alert for inline use
 */
interface ViolationAlertProps {
  violationType: string;
  articleNumber: number;
  match: string;
  className?: string;
}

export function ViolationAlert({ violationType, articleNumber, match, className }: ViolationAlertProps) {
  return (
    <Alert variant="destructive" className={className}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <strong>Artikel {articleNumber}:</strong> Möjlig överträdelse av typ "{violationType}". 
        Flaggad text: "{match}"
      </AlertDescription>
    </Alert>
  );
}

/**
 * Compact constitution reference
 */
interface ConstitutionRefProps {
  articleNumber: number;
  title: string;
}

export function ConstitutionRef({ articleNumber, title }: ConstitutionRefProps) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Shield className="h-3 w-3" />
      <span>Art. {articleNumber}: {title}</span>
    </span>
  );
}
