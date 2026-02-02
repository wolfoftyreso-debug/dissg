import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, MessageSquare } from 'lucide-react';
import { LEGAL_DISCLAIMERS } from '@/config/publicProfileConfig';

interface CorrectionNoticeProps {
  wikipediaUrl?: string | null;
  className?: string;
}

export function CorrectionNotice({ wikipediaUrl, className = '' }: CorrectionNoticeProps) {
  const labels = LEGAL_DISCLAIMERS.correction;

  return (
    <Alert className={`bg-card ${className}`}>
      <MessageSquare className="h-4 w-4" />
      <AlertTitle>{labels.title}</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm whitespace-pre-line mb-3">{labels.text}</p>
        {wikipediaUrl && (
          <Button variant="outline" size="sm" asChild>
            <a 
              href={wikipediaUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Redigera på Wikipedia
            </a>
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
