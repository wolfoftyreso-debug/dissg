/**
 * NAVIGATION BAR — System Navigation
 */

import React from 'react';
import { ExplorerView } from './TruthExplorer';

interface NavigationBarProps {
  currentView: ExplorerView;
  navigationPath: string[];
  onViewChange: (view: ExplorerView) => void;
  onNavigateUp: () => void;
  domain: string;
}

export function NavigationBar({ 
  currentView, 
  navigationPath, 
  onViewChange,
  onNavigateUp,
  domain 
}: NavigationBarProps) {
  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo / Home */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onViewChange('orientation')}
              className="font-bold text-lg hover:text-primary transition-colors"
            >
              [TRUTH-OS]
            </button>
            <span className="text-muted-foreground text-sm">
              / {domain.toUpperCase()}
            </span>
          </div>

          {/* Breadcrumb Path */}
          {navigationPath.length > 0 && (
            <div className="hidden md:flex items-center gap-2 text-sm">
              <button 
                onClick={() => onViewChange('orientation')}
                className="text-muted-foreground hover:text-foreground"
              >
                [ROOT]
              </button>
              {navigationPath.slice(-3).map((path, i) => (
                <React.Fragment key={i}>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-foreground truncate max-w-[120px]">
                    {path.split('_').slice(0, 2).join('_')}
                  </span>
                </React.Fragment>
              ))}
            </div>
          )}

          {/* View Switcher */}
          <div className="flex items-center gap-2">
            <ViewTab 
              active={currentView === 'orientation'} 
              onClick={() => onViewChange('orientation')}
            >
              [ORIENT]
            </ViewTab>
            <ViewTab 
              active={currentView === 'depth'} 
              onClick={() => onViewChange('depth')}
            >
              [DEPTH]
            </ViewTab>
            <ViewTab 
              active={currentView === 'relations'} 
              onClick={() => onViewChange('relations')}
            >
              [RELATE]
            </ViewTab>
            <ViewTab 
              active={currentView === 'history'} 
              onClick={() => onViewChange('history')}
            >
              [HIST]
            </ViewTab>
          </div>
        </div>
      </div>
    </nav>
  );
}

interface ViewTabProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ViewTab({ active, onClick, children }: ViewTabProps) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2 py-1 rounded transition-colors ${
        active 
          ? 'bg-primary/20 text-primary' 
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}
