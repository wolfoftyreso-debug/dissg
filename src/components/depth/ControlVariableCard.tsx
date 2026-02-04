/**
 * CONTROL VARIABLE CARD
 * 
 * Klickbar kort som öppnar en 5-nivåers förklaringspyramid:
 * 1. Observation (Vad?)
 * 2. Mekanism (Varför/Drivkrafter?)
 * 3. Metod (Hur vet vi detta?)
 * 4. Begränsningar (Vad visas inte?)
 * 5. Rådata (Källor/Primärdata)
 * 
 * Zero Dead-Ends: Allt är klickbart i oändligt djup.
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import type { ControlVariable } from '@/config/demographyCorrelationConfig';

interface ControlVariableCardProps {
  variable: ControlVariable;
  language?: 'sv' | 'en';
}

export const ControlVariableCard: React.FC<ControlVariableCardProps> = ({
  variable,
  language = 'sv'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getTrendIndicator = () => {
    switch (variable.trendDirection) {
      case 'up': return '[+]';
      case 'down': return '[-]';
      case 'stable': return '[=]';
      case 'volatile': return '[~]';
      default: return '';
    }
  };

  const getRelevanceBadge = () => {
    if (variable.relevanceScore >= 90) return { label: 'Hög relevans', variant: 'default' as const };
    if (variable.relevanceScore >= 70) return { label: 'Medel relevans', variant: 'secondary' as const };
    return { label: 'Låg relevans', variant: 'outline' as const };
  };

  const relevance = getRelevanceBadge();

  return (
    <>
      {/* Clickable Card */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-4 border rounded-lg text-left hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer group w-full min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label={`Fördjupa: ${variable.nameSv}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="font-medium text-sm group-hover:text-primary transition-colors">
              {variable.nameSv}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {variable.description}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-xs text-muted-foreground">
              {getTrendIndicator()}
              {variable.changePercent && ` ${variable.changePercent > 0 ? '+' : ''}${variable.changePercent}%`}
            </span>
            <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Fördjupa
            </span>
          </div>
        </div>
      </button>

      {/* Explanation Pyramid Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-4 flex-wrap">
              <span>{variable.nameSv}</span>
              <Badge variant={relevance.variant}>{relevance.label}</Badge>
            </DialogTitle>
            <p className="text-sm text-muted-foreground">{variable.description}</p>
          </DialogHeader>

          <Tabs defaultValue="observation" className="mt-4">
            <TabsList className="grid w-full grid-cols-5 h-auto">
              <TabsTrigger value="observation" className="text-xs py-2 px-1">
                <span className="hidden sm:inline">1. Observation</span>
                <span className="sm:hidden">1. Obs</span>
              </TabsTrigger>
              <TabsTrigger value="mechanism" className="text-xs py-2 px-1">
                <span className="hidden sm:inline">2. Mekanism</span>
                <span className="sm:hidden">2. Mek</span>
              </TabsTrigger>
              <TabsTrigger value="method" className="text-xs py-2 px-1">
                <span className="hidden sm:inline">3. Metod</span>
                <span className="sm:hidden">3. Met</span>
              </TabsTrigger>
              <TabsTrigger value="limitations" className="text-xs py-2 px-1">
                <span className="hidden sm:inline">4. Begränsningar</span>
                <span className="sm:hidden">4. Begr</span>
              </TabsTrigger>
              <TabsTrigger value="sources" className="text-xs py-2 px-1">
                <span className="hidden sm:inline">5. Källor</span>
                <span className="sm:hidden">5. Käll</span>
              </TabsTrigger>
            </TabsList>

            {/* Level 1: Observation */}
            <TabsContent value="observation" className="mt-4 space-y-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">L1</Badge>
                      <span className="text-sm font-medium">Vad observerades?</span>
                    </div>
                    <p className="text-sm leading-relaxed">
                      {language === 'sv' ? variable.observation.sv : variable.observation.en}
                    </p>
                    <Separator />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Trendindikator: {getTrendIndicator()}</span>
                      {variable.changePercent && (
                        <span>Förändring: {variable.changePercent > 0 ? '+' : ''}{variable.changePercent}%</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Level 2: Mechanism */}
            <TabsContent value="mechanism" className="mt-4 space-y-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">L2</Badge>
                      <span className="text-sm font-medium">Varför spelar detta roll?</span>
                    </div>
                    <p className="text-sm leading-relaxed">
                      {language === 'sv' ? variable.mechanism.sv : variable.mechanism.en}
                    </p>
                    <Separator />
                    <div className="text-xs text-muted-foreground">
                      Relevanspoäng: {variable.relevanceScore}/100 för denna analys
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Level 3: Method */}
            <TabsContent value="method" className="mt-4 space-y-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">L3</Badge>
                      <span className="text-sm font-medium">Hur mäts detta?</span>
                    </div>
                    <p className="text-sm leading-relaxed">
                      {language === 'sv' ? variable.method.sv : variable.method.en}
                    </p>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">Uppdateringsfrekvens:</span>
                        <div className="font-medium">{variable.method.dataFrequency}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Senast uppdaterad:</span>
                        <div className="font-medium">{variable.method.latestUpdate}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Level 4: Limitations */}
            <TabsContent value="limitations" className="mt-4 space-y-4">
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs border-destructive/50">L4</Badge>
                      <span className="text-sm font-medium text-destructive">Vad visar detta INTE?</span>
                    </div>
                    <ul className="space-y-2">
                      {(language === 'sv' ? variable.limitations.sv : variable.limitations.en).map((limitation, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="font-mono text-destructive text-xs">[!]</span>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Level 5: Sources */}
            <TabsContent value="sources" className="mt-4 space-y-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">L5</Badge>
                      <span className="text-sm font-medium">Primärkällor</span>
                    </div>
                    <div className="space-y-3">
                      {variable.sources.map((source, i) => (
                        <a
                          key={i}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 border rounded-lg hover:bg-muted/50 hover:border-primary/50 transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-medium text-sm text-primary">
                                {source.name}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Täckning: {source.coverage}
                              </div>
                            </div>
                            <Badge variant={source.type === 'primary' ? 'default' : 'secondary'} className="text-xs">
                              {source.type === 'primary' ? 'Primär' : 'Sekundär'}
                            </Badge>
                          </div>
                        </a>
                      ))}
                    </div>
                    <Separator />
                    <div className="text-xs text-muted-foreground">
                      Klicka på källa för att öppna i nytt fönster. Alla källor är publikt tillgängliga.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Stäng
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ControlVariableCard;
