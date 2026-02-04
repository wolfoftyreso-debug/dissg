/**
 * HERO SECTION
 * 
 * Avanza-inspirerad hero med headline, beskrivning och CTA.
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
              Förstå civilisationen<br />
              genom data
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Få insyn i hur samhällen utvecklas världen över. Med DISSG kan du följa 
              184 nyckeltal för 195 länder – från globalt till lokalt. Kanske är det 
              därför vi kallas "civilisationens kontrollpanel".
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                onClick={onStartDiagnosis}
              >
                Starta diagnos
              </Button>
              <Link to="/login">
                <Button variant="ghost" size="lg" className="text-primary hover:text-primary/80">
                  Redan användare? Logga in
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground">
              All data är öppen och spårbar. Inga dolda algoritmer.
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
                  <div className="text-xs text-muted-foreground font-mono">[DISSG Mobile]</div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-sm">
                      <div className="text-[10px] text-muted-foreground mb-1">GLOBAL LAMBDA</div>
                      <div className="text-2xl font-bold font-mono">0.76</div>
                      <div className="text-xs text-emerald-600">↑ Förbättring sedan 1990</div>
                    </div>
                    
                    {/* Global domains - not country-specific */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">[VIT] Liv & Hälsa</span>
                        <span className="font-mono text-emerald-600">+18%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">[FÖR] Försörjning</span>
                        <span className="font-mono text-emerald-600">+24%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">[KAP] Kapacitet</span>
                        <span className="font-mono text-emerald-600">+31%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">[HÅL] Hållbarhet</span>
                        <span className="font-mono text-amber-600">-12%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-24 bg-muted rounded-sm flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">[195 länder]</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative circles */}
              <div className="absolute -z-10 -top-8 -right-8 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute -z-10 -bottom-8 -left-8 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
