/**
 * APP PROMO SECTION
 * 
 * "Håll koll på världen direkt från mobilen" - App Store/Play Store promo.
 * GLOBALT PERSPEKTIV - jurisdiktionsneutral.
 */

import React from 'react';
import { Apple } from 'lucide-react';

// Simple Play Store icon
const PlayStoreIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5ZM16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12ZM20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.5 12.92 20.16 13.19L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81ZM6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" />
  </svg>
);

export const AppPromoSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content - GLOBAL perspective */}
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
              Håll koll på civilisationen direkt från mobilen
            </h2>
            
            <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
              Följ 195 länder i realtid. Ladda ner appen och se globala trender, 
              få notiser om anomalier och utforska data från vilken världsdel som 
              helst. Välj ditt fokusland eller behåll det globala perspektivet.
            </p>

            {/* App store buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-sm hover:bg-slate-100 transition-colors">
                <Apple className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wide">Hämta i</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>
              
              <button className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-sm hover:bg-slate-100 transition-colors">
                <PlayStoreIcon />
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wide">Ladda ned på</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* Right: Phone mockups - GLOBAL data */}
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              {/* Phone 1 (front) */}
              <div className="w-56 h-[420px] bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl z-10 relative">
                {/* Phone header */}
                <div className="h-6 bg-slate-700 flex items-center justify-center">
                  <div className="w-16 h-1 bg-slate-600 rounded-full" />
                </div>
                
                {/* Phone content - GLOBAL perspective */}
                <div className="p-3 space-y-3 bg-slate-900">
                  <div className="text-[10px] text-slate-500 font-mono">[DISSG v1.0]</div>
                  
                  {/* Global dashboard preview */}
                  <div className="space-y-2">
                    <div className="p-2 bg-slate-800 rounded-sm">
                      <div className="text-[9px] text-slate-500 mb-1">GLOBAL LAMBDA</div>
                      <div className="text-xl font-bold font-mono text-emerald-400">0.76</div>
                    </div>
                    
                    {/* Top regions by Lambda */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-slate-800 rounded-sm">
                        <div className="text-[8px] text-slate-500">Europa</div>
                        <div className="text-sm font-mono text-emerald-400">0.89</div>
                      </div>
                      <div className="p-2 bg-slate-800 rounded-sm">
                        <div className="text-[8px] text-slate-500">Nordamerika</div>
                        <div className="text-sm font-mono text-emerald-400">0.87</div>
                      </div>
                      <div className="p-2 bg-slate-800 rounded-sm">
                        <div className="text-[8px] text-slate-500">Asien</div>
                        <div className="text-sm font-mono text-amber-400">0.71</div>
                      </div>
                      <div className="p-2 bg-slate-800 rounded-sm">
                        <div className="text-[8px] text-slate-500">Afrika</div>
                        <div className="text-sm font-mono text-amber-400">0.54</div>
                      </div>
                    </div>
                    
                    {/* Chart placeholder */}
                    <div className="h-20 bg-slate-800 rounded-sm flex items-center justify-center">
                      <div className="flex items-end gap-1 h-12">
                        {[40, 55, 45, 60, 70, 65, 75].map((h, i) => (
                          <div 
                            key={i} 
                            className="w-4 bg-emerald-500/50 rounded-t"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-[8px] text-slate-500 text-center">
                      195 länder • 7 världsdelar • 184 indikatorer
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Phone 2 (behind, slightly offset) */}
              <div className="absolute -top-4 -right-12 w-48 h-[360px] bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-xl -z-10 opacity-60">
                <div className="h-6 bg-slate-700" />
                <div className="p-2 bg-slate-900 h-full">
                  <div className="h-full bg-slate-800 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromoSection;
