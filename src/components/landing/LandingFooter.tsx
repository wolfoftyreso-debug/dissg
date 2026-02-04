/**
 * LANDING FOOTER
 * 
 * Avanza-inspirerad footer med länkar och info.
 */

import React from 'react';
import { Link } from 'react-router-dom';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-muted/50 border-t">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center rounded-sm font-bold font-mono text-sm">
                D
              </div>
              <span className="font-semibold">DISSG</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Diagnostic Information System for Societal Governance. 
              Öppen samhällsdiagnostik för alla.
            </p>
          </div>

          {/* Links - Verktyg */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Verktyg</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/diagnostics" className="hover:text-foreground transition-colors">Diagnos</Link></li>
              <li><Link to="/gdm" className="hover:text-foreground transition-colors">Global karta</Link></li>
              <li><Link to="/lambda" className="hover:text-foreground transition-colors">Lambda-index</Link></li>
              <li><Link to="/data" className="hover:text-foreground transition-colors">Dataexplorer</Link></li>
            </ul>
          </div>

          {/* Links - Om oss */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Om DISSG</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">Om systemet</Link></li>
              <li><Link to="/charter" className="hover:text-foreground transition-colors">Stadgar</Link></li>
              <li><Link to="/api" className="hover:text-foreground transition-colors">API & Licenser</Link></li>
              <li><Link to="/help" className="hover:text-foreground transition-colors">Hjälp</Link></li>
            </ul>
          </div>

          {/* Links - Juridik */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Juridik</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Integritetspolicy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Användarvillkor</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Cookiepolicy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Datalicenser</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2024 DISSG. All data är öppen och spårbar.
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="font-mono">[v1.0]</span>
            <span>•</span>
            <span>184 indikatorer</span>
            <span>•</span>
            <span>23 länder</span>
            <span>•</span>
            <span>Senaste uppdatering: 2024-Q4</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
