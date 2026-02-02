/**
 * Charter Page
 * 
 * Public page displaying the Truth Layer Charter.
 * URL: /charter
 * 
 * The constitutional foundation for the Global Truth Layer.
 */

import React from 'react';
import { 
  CHARTER_PREAMBLE, 
  CHARTER_ARTICLES, 
  CHARTER_CLOSING,
  CHARTER_VERSION,
  CORE_MISSION_STATEMENT,
  type CharterArticle 
} from '@/config/truthLayerCharter';
import { Shield, Lock, Scale, FileText, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

function ArticleCard({ article, lang = 'sv' }: { article: CharterArticle; lang?: 'en' | 'sv' }) {
  const title = lang === 'sv' && article.titleLocal.sv ? article.titleLocal.sv : article.title;
  const content = lang === 'sv' && article.contentLocal?.sv ? article.contentLocal.sv : article.content;
  const prohibitions = lang === 'sv' && article.prohibitionsLocal?.sv ? article.prohibitionsLocal.sv : article.prohibitions;

  return (
    <Card className="border-l-4 border-l-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-muted-foreground font-mono text-sm">
              {lang === 'sv' ? 'Artikel' : 'Article'} {article.number}
            </span>
            <span className="text-foreground">{title}</span>
          </CardTitle>
          {article.isImmutable && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Lock className="h-3 w-3" />
              {lang === 'sv' ? 'Oföränderlig' : 'Immutable'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-sm">
          {content.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        
        {prohibitions && prohibitions.length > 0 && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
              {lang === 'sv' ? 'Förbjudet' : 'Prohibited'}
            </p>
            <ul className="space-y-1 text-sm text-destructive/80">
              {prohibitions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function CharterPage() {
  const lang = 'sv'; // Could be dynamic based on user preference

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scale className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Truth Layer Charter</h1>
          <p className="text-lg text-muted-foreground">
            {lang === 'sv' 
              ? 'Grundlag för världens sanningslager' 
              : 'Constitution for the Global Truth Layer'}
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <span>Version {CHARTER_VERSION.version}</span>
            <span>•</span>
            <span>{lang === 'sv' ? 'Antagen' : 'Adopted'}: {CHARTER_VERSION.adoptedAt}</span>
          </div>
        </header>

        {/* Core Mission */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="py-6 text-center">
            <p className="text-lg font-medium italic">
              "{lang === 'sv' ? CORE_MISSION_STATEMENT.sv : CORE_MISSION_STATEMENT.en}"
            </p>
          </CardContent>
        </Card>

        {/* Preamble */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {lang === 'sv' ? 'Preambel' : 'Preamble'}
          </h2>
          <Card>
            <CardContent className="py-6">
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {lang === 'sv' ? CHARTER_PREAMBLE.sv : CHARTER_PREAMBLE.en}
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* Articles */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {lang === 'sv' ? 'Artiklar' : 'Articles'}
          </h2>
          
          {CHARTER_ARTICLES.map((article) => (
            <ArticleCard key={article.number} article={article} lang={lang} />
          ))}
        </section>

        <Separator className="my-8" />

        {/* Closing */}
        <section className="mb-8">
          <Card className="bg-muted/50">
            <CardContent className="py-6">
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed text-center">
                {lang === 'sv' ? CHARTER_CLOSING.sv : CHARTER_CLOSING.en}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          <p className="mb-2">
            {lang === 'sv' 
              ? 'Denna charter är offentlig och oföränderlig i sin kärna.'
              : 'This charter is public and immutable in its core.'}
          </p>
          <p>
            Checksum: <code className="bg-muted px-1 py-0.5 rounded">{CHARTER_VERSION.checksum}</code>
          </p>
          <div className="mt-4">
            <a 
              href="/trust-log" 
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              {lang === 'sv' ? 'Se ändringslogg' : 'View change log'}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
