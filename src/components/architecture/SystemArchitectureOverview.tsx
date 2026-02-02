/**
 * SYSTEM ARCHITECTURE OVERVIEW
 * 
 * Visual display of the complete 13-module architecture.
 */

import React from 'react';
import {
  SYSTEM_ARCHITECTURE,
  CORE_PRINCIPLES,
  validateArchitectureCompleteness,
} from '@/config/systemArchitecture';

interface ModuleCardProps {
  moduleNumber: string;
  title: { en: string; sv: string };
  language?: 'en' | 'sv';
  access?: { en: string; sv: string };
  children?: React.ReactNode;
}

function ModuleCard({ moduleNumber, title, language = 'en', access, children }: ModuleCardProps) {
  return (
    <div className="border border-border p-4 bg-card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-muted-foreground">{moduleNumber}</span>
        {access && (
          <span className={`text-xs px-2 py-0.5 ${
            access.en.toLowerCase().includes('free') 
              ? 'bg-primary/10 text-primary' 
              : 'bg-amber-500/10 text-amber-600'
          }`}>
            {access[language]}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-sm">{title[language]}</h3>
      {children}
    </div>
  );
}

interface SystemArchitectureOverviewProps {
  language?: 'en' | 'sv';
  showPrinciples?: boolean;
  compact?: boolean;
}

export function SystemArchitectureOverview({ 
  language = 'en', 
  showPrinciples = true,
  compact = false,
}: SystemArchitectureOverviewProps) {
  const labels = {
    en: {
      title: 'Total System Architecture',
      subtitle: 'Global Transparency & Analytics Infrastructure',
      modules: 'modules',
      version: 'Version',
      locked: 'Locked',
      complete: 'Complete',
      principles: 'Core Principles',
    },
    sv: {
      title: 'Total systemarkitektur',
      subtitle: 'Global transparens- och analysinfrastruktur',
      modules: 'moduler',
      version: 'Version',
      locked: 'Låst',
      complete: 'Komplett',
      principles: 'Kärnprinciper',
    },
  }[language];

  const validation = validateArchitectureCompleteness();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold">{labels.title}</h1>
        <p className="text-muted-foreground">{labels.subtitle}</p>
        <div className="flex gap-4 mt-2 text-xs">
          <span>{SYSTEM_ARCHITECTURE.totalModules} {labels.modules}</span>
          <span>{labels.version}: {SYSTEM_ARCHITECTURE.version}</span>
          <span className="text-primary">✓ {labels.locked}</span>
          {validation.complete && <span className="text-primary">✓ {labels.complete}</span>}
        </div>
      </div>

      {/* Core Principles */}
      {showPrinciples && (
        <div className="bg-muted/30 p-4 border border-border">
          <h2 className="font-semibold mb-3">{labels.principles}</h2>
          <div className={compact ? "grid grid-cols-2 md:grid-cols-5 gap-2" : "space-y-1"}>
            {CORE_PRINCIPLES.principles.map((p) => (
              <div key={p.id} className="flex items-start gap-2 text-sm">
                <span className="font-mono text-xs text-muted-foreground">{p.id}</span>
                <span>{p[language]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Module Grid */}
      <div className={`grid gap-4 ${compact ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'}`}>
        {Object.entries(SYSTEM_ARCHITECTURE.modules).map(([key, module]) => (
          <ModuleCard
            key={key}
            moduleNumber={key}
            title={module.title}
            language={language}
            access={(module as any).access}
          />
        ))}
      </div>
    </div>
  );
}

export function ArchitectureModuleList({ language = 'en' }: { language?: 'en' | 'sv' }) {
  return (
    <ol className="space-y-1 text-sm">
      {Object.entries(SYSTEM_ARCHITECTURE.modules).map(([key, module]) => (
        <li key={key} className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground w-6">{key}</span>
          <span>{module.title[language]}</span>
        </li>
      ))}
    </ol>
  );
}
