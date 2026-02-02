/**
 * BLOCK 8: DATA HONESTY & SELF-AUDIT ENGINE
 * 
 * Data Quality Badge - Shows quality level and allows drill-down
 * Systemet granskar sig självt.
 */

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Clock,
  Database,
  Shield,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type QualityLevel = 'high' | 'medium' | 'low' | 'unknown';

export interface DataQualityMetrics {
  // Core metrics
  completeness: number;       // 0-100: How much data is present
  freshness: number;          // 0-100: How recent is the data
  reliability: number;        // 0-100: Source reliability score
  consistency: number;        // 0-100: Internal consistency
  
  // Flags
  hasBiasRisk: boolean;
  hasMethodDrift: boolean;
  isEstimated: boolean;
  hasCensorshipRisk: boolean;
  
  // Metadata
  lastUpdated: Date;
  sourceCount: number;
  coverageCountries: number;
  missingDataPoints: number;
  
  // Notes
  qualityNotes?: string[];
}

export interface DataQualityBadgeProps {
  level: QualityLevel;
  metrics?: DataQualityMetrics;
  compact?: boolean;
  className?: string;
}

const QUALITY_CONFIG: Record<QualityLevel, {
  label: string;
  labelSv: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}> = {
  high: {
    label: 'High Quality',
    labelSv: 'Hög kvalitet',
    icon: <CheckCircle className="h-3 w-3" />,
    color: 'text-status-positive',
    bgColor: 'bg-status-positive/10'
  },
  medium: {
    label: 'Medium Quality',
    labelSv: 'Medel kvalitet',
    icon: <AlertTriangle className="h-3 w-3" />,
    color: 'text-status-warning',
    bgColor: 'bg-status-warning/10'
  },
  low: {
    label: 'Low Quality',
    labelSv: 'Låg kvalitet',
    icon: <XCircle className="h-3 w-3" />,
    color: 'text-status-critical',
    bgColor: 'bg-status-critical/10'
  },
  unknown: {
    label: 'Unknown',
    labelSv: 'Okänd',
    icon: <Info className="h-3 w-3" />,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted'
  }
};

// Calculate overall quality level from metrics
export const calculateQualityLevel = (metrics: DataQualityMetrics): QualityLevel => {
  const avgScore = (
    metrics.completeness + 
    metrics.freshness + 
    metrics.reliability + 
    metrics.consistency
  ) / 4;

  // Penalize for flags
  let penalty = 0;
  if (metrics.hasBiasRisk) penalty += 15;
  if (metrics.hasMethodDrift) penalty += 10;
  if (metrics.hasCensorshipRisk) penalty += 20;

  const finalScore = avgScore - penalty;

  if (finalScore >= 75) return 'high';
  if (finalScore >= 50) return 'medium';
  if (finalScore >= 25) return 'low';
  return 'unknown';
};

// Quality detail panel
const QualityDetailPanel: React.FC<{ metrics: DataQualityMetrics }> = ({ metrics }) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) return `${diffHours}h sedan`;
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}d sedan`;
    return date.toLocaleDateString('sv-SE');
  };

  return (
    <div className="space-y-4 w-72">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Datakvalitet</h4>
        
        {/* Core metrics */}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                Fullständighet
              </span>
              <span className="font-data">{metrics.completeness}%</span>
            </div>
            <Progress value={metrics.completeness} className="h-1" />
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Aktualitet
              </span>
              <span className="font-data">{metrics.freshness}%</span>
            </div>
            <Progress value={metrics.freshness} className="h-1" />
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Källtillförlitlighet
              </span>
              <span className="font-data">{metrics.reliability}%</span>
            </div>
            <Progress value={metrics.reliability} className="h-1" />
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3" />
                Konsistens
              </span>
              <span className="font-data">{metrics.consistency}%</span>
            </div>
            <Progress value={metrics.consistency} className="h-1" />
          </div>
        </div>
      </div>

      {/* Flags/Warnings */}
      {(metrics.hasBiasRisk || metrics.hasMethodDrift || metrics.isEstimated || metrics.hasCensorshipRisk) && (
        <div className="space-y-1">
          <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Varningar
          </h5>
          <div className="flex flex-wrap gap-1">
            {metrics.hasBiasRisk && (
              <Badge variant="outline" className="text-xs border-status-warning text-status-warning">
                Bias-risk
              </Badge>
            )}
            {metrics.hasMethodDrift && (
              <Badge variant="outline" className="text-xs border-status-warning text-status-warning">
                Metodförändring
              </Badge>
            )}
            {metrics.isEstimated && (
              <Badge variant="outline" className="text-xs">
                Estimerad
              </Badge>
            )}
            {metrics.hasCensorshipRisk && (
              <Badge variant="outline" className="text-xs border-status-critical text-status-critical">
                Censur-risk
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-muted/50 p-2 rounded-sm">
          <div className="text-muted-foreground">Källor</div>
          <div className="font-medium font-data">{metrics.sourceCount}</div>
        </div>
        <div className="bg-muted/50 p-2 rounded-sm">
          <div className="text-muted-foreground">Länder</div>
          <div className="font-medium font-data">{metrics.coverageCountries}</div>
        </div>
        <div className="bg-muted/50 p-2 rounded-sm">
          <div className="text-muted-foreground">Saknad data</div>
          <div className="font-medium font-data">{metrics.missingDataPoints}</div>
        </div>
        <div className="bg-muted/50 p-2 rounded-sm">
          <div className="text-muted-foreground">Uppdaterad</div>
          <div className="font-medium">{formatDate(metrics.lastUpdated)}</div>
        </div>
      </div>

      {/* Quality notes */}
      {metrics.qualityNotes && metrics.qualityNotes.length > 0 && (
        <div className="space-y-1">
          <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Anteckningar
          </h5>
          <ul className="text-xs space-y-1">
            {metrics.qualityNotes.map((note, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="text-muted-foreground">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const DataQualityBadge: React.FC<DataQualityBadgeProps> = ({
  level,
  metrics,
  compact = false,
  className
}) => {
  const config = QUALITY_CONFIG[level];

  const badge = (
    <Badge 
      variant="outline" 
      className={cn(
        "cursor-pointer transition-colors",
        config.bgColor,
        config.color,
        compact ? "px-1.5 py-0" : "",
        className
      )}
    >
      <span className="flex items-center gap-1">
        {config.icon}
        {!compact && <span className="text-xs">{config.labelSv}</span>}
      </span>
    </Badge>
  );

  if (!metrics) {
    return badge;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {badge}
      </PopoverTrigger>
      <PopoverContent className="p-3" align="end">
        <QualityDetailPanel metrics={metrics} />
      </PopoverContent>
    </Popover>
  );
};

/**
 * Self-audit summary card for pages
 */
export const DataQualitySummary: React.FC<{
  title: string;
  metrics: DataQualityMetrics;
  className?: string;
}> = ({ title, metrics, className }) => {
  const level = calculateQualityLevel(metrics);
  const config = QUALITY_CONFIG[level];

  return (
    <Card className={cn("data-card", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{title}</CardTitle>
          <DataQualityBadge level={level} metrics={metrics} />
        </div>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        <p>
          Data från {metrics.sourceCount} källor täcker {metrics.coverageCountries} länder. 
          {metrics.missingDataPoints > 0 && ` ${metrics.missingDataPoints} datapunkter saknas.`}
        </p>
      </CardContent>
    </Card>
  );
};

export default DataQualityBadge;
