/**
 * 🔒 Verification Badge
 * 
 * Shows verification status with QR code and hash.
 * "Ingen kan säga 'ni hittade på'"
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { QrCode, Check, ExternalLink, Copy, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { VerificationProof } from '@/types/realityOnly';

interface VerificationBadgeProps {
  verification: VerificationProof;
  size?: 'sm' | 'md' | 'lg';
  showQROnClick?: boolean;
  className?: string;
}

export function VerificationBadge({
  verification,
  size = 'md',
  showQROnClick = true,
  className,
}: VerificationBadgeProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(verification.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <>
      <button
        onClick={() => showQROnClick && setShowDialog(true)}
        className={cn(
          'inline-flex items-center gap-2 font-mono rounded-md',
          'bg-status-positive/10 text-status-positive border border-status-positive/20',
          'hover:bg-status-positive/20 transition-colors',
          sizeClasses[size],
          className
        )}
      >
        <Check className={cn(
          size === 'sm' && 'h-3 w-3',
          size === 'md' && 'h-4 w-4',
          size === 'lg' && 'h-5 w-5',
        )} />
        <span className="font-medium">Verified</span>
        <span className="opacity-70">{verification.hash.slice(0, 12)}</span>
      </button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Verification Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* QR Code placeholder */}
            <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center">
              <QrCode className="h-24 w-24 text-muted-foreground" />
            </div>

            {/* Hash */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Verification Hash</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-muted rounded text-sm font-mono break-all">
                  {verification.hash}
                </code>
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Sources */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Sources ({verification.sources.length})</p>
              <ul className="text-sm space-y-1">
                {verification.sources.map((source, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span>{source.name}</span>
                    <span className="text-muted-foreground">{source.reliability}% reliable</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Aggregation */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Aggregation Logic</p>
              <p className="text-sm">{verification.aggregationLogic}</p>
            </div>

            {/* Exclusions */}
            {verification.exclusions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Exclusions</p>
                <ul className="text-sm space-y-1">
                  {verification.exclusions.map((exc, i) => (
                    <li key={i} className="text-status-warning">
                      {exc.sourceId}: {exc.reason} ({exc.impact} impact)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timestamps */}
            <div className="flex justify-between text-xs text-muted-foreground pt-4 border-t">
              <span>Generated: {new Date(verification.generatedAt).toLocaleString()}</span>
              <span>Version: {verification.versionStatus}</span>
            </div>

            {/* View full build page */}
            <Button className="w-full" asChild>
              <a href={verification.buildPageUrl} target="_blank" rel="noopener noreferrer">
                View Full Build Page
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
