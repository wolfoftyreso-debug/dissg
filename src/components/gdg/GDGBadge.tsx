/**
 * GDG BADGE COMPONENT
 * 
 * Visual representation of GDG compliance status.
 */

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { GDGBadge as GDGBadgeType } from '@/core/truth-engine/sdk';

interface GDGBadgeProps {
  badge: GDGBadgeType;
  showDetails?: boolean;
}

export function GDGBadgeDisplay({ badge, showDetails = false }: GDGBadgeProps) {
  const colors = {
    compliant: 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200',
    partial: 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200',
    non_compliant: 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200',
    pending: 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200',
  };

  const content = (
    <Badge 
      className={`${colors[badge.level]} border px-3 py-1.5 text-sm font-medium cursor-default`}
      variant="outline"
    >
      <span className="mr-1.5">{badge.display_icon}</span>
      {badge.display_text}
    </Badge>
  );

  if (!showDetails) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3">
          <div className="space-y-2 text-xs">
            <div className="font-medium">Validation Details</div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-muted-foreground">Scope:</span>
              <span>{badge.scope_valid ? '✓ Valid' : '✗ Invalid'}</span>
              <span className="text-muted-foreground">Nodes:</span>
              <span>{badge.nodes_valid ? '✓ Valid' : '✗ Invalid'}</span>
              <span className="text-muted-foreground">No Recommendations:</span>
              <span>{badge.no_recommendations ? '✓ Clean' : '✗ Found'}</span>
              <span className="text-muted-foreground">Limitations:</span>
              <span>{badge.limitations_present ? '✓ Present' : '✗ Missing'}</span>
              <span className="text-muted-foreground">Confidence:</span>
              <span>{badge.confidence_present ? '✓ Present' : '✗ Missing'}</span>
            </div>
            <div className="pt-1 border-t">
              <span className="text-muted-foreground">Issued: </span>
              {new Date(badge.issued_at).toLocaleDateString()}
            </div>
            <div>
              <span className="text-muted-foreground">Expires: </span>
              {new Date(badge.expires_at).toLocaleDateString()}
            </div>
            <div className="font-mono text-[10px] text-muted-foreground">
              {badge.validation_hash}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * SIMPLE BADGE (just icon + text)
 */
export function GDGBadgeSimple({ level }: { level: GDGBadgeType['level'] }) {
  const config = {
    compliant: { icon: '✅', text: 'GDG v1.0', color: 'bg-green-100 text-green-800' },
    partial: { icon: '⚠️', text: 'GDG Partial', color: 'bg-yellow-100 text-yellow-800' },
    non_compliant: { icon: '❌', text: 'Not Compliant', color: 'bg-red-100 text-red-800' },
    pending: { icon: '⏳', text: 'Pending', color: 'bg-gray-100 text-gray-800' },
  };

  const { icon, text, color } = config[level];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {icon} {text}
    </span>
  );
}
