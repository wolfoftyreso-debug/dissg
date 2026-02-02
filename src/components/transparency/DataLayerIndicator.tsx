import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Database, GitBranch, Eye } from 'lucide-react';
import { DATA_LAYERS } from '@/config/publicProfileConfig';

type DataLayer = 'source' | 'aggregation' | 'presentation';

interface DataLayerIndicatorProps {
  /** Vilket lager denna data tillhör */
  layer: DataLayer;
  
  /** Visa med tooltip eller inline */
  variant?: 'badge' | 'inline' | 'minimal';
  
  className?: string;
}

const LAYER_CONFIG = {
  source: {
    label: 'A',
    name: 'Källfakta',
    icon: Database,
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    description: DATA_LAYERS.sourceData.disclaimer,
  },
  aggregation: {
    label: 'B',
    name: 'Sammanställning',
    icon: GitBranch,
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    description: DATA_LAYERS.aggregation.disclaimer,
  },
  presentation: {
    label: 'C',
    name: 'Visualisering',
    icon: Eye,
    color: 'bg-green-500/10 text-green-600 border-green-500/30',
    description: DATA_LAYERS.presentation.disclaimer,
  },
} as const;

/**
 * DEL XIV: Indikator för datalager
 * 
 * Visar tydligt vilket lager (A, B eller C) en datapunkt tillhör
 * enligt tre-lager-modellen.
 */
export function DataLayerIndicator({
  layer,
  variant = 'badge',
  className = '',
}: DataLayerIndicatorProps) {
  const config = LAYER_CONFIG[layer];
  const Icon = config.icon;

  if (variant === 'minimal') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`text-xs font-mono font-bold ${className}`}>
              [{config.label}]
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{config.name}</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              {config.description}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === 'inline') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`inline-flex items-center gap-1 text-xs text-muted-foreground ${className}`}>
              <Icon className="h-3 w-3" />
              <span>{config.name}</span>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs max-w-xs">{config.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`${config.color} ${className}`}>
            <Icon className="h-3 w-3 mr-1" />
            Lager {config.label}: {config.name}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-xs">{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
