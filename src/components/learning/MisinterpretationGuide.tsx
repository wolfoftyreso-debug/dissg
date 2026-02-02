/**
 * BLOCK QF — COMMON MISINTERPRETATIONS
 * 
 * "Detta misstolkas ofta"
 * - kortsiktiga effekter vs långsiktiga
 * - genomsnitt vs spridning
 * - samtidighet vs orsak
 * 
 * Systemet vaccinerar mot feltänk.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, BarChart2, Link, Target, HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { COMMON_MISINTERPRETATIONS, type Misinterpretation } from '@/config/guidedLearningPathsConfig';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  timing: <Clock className="h-4 w-4" />,
  aggregation: <BarChart2 className="h-4 w-4" />,
  causation: <Link className="h-4 w-4" />,
  selection: <Target className="h-4 w-4" />,
  context: <HelpCircle className="h-4 w-4" />,
};

const CATEGORY_LABELS: Record<string, string> = {
  timing: 'Tidsperspektiv',
  aggregation: 'Aggregering',
  causation: 'Kausalitet',
  selection: 'Urval',
  context: 'Kontext',
};

interface MisinterpretationGuideProps {
  filterCategory?: string;
}

export function MisinterpretationGuide({ filterCategory }: MisinterpretationGuideProps) {
  const misinterpretations = filterCategory 
    ? COMMON_MISINTERPRETATIONS.filter(m => m.category === filterCategory)
    : COMMON_MISINTERPRETATIONS;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Detta misstolkas ofta
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Vanliga feltolkningar som är bra att känna till
        </p>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {misinterpretations.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  {CATEGORY_ICONS[item.category]}
                  <div>
                    <div className="font-medium">{item.titleSv}</div>
                    <Badge variant="outline" className="text-xs mt-1">
                      {CATEGORY_LABELS[item.category]}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-7">
                  <p className="text-muted-foreground">
                    {item.descriptionSv}
                  </p>
                  {item.exampleSv && (
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      <span className="text-xs text-muted-foreground block mb-1">
                        Exempel:
                      </span>
                      {item.exampleSv}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
