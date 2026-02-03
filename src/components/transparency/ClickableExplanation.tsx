/**
 * Clickable Explanation Component - Spotless Protocol
 * Every element can be clicked for detailed information via 5-level explanation pyramid.
 * NO ICONS - descriptive text only per design doctrine.
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export interface ExplanationLevel {
  observation: string;     // Nivå 1: Vad?
  mechanism: string;       // Nivå 2: Varför?
  method: string;          // Nivå 3: Hur vet vi?
  limitations: string[];   // Nivå 4: Begränsningar
  rawSource?: string;      // Nivå 5: Rådata/källa
}

interface ClickableExplanationProps {
  title: string;
  summary: string;
  explanation: ExplanationLevel;
  children: React.ReactNode;
  className?: string;
}

export function ClickableExplanation({
  title,
  summary,
  explanation,
  children,
  className = '',
}: ClickableExplanationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`text-left w-full hover:bg-muted/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg ${className}`}
        aria-label={`Visa mer information om ${title}`}
      >
        {children}
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{title}</DialogTitle>
            <p className="text-muted-foreground mt-2">{summary}</p>
          </DialogHeader>

          <Separator className="my-4" />

          <Tabs defaultValue="observation" className="mt-4">
            <TabsList className="grid w-full grid-cols-5 text-xs">
              <TabsTrigger value="observation">Vad?</TabsTrigger>
              <TabsTrigger value="mechanism">Varför?</TabsTrigger>
              <TabsTrigger value="method">Hur vet vi?</TabsTrigger>
              <TabsTrigger value="limitations">Begränsningar</TabsTrigger>
              <TabsTrigger value="source">Källa</TabsTrigger>
            </TabsList>

            <TabsContent value="observation" className="mt-4 space-y-3">
              <h3 className="font-semibold">Nivå 1: Observation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {explanation.observation}
              </p>
            </TabsContent>

            <TabsContent value="mechanism" className="mt-4 space-y-3">
              <h3 className="font-semibold">Nivå 2: Mekanism</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {explanation.mechanism}
              </p>
            </TabsContent>

            <TabsContent value="method" className="mt-4 space-y-3">
              <h3 className="font-semibold">Nivå 3: Metodik</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {explanation.method}
              </p>
            </TabsContent>

            <TabsContent value="limitations" className="mt-4 space-y-3">
              <h3 className="font-semibold">Nivå 4: Begränsningar</h3>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Vad detta INTE visar:
                </p>
                <ul className="space-y-2">
                  {explanation.limitations.map((limitation, i) => (
                    <li key={i} className="text-sm text-muted-foreground pl-4 border-l-2 border-muted">
                      {limitation}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="source" className="mt-4 space-y-3">
              <h3 className="font-semibold">Nivå 5: Rådata och källa</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {explanation.rawSource || 'Ingen ytterligare källinformation tillgänglig för denna nivå.'}
              </p>
            </TabsContent>
          </Tabs>

          <Separator className="my-4" />

          <div className="text-xs text-muted-foreground">
            <p>Varje element i systemet kan klickas för att visa denna förklaringspyramid.</p>
            <p className="mt-1">Syftet är att du aldrig ska behöva lita – du ska kunna verifiera.</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Simple clickable text variant for inline use
interface ClickableTermProps {
  term: string;
  explanation: ExplanationLevel;
  className?: string;
}

export function ClickableTerm({ term, explanation, className = '' }: ClickableTermProps) {
  return (
    <ClickableExplanation
      title={term}
      summary={explanation.observation}
      explanation={explanation}
      className={className}
    >
      <span className="underline decoration-dotted underline-offset-4 hover:decoration-solid">
        {term}
      </span>
    </ClickableExplanation>
  );
}

export default ClickableExplanation;
