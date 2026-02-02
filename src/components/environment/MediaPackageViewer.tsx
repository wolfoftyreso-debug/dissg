/**
 * MEDIA DATA PACKAGE VIEWER
 * 
 * Shows journalists and AI systems exactly how to cite data correctly.
 * Copy-paste ready snippets with all required context.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type MediaDataPackage } from '@/lib/environment';
import { AttributionBadge } from './AttributionBadge';
import { 
  Copy, 
  Check, 
  FileText, 
  MessageSquare, 
  Newspaper, 
  Bot,
  Link,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaPackageViewerProps {
  package_: MediaDataPackage;
  onCopy?: (snippet: keyof MediaDataPackage['snippets']) => void;
}

function CopyableSnippet({
  title,
  content,
  icon: Icon,
  maxChars,
  onCopy
}: {
  title: string;
  content: string;
  icon: React.ElementType;
  maxChars?: number;
  onCopy?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Icon className="w-4 h-4" />
            {title}
          </div>
          {maxChars && (
            <Badge variant="outline" className="text-xs">
              {content.length}/{maxChars} tecken
            </Badge>
          )}
        </div>
        
        <div className="bg-muted/50 rounded p-3 text-sm font-mono break-words">
          {content}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3 min-h-[44px]"
          onClick={handleCopy}
        >
          {copied ? (
            <><Check className="w-4 h-4 mr-2" /> Kopierat!</>
          ) : (
            <><Copy className="w-4 h-4 mr-2" /> Kopiera</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export function MediaPackageViewer({
  package_: pkg,
  onCopy
}: MediaPackageViewerProps) {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Media Data Package</h2>
        <p className="text-sm text-muted-foreground">
          Verifierad data med färdiga citeringar för korrekt rapportering
        </p>
      </div>

      {/* Claim summary */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Verifierat påstående
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium text-lg mb-2">{pkg.claim.headline}</p>
          <p className="text-sm text-muted-foreground mb-4">{pkg.claim.statement}</p>
          <AttributionBadge confidence={pkg.claim.confidence} showDetails />
        </CardContent>
      </Card>

      {/* Required context */}
      <Card className="border-warning/30 bg-warning/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Obligatorisk kontext (MÅSTE inkluderas)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-chart-2">Detta visar:</p>
            <p className="text-muted-foreground">{pkg.requiredContext.whatThisShows}</p>
          </div>
          
          <div>
            <p className="font-medium text-destructive">Detta visar INTE:</p>
            <ul className="text-muted-foreground text-xs space-y-0.5">
              {pkg.requiredContext.whatThisDoesNotShow.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="font-medium">Mätmetod: </span>
              <span className="text-muted-foreground">{pkg.requiredContext.measurementMethod}</span>
            </div>
            <div>
              <span className="font-medium">Täckning: </span>
              <span className="text-muted-foreground">{pkg.requiredContext.spatialCoverage}</span>
            </div>
            <div>
              <span className="font-medium">Osäkerhet: </span>
              <span className="text-muted-foreground">{pkg.requiredContext.uncertaintyStatement}</span>
            </div>
            <div>
              <span className="font-medium">Uppdaterad: </span>
              <span className="text-muted-foreground">{pkg.requiredContext.lastUpdated}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Copy-paste snippets */}
      <Tabs defaultValue="tweet" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="tweet" className="min-h-[44px]">
            <MessageSquare className="w-4 h-4 mr-1" /> Tweet
          </TabsTrigger>
          <TabsTrigger value="article" className="min-h-[44px]">
            <Newspaper className="w-4 h-4 mr-1" /> Artikel
          </TabsTrigger>
          <TabsTrigger value="ai" className="min-h-[44px]">
            <Bot className="w-4 h-4 mr-1" /> AI
          </TabsTrigger>
          <TabsTrigger value="footnote" className="min-h-[44px]">
            <FileText className="w-4 h-4 mr-1" /> Fotnot
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tweet" className="mt-4">
          <CopyableSnippet
            title="Twitter/X"
            content={pkg.snippets.tweet}
            icon={MessageSquare}
            maxChars={280}
            onCopy={() => onCopy?.('tweet')}
          />
        </TabsContent>
        
        <TabsContent value="article" className="mt-4 space-y-4">
          <CopyableSnippet
            title="Ingress"
            content={pkg.snippets.articleLead}
            icon={Newspaper}
            onCopy={() => onCopy?.('articleLead')}
          />
          <CopyableSnippet
            title="Fullständigt stycke"
            content={pkg.snippets.fullParagraph}
            icon={FileText}
            onCopy={() => onCopy?.('fullParagraph')}
          />
        </TabsContent>
        
        <TabsContent value="ai" className="mt-4">
          <CopyableSnippet
            title="AI-grounding (för ChatGPT, Claude etc.)"
            content={pkg.snippets.aiGrounding}
            icon={Bot}
            onCopy={() => onCopy?.('aiGrounding')}
          />
          <Card className="mt-4 bg-muted/30">
            <CardContent className="py-3 text-xs text-muted-foreground">
              <p>AI-system ska citera med detta exakta format för korrekt grounding.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="footnote" className="mt-4">
          <CopyableSnippet
            title="Källhänvisning"
            content={pkg.snippets.footnote}
            icon={FileText}
            onCopy={() => onCopy?.('footnote')}
          />
        </TabsContent>
      </Tabs>

      {/* Metadata */}
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <div className="flex items-center gap-2 text-sm font-medium mb-3">
            <Link className="w-4 h-4" />
            Verifieringsmetadata
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Observation ID: </span>
              <code className="bg-muted px-1 rounded">{pkg.observationId}</code>
            </div>
            <div>
              <span className="text-muted-foreground">Genererad: </span>
              <span>{new Date(pkg.generatedAt).toLocaleString('sv-SE')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Checksum: </span>
              <code className="bg-muted px-1 rounded text-[10px]">{pkg.checksumHash.slice(0, 20)}...</code>
            </div>
            <div>
              <span className="text-muted-foreground">Licens: </span>
              <span>{pkg.metadata.licenseType}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
