/**
 * WAVE 8 BLOCK BS: Integrated Index Display
 * 
 * Visar integrerade index med fullständig metodtransparens.
 * Ekonomi isolerat = förbjudet.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Info, 
  ChevronDown, 
  ChevronUp,
  AlertTriangle,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { 
  INTEGRATED_INDICES, 
  getWeightExplanation,
  type IntegratedIndex,
} from '@/config/integratedIndexConfig';

interface IntegratedIndexCardProps {
  indexId: string;
  currentValue: number;
  previousValue?: number;
  periodLabel: string;
  lang?: 'sv' | 'en';
}

export function IntegratedIndexCard({
  indexId,
  currentValue,
  previousValue,
  periodLabel,
  lang = 'sv',
}: IntegratedIndexCardProps) {
  const [showMethod, setShowMethod] = useState(false);
  const [showComponents, setShowComponents] = useState(false);

  const index = INTEGRATED_INDICES.find(i => i.id === indexId);
  if (!index) return null;

  const change = previousValue ? ((currentValue - previousValue) / previousValue) * 100 : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="secondary" className="mb-2 text-[10px]">
              {index.code}
            </Badge>
            <CardTitle className="text-lg">
              {lang === 'sv' ? index.name : index.name_en}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === 'sv' ? index.description : index.description_en}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{currentValue.toFixed(1)}</p>
            {previousValue && (
              <p className={`text-sm font-mono ${
                change >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {change > 0 ? '+' : ''}{change.toFixed(1)}%
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{periodLabel}</span>
          <span>
            {lang === 'sv' ? 'Uppdateras' : 'Updates'}: {index.updateFrequency}
          </span>
        </div>

        {/* Komponenter */}
        <div>
          <button 
            className="w-full flex items-center justify-between py-2 text-sm"
            onClick={() => setShowComponents(!showComponents)}
          >
            <span className="font-medium flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              {lang === 'sv' ? 'Komponenter' : 'Components'}
              <Badge variant="outline" className="text-[10px]">
                {index.components.length} {lang === 'sv' ? 'domäner' : 'domains'}
              </Badge>
            </span>
            {showComponents ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {showComponents && (
            <div className="pl-6 space-y-3 mt-2">
              {index.components.map((component, i) => (
                <div key={i} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{component.domain}</span>
                    <span className="text-sm font-mono">
                      {(component.weight * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={component.weight * 100} className="h-2 mb-2" />
                  <div className="flex flex-wrap gap-1 mb-2">
                    {component.indicators.map((ind, j) => (
                      <Badge key={j} variant="outline" className="text-[10px]">
                        {ind}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">
                    {component.rationale}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Metod */}
        <div>
          <button 
            className="w-full flex items-center justify-between py-2 text-sm"
            onClick={() => setShowMethod(!showMethod)}
          >
            <span className="font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              {lang === 'sv' ? 'Metod & Begränsningar' : 'Method & Limitations'}
            </span>
            {showMethod ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {showMethod && (
            <div className="pl-6 space-y-3 mt-2">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs font-medium mb-2">
                  {lang === 'sv' ? 'Metodologi:' : 'Methodology:'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {index.methodology}
                </p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800">
                <p className="text-xs font-medium text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {lang === 'sv' ? 'Begränsningar:' : 'Limitations:'}
                </p>
                <ul className="text-[10px] text-amber-700 dark:text-amber-300 space-y-1">
                  {index.limitations.map((lim, i) => (
                    <li key={i}>• {lim}</li>
                  ))}
                </ul>
              </div>

              <div className="text-[10px] text-muted-foreground">
                {lang === 'sv' ? 'Data tillgänglig från:' : 'Data available from:'} {index.availableFrom}
              </div>
            </div>
          )}
        </div>

        {/* Viktningsförklaring */}
        <div className="p-3 bg-muted/20 rounded text-xs text-muted-foreground">
          <Info className="h-3 w-3 inline mr-1" />
          {getWeightExplanation(indexId, lang)}
        </div>

        {/* Multi-domain disclaimer */}
        <div className="p-3 border rounded bg-background">
          <p className="text-[10px] text-muted-foreground flex items-start gap-2">
            <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
            {lang === 'sv' 
              ? 'Detta index kombinerar flera domäner. Enskilda komponenter kan röra sig i olika riktningar. Tolka helheten med försiktighet.'
              : 'This index combines multiple domains. Individual components may move in different directions. Interpret the whole with caution.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Lista alla integrerade index
 */
export function IntegratedIndexList({
  lang = 'sv',
}: {
  lang?: 'sv' | 'en';
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {lang === 'sv' ? 'Integrerade Index' : 'Integrated Indices'}
        </h3>
        <Badge variant="outline">
          {INTEGRATED_INDICES.length} index
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        {lang === 'sv' 
          ? 'Kombinerade mått som spänner över flera domäner. Ekonomi isolerat = förbjudet i detta system.'
          : 'Combined measures spanning multiple domains. Economy in isolation = forbidden in this system.'}
      </p>

      <div className="grid gap-4">
        {INTEGRATED_INDICES.map(index => (
          <Card key={index.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="secondary" className="mb-1 text-[10px]">
                  {index.code}
                </Badge>
                <h4 className="font-medium">
                  {lang === 'sv' ? index.name : index.name_en}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {lang === 'sv' ? index.description : index.description_en}
                </p>
              </div>
              <div className="flex gap-1">
                {index.components.map((c, i) => (
                  <Badge key={i} variant="outline" className="text-[10px]">
                    {c.domain}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
