/**
 * Evidence Status Badge
 * 
 * Visual indicator for claim evidence status.
 * 🟥 Unsupported | 🟨 Weakly Supported | 🟩 Supported
 */

import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { EVIDENCE_STATUSES, type EvidenceStatus } from '@/config/evidenceMechanism';

interface EvidenceStatusBadgeProps {
  status: EvidenceStatus;
  reportCode?: string | null;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
  lang?: string;
}

const iconMap = {
  unsupported: XCircle,
  weak: AlertCircle,
  supported: CheckCircle2
};

const sizeMap = {
  sm: { badge: 'text-xs px-1.5 py-0.5', icon: 'h-3 w-3' },
  md: { badge: 'text-sm px-2 py-1', icon: 'h-4 w-4' },
  lg: { badge: 'text-base px-3 py-1.5', icon: 'h-5 w-5' }
};

export function EvidenceStatusBadge({
  status,
  reportCode,
  showTooltip = true,
  size = 'md',
  lang = 'sv'
}: EvidenceStatusBadgeProps) {
  const statusDef = EVIDENCE_STATUSES[status];
  const Icon = iconMap[status];
  const sizes = sizeMap[size];
  
  const label = lang === 'sv' && statusDef.labelLocal.sv 
    ? statusDef.labelLocal.sv 
    : statusDef.label;
  
  const description = lang === 'sv' && statusDef.descriptionLocal.sv
    ? statusDef.descriptionLocal.sv
    : statusDef.description;

  const badge = (
    <Badge 
      variant="outline" 
      className={`${statusDef.bgColor} ${statusDef.borderColor} ${statusDef.color} ${sizes.badge} inline-flex items-center gap-1.5`}
    >
      <Icon className={sizes.icon} />
      <span>{label}</span>
      {reportCode && status !== 'unsupported' && (
        <span className="font-mono text-xs opacity-75">{reportCode}</span>
      )}
    </Badge>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Inline status indicator (minimal)
 */
export function EvidenceStatusInline({ status }: { status: EvidenceStatus }) {
  const statusDef = EVIDENCE_STATUSES[status];
  return (
    <span 
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${statusDef.bgColor} ${statusDef.borderColor} border`}
      title={statusDef.label}
    >
      <span className="text-xs">{statusDef.code}</span>
    </span>
  );
}
