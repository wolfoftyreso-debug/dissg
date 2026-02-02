/**
 * Trust Log Page
 * 
 * Public page showing all system changes.
 * URL: /trust-log
 * 
 * Part of Block 55: Public Trust Log & Governance.
 */

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { TrustLogList } from '@/components/trust/TrustLogList';
import { 
  IMMUTABILITY_RULES, 
  ANTI_INFLUENCE_BLOCKS,
  GOVERNANCE_ROLES 
} from '@/config/trustLogConfig';
import { Shield, Lock, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TrustLogPage() {
  const [searchParams] = useSearchParams();
  const scope = searchParams.get('scope') || undefined;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Trust Log</h1>
          </div>
          <p className="text-muted-foreground">
            Alla ändringar i systemet loggas här offentligt. 
            Inget kan ändras utan att synas.
          </p>
        </header>

        {/* Principles */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Immutabilitet
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• Rådata skrivs aldrig över</li>
                <li>• Äldre versioner alltid tillgängliga</li>
                <li>• URL:er ändras aldrig</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                Roller
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                {Object.entries(GOVERNANCE_ROLES).slice(0, 3).map(([key, role]) => (
                  <li key={key}>• {role.label}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Blockerat
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• Sponsrat innehåll</li>
                <li>• Pay-to-rank</li>
                <li>• Politiska banners</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Trust Log List */}
        <TrustLogList scope={scope} limit={50} showStats={true} />

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          <p>
            Denna logg är offentlig och maskinläsbar. 
            Alla kan granska och verifiera ändringar.
          </p>
          <p className="mt-1">
            Förtroende byggs inte med ord. Det byggs med spårbarhet.
          </p>
        </footer>
      </div>
    </div>
  );
}
