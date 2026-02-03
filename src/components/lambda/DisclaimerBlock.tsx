/**
 * DISCLAIMER BLOCK COMPONENT
 * 
 * Displays required legal disclaimers for Lambda data.
 * Always visible, never hidden behind a toggle.
 */

import { AlertCircle, Info, ShieldCheck, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  generateDisclaimerBlock, 
  generateGDPRStatement,
  generateQRVerificationUrl,
  generateVerificationHash
} from '@/lib/lambda/legal-protection';

interface DisclaimerBlockProps {
  context: string[];
  entityType?: 'index' | 'lambda' | 'correlation' | 'analysis';
  entityId?: string;
  data?: Record<string, unknown>;
  showVerification?: boolean;
  language?: 'sv' | 'en';
  className?: string;
}

export function DisclaimerBlock({
  context,
  entityType = 'index',
  entityId = 'unknown',
  data,
  showVerification = true,
  language = 'sv',
  className,
}: DisclaimerBlockProps) {
  const disclaimerContent = generateDisclaimerBlock(context, language);
  
  // Generate verification if data is provided
  const verificationHash = data 
    ? generateVerificationHash(data, new Date().toISOString())
    : null;
  const verificationUrl = verificationHash
    ? generateQRVerificationUrl(entityType, entityId, verificationHash)
    : null;
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* Main disclaimer alert */}
      <Alert variant="default" className="border-muted">
        <Info className="h-4 w-4" />
        <AlertTitle>{disclaimerContent.title}</AlertTitle>
        <AlertDescription>
          <ul className="mt-2 space-y-2 text-sm">
            {disclaimerContent.disclaimers.map((disclaimer, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>{disclaimer}</span>
              </li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
      
      {/* Methodology note */}
      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
        <ShieldCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-medium mb-1">
            {language === 'sv' ? 'Metodtransparens' : 'Method Transparency'}
          </p>
          <p className="text-muted-foreground">
            {disclaimerContent.methodology_note}
          </p>
        </div>
      </div>
      
      {/* Verification link */}
      {showVerification && verificationUrl && (
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {language === 'sv' ? 'Verifieringskod' : 'Verification code'}:
            </span>
            <code className="font-mono text-xs bg-background px-2 py-0.5 rounded">
              {verificationHash}
            </code>
          </div>
          <a 
            href={verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline"
          >
            <span>{language === 'sv' ? 'Verifiera' : 'Verify'}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
      
      {/* GDPR statement - compact */}
      <details className="text-xs">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
          {language === 'sv' ? 'GDPR-information' : 'GDPR Information'}
        </summary>
        <pre className="mt-2 p-3 bg-muted/30 rounded text-muted-foreground whitespace-pre-wrap">
          {generateGDPRStatement(language)}
        </pre>
      </details>
    </div>
  );
}

export default DisclaimerBlock;
