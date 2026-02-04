/**
 * ODIS-STYLE HEADER
 * 
 * Strukturmässigt lik VW ODIS diagnostiksystem.
 * Visar systeminfo i grid-layout med statusindikatorer.
 * Integrerar GeoScopeNavigator för zoom in/out mellan nivåer.
 */

import React from 'react';
import { UserMenu } from '@/components/auth/UserMenu';
import { GeoScopeNavigator } from './GeoScopeNavigator';
import { useGeo } from '@/contexts/GeoContext';

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
  systemName = 'DISSG – Diagnostic Information System for Societal Governance',
  leftInfo,
  rightInfo = [
    { label: 'VER', value: 'DISSG 1.0' },
    { label: 'Data', value: '2024-Q4 / 184 indicators' },
  ],
  statusIndicators = [
    { status: 'ok', label: 'Data sync' },
    { status: 'warning', label: 'Anomalies' },
    { status: 'inactive', label: 'Simulation' },
  ],
}) => {
  const { scope } = useGeo();
  
  const getStatusColor = (status: 'ok' | 'warning' | 'error' | 'inactive') => {
    switch (status) {
      case 'ok': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
      case 'inactive': return 'bg-muted-foreground/30';
    }
  };

  // Dynamic left info based on geo scope
  const dynamicLeftInfo = leftInfo || [
    { label: 'Scope', value: scope.level.toUpperCase() },
    { label: scope.level === 'global' ? 'Coverage' : 'Focus', value: scope.name_local || scope.name },
  ];

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
        {/* Left: Geo Navigator + info */}
        <div className="flex items-center gap-4">
          {/* Geo Scope Navigator */}
          <GeoScopeNavigator variant="full" />
          
          {/* Additional info */}
          <div className="hidden md:flex gap-6 pl-4 border-l border-border">
            {dynamicLeftInfo.map((info, i) => (
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
        </div>

        {/* Right info + status */}
        <div className="flex items-start gap-6">
          {rightInfo.map((info, i) => (
            <div key={i} className="min-w-[100px] hidden lg:block">
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
