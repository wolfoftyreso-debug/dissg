/**
 * Claim Card
 * 
 * Displays a claim with its evidence status and linked report.
 * "We will do X to improve Y" → Required: Linked Evidence Report ID
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, FileText, Quote, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EvidenceStatusBadge } from './EvidenceStatusBadge';
import { 
  type EvidenceStatus,
  VALUE_DRIVEN_TEMPLATE 
} from '@/config/evidenceMechanism';

interface ClaimCardProps {
  claim: {
    id: string;
    claimText: string;
    claimTextLocal?: Record<string, string>;
    linkedReportId: string | null;
    linkedReportCode: string | null;
    evidenceStatus: EvidenceStatus;
    claimedBy: string;
    claimedAt: string;
    context: string;
    isValueDriven: boolean;
    valueStatement?: string;
  };
  lang?: string;
  showContext?: boolean;
}

export function ClaimCard({ claim, lang = 'sv', showContext = true }: ClaimCardProps) {
  const claimText = lang === 'sv' && claim.claimTextLocal?.sv 
    ? claim.claimTextLocal.sv 
    : claim.claimText;

  return (
    <Card className={`
      ${claim.evidenceStatus === 'unsupported' ? 'border-l-4 border-l-red-500' : ''}
      ${claim.evidenceStatus === 'weak' ? 'border-l-4 border-l-yellow-500' : ''}
      ${claim.evidenceStatus === 'supported' ? 'border-l-4 border-l-green-500' : ''}
    `}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-2">
            <Quote className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <CardTitle className="text-base font-medium leading-snug">
              "{claimText}"
            </CardTitle>
          </div>
          <EvidenceStatusBadge 
            status={claim.evidenceStatus} 
            reportCode={claim.linkedReportCode}
            lang={lang}
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Value-driven declaration */}
        {claim.isValueDriven && (
          <div className="flex items-start gap-2 p-2 bg-muted rounded text-sm">
            <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-muted-foreground italic">
              {lang === 'sv' 
                ? VALUE_DRIVEN_TEMPLATE.statementLocal.sv 
                : VALUE_DRIVEN_TEMPLATE.statement}
            </p>
          </div>
        )}

        {/* Linked report */}
        {claim.linkedReportCode && (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <Link 
              to={`/evidence/${claim.linkedReportCode}`}
              className="text-sm text-primary hover:underline font-mono"
            >
              {claim.linkedReportCode}
            </Link>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* No report linked */}
        {!claim.linkedReportCode && !claim.isValueDriven && (
          <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-100 rounded text-sm">
            <span className="text-red-600">
              {lang === 'sv' 
                ? 'Ingen evidensrapport kopplad' 
                : 'No evidence report linked'}
            </span>
          </div>
        )}

        {/* Context */}
        {showContext && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
            <span>{claim.claimedBy}</span>
            <span>•</span>
            <span>{claim.context}</span>
            <span>•</span>
            <span>{new Date(claim.claimedAt).toLocaleDateString(lang === 'sv' ? 'sv-SE' : 'en-US')}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
