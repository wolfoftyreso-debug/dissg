/**
 * MODEL TYPE SELECTOR
 * 
 * Selection of probabilistic model types for scenario creation.
 */

import React from 'react';
import { 
  SCENARIO_MODEL_TYPES, 
  type ScenarioModelType,
  type ModelTypeDefinition 
} from '@/config/scenarioLabConfig';

interface ModelTypeSelectorProps {
  selectedModel?: ScenarioModelType;
  onSelectModel: (model: ScenarioModelType) => void;
  language?: 'en' | 'sv';
  variant?: 'cards' | 'list' | 'compact';
  className?: string;
}

export function ModelTypeSelector({
  selectedModel,
  onSelectModel,
  language = 'en',
  variant = 'cards',
  className = '',
}: ModelTypeSelectorProps) {
  const labels = {
    en: {
      title: 'Select Model Type',
      complexity: { basic: 'Basic', intermediate: 'Intermediate', advanced: 'Advanced' },
    },
    sv: {
      title: 'Välj modelltyp',
      complexity: { basic: 'Grundläggande', intermediate: 'Medel', advanced: 'Avancerad' },
    },
  }[language];

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {SCENARIO_MODEL_TYPES.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelectModel(model.id)}
            className={`px-3 py-1 border text-sm transition-all ${
              selectedModel === model.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <span className="mr-1">{model.icon}</span>
            {model.label[language]}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-2 ${className}`}>
        {SCENARIO_MODEL_TYPES.map((model) => (
          <ModelTypeListItem
            key={model.id}
            model={model}
            isSelected={selectedModel === model.id}
            onSelect={() => onSelectModel(model.id)}
            language={language}
            complexityLabels={labels.complexity}
          />
        ))}
      </div>
    );
  }

  // Cards variant (default)
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="font-bold">{labels.title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SCENARIO_MODEL_TYPES.map((model) => (
          <ModelTypeCard
            key={model.id}
            model={model}
            isSelected={selectedModel === model.id}
            onSelect={() => onSelectModel(model.id)}
            language={language}
            complexityLabels={labels.complexity}
          />
        ))}
      </div>
    </div>
  );
}

function ModelTypeCard({
  model,
  isSelected,
  onSelect,
  language,
  complexityLabels,
}: {
  model: ModelTypeDefinition;
  isSelected: boolean;
  onSelect: () => void;
  language: 'en' | 'sv';
  complexityLabels: Record<string, string>;
}) {
  const complexityColors = {
    basic: 'bg-green-500/10 text-green-700',
    intermediate: 'bg-amber-500/10 text-amber-700',
    advanced: 'bg-red-500/10 text-red-700',
  };

  return (
    <button
      onClick={onSelect}
      className={`text-left p-4 border-2 transition-all ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{model.icon}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold">{model.label[language]}</h4>
            <span className={`text-xs px-2 py-0.5 ${complexityColors[model.complexity]}`}>
              {complexityLabels[model.complexity]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {model.description[language]}
          </p>
        </div>
      </div>
    </button>
  );
}

function ModelTypeListItem({
  model,
  isSelected,
  onSelect,
  language,
  complexityLabels,
}: {
  model: ModelTypeDefinition;
  isSelected: boolean;
  onSelect: () => void;
  language: 'en' | 'sv';
  complexityLabels: Record<string, string>;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-3 border transition-all flex items-center gap-3 ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      }`}
    >
      <span className="text-xl">{model.icon}</span>
      <div className="flex-1">
        <span className="font-medium">{model.label[language]}</span>
        <span className="text-xs text-muted-foreground ml-2">
          ({complexityLabels[model.complexity]})
        </span>
      </div>
      {isSelected && <span className="text-primary">✓</span>}
    </button>
  );
}
