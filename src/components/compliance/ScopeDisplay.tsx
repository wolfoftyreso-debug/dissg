/**
 * SCOPE DISPLAY COMPONENT
 * 
 * Shows what a dataset covers and doesn't cover.
 * Always visible when viewing any data.
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ScopeDeclaration } from '@/types/compliance';

interface ScopeDisplayProps {
  scope: ScopeDeclaration;
  variant?: 'compact' | 'full';
  className?: string;
}

export function ScopeDisplay({ 
  scope, 
  variant = 'compact',
  className = '' 
}: ScopeDisplayProps) {
  const [expanded, setExpanded] = useState(variant === 'full');
  
  if (variant === 'compact' && !expanded) {
    return (
      <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
        <Info className="h-3 w-3" />
        <span>Scope: {scope.entity_name}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1 text-xs"
          onClick={() => setExpanded(true)}
        >
          <ChevronDown className="h-3 w-3" />
          Details
        </Button>
      </div>
    );
  }
  
  return (
    <div className={`rounded-lg border bg-muted/50 p-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-primary" />
          <h4 className="font-medium text-foreground">
            Data Scope: {scope.entity_name}
          </h4>
        </div>
        {variant === 'compact' && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
            onClick={() => setExpanded(false)}
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* What this covers */}
        <div>
          <h5 className="text-sm font-medium text-green-700 dark:text-green-400 mb-2 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            This data covers
          </h5>
          <ul className="text-xs text-muted-foreground space-y-1">
            {scope.covers.map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </div>
        
        {/* What this does NOT cover */}
        <div>
          <h5 className="text-sm font-medium text-destructive mb-2 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            This data does NOT cover
          </h5>
          <ul className="text-xs text-muted-foreground space-y-1">
            {scope.does_not_cover.map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Confidence and validity */}
      <div className="mt-4 pt-3 border-t border-border flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="font-medium">Confidence:</span>
          <span className={getConfidenceColor(scope.confidence_level)}>
            {scope.confidence_level}
          </span>
        </span>
        {scope.geographic_scope.length > 0 && (
          <span>
            <span className="font-medium">Geographic:</span>{' '}
            {scope.geographic_scope.join(', ')}
          </span>
        )}
        {scope.temporal_validity_start && scope.temporal_validity_end && (
          <span>
            <span className="font-medium">Period:</span>{' '}
            {scope.temporal_validity_start} to {scope.temporal_validity_end}
          </span>
        )}
      </div>
      
      {/* Invalid uses */}
      {scope.invalid_uses.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-destructive/80">
            <span className="font-medium">Not valid for:</span>{' '}
            {scope.invalid_uses.join('; ')}
          </p>
        </div>
      )}
    </div>
  );
}

function getConfidenceColor(level: string): string {
  switch (level) {
    case 'high':
      return 'text-green-600 dark:text-green-400';
    case 'medium':
      return 'text-amber-600 dark:text-amber-400';
    case 'low':
      return 'text-orange-600 dark:text-orange-400';
    case 'experimental':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-muted-foreground';
  }
}

export default ScopeDisplay;
