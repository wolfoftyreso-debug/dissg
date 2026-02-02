/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CLICKABLE WRAPPER - Universal Clickability (Spotless Protocol §1)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * RULE: Nothing may be displayed that cannot be deepened.
 * 
 * For every element in the system:
 * - number → click → definition + source
 * - graph → click → method + raw data
 * - header → click → scope + limitation
 * - icon → click → explanation
 * - summary → click → full aggregation
 * 
 * CHECK:
 * - Is there any visual element that is not clickable? ❌ FORBIDDEN
 * - Is there any click that leads to "empty page"? ❌ FORBIDDEN
 * 
 * UI shall never promise more than the system delivers.
 */

import { ReactNode, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChevronRight, Info, ExternalLink } from 'lucide-react';
import { useSpotless } from '@/context/SpotlessContext';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ClickableType = 
  | 'number'      // → definition + source
  | 'graph'       // → method + raw data
  | 'header'      // → scope + limitation
  | 'icon'        // → explanation
  | 'summary'     // → full aggregation
  | 'generic';    // → custom content

interface ClickableContent {
  title: string;
  definition?: string;
  source?: {
    name: string;
    url: string;
    date: string;
  };
  method?: string;
  scope?: string;
  limitations?: string[];
  explanation?: string;
  children?: ReactNode;
}

interface ClickableWrapperProps {
  /** Type of element being wrapped */
  type: ClickableType;
  /** Content to show on click */
  content: ClickableContent;
  /** The element to wrap */
  children: ReactNode;
  /** Use popover instead of dialog */
  variant?: 'dialog' | 'popover';
  /** Additional styling */
  className?: string;
  /** Disable click (for audit mode detection) */
  disabled?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function ClickableWrapper({
  type,
  content,
  children,
  variant = 'dialog',
  className,
  disabled = false,
}: ClickableWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuditMode } = useSpotless();

  // Register element for audit
  const hasValidContent = Boolean(
    content.definition || 
    content.source || 
    content.method || 
    content.scope || 
    content.explanation ||
    content.children
  );

  // In audit mode, highlight elements
  const auditHighlight = isAuditMode ? (
    hasValidContent 
      ? 'ring-2 ring-status-positive ring-offset-1' 
      : 'ring-2 ring-status-critical ring-offset-1'
  ) : '';

  if (disabled) {
    return <>{children}</>;
  }

  const triggerContent = (
    <button
      className={cn(
        'inline-flex items-center gap-0.5 cursor-pointer transition-colors',
        'hover:text-primary underline-offset-2 hover:underline',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 rounded',
        auditHighlight,
        className
      )}
      onClick={() => !variant && setIsOpen(true)}
    >
      {children}
      <ChevronRight className="h-3 w-3 opacity-50" />
    </button>
  );

  if (variant === 'popover') {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          {triggerContent}
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <ClickableContentDisplay type={type} content={content} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerContent}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            {content.title}
          </DialogTitle>
        </DialogHeader>
        <ClickableContentDisplay type={type} content={content} />
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT DISPLAY
// ═══════════════════════════════════════════════════════════════════════════

function ClickableContentDisplay({ 
  type, 
  content 
}: { 
  type: ClickableType; 
  content: ClickableContent;
}) {
  return (
    <div className="space-y-4 py-2">
      {/* Type badge */}
      <Badge variant="outline" className="capitalize">
        {type === 'number' && '🔢 Siffra'}
        {type === 'graph' && '📊 Graf'}
        {type === 'header' && '📑 Rubrik'}
        {type === 'icon' && '🔣 Ikon'}
        {type === 'summary' && '📋 Sammanfattning'}
        {type === 'generic' && '📎 Element'}
      </Badge>

      {/* Definition */}
      {content.definition && (
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">Definition</h4>
          <p className="text-sm text-muted-foreground">{content.definition}</p>
        </div>
      )}

      {/* Source */}
      {content.source && (
        <div className="p-3 bg-muted/50 rounded-md space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            📚 Källa
          </h4>
          <p className="text-sm font-medium">{content.source.name}</p>
          <p className="text-xs text-muted-foreground">
            Publicerad: {content.source.date}
          </p>
          <a 
            href={content.source.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            Öppna källa <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {/* Method */}
      {content.method && (
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">Metod</h4>
          <p className="text-sm text-muted-foreground">{content.method}</p>
        </div>
      )}

      {/* Scope */}
      {content.scope && (
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">Omfattning</h4>
          <p className="text-sm text-muted-foreground">{content.scope}</p>
        </div>
      )}

      {/* Limitations */}
      {content.limitations && content.limitations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-status-warning">Begränsningar</h4>
          <ul className="space-y-1">
            {content.limitations.map((lim, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-status-warning">⚠</span>
                {lim}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Explanation (for icons) */}
      {content.explanation && (
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">Förklaring</h4>
          <p className="text-sm text-muted-foreground">{content.explanation}</p>
        </div>
      )}

      {/* Custom children */}
      {content.children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SPECIALIZED WRAPPERS
// ═══════════════════════════════════════════════════════════════════════════

interface ClickableNumberProps {
  value: number | string;
  unit?: string;
  definition: string;
  source: ClickableContent['source'];
  className?: string;
}

export function ClickableNumber({ 
  value, 
  unit, 
  definition, 
  source,
  className 
}: ClickableNumberProps) {
  return (
    <ClickableWrapper
      type="number"
      content={{
        title: `${value}${unit ? ` ${unit}` : ''}`,
        definition,
        source,
      }}
      variant="popover"
      className={className}
    >
      <span className="tabular-nums font-semibold">{value}</span>
      {unit && <span className="text-muted-foreground ml-1">{unit}</span>}
    </ClickableWrapper>
  );
}

interface ClickableHeaderProps {
  children: ReactNode;
  scope: string;
  limitations: string[];
  className?: string;
}

export function ClickableHeader({ 
  children, 
  scope, 
  limitations,
  className 
}: ClickableHeaderProps) {
  return (
    <ClickableWrapper
      type="header"
      content={{
        title: typeof children === 'string' ? children : 'Rubrik',
        scope,
        limitations,
      }}
      variant="popover"
      className={className}
    >
      {children}
    </ClickableWrapper>
  );
}

interface ClickableIconProps {
  icon: ReactNode;
  label: string;
  explanation: string;
  className?: string;
}

export function ClickableIcon({ 
  icon, 
  label, 
  explanation,
  className 
}: ClickableIconProps) {
  return (
    <ClickableWrapper
      type="icon"
      content={{
        title: label,
        explanation,
      }}
      variant="popover"
      className={className}
    >
      {icon}
    </ClickableWrapper>
  );
}

export default ClickableWrapper;
