/**
 * CLICKABLE ICON - Universal wrapper for all icons
 * ═══════════════════════════════════════════════════════════════
 * 
 * Makes any Lucide icon clickable with:
 * - Hover tooltip showing meaning
 * - Click opens deep-dive sheet
 * - Registry-backed explanations
 * 
 * Usage:
 * <ClickableIcon icon={Zap} registryId="zap" />
 */

import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getIconDefinition, type IconDefinition } from '@/lib/registry/iconRegistry';
import { cn } from '@/lib/utils';
import { BookOpen, Scale, ExternalLink, Link2 } from 'lucide-react';

interface ClickableIconProps {
  icon: LucideIcon;
  registryId: string;
  size?: number;
  className?: string;
  // Allow passing custom content for icons not in registry
  customDefinition?: Partial<IconDefinition>;
  // Disable interaction (just show icon)
  disabled?: boolean;
}

export const ClickableIcon: React.FC<ClickableIconProps> = ({
  icon: Icon,
  registryId,
  size = 16,
  className,
  customDefinition,
  disabled = false,
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  
  const definition = getIconDefinition(registryId) || customDefinition as IconDefinition;
  
  if (!definition) {
    // Fallback: just render the icon without interactivity
    return <Icon size={size} className={className} />;
  }
  
  if (disabled) {
    return <Icon size={size} className={className} />;
  }

  const categoryColors: Record<string, string> = {
    status: 'bg-primary/10 text-primary',
    domain: 'bg-secondary/50 text-secondary-foreground',
    action: 'bg-accent/50 text-accent-foreground',
    metric: 'bg-muted text-muted-foreground',
    warning: 'bg-destructive/10 text-destructive',
    navigation: 'bg-muted text-muted-foreground',
    substance: 'bg-primary/10 text-primary',
    health: 'bg-destructive/10 text-destructive',
    governance: 'bg-secondary/50 text-secondary-foreground',
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <button
              onClick={() => setSheetOpen(true)}
              className={cn(
                "inline-flex items-center justify-center rounded-sm hover:bg-muted/80 p-0.5 transition-colors cursor-pointer",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                className
              )}
              aria-label={`Visa mer om ${definition.nameSv}`}
            >
              <Icon size={size} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="font-medium">{definition.nameSv}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Klicka för fördjupning</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <ScrollArea className="h-full pr-4">
            <SheetHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", categoryColors[definition.category])}>
                  <Icon size={24} />
                </div>
                <div>
                  <SheetTitle>{definition.nameSv}</SheetTitle>
                  <SheetDescription>{definition.name}</SheetDescription>
                </div>
              </div>
              <Badge variant="outline" className={cn("w-fit", categoryColors[definition.category])}>
                {definition.category === 'status' ? 'Status' :
                 definition.category === 'domain' ? 'Domän' :
                 definition.category === 'action' ? 'Åtgärd' :
                 definition.category === 'metric' ? 'Mätvärde' :
                 definition.category === 'warning' ? 'Varning' :
                 definition.category === 'navigation' ? 'Navigation' :
                 definition.category === 'substance' ? 'Substans' :
                 definition.category === 'health' ? 'Hälsa' :
                 definition.category === 'governance' ? 'Styrning' : definition.category}
              </Badge>
            </SheetHeader>

            <div className="mt-6 space-y-4">
              {/* Description */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Betydelse</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{definition.descriptionSv}</p>
                </CardContent>
              </Card>

              {/* What it shows */}
              <Alert className="bg-secondary/30 border-secondary">
                <BookOpen className="h-4 w-4 text-secondary-foreground" />
                <AlertDescription>
                  <p className="font-medium text-secondary-foreground text-xs mb-1">
                    Detta visar:
                  </p>
                  <ul className="text-xs space-y-0.5">
                    {definition.whatItShows.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>

              {/* What it doesn't show */}
              <Alert className="bg-destructive/10 border-destructive/30">
                <Scale className="h-4 w-4 text-destructive" />
                <AlertDescription>
                  <p className="font-medium text-destructive text-xs mb-1">
                    Detta visar INTE:
                  </p>
                  <ul className="text-xs space-y-0.5">
                    {definition.whatItDoesNotShow.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Related concepts */}
              {definition.relatedConcepts.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Link2 className="h-4 w-4" />
                      Relaterade begrepp
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {definition.relatedConcepts.map((concept) => (
                        <Badge key={concept} variant="secondary" className="text-xs">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Data source */}
              {definition.dataSource && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Datakälla</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{definition.dataSource}</p>
                  </CardContent>
                </Card>
              )}

              {/* Learn more link */}
              {definition.learnMoreUrl && (
                <a
                  href={definition.learnMoreUrl}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <span className="text-sm font-medium group-hover:text-primary">
                    Läs mer om {definition.nameSv.toLowerCase()}
                  </span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </a>
              )}

              <Separator className="my-4" />

              <p className="text-xs text-muted-foreground text-center">
                Alla ikoner i systemet är klickbara och förklarade.
              </p>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ClickableIcon;
