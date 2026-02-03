/**
 * LAMBDA VERIFICATION BADGE
 * 
 * Anti-screenshot manipulation:
 * - Every graph can be verified via QR/hash
 * - Every graph can be recreated exactly via URL
 * 
 * This KILLS social media manipulation.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink,
  Clock,
  Hash
} from 'lucide-react';
import {
  type VerificationData,
  type AuditRecord,
  VERIFICATION_PROMPT,
} from '@/config/lambdaAntiManipulation';

interface LambdaVerificationBadgeProps {
  verification: VerificationData;
  audit: AuditRecord;
  language?: 'sv' | 'en';
  compact?: boolean;
}

export const LambdaVerificationBadge: React.FC<LambdaVerificationBadgeProps> = ({
  verification,
  audit,
  language = 'sv',
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(verification.verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (compact) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-6 text-xs text-muted-foreground"
        onClick={() => setIsOpen(true)}
      >
        <Shield className="h-3 w-3 mr-1" />
        {verification.contentHash.substring(0, 8)}...
      </Button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors text-xs"
      >
        <Shield className="h-3 w-3 text-primary" />
        <span className="text-muted-foreground">
          {language === 'sv' ? 'Verifierbar' : 'Verifiable'}
        </span>
        <code className="font-mono text-primary">
          {verification.contentHash.substring(0, 8)}
        </code>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {language === 'sv' ? 'Verifieringsdetaljer' : 'Verification Details'}
            </DialogTitle>
            <DialogDescription>
              {language === 'sv'
                ? 'Denna visualisering kan verifieras och återskapas exakt.'
                : 'This visualization can be verified and recreated exactly.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Content hash */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Hash className="h-3 w-3" />
                {language === 'sv' ? 'Innehållshash (SHA-256)' : 'Content Hash (SHA-256)'}
              </div>
              <code className="block text-xs font-mono bg-muted p-2 rounded break-all">
                {verification.contentHash}
              </code>
            </div>

            {/* Version ID */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">
                {language === 'sv' ? 'Version-ID' : 'Version ID'}
              </div>
              <Badge variant="outline" className="font-mono">
                {audit.versionId}
              </Badge>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {language === 'sv' ? 'Genererad' : 'Generated'}
                </div>
                <div className="text-sm font-mono">
                  {new Date(verification.generatedAt).toLocaleString(language === 'sv' ? 'sv-SE' : 'en-US')}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  {language === 'sv' ? 'Metodversion' : 'Method Version'}
                </div>
                <div className="text-sm font-mono">{audit.methodVersion}</div>
              </div>
            </div>

            {/* Verification URL */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                {language === 'sv' ? 'Verifieringslänk' : 'Verification URL'}
              </div>
              <div className="flex gap-2">
                <code className="flex-1 text-xs font-mono bg-muted p-2 rounded truncate">
                  {verification.verificationUrl}
                </code>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* QR placeholder */}
            <div className="flex items-center justify-center p-6 bg-muted rounded-lg">
              <div className="text-center">
                <QrCode className="h-16 w-16 mx-auto text-muted-foreground/50" />
                <p className="text-xs text-muted-foreground mt-2">
                  {language === 'sv' ? 'QR-kod för verifiering' : 'QR code for verification'}
                </p>
              </div>
            </div>

            {/* Purpose explanation */}
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-xs text-muted-foreground">
                {language === 'sv'
                  ? 'Om någon delar en skärmdump av denna visualisering kan vem som helst verifiera att den är äkta genom att besöka verifieringslänken.'
                  : 'If someone shares a screenshot of this visualization, anyone can verify it\'s authentic by visiting the verification link.'}
              </p>
            </div>

            {/* Open verification page */}
            <Button className="w-full" asChild>
              <a href={verification.verificationUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                {VERIFICATION_PROMPT[language]}
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LambdaVerificationBadge;
