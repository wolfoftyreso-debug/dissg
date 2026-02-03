/**
 * EVIDENCE LINK BADGE
 * 
 * Displays verification badge with QR code for any data view.
 * - Always extractable from correct aggregations
 * - Click to copy or scan QR
 * - Enter code manually to verify
 */

import { useState } from 'react';
import { Check, Copy, QrCode, ExternalLink, Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { EvidenceLink, EvidenceLinkVerification } from '@/lib/lambda/evidence-link';
import { 
  formatEvidenceLinkDisplay, 
  getVerificationStatusLabel,
  parseShortCode 
} from '@/lib/lambda/evidence-link';

interface EvidenceLinkBadgeProps {
  evidenceLink: EvidenceLink;
  verification?: EvidenceLinkVerification;
  onVerify?: (code: string) => void;
  language?: 'sv' | 'en';
  size?: 'sm' | 'md';
  className?: string;
}

export function EvidenceLinkBadge({
  evidenceLink,
  verification,
  onVerify,
  language = 'sv',
  size = 'sm',
  className,
}: EvidenceLinkBadgeProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [verifyInput, setVerifyInput] = useState('');
  
  const labels = {
    evidenceLink: { sv: 'Verifieringslänk', en: 'Evidence Link' },
    copyCode: { sv: 'Kopiera kod', en: 'Copy code' },
    copied: { sv: 'Kopierad!', en: 'Copied!' },
    showQR: { sv: 'Visa QR-kod', en: 'Show QR code' },
    verifyManual: { sv: 'Verifiera kod', en: 'Verify code' },
    openVerification: { sv: 'Öppna verifiering', en: 'Open verification' },
    scanOrEnter: { 
      sv: 'Skanna QR-koden eller skriv in koden manuellt för att verifiera denna data.', 
      en: 'Scan the QR code or enter the code manually to verify this data.' 
    },
    enterCode: { sv: 'Ange verifieringskod', en: 'Enter verification code' },
    verify: { sv: 'Verifiera', en: 'Verify' },
    generatedAt: { sv: 'Genererad', en: 'Generated' },
    sources: { sv: 'Källor', en: 'Sources' },
  };
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(evidenceLink.short_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleVerifySubmit = () => {
    const parsed = parseShortCode(verifyInput);
    if (parsed && onVerify) {
      onVerify(parsed);
    }
    setShowVerify(false);
    setVerifyInput('');
  };
  
  const displayCode = formatEvidenceLinkDisplay(evidenceLink);
  
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size={size === 'md' ? 'default' : 'sm'}
            className={cn(
              'font-mono gap-2',
              verification?.is_valid && 'border-primary/50',
              className
            )}
          >
            <Shield className={cn(
              'h-3.5 w-3.5',
              verification?.is_valid ? 'text-primary' : 'text-muted-foreground'
            )} />
            <span className="text-xs">{displayCode}</span>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">
                {labels.evidenceLink[language]}
              </h4>
              {verification && (
                <VerificationStatus 
                  status={verification.match_status} 
                  language={language}
                />
              )}
            </div>
            
            {/* Code display */}
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-muted rounded-md font-mono text-sm tracking-wider text-center">
                {displayCode}
              </code>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Description */}
            <p className="text-xs text-muted-foreground">
              {labels.scanOrEnter[language]}
            </p>
            
            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
                onClick={() => setShowQR(true)}
              >
                <QrCode className="h-3.5 w-3.5" />
                <span>{labels.showQR[language]}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
                onClick={() => setShowVerify(true)}
              >
                <Shield className="h-3.5 w-3.5" />
                {labels.verifyManual[language]}
              </Button>
            </div>
            
            {/* Open full verification link */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full gap-2 text-xs"
              asChild
            >
              <a href={evidenceLink.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" />
                {labels.openVerification[language]}
              </a>
            </Button>
            
            {/* Metadata */}
            <div className="pt-2 border-t space-y-1">
              <p className="text-[10px] text-muted-foreground font-mono">
                {labels.generatedAt[language]}: {new Date(evidenceLink.generated_at).toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono">
                {labels.sources[language]}: {evidenceLink.sources.length}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono truncate">
                SHA: {evidenceLink.data_checksum.substring(0, 16)}...
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* QR Code Dialog */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{labels.evidenceLink[language]}</DialogTitle>
            <DialogDescription>
              {labels.scanOrEnter[language]}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-4 py-4">
            {/* QR Code placeholder - would use actual QR library in production */}
            <div className="w-48 h-48 bg-white p-4 rounded-lg">
              <QRCodeDisplay value={evidenceLink.url} />
            </div>
            
            <code className="px-4 py-2 bg-muted rounded-md font-mono text-lg tracking-widest">
              {displayCode}
            </code>
            
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-primary" />
                  {labels.copied[language]}
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  {labels.copyCode[language]}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Manual Verification Dialog */}
      <Dialog open={showVerify} onOpenChange={setShowVerify}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{labels.verifyManual[language]}</DialogTitle>
            <DialogDescription>
              {labels.enterCode[language]}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-2 py-4">
            <Input
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value.toUpperCase())}
              placeholder="XXXX-XXXX"
              className="font-mono text-center text-lg tracking-widest"
              maxLength={9}
            />
            <Button onClick={handleVerifySubmit} disabled={verifyInput.length < 8}>
              {labels.verify[language]}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// =============================================================================
// VERIFICATION STATUS INDICATOR
// =============================================================================

interface VerificationStatusProps {
  status: EvidenceLinkVerification['match_status'];
  language: 'sv' | 'en';
}

function VerificationStatus({ status, language }: VerificationStatusProps) {
  const { label } = getVerificationStatusLabel(status, language);
  
  const config = {
    exact: { color: 'text-primary bg-primary/10', icon: Check },
    data_changed: { color: 'text-warning bg-warning/10', icon: AlertTriangle },
    expired: { color: 'text-muted-foreground bg-muted', icon: AlertTriangle },
    invalid: { color: 'text-destructive bg-destructive/10', icon: AlertTriangle },
  };
  
  const { color, icon: Icon } = config[status];
  
  return (
    <div className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-xs', color)}>
      <Icon className="h-3 w-3" />
      {label}
    </div>
  );
}

// =============================================================================
// QR CODE DISPLAY (Simple placeholder - use actual QR library in production)
// =============================================================================

interface QRCodeDisplayProps {
  value: string;
}

function QRCodeDisplay({ value }: QRCodeDisplayProps) {
  // This is a placeholder. In production, use a proper QR library like 'qrcode.react'
  // Generate a deterministic pattern based on the value
  const hash = value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const size = 8;
  const cells: boolean[][] = [];
  
  for (let y = 0; y < size; y++) {
    cells[y] = [];
    for (let x = 0; x < size; x++) {
      // Create pattern with corner squares (like real QR codes)
      const isCorner = (x < 2 && y < 2) || (x >= size - 2 && y < 2) || (x < 2 && y >= size - 2);
      const isData = ((hash + x * 7 + y * 13) % 3) === 0;
      cells[y][x] = isCorner || isData;
    }
  }
  
  return (
    <div className="w-full h-full grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
      {cells.flat().map((filled, i) => (
        <div
          key={i}
          className={cn(
            'aspect-square',
            filled ? 'bg-black' : 'bg-white'
          )}
        />
      ))}
    </div>
  );
}

export default EvidenceLinkBadge;
