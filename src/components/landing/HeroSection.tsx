/**
 * HERO SECTION
 * 
 * Enterprise-grade. Myndighetsrelevant. Ingen säljton.
 * GLOBALT PERSPEKTIV - jurisdiktionsneutral.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onStartDiagnosis?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartDiagnosis }) => {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Diagnostisk infrastruktur<br />
              för samhällsstyrning
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              DISSG tillhandahåller strukturerad åtkomst till 184 standardiserade indikatorer 
              för 195 jurisdiktioner. Observationsbaserat. Metodologiskt transparent. 
              Agnostiskt till utfall.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                onClick={onStartDiagnosis}
              >
                Öppna systemet
              </Button>
              <Link to="/login">
                <Button variant="ghost" size="lg" className="text-primary hover:text-primary/80">
                  Logga in
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground font-mono">
              All data är öppen och spårbar. Inga dolda algoritmer. Inga rekommendationer.
            </p>
          </div>

          {/* Right: Visual element (global device mockup) */}
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              {/* Phone mockup */}
              <div className="w-64 h-[500px] bg-card border-2 border-border rounded-3xl shadow-lg overflow-hidden">
                {/* Phone header */}
                <div className="h-8 bg-muted flex items-center justify-center">
                  <div className="w-20 h-1 bg-border rounded-full" />
                </div>
                
                {/* Phone content - GLOBAL perspective */}
                <div className="p-4 space-y-4">
                  <div className="text-xs text-muted-foreground font-mono">[DISSG v1.0]</div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-sm">
                      <div className="text-[10px] text-muted-foreground mb-1 font-mono">GLOBAL λ-INDEX</div>
                      <div className="text-2xl font-bold font-mono">0.76</div>
                      <div className="text-xs text-muted-foreground font-mono">1990–2024 Δ +0.12</div>
                    </div>
                    
                    {/* Global domains - not country-specific */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-muted-foreground">[VIT]</span>
                        <span className="text-foreground">0.81</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-muted-foreground">[FÖR]</span>
                        <span className="text-foreground">0.74</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-muted-foreground">[KAP]</span>
                        <span className="text-foreground">0.79</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-muted-foreground">[HÅL]</span>
                        <span className="text-foreground">0.68</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-24 bg-muted rounded-sm flex items-center justify-center">
                    <span className="text-xs text-muted-foreground font-mono">195 jurisdiktioner</span>
                  </div>
                </div>
              </div>
              
              {/* Minimal decorative elements */}
              <div className="absolute -z-10 -top-8 -right-8 w-64 h-64 bg-muted/30 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
