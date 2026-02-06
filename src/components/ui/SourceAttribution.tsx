/**
 * SOURCE ATTRIBUTION COMPONENT
 * 
 * Displays data source information with full transparency.
 * Every data point must show its provenance.
 */

import React from 'react';

interface Source {
  name: string;
  url?: string;
  type: 'primary' | 'secondary' | 'derived';
}

interface SourceAttributionProps {
  sources: Source[];
  lastUpdated?: string;
  confidence?: number;
  className?: string;
}

export function SourceAttribution({ 
  sources, 
  lastUpdated, 
  confidence,
  className = '' 
}: SourceAttributionProps) {
  const getTypeLabel = (type: Source['type']) => {
    switch (type) {
      case 'primary': return 'Primärkälla';
      case 'secondary': return 'Sekundärkälla';
      case 'derived': return 'Härledd';
    }
  };

  const getTypeColor = (type: Source['type']) => {
    switch (type) {
      case 'primary': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'secondary': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'derived': return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className={`text-xs ${className}`}>
      <p className="font-medium text-slate-700 mb-2 flex items-center gap-1.5">
        <span>📚</span> Källor
      </p>
      
      <div className="space-y-1.5">
        {sources.map((source, i) => (
          <div 
            key={i} 
            className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg border ${getTypeColor(source.type)}`}
          >
            <div className="flex items-center gap-2">
              {source.url ? (
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline font-medium"
                >
                  {source.name} ↗
                </a>
              ) : (
                <span className="font-medium">{source.name}</span>
              )}
            </div>
            <span className="text-[10px] opacity-70">{getTypeLabel(source.type)}</span>
          </div>
        ))}
      </div>

      {(lastUpdated || confidence !== undefined) && (
        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
          {lastUpdated && (
            <span>📅 Uppdaterad: {lastUpdated}</span>
          )}
          {confidence !== undefined && (
            <span>🎯 Konfidens: {confidence}%</span>
          )}
        </div>
      )}
    </div>
  );
}

export default SourceAttribution;
