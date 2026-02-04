/**
 * LANDING HEADER
 * 
 * ODIS-stil header för landing page.
 * Kombinerar system-info med navigation.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { UserMenu } from '@/components/auth/UserMenu';

interface LandingHeaderProps {
  onStartDiagnosis?: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ onStartDiagnosis }) => {
  return (
    <header className="border-b-2 border-border bg-card">
      {/* Title bar */}
      <div className="bg-primary/10 border-b border-primary/20 px-4 py-1.5 flex items-center justify-between">
        <span className="font-mono text-xs font-semibold tracking-wide text-primary">
          DISSG – Diagnostic Information System for Societal Governance
        </span>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-muted-foreground font-mono">
            VER 1.0 | 184 indicators | 2024-Q4
          </span>
          <UserMenu />
        </div>
      </div>

      {/* Navigation bar */}
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center rounded-sm font-bold font-mono">
            D
          </div>
          <div>
            <div className="font-semibold text-sm">DISSG</div>
            <div className="text-[10px] text-muted-foreground">Samhällsdiagnostik</div>
          </div>
        </Link>

        {/* Main navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/diagnostics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Diagnos
          </Link>
          <Link to="/data" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Data
          </Link>
          <Link to="/gdm" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Karta
          </Link>
          <Link to="/lambda" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Lambda
          </Link>
          <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Hjälp
          </Link>
        </nav>

        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onStartDiagnosis}
            className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium rounded-sm hover:bg-primary/90 transition-colors"
          >
            Starta diagnos
          </button>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
