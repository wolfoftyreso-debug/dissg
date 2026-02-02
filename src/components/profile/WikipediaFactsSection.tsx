import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, User, Calendar, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { LEGAL_DISCLAIMERS } from '@/config/publicProfileConfig';

interface WikipediaFactsSectionProps {
  official: {
    full_name: string;
    party_affiliation?: string | null;
    birth_year?: number | null;
    wikipedia_url?: string | null;
    last_verified_at?: string | null;
  };
  className?: string;
}

export function WikipediaFactsSection({ official, className = '' }: WikipediaFactsSectionProps) {
  const labels = LEGAL_DISCLAIMERS.wikipediaAttribution;
  const verification = LEGAL_DISCLAIMERS.verification;
  
  const formatVerificationDate = (dateStr?: string | null) => {
    if (!dateStr) return verification.unknown;
    return format(new Date(dateStr), 'd MMMM yyyy', { locale: sv });
  };

  return (
    <Card className={`border-2 border-muted ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              {labels.title}
            </CardTitle>
            <CardDescription className="mt-1">
              {labels.text}
            </CardDescription>
          </div>
          {official.wikipedia_url && (
            <Button variant="outline" size="sm" asChild>
              <a 
                href={official.wikipedia_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {labels.linkText}
              </a>
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Biografiska fakta */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Namn */}
          <div>
            <div className="text-sm font-medium text-muted-foreground">Namn</div>
            <div className="text-lg font-semibold">{official.full_name}</div>
          </div>
          
          {/* Parti */}
          {official.party_affiliation && (
            <div>
              <div className="text-sm font-medium text-muted-foreground">Parti</div>
              <Badge variant="secondary" className="mt-1">
                {official.party_affiliation}
              </Badge>
            </div>
          )}
          
          {/* Födelseår */}
          {official.birth_year && (
            <div>
              <div className="text-sm font-medium text-muted-foreground">Födelseår</div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {official.birth_year}
              </div>
            </div>
          )}
        </div>
        
        <Separator />
        
        {/* Verifieringsstatus */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{verification.prefix}</span>
          </div>
          <span className="font-medium">
            {formatVerificationDate(official.last_verified_at)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
