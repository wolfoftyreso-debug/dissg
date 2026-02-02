import { Shield, Scale, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OFFICIAL_POSITION, SOURCE_DISCLAIMER } from '@/config/dataPositioningConfig';

interface SystemFooterProps {
  /** Visa kort eller fullständig version */
  variant?: 'full' | 'compact';
  
  /** Språk */
  lang?: 'sv' | 'en';
  
  className?: string;
}

/**
 * WAVE 7 BLOCK BC/BI: System Footer with Data Positioning
 * 
 * Visar alltid den officiella positionen i footern.
 * SKA finnas på ALLA sidor i systemet.
 */
export function SystemFooter({
  variant = 'compact',
  lang = 'sv',
  className = '',
}: SystemFooterProps) {
  const currentYear = new Date().getFullYear();

  if (variant === 'compact') {
    return (
      <footer className={`border-t pt-6 mt-8 ${className}`}>
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Officiell position - alltid synlig */}
          <div className="flex items-start gap-3 text-xs text-muted-foreground">
            <Shield className="h-4 w-4 shrink-0 mt-0.5 text-primary/60" />
            <div className="space-y-2">
              <p className="leading-relaxed whitespace-pre-line">
                {OFFICIAL_POSITION[lang]}
              </p>
              <p className="text-[10px] italic">
                {SOURCE_DISCLAIMER[lang]}
              </p>
            </div>
          </div>

          <Separator />

          {/* Länkar */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>© {currentYear} NOGF</span>
              <a href="/about" className="underline underline-offset-2 hover:text-foreground transition-colors">
                {lang === 'sv' ? 'Om systemet' : 'About'}
              </a>
              <a href="/metod" className="underline underline-offset-2 hover:text-foreground transition-colors">
                {lang === 'sv' ? 'Metod' : 'Methodology'}
              </a>
              <a href="/kallor" className="underline underline-offset-2 hover:text-foreground transition-colors">
                {lang === 'sv' ? 'Datakällor' : 'Data sources'}
              </a>
            </div>
            
            <AboutSystemDialog lang={lang} />
          </div>
        </div>
      </footer>
    );
  }

  // Full variant
  return (
    <footer className={`border-t pt-8 mt-12 pb-8 ${className}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Huvudsektion */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Officiell position */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold">
                {lang === 'sv' ? 'Om plattformens datahantering' : 'About platform data handling'}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
              {OFFICIAL_POSITION[lang]}
            </p>
            <p className="text-[10px] text-muted-foreground italic p-2 bg-muted/30 rounded">
              {SOURCE_DISCLAIMER[lang]}
            </p>
          </div>

          {/* Länkar och info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">
                {lang === 'sv' ? 'Resurser' : 'Resources'}
              </h3>
              <ul className="space-y-1 text-xs">
                <li>
                  <a href="/about" className="text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
                    {lang === 'sv' ? 'Om systemet' : 'About the system'}
                  </a>
                </li>
                <li>
                  <a href="/metod" className="text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
                    {lang === 'sv' ? 'Metodbeskrivning' : 'Methodology'}
                  </a>
                </li>
                <li>
                  <a href="/kallor" className="text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
                    {lang === 'sv' ? 'Alla datakällor' : 'All data sources'}
                  </a>
                </li>
                <li>
                  <a href="/api" className="text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
                    {lang === 'sv' ? 'API-dokumentation' : 'API documentation'}
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">
                {lang === 'sv' ? 'Öppenhet' : 'Transparency'}
              </h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <Shield className="h-3 w-3 text-green-600" />
                  {lang === 'sv' ? 'Ingen data modifieras' : 'No data is modified'}
                </li>
                <li className="flex items-center gap-1.5">
                  <Shield className="h-3 w-3 text-green-600" />
                  {lang === 'sv' ? 'Alla metoder är publika' : 'All methods are public'}
                </li>
                <li className="flex items-center gap-1.5">
                  <Shield className="h-3 w-3 text-green-600" />
                  {lang === 'sv' ? 'Full spårbarhet' : 'Full traceability'}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator />

        {/* Copyright */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] text-muted-foreground">
          <span>© {currentYear} NOGF — Nationellt Observationssystem för Grundläggande Funktioner</span>
          <AboutSystemDialog lang={lang} />
        </div>
      </div>
    </footer>
  );
}

/**
 * Dialog med fullständig systeminformation
 */
function AboutSystemDialog({ lang }: { lang: 'sv' | 'en' }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]">
          <Info className="h-3 w-3 mr-1" />
          {lang === 'sv' ? 'Mer information' : 'More info'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            {lang === 'sv' ? 'Om systemet' : 'About the system'}
          </DialogTitle>
          <DialogDescription>
            {lang === 'sv' 
              ? 'Nationellt Observationssystem för Grundläggande Funktioner (NOGF)'
              : 'National Observation System for Fundamental Functions (NOGF)'
            }
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* Kärnprincip */}
            <section>
              <h4 className="text-sm font-semibold mb-2">
                {lang === 'sv' ? 'Kärnprincip' : 'Core Principle'}
              </h4>
              <div className="p-3 bg-muted/30 rounded-lg text-sm whitespace-pre-line">
                {OFFICIAL_POSITION[lang]}
              </div>
            </section>

            <Separator />

            {/* Vad vi gör */}
            <section>
              <h4 className="text-sm font-semibold mb-2">
                {lang === 'sv' ? 'Vad plattformen gör' : 'What the platform does'}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ {lang === 'sv' ? 'Samlar in öppen data från myndigheter' : 'Collects open data from authorities'}</li>
                <li>✓ {lang === 'sv' ? 'Strukturerar och visualiserar' : 'Structures and visualizes'}</li>
                <li>✓ {lang === 'sv' ? 'Visar trender och förändringar' : 'Shows trends and changes'}</li>
                <li>✓ {lang === 'sv' ? 'Möjliggör jämförelser' : 'Enables comparisons'}</li>
              </ul>
            </section>

            <Separator />

            {/* Vad vi inte gör */}
            <section>
              <h4 className="text-sm font-semibold mb-2">
                {lang === 'sv' ? 'Vad plattformen inte gör' : 'What the platform does not do'}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✗ {lang === 'sv' ? 'Producerar egen data' : 'Produce original data'}</li>
                <li>✗ {lang === 'sv' ? 'Ändrar eller "justerar" värden' : 'Modify or "adjust" values'}</li>
                <li>✗ {lang === 'sv' ? 'Drar slutsatser eller värderar' : 'Draw conclusions or make judgments'}</li>
                <li>✗ {lang === 'sv' ? 'Rekommenderar åtgärder' : 'Recommend actions'}</li>
              </ul>
            </section>

            <Separator />

            {/* Ansvar */}
            <section>
              <h4 className="text-sm font-semibold mb-2">
                {lang === 'sv' ? 'Ansvarsfördelning' : 'Responsibility'}
              </h4>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-sm text-amber-800 dark:text-amber-200">
                {SOURCE_DISCLAIMER[lang]}
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
