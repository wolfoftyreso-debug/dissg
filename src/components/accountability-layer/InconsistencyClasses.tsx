/**
 * INCONSISTENCY CLASSES
 * 
 * Four standard classifications — all equally neutral.
 * The system classifies — never judges.
 */

import React from 'react';
import { 
  INCONSISTENCY_CLASSES, 
  CLASSES_PRINCIPLE,
  type InconsistencyClass,
  type InconsistencyClassDefinition 
} from '@/config/inconsistencyLayerConfig';

interface InconsistencyClassesProps {
  language?: 'en' | 'sv';
  variant?: 'full' | 'grid' | 'list';
  highlightClass?: InconsistencyClass;
  className?: string;
}

export function InconsistencyClasses({
  language = 'en',
  variant = 'full',
  highlightClass,
  className = '',
}: InconsistencyClassesProps) {
  const labels = {
    en: {
      title: 'Four Classes of Inconsistency',
      subtitle: 'Standard classification — never judgment',
    },
    sv: {
      title: 'Fyra klasser av inkonsistens',
      subtitle: 'Standardklassificering — aldrig dom',
    },
  }[language];

  if (variant === 'list') {
    return (
      <div className={`space-y-2 ${className}`}>
        {INCONSISTENCY_CLASSES.map((cls) => (
          <InconsistencyClassBadge
            key={cls.id}
            definition={cls}
            language={language}
            isHighlighted={highlightClass === cls.id}
            variant="inline"
          />
        ))}
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
        {INCONSISTENCY_CLASSES.map((cls) => (
          <InconsistencyClassBadge
            key={cls.id}
            definition={cls}
            language={language}
            isHighlighted={highlightClass === cls.id}
            variant="card"
          />
        ))}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`border-2 border-border bg-card p-6 space-y-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-xl font-bold">{labels.title}</h2>
        <p className="text-muted-foreground">{labels.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INCONSISTENCY_CLASSES.map((cls) => (
          <InconsistencyClassCard
            key={cls.id}
            definition={cls}
            language={language}
            isHighlighted={highlightClass === cls.id}
          />
        ))}
      </div>

      <div className="text-center pt-4 border-t border-border">
        <p className="font-semibold text-primary">{CLASSES_PRINCIPLE[language]}</p>
      </div>
    </div>
  );
}

function InconsistencyClassCard({
  definition,
  language,
  isHighlighted,
}: {
  definition: InconsistencyClassDefinition;
  language: 'en' | 'sv';
  isHighlighted?: boolean;
}) {
  return (
    <div
      className={`border-2 p-4 space-y-2 ${definition.color} ${
        isHighlighted ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 border-2 border-current flex items-center justify-center font-bold text-lg">
          {definition.code}
        </span>
        <div>
          <h3 className="font-bold">{definition.label[language]}</h3>
        </div>
      </div>
      <p className="text-sm">{definition.description[language]}</p>
    </div>
  );
}

function InconsistencyClassBadge({
  definition,
  language,
  isHighlighted,
  variant = 'inline',
}: {
  definition: InconsistencyClassDefinition;
  language: 'en' | 'sv';
  isHighlighted?: boolean;
  variant?: 'inline' | 'card';
}) {
  if (variant === 'card') {
    return (
      <div
        className={`border p-3 text-center space-y-1 ${definition.color} ${
          isHighlighted ? 'ring-2 ring-primary' : ''
        }`}
      >
        <div className="text-2xl font-bold">{definition.icon}</div>
        <div className="text-xs font-mono">{definition.code}</div>
        <div className="text-xs font-medium">{definition.label[language]}</div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 p-2 border ${definition.color} ${
        isHighlighted ? 'ring-2 ring-primary' : ''
      }`}
    >
      <span className="w-8 h-8 border border-current flex items-center justify-center font-bold text-sm">
        {definition.code}
      </span>
      <div className="flex-1">
        <span className="font-medium text-sm">{definition.label[language]}</span>
        <span className="text-xs text-muted-foreground ml-2">— {definition.description[language]}</span>
      </div>
    </div>
  );
}

/**
 * Single class indicator for use in data displays
 */
export function InconsistencyIndicator({
  classId,
  language = 'en',
  size = 'md',
}: {
  classId: InconsistencyClass;
  language?: 'en' | 'sv';
  size?: 'sm' | 'md' | 'lg';
}) {
  const definition = INCONSISTENCY_CLASSES.find((c) => c.id === classId);
  if (!definition) return null;

  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <div
      className={`${sizes[size]} border-2 border-current flex items-center justify-center font-bold ${definition.color}`}
      title={`${definition.label[language]}: ${definition.description[language]}`}
    >
      {definition.code}
    </div>
  );
}
