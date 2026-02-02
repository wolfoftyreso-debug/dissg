/**
 * Report Embed Component
 * 
 * Embeddable widget for media and external sites.
 * Supports: badge, card, inline, full styles.
 */

import React from 'react';
import { FileText, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EVIDENCE_STATUSES, type EvidenceStatus } from '@/config/evidenceMechanism';

interface ReportEmbedProps {
  reportCode: string;
  title?: string;
  status: EvidenceStatus;
  uncertainty?: 'low' | 'moderate' | 'high';
  style?: 'badge' | 'card' | 'inline' | 'full';
  theme?: 'light' | 'dark';
  showUncertainty?: boolean;
  showScope?: boolean;
  scope?: string[];
  lang?: string;
}

export function ReportEmbed({
  reportCode,
  title,
  status,
  uncertainty,
  style = 'badge',
  theme = 'light',
  showUncertainty = false,
  showScope = false,
  scope = [],
  lang = 'sv'
}: ReportEmbedProps) {
  const statusDef = EVIDENCE_STATUSES[status];
  const isDark = theme === 'dark';
  
  // Badge style (minimal)
  if (style === 'badge') {
    return (
      <a 
        href={`/evidence/${reportCode}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium
          ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'}
          hover:opacity-80 transition-opacity
        `}
      >
        <FileText className="h-3 w-3" />
        <span>{reportCode}</span>
        <span className={statusDef.color}>{statusDef.code}</span>
      </a>
    );
  }

  // Inline style (text only)
  if (style === 'inline') {
    return (
      <span className="inline-flex items-center gap-1 text-sm">
        <span className="opacity-75">
          {lang === 'sv' ? 'Evidensrapport' : 'Evidence Report'}
        </span>
        <a 
          href={`/evidence/${reportCode}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-primary hover:underline"
        >
          {reportCode}
        </a>
        <span>{statusDef.code}</span>
      </span>
    );
  }

  // Card style (medium)
  if (style === 'card') {
    return (
      <Card className={`
        max-w-sm
        ${isDark ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-200'}
      `}>
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <a 
                href={`/evidence/${reportCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-primary hover:underline"
              >
                {reportCode}
              </a>
            </div>
            <Badge 
              variant="outline" 
              className={`${statusDef.bgColor} ${statusDef.borderColor} ${statusDef.color} text-xs`}
            >
              {statusDef.code} {lang === 'sv' ? statusDef.labelLocal.sv : statusDef.label}
            </Badge>
          </div>
          
          {title && (
            <p className={`text-sm mt-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {title}
            </p>
          )}
          
          {showUncertainty && uncertainty && (
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3" />
              <span>
                {lang === 'sv' ? 'Osäkerhet:' : 'Uncertainty:'} {uncertainty}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-current/10">
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Truth Layer Global
            </span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full style (expanded)
  return (
    <Card className={`
      ${isDark ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-200'}
    `}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-primary" />
              <a 
                href={`/evidence/${reportCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-primary hover:underline"
              >
                {reportCode}
              </a>
            </div>
            {title && (
              <h4 className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                {title}
              </h4>
            )}
          </div>
          
          <Badge 
            variant="outline" 
            className={`${statusDef.bgColor} ${statusDef.borderColor} ${statusDef.color}`}
          >
            {status === 'supported' ? <CheckCircle2 className="h-4 w-4 mr-1" /> : null}
            {lang === 'sv' ? statusDef.labelLocal.sv : statusDef.label}
          </Badge>
        </div>
        
        {showUncertainty && uncertainty && (
          <div className="flex items-center gap-2 mt-3 p-2 bg-muted/50 rounded text-sm">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <span>
              <strong>{lang === 'sv' ? 'Osäkerhetsnivå:' : 'Uncertainty level:'}</strong> {uncertainty}
            </span>
          </div>
        )}
        
        {showScope && scope.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1">
              {lang === 'sv' ? 'Omfattning:' : 'Scope:'}
            </p>
            <div className="flex flex-wrap gap-1">
              {scope.map((s, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-current/10">
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Truth Layer Global
          </span>
          <a 
            href={`/evidence/${reportCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            {lang === 'sv' ? 'Visa full rapport' : 'View full report'}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
