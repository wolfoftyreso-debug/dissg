/**
 * 🔒 Share Validator
 * 
 * Validates and blocks sharing that lacks required context.
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Share2, AlertTriangle, Check, X, Copy, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { validateSharing } from '@/lib/realityOnly/sharingBlocker';
import type { VerificationProof, DataAvailability } from '@/types/realityOnly';

interface ShareValidatorProps {
  verification: VerificationProof;
  dataAvailability: DataAvailability;
  contentType: 'graph' | 'wrapped_step' | 'reality_check' | 'comparison' | 'correlation';
  hasSourceAttribution?: boolean;
  hasUncertainty?: boolean;
  hasLimitations?: boolean;
  hasTimeContext?: boolean;
  hasScopeContext?: boolean;
  onShare?: (platform: string) => void;
  className?: string;
}

export function ShareValidator({
  verification,
  dataAvailability,
  contentType,
  hasSourceAttribution = true,
  hasUncertainty = true,
  hasLimitations = true,
  hasTimeContext = true,
  hasScopeContext = true,
  onShare,
  className,
}: ShareValidatorProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const validation = validateSharing({
    hasSourceAttribution,
    hasUncertainty,
    hasLimitations,
    hasVerification: true,
    hasTimeContext,
    hasScopeContext,
    dataAvailability,
    contentType,
  });

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/verify/${verification.hash}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    if (!validation.canShare) return;
    onShare?.(platform);
    setShowDialog(false);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowDialog(true)}
        className={className}
      >
        <Share2 className="h-4 w-4 mr-2" />
        Dela
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Dela innehåll
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Validation status */}
            <div className={cn(
              'p-4 rounded-lg',
              validation.canShare 
                ? 'bg-status-positive/10 border border-status-positive/20'
                : 'bg-status-negative/10 border border-status-negative/20'
            )}>
              <div className="flex items-start gap-3">
                {validation.canShare ? (
                  <Check className="h-5 w-5 text-status-positive shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-status-negative shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={cn(
                    'font-medium',
                    validation.canShare ? 'text-status-positive' : 'text-status-negative'
                  )}>
                    {validation.canShare 
                      ? 'Innehållet kan delas'
                      : 'Delning blockerad'
                    }
                  </p>
                  {!validation.canShare && validation.blockReasons.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {validation.blockReasons[0].messageLocal.sv || validation.blockReasons[0].message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Required context checklist */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Obligatorisk kontext</p>
              <div className="space-y-2">
                {[
                  { key: 'sources', label: 'Källhänvisning', has: hasSourceAttribution },
                  { key: 'uncertainty', label: 'Osäkerhetsintervall', has: hasUncertainty },
                  { key: 'limitations', label: 'Begränsningar', has: hasLimitations },
                  { key: 'time', label: 'Tidskontext', has: hasTimeContext },
                  { key: 'verification', label: 'Verifieringslänk', has: true },
                ].map(item => (
                  <div key={item.key} className="flex items-center gap-2 text-sm">
                    {item.has ? (
                      <Check className="h-4 w-4 text-status-positive" />
                    ) : (
                      <X className="h-4 w-4 text-status-negative" />
                    )}
                    <span className={item.has ? '' : 'text-status-negative'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warnings */}
            {validation.warnings.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-status-warning">Varningar</p>
                {validation.warnings.map((warning, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    {warning.message}
                  </p>
                ))}
              </div>
            )}

            {/* Mandatory disclaimer preview */}
            {validation.canShare && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Obligatorisk ansvarsfriskrivning</p>
                <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                  {validation.mandatoryDisclaimer}
                </div>
              </div>
            )}

            {/* Share options */}
            {validation.canShare && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Dela via</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCopyLink}
                  >
                    {copied ? <CheckCheck className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? 'Kopierad!' : 'Kopiera länk'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Stäng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
