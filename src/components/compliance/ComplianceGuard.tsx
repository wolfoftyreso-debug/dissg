/**
 * COMPLIANCE GUARD COMPONENT
 * 
 * Wraps any data display with compliance checking.
 * Ensures all data is displayed with proper context and disclaimers.
 * 
 * Usage:
 * <ComplianceGuard query={userQuery} dataType="health">
 *   <YourDataComponent />
 * </ComplianceGuard>
 */

import React from 'react';
import { Shield, AlertTriangle, Info, Ban } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  checkQueryCompliance, 
  getBlockResponse,
  getRedirectSuggestion 
} from '@/lib/compliance/query-filter';
import { 
  checkEthicsCompliance,
  isIndividualDataRequest,
  isPredictiveRequest,
  isDosageRequest,
  isTreatmentComparisonRequest
} from '@/lib/compliance/ethics-enforcer';
import { getLegalDisclaimers } from '@/lib/compliance';

interface ComplianceGuardProps {
  children: React.ReactNode;
  query?: string;
  dataType?: string;
  groupSize?: number;
  jurisdiction?: string;
  showDisclaimers?: boolean;
  className?: string;
}

export function ComplianceGuard({
  children,
  query,
  dataType = 'default',
  groupSize,
  jurisdiction = 'GLOBAL',
  showDisclaimers = true,
  className = ''
}: ComplianceGuardProps) {
  // Check query compliance if query provided
  if (query) {
    const compliance = checkQueryCompliance(query);
    
    if (!compliance.allowed) {
      return (
        <BlockedQueryDisplay 
          patterns={compliance.blocked_patterns.map(p => p.id)}
          jurisdiction={jurisdiction}
        />
      );
    }
    
    // Check for specific dangerous patterns
    if (isIndividualDataRequest(query)) {
      return (
        <BlockedQueryDisplay 
          patterns={['individual_data']}
          jurisdiction={jurisdiction}
        />
      );
    }
    
    if (isPredictiveRequest(query)) {
      return (
        <BlockedQueryDisplay 
          patterns={['predictive_request']}
          jurisdiction={jurisdiction}
        />
      );
    }
    
    if (isDosageRequest(query)) {
      return (
        <BlockedQueryDisplay 
          patterns={['dosage_request']}
          jurisdiction={jurisdiction}
        />
      );
    }
    
    if (isTreatmentComparisonRequest(query)) {
      return (
        <BlockedQueryDisplay 
          patterns={['treatment_comparison']}
          jurisdiction={jurisdiction}
        />
      );
    }
  }
  
  // Check ethics compliance
  const ethicsCheck = checkEthicsCompliance(dataType, groupSize);
  if (!ethicsCheck.passed) {
    return (
      <EthicsViolationDisplay 
        violations={ethicsCheck.violated_constraints}
      />
    );
  }
  
  // Get disclaimers
  const disclaimers = getLegalDisclaimers(jurisdiction);
  
  return (
    <div className={`compliance-guard ${className}`}>
      {/* Warnings if any */}
      {ethicsCheck.warnings.length > 0 && (
        <Alert className="mb-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-200">
            Data Context
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            {ethicsCheck.warnings.map((w, i) => (
              <p key={i} className="text-sm">{w}</p>
            ))}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Main content */}
      {children}
      
      {/* Disclaimers */}
      {showDisclaimers && disclaimers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-muted">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              {disclaimers.slice(0, 2).map((d, i) => (
                <p key={i}>{d}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Display for blocked queries
 */
function BlockedQueryDisplay({ 
  patterns,
  jurisdiction
}: { 
  patterns: string[];
  jurisdiction: string;
}) {
  const blockResponse = getBlockResponse(patterns);
  const redirect = getRedirectSuggestion(patterns);
  const disclaimers = getLegalDisclaimers(jurisdiction);
  
  return (
    <div className="rounded-lg border-2 border-destructive bg-destructive/10 p-6">
      <div className="flex gap-4">
        <Ban className="h-8 w-8 text-destructive flex-shrink-0" />
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-destructive">
            Query Outside Platform Scope
          </h3>
          <p className="text-foreground/80">
            {blockResponse}
          </p>
          {redirect && (
            <div className="bg-background rounded p-3 border border-border">
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    What you can explore:
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {redirect}
                  </p>
                </div>
              </div>
            </div>
          )}
          {disclaimers.length > 0 && (
            <p className="text-xs text-muted-foreground italic border-t border-border pt-3 mt-3">
              {disclaimers[0]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Display for ethics violations
 */
function EthicsViolationDisplay({ 
  violations 
}: { 
  violations: Array<{ constraint_name: string; constraint_description: string; rationale: string }>;
}) {
  return (
    <div className="rounded-lg border-2 border-destructive bg-destructive/10 p-6">
      <div className="flex gap-4">
        <Shield className="h-8 w-8 text-destructive flex-shrink-0" />
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-destructive">
            Data Request Blocked
          </h3>
          <p className="text-foreground/80">
            This request violates platform ethics constraints.
          </p>
          <div className="space-y-2">
            {violations.map((v, i) => (
              <div key={i} className="bg-background rounded p-3 border border-border">
                <p className="text-sm font-medium text-foreground">
                  {v.constraint_name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {v.constraint_description}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground italic">
            These constraints exist to prevent harm and protect data integrity.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ComplianceGuard;
