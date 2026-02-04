import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ResponsibilityLevel {
  type: 'primary' | 'secondary' | 'operational';
  label: string;
  entity: string;
}

interface ResponsibilityDrilldownProps {
  responsibility: ResponsibilityLevel | null;
  onClose: () => void;
  kpiCode?: string;
}

// Mock data för departement/myndigheter
const ENTITY_DETAILS: Record<string, {
  fullName: string;
  description: string;
  website: string;
  contactInfo: string;
  relatedKPIs: string[];
  budget: string;
  employees: number;
  lastUpdated: string;
}> = {
  'Statsrådsberedningen': {
    fullName: 'Statsrådsberedningen (SB)',
    description: 'Statsrådsberedningen är ett kansli som stödjer statsministern och samordnar regeringens arbete.',
    website: 'https://www.regeringen.se/statsradsberedningen',
    contactInfo: 'sb.registrator@regeringskansliet.se',
    relatedKPIs: ['SYS-01', 'SYS-02', 'SYS-03'],
    budget: '~250 MSEK',
    employees: 180,
    lastUpdated: '2024-01',
  },
  'Finansdepartementet': {
    fullName: 'Finansdepartementet (Fi)',
    description: 'Ansvarar för frågor som rör statens ekonomi, skattefrågor och finansmarknader.',
    website: 'https://www.regeringen.se/finansdepartementet',
    contactInfo: 'fi.registrator@regeringskansliet.se',
    relatedKPIs: ['EKO-01', 'EKO-02', 'SYS-01'],
    budget: '~450 MSEK',
    employees: 420,
    lastUpdated: '2024-01',
  },
  'Regeringskansliet': {
    fullName: 'Regeringskansliet',
    description: 'Den myndighet som bistår regeringen med att genomföra sin politik.',
    website: 'https://www.regeringen.se',
    contactInfo: 'registrator@regeringskansliet.se',
    relatedKPIs: ['SYS-01', 'SYS-02'],
    budget: '~8 500 MSEK',
    employees: 4800,
    lastUpdated: '2024-01',
  },
  'Socialdepartementet': {
    fullName: 'Socialdepartementet (S)',
    description: 'Ansvarar för frågor om socialförsäkring, hälso- och sjukvård samt socialtjänst.',
    website: 'https://www.regeringen.se/socialdepartementet',
    contactInfo: 's.registrator@regeringskansliet.se',
    relatedKPIs: ['DEM-01', 'DEM-02', 'SOC-01'],
    budget: '~380 MSEK',
    employees: 350,
    lastUpdated: '2024-01',
  },
  'Arbetsmarknadsdepartementet': {
    fullName: 'Arbetsmarknadsdepartementet (A)',
    description: 'Ansvarar för arbetsmarknadspolitik, arbetsrätt och integration.',
    website: 'https://www.regeringen.se/arbetsmarknadsdepartementet',
    contactInfo: 'a.registrator@regeringskansliet.se',
    relatedKPIs: ['ARB-01', 'ARB-02', 'ARB-03'],
    budget: '~320 MSEK',
    employees: 280,
    lastUpdated: '2024-01',
  },
};

export function ResponsibilityDrilldown({ responsibility, onClose, kpiCode }: ResponsibilityDrilldownProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'kpis' | 'contact'>('overview');
  
  if (!responsibility) return null;
  
  const details = ENTITY_DETAILS[responsibility.entity] || {
    fullName: responsibility.entity,
    description: 'Information ej tillgänglig i systemet.',
    website: '#',
    contactInfo: 'Ej registrerad',
    relatedKPIs: [],
    budget: 'Ej angivet',
    employees: 0,
    lastUpdated: 'N/A',
  };

  const typeLabels = {
    primary: '[PRIMÄRT]',
    secondary: '[SEKUNDÄRT]',
    operational: '[OPERATIVT]',
  };

  return (
    <Dialog open={!!responsibility} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm flex items-center gap-2">
            <span className="text-primary">{typeLabels[responsibility.type]}</span>
            <span>{responsibility.entity}</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* Tabs */}
        <div className="flex gap-1 border-b border-border">
          {(['overview', 'kpis', 'contact'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-3 py-2 text-xs font-mono transition-colors',
                activeTab === tab
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab === 'overview' && '[ÖVERSIKT]'}
              {tab === 'kpis' && '[KPI:ER]'}
              {tab === 'contact' && '[KONTAKT]'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4 py-2">
          {activeTab === 'overview' && (
            <>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">[NAMN]</p>
                  <p className="text-sm text-foreground">{details.fullName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">[BESKRIVNING]</p>
                  <p className="text-sm text-foreground">{details.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase">[BUDGET]</p>
                    <p className="text-sm text-foreground font-mono">{details.budget}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase">[ANSTÄLLDA]</p>
                    <p className="text-sm text-foreground font-mono">{details.employees.toLocaleString('sv-SE')}</p>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-[10px] font-mono text-muted-foreground">
                  [SENAST UPPDATERAD] {details.lastUpdated}
                </p>
              </div>
            </>
          )}

          {activeTab === 'kpis' && (
            <div className="space-y-3">
              <p className="text-[10px] font-mono text-muted-foreground uppercase">[RELATERADE KPI:ER]</p>
              {details.relatedKPIs.length > 0 ? (
                <div className="space-y-2">
                  {details.relatedKPIs.map((kpi) => (
                    <button
                      key={kpi}
                      className={cn(
                        'flex w-full items-center justify-between rounded-sm border p-2 text-left transition-colors',
                        kpi === kpiCode
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-card hover:bg-muted/50'
                      )}
                    >
                      <span className="text-sm font-mono text-foreground">{kpi}</span>
                      <span className="text-xs text-muted-foreground">[→]</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Inga kopplade KPI:er registrerade.</p>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-mono text-muted-foreground uppercase">[WEBBPLATS]</p>
                <a 
                  href={details.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline font-mono"
                >
                  {details.website}
                </a>
              </div>
              <div>
                <p className="text-[10px] font-mono text-muted-foreground uppercase">[E-POST]</p>
                <p className="text-sm text-foreground font-mono">{details.contactInfo}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono bg-muted hover:bg-muted/80 rounded-sm transition-colors"
          >
            [STÄNG]
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
