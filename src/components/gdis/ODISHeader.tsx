/**
 * ODIS-STYLE HEADER
 * 
 * Strukturmässigt lik VW ODIS diagnostiksystem.
 * Visar systeminfo i grid-layout med statusindikatorer.
 */

import React from 'react';
import { UserMenu } from '@/components/auth/UserMenu';

interface SystemInfo {
  label: string;
  value: string;
}

interface ODISHeaderProps {
  systemName?: string;
  leftInfo?: SystemInfo[];
  rightInfo?: SystemInfo[];
  statusIndicators?: Array<{
    status: 'ok' | 'warning' | 'error' | 'inactive';
    label?: string;
  }>;
}

export const ODISHeader: React.FC<ODISHeaderProps> = ({
  systemName = 'Global Diagnostic Information System Service',
  leftInfo = [
    { label: 'Country', value: 'SE' },
    { label: 'Region', value: 'NUTS-2' },
    { label: 'Scope', value: 'National' },
  ],
  rightInfo = [
    { label: 'VER', value: 'GDIS 1.0' },
    { label: 'Data', value: '2024-Q4 / 184 indicators' },
  ],
  statusIndicators = [
    { status: 'ok', label: 'Data sync' },
    { status: 'warning', label: 'Anomalies' },
    { status: 'inactive', label: 'Simulation' },
  ],
}) => {
  const getStatusColor = (status: 'ok' | 'warning' | 'error' | 'inactive') => {
    switch (status) {
      case 'ok': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
      case 'inactive': return 'bg-muted-foreground/30';
    }
  };

  return (
    <header className="border-b-2 border-border bg-muted/30">
      {/* Title bar */}
      <div className="bg-primary/10 border-b border-primary/20 px-3 py-1.5 flex items-center justify-between">
        <span className="font-mono text-xs font-semibold tracking-wide text-primary">
          {systemName}
        </span>
        <div className="flex items-center gap-2">
          <UserMenu />
        </div>
      </div>

      {/* Info grid */}
      <div className="px-3 py-2 flex items-start justify-between gap-4 flex-wrap">
        {/* Left info columns */}
        <div className="flex gap-6">
          {leftInfo.map((info, i) => (
            <div key={i} className="min-w-[80px]">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {info.label}:
              </div>
              <div className="font-mono text-sm font-medium">
                {info.value}
              </div>
            </div>
          ))}
        </div>

        {/* Right info + status */}
        <div className="flex items-start gap-6">
          {rightInfo.map((info, i) => (
            <div key={i} className="min-w-[100px]">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {info.label}:
              </div>
              <div className="font-mono text-sm font-medium">
                {info.value}
              </div>
            </div>
          ))}

          {/* Status indicators */}
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            {statusIndicators.map((indicator, i) => (
              <div key={i} className="flex items-center gap-1.5" title={indicator.label}>
                <span className={`w-3 h-3 rounded-sm ${getStatusColor(indicator.status)}`} />
                {indicator.status === 'error' && (
                  <span className="font-mono text-xs text-destructive">[!]</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ODISHeader;
