import React from 'react';
import { dataDepthConfig, DataDepthLevel } from '@/config/globalExpansionConfig';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Database, Globe, Layers, CheckCircle } from 'lucide-react';

interface DataDepthIndicatorProps {
  depth: DataDepthLevel;
  showFeatures?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function DataDepthIndicator({ 
  depth, 
  showFeatures = false,
  size = 'md',
  className 
}: DataDepthIndicatorProps) {
  const config = dataDepthConfig[depth];
  
  const getIcon = () => {
    switch (depth) {
      case 'global_baseline':
        return <Globe className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />;
      case 'regional_bloc':
        return <Layers className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />;
      case 'national_deep':
        return <Database className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />;
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  if (showFeatures) {
    return (
      <div className={className}>
        <div className={`inline-flex items-center gap-2 rounded-lg ${config.color} ${sizeClasses[size]}`}>
          {getIcon()}
          <span className="font-medium">{config.label}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 mb-2">{config.description}</p>
        <div className="space-y-1">
          {config.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="secondary" 
            className={`${config.color} ${sizeClasses[size]} cursor-help ${className}`}
          >
            {getIcon()}
            <span className="ml-1">{config.label}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="font-medium mb-1">{config.label}</p>
          <p className="text-xs text-muted-foreground mb-2">{config.description}</p>
          <ul className="text-xs space-y-0.5">
            {config.features.slice(0, 4).map((feature, i) => (
              <li key={i} className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                {feature}
              </li>
            ))}
            {config.features.length > 4 && (
              <li className="text-muted-foreground">
                +{config.features.length - 4} fler...
              </li>
            )}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
