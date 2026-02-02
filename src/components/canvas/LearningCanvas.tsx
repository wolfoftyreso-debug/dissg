/**
 * CORRELATION & LEARNING CANVAS
 * "Visa mig vad som rör sig tillsammans – och hjälp mig förstå varför det kan vara relevant."
 * 
 * Superenkel. Supersnygg. Supersann.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { DataPicker } from './DataPicker';
import { CorrelationChart } from './CorrelationChart';
import { PatternExplanation } from './PatternExplanation';
import { MisinterpretationGuard } from './MisinterpretationGuard';
import { WhatElseMoved } from './WhatElseMoved';
import { SessionSummary } from './SessionSummary';
import { 
  DATA_CATEGORIES, 
  CANVAS_SECTIONS,
  type DataIndicator 
} from '@/config/correlationLearningCanvasConfig';
import { Share2, BookmarkPlus, HelpCircle } from 'lucide-react';

interface SelectedData {
  indicatorA: DataIndicator | null;
  indicatorB: DataIndicator | null;
  region: string;
  timeRange: [number, number];
}

export function LearningCanvas() {
  const [selectedData, setSelectedData] = useState<SelectedData>({
    indicatorA: null,
    indicatorB: null,
    region: 'SE',
    timeRange: [2010, 2024],
  });
  
  const [showSummary, setShowSummary] = useState(false);
  
  const hasSelection = selectedData.indicatorA && selectedData.indicatorB;
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Utforska samband
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Se vad som rör sig tillsammans – förstå varför det kan vara relevant
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={!hasSelection}>
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Spara
              </Button>
              <Button variant="outline" size="sm" disabled={!hasSelection}>
                <Share2 className="h-4 w-4 mr-2" />
                Dela
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* SECTION 1: Vad jämför du? */}
        <section aria-labelledby="selection-heading">
          <Card className="border-2 border-dashed border-muted hover:border-primary/30 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">1</Badge>
                <CardTitle id="selection-heading" className="text-lg">
                  {CANVAS_SECTIONS[0].titleSv}
                </CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                {CANVAS_SECTIONS[0].descriptionSv}
              </p>
            </CardHeader>
            <CardContent>
              <DataPicker
                categories={DATA_CATEGORIES}
                selectedA={selectedData.indicatorA}
                selectedB={selectedData.indicatorB}
                region={selectedData.region}
                timeRange={selectedData.timeRange}
                onSelectA={(indicator) => setSelectedData(prev => ({ ...prev, indicatorA: indicator }))}
                onSelectB={(indicator) => setSelectedData(prev => ({ ...prev, indicatorB: indicator }))}
                onSelectRegion={(region) => setSelectedData(prev => ({ ...prev, region }))}
                onSelectTimeRange={(range) => setSelectedData(prev => ({ ...prev, timeRange: range }))}
              />
            </CardContent>
          </Card>
        </section>

        {/* SECTION 2: Vad ser vi? */}
        {hasSelection && (
          <section aria-labelledby="visualization-heading">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">2</Badge>
                  <CardTitle id="visualization-heading" className="text-lg">
                    {CANVAS_SECTIONS[1].titleSv}
                  </CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  {CANVAS_SECTIONS[1].descriptionSv}
                </p>
              </CardHeader>
              <CardContent>
                <CorrelationChart
                  indicatorA={selectedData.indicatorA!}
                  indicatorB={selectedData.indicatorB!}
                  region={selectedData.region}
                  timeRange={selectedData.timeRange}
                />
              </CardContent>
            </Card>
          </section>
        )}

        {/* SECTION 3: Vad betyder detta? */}
        {hasSelection && (
          <section aria-labelledby="interpretation-heading">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">3</Badge>
                  <CardTitle id="interpretation-heading" className="text-lg">
                    {CANVAS_SECTIONS[2].titleSv}
                  </CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  {CANVAS_SECTIONS[2].descriptionSv}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <PatternExplanation
                  indicatorA={selectedData.indicatorA!}
                  indicatorB={selectedData.indicatorB!}
                />
                
                <Separator />
                
                <WhatElseMoved
                  indicatorA={selectedData.indicatorA!}
                  indicatorB={selectedData.indicatorB!}
                  region={selectedData.region}
                  timeRange={selectedData.timeRange}
                />
              </CardContent>
            </Card>
          </section>
        )}

        {/* Session Summary */}
        {hasSelection && (
          <div className="flex justify-center">
            <Button 
              variant="secondary" 
              onClick={() => setShowSummary(true)}
              className="gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Vad lärde vi oss här?
            </Button>
          </div>
        )}

        {showSummary && hasSelection && (
          <SessionSummary
            indicatorA={selectedData.indicatorA!}
            indicatorB={selectedData.indicatorB!}
            timeRange={selectedData.timeRange}
            onClose={() => setShowSummary(false)}
          />
        )}
      </main>

      {/* BLOCK PH: Misinterpretation Guard - Always visible */}
      <MisinterpretationGuard />
    </div>
  );
}
