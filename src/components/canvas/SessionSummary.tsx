/**
 * BLOCK PJ — "WHAT DID WE LEARN HERE?"
 * 
 * Efter varje session kan systemet sammanfatta:
 * "I denna jämförelse såg vi att:
 * – A och B ofta rörde sig samtidigt under period X–Y
 * – sambandet var svagt / starkt / varierande
 * – flera andra faktorer också förändrades"
 * 
 * 📌 Hjälper användaren formulera lärdomar korrekt.
 */

import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, BookmarkPlus, Share2, Copy } from 'lucide-react';
import type { DataIndicator } from '@/config/correlationLearningCanvasConfig';
import { toast } from 'sonner';

interface SessionSummaryProps {
  indicatorA: DataIndicator;
  indicatorB: DataIndicator;
  timeRange: [number, number];
  onClose: () => void;
}

export function SessionSummary({
  indicatorA,
  indicatorB,
  timeRange,
  onClose,
}: SessionSummaryProps) {
  const handleCopy = () => {
    const summaryText = `Jämförelse: ${indicatorA.nameSv} och ${indicatorB.nameSv}
Period: ${timeRange[0]}–${timeRange[1]}

Observationer:
• ${indicatorA.nameSv} och ${indicatorB.nameSv} rörde sig ofta i samma riktning
• Sambandet var måttligt starkt under perioden
• Flera andra faktorer förändrades också

⚠️ Observerade mönster innebär inte orsakssamband.

Källa: NOGF Data`;

    navigator.clipboard.writeText(summaryText);
    toast.success('Sammanfattning kopierad');
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>💡</span>
            <span>Vad lärde vi oss här?</span>
          </DialogTitle>
          <DialogDescription>
            En sammanfattning av denna jämförelse
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* What we compared */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">{indicatorA.nameSv}</Badge>
            <span className="text-muted-foreground">och</span>
            <Badge variant="secondary">{indicatorB.nameSv}</Badge>
            <span className="text-muted-foreground">under</span>
            <Badge variant="outline">{timeRange[0]}–{timeRange[1]}</Badge>
          </div>

          {/* Observations */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="text-sm font-medium">I denna jämförelse såg vi att:</div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                  <span>
                    {indicatorA.nameSv} och {indicatorB.nameSv} rörde sig ofta 
                    i samma riktning under perioden
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                  <span>
                    Sambandet var måttligt starkt med vissa undantag
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span>
                    Flera andra faktorer förändrades också under samma period
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Caveats */}
          <Card className="border-warning/50 bg-warning/5">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <AlertCircle className="h-4 w-4 text-warning" />
                <span>Viktigt att komma ihåg</span>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                <li>• Observerade mönster innebär inte orsakssamband</li>
                <li>• Många faktorer kan påverka samtidigt</li>
                <li>• Mönster kan variera i andra perioder eller regioner</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleCopy} className="gap-2">
            <Copy className="h-4 w-4" />
            Kopiera
          </Button>
          <Button variant="outline" className="gap-2">
            <BookmarkPlus className="h-4 w-4" />
            Spara
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Dela
          </Button>
          <Button onClick={onClose}>
            Stäng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
