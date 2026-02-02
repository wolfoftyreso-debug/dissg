/**
 * WAVE 9: BLOCK CA — DATA LITERACY LAYER
 * 
 * Alla ska förstå datan.
 * Förskolelärar-testet ska klaras.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  AlertCircle, 
  Eye,
  HelpCircle,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  LITERACY_EXAMPLES, 
  LITERACY_FEATURE_FLAGS,
  type LiteracyExplanation 
} from '@/config/publicLearningConfig';

interface DataLiteracyCardProps {
  concept: string;
  customExplanation?: LiteracyExplanation;
}

export function DataLiteracyCard({ concept, customExplanation }: DataLiteracyCardProps) {
  const [selectedLevel, setSelectedLevel] = useState<'simple' | 'standard' | 'technical'>(
    LITERACY_FEATURE_FLAGS.defaultLevel
  );

  const explanation = customExplanation || LITERACY_EXAMPLES.find(e => e.id === `lit_${concept}`);
  
  if (!explanation) return null;

  const levelLabels = {
    simple: 'Enkel',
    standard: 'Standard',
    technical: 'Teknisk'
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-primary" />
          Förstå detta begrepp
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Level Selector */}
        <Tabs value={selectedLevel} onValueChange={(v) => setSelectedLevel(v as typeof selectedLevel)}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="simple" className="text-xs">
              {levelLabels.simple}
            </TabsTrigger>
            <TabsTrigger value="standard" className="text-xs">
              {levelLabels.standard}
            </TabsTrigger>
            <TabsTrigger value="technical" className="text-xs">
              {levelLabels.technical}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="simple" className="mt-3">
            <p className="text-sm leading-relaxed">{explanation.levels.simple}</p>
          </TabsContent>
          
          <TabsContent value="standard" className="mt-3">
            <p className="text-sm leading-relaxed">{explanation.levels.standard}</p>
          </TabsContent>
          
          <TabsContent value="technical" className="mt-3">
            <p className="text-sm leading-relaxed">{explanation.levels.technical}</p>
          </TabsContent>
        </Tabs>

        {/* Common Misinterpretations */}
        {LITERACY_FEATURE_FLAGS.showMisinterpretations && explanation.commonMisinterpretations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              Vanliga feltolkningar
            </h4>
            {explanation.commonMisinterpretations.map((mis, idx) => (
              <div key={idx} className="p-3 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs shrink-0">
                    {mis.frequency === 'very_common' ? 'Mycket vanligt' : 
                     mis.frequency === 'common' ? 'Vanligt' : 'Ibland'}
                  </Badge>
                  <p className="text-sm text-status-critical line-through">
                    {mis.description}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong>Varför fel:</strong> {mis.whyWrong}
                </p>
                <p className="text-sm text-status-positive">
                  ✓ {mis.correctInterpretation}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Reading Guide */}
        {LITERACY_FEATURE_FLAGS.showReadingGuide && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Hur ska det läsas?
            </h4>
            
            <div className="grid grid-cols-1 gap-2">
              <div className="p-2 bg-status-positive/10 rounded">
                <span className="text-xs font-medium text-status-positive">Titta efter:</span>
                <ul className="mt-1 space-y-0.5">
                  {explanation.readingGuide.whatToLookFor.map((item, idx) => (
                    <li key={idx} className="text-xs flex items-center gap-1">
                      <ChevronRight className="h-3 w-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-2 bg-status-critical/10 rounded">
                <span className="text-xs font-medium text-status-critical">Ignorera:</span>
                <ul className="mt-1 space-y-0.5">
                  {explanation.readingGuide.whatToIgnore.map((item, idx) => (
                    <li key={idx} className="text-xs flex items-center gap-1">
                      <ChevronRight className="h-3 w-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-2 bg-muted/50 rounded">
                <span className="text-xs font-medium flex items-center gap-1">
                  <HelpCircle className="h-3 w-3" />
                  Ställ dig dessa frågor:
                </span>
                <ul className="mt-1 space-y-0.5">
                  {explanation.readingGuide.questions.map((q, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground">
                      • {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        {LITERACY_FEATURE_FLAGS.alwaysShowDisclaimer && (
          <div className="flex items-start gap-2 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              Denna förklaring är förenklad. Faktiska tillämpningar kan vara mer komplexa.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================
// SIMPLE EXPLANATION BUTTON
// ============================================================

interface SimpleExplanationButtonProps {
  concept: string;
  children?: React.ReactNode;
}

export function SimpleExplanationButton({ concept, children }: SimpleExplanationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const explanation = LITERACY_EXAMPLES.find(e => e.id === `lit_${concept}`);
  if (!explanation) return <>{children}</>;

  return (
    <div className="relative inline-block">
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-5 w-5 p-0 ml-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <HelpCircle className="h-3 w-3 text-muted-foreground" />
      </Button>
      
      {isOpen && (
        <div className="absolute z-50 w-64 p-3 bg-popover border rounded-lg shadow-lg text-sm left-0 top-6">
          <p>{explanation.levels.simple}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 text-xs"
            onClick={() => setIsOpen(false)}
          >
            Stäng
          </Button>
        </div>
      )}
    </div>
  );
}
