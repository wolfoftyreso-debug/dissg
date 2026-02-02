/**
 * Knowledge Wrapper - Makes any UI element a Knowledge Object
 * 
 * Wraps any component to make it clickable with depth levels.
 * Everything that exists must be explainable.
 */

import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  type KnowledgeObject,
  type DepthLevel,
  DEPTH_LEVELS,
} from '@/config/extremeClaritySystem';

interface KnowledgeWrapperProps {
  children: ReactNode;
  knowledge: Partial<KnowledgeObject>;
  variant?: 'inline' | 'block' | 'minimal';
  className?: string;
}

/**
 * Wraps any UI element to make it a knowledge object
 */
export function KnowledgeWrapper({
  children,
  knowledge,
  variant = 'inline',
  className,
}: KnowledgeWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const hasDepth = knowledge.deeper_levels && knowledge.deeper_levels.length > 0;
  
  if (variant === 'minimal') {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <span 
            className={cn(
              'cursor-pointer underline decoration-dotted underline-offset-2',
              'hover:decoration-solid',
              className
            )}
          >
            {children}
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <KnowledgeDepthView knowledge={knowledge} />
        </PopoverContent>
      </Popover>
    );
  }
  
  if (variant === 'inline') {
    return (
      <span className={cn('inline-flex items-center gap-1', className)}>
        {children}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button className="inline-flex items-center text-muted-foreground hover:text-primary">
              <Info className="h-3 w-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-96" align="start">
            <KnowledgeDepthView knowledge={knowledge} />
          </PopoverContent>
        </Popover>
      </span>
    );
  }
  
  // Block variant
  return (
    <div className={cn('space-y-2', className)}>
      {children}
      {hasDepth && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="text-muted-foreground text-xs"
        >
          {isOpen ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              Hide explanation
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              What does this mean?
            </>
          )}
        </Button>
      )}
      {isOpen && (
        <div className="border-l-2 border-primary/20 pl-4">
          <KnowledgeDepthView knowledge={knowledge} />
        </div>
      )}
    </div>
  );
}

/**
 * Depth view component - shows the 5 levels
 */
function KnowledgeDepthView({ knowledge }: { knowledge: Partial<KnowledgeObject> }) {
  const [activeLevel, setActiveLevel] = useState<DepthLevel>(1);
  
  const currentLevelData = knowledge.deeper_levels?.find(l => l.level === activeLevel);
  
  return (
    <div className="space-y-4">
      {/* Question this answers */}
      {knowledge.question && (
        <p className="text-sm font-medium">{knowledge.question}</p>
      )}
      
      {/* Level tabs */}
      <div className="flex flex-wrap gap-1">
        {([1, 2, 3, 4, 5] as DepthLevel[]).map((level) => {
          const levelConfig = DEPTH_LEVELS[level];
          const hasContent = knowledge.deeper_levels?.some(l => l.level === level);
          
          return (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              disabled={!hasContent}
              className={cn(
                'px-2 py-1 text-xs rounded transition-colors',
                activeLevel === level
                  ? 'bg-primary text-primary-foreground'
                  : hasContent
                    ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                    : 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
              )}
            >
              {level}. {levelConfig.labelSv}
            </button>
          );
        })}
      </div>
      
      {/* Content */}
      {currentLevelData ? (
        <div className="space-y-2">
          <p className="text-sm">{currentLevelData.content}</p>
          
          {currentLevelData.sources.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Källor: </span>
              {currentLevelData.sources.join(', ')}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {knowledge.explains || 'No explanation available'}
        </p>
      )}
      
      {/* Limitations */}
      {knowledge.limitations && knowledge.limitations.length > 0 && activeLevel >= 4 && (
        <div className="text-xs text-muted-foreground border-t pt-2">
          <span className="font-medium">Begränsningar: </span>
          {knowledge.limitations.join('; ')}
        </div>
      )}
      
      {/* Source link */}
      {knowledge.url && (
        <a 
          href={knowledge.url}
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          Full förklaring
        </a>
      )}
    </div>
  );
}

/**
 * Clickable number with full depth
 */
interface ClickableNumberProps {
  value: string | number;
  knowledge: Partial<KnowledgeObject>;
  unit?: string;
  className?: string;
}

export function ClickableNumber({ value, knowledge, unit, className }: ClickableNumberProps) {
  return (
    <KnowledgeWrapper knowledge={knowledge} variant="minimal" className={className}>
      <span className="font-mono">
        {value}
        {unit && <span className="text-muted-foreground ml-0.5">{unit}</span>}
      </span>
    </KnowledgeWrapper>
  );
}

/**
 * Clickable label with inline explanation
 */
interface ClickableLabelProps {
  label: string;
  knowledge: Partial<KnowledgeObject>;
  className?: string;
}

export function ClickableLabel({ label, knowledge, className }: ClickableLabelProps) {
  return (
    <KnowledgeWrapper knowledge={knowledge} variant="minimal" className={className}>
      {label}
    </KnowledgeWrapper>
  );
}
