/**
 * TRUST ANCHOR STATUS
 * 
 * Shows the fixed point in time.
 * Verification status. Mirror coverage.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Anchor,
  Shield,
  Globe2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Database,
  Link2,
} from 'lucide-react';
import type { TrustAnchorStatus as TrustAnchorStatusType } from '@/core/system/trust-anchor/types';

interface TrustAnchorStatusProps {
  status?: TrustAnchorStatusType;
}

// Default status for display
const DEFAULT_STATUS: TrustAnchorStatusType = {
  latest_snapshot: {
    snapshot_id: 'ITS_2025_Q1',
    version: '1.0.0',
    period: '2025_Q1',
    timestamp: new Date().toISOString(),
    included_artifacts: [
      'ontology',
      'decision_standards',
      'reference_cases',
      'legitimacy_rules',
      'semantic_definitions',
      'governance_charter',
    ],
    artifact_hashes: {} as Record<string, string>,
    root_hash: '0x9af3e7b2c1d4f5a6...',
    previous_snapshot_hash: null,
    created_by: 'system_automatic',
    witness_count: 5,
    is_sealed: true,
    sealed_at: new Date().toISOString(),
  },
  total_snapshots: 1,
  chain_valid: true,
  active_mirrors: 5,
  total_mirrors: 5,
  mirror_coverage_by_jurisdiction: {
    'EU': 2,
    'CH': 1,
    'SG': 1,
    'SE': 1,
  },
  oldest_snapshot_age_years: 0,
  time_proof_test_pass_rate: 1.0,
  death_mode_ready: true,
  essential_artifacts_mirrored: true,
};

export function TrustAnchorStatus({ status = DEFAULT_STATUS }: TrustAnchorStatusProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Anchor className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Trust Anchor</CardTitle>
              <p className="text-sm text-muted-foreground">
                The fixed point in time. Immutable. Verifiable.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatusCard
              icon={<Database className="h-4 w-4" />}
              label="Total Snapshots"
              value={status.total_snapshots}
            />
            <StatusCard
              icon={<Globe2 className="h-4 w-4" />}
              label="Active Mirrors"
              value={`${status.active_mirrors}/${status.total_mirrors}`}
            />
            <StatusCard
              icon={<Link2 className="h-4 w-4" />}
              label="Chain Valid"
              value={status.chain_valid ? 'Yes' : 'No'}
              variant={status.chain_valid ? 'success' : 'error'}
            />
            <StatusCard
              icon={<Shield className="h-4 w-4" />}
              label="Death Mode Ready"
              value={status.death_mode_ready ? 'Yes' : 'No'}
              variant={status.death_mode_ready ? 'success' : 'warning'}
            />
          </div>
        </CardContent>
      </Card>

      {/* Latest Snapshot */}
      {status.latest_snapshot && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Latest Snapshot</CardTitle>
              <Badge variant="outline" className="font-mono text-xs">
                {status.latest_snapshot.snapshot_id}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Period</p>
                <p className="font-medium">{status.latest_snapshot.period}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sealed At</p>
                <p className="font-medium">
                  {status.latest_snapshot.sealed_at 
                    ? new Date(status.latest_snapshot.sealed_at).toLocaleDateString()
                    : 'Not sealed'
                  }
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Root Hash</p>
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono block overflow-hidden text-ellipsis">
                {status.latest_snapshot.root_hash}
              </code>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Included Artifacts ({status.latest_snapshot.included_artifacts.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {status.latest_snapshot.included_artifacts.map((artifact) => (
                  <Badge key={artifact} variant="secondary" className="text-xs">
                    {artifact.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mirror Coverage */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Mirror Coverage by Jurisdiction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(status.mirror_coverage_by_jurisdiction).map(([jurisdiction, count]) => (
              <div key={jurisdiction} className="flex items-center gap-3">
                <Badge variant="outline" className="w-10 text-center">
                  {jurisdiction}
                </Badge>
                <Progress value={(count / 3) * 100} className="flex-1 h-2" />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {count} mirror{count !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Proofing */}
      <Card className="bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Time Proofing Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">30-Year Test Pass Rate</span>
              <span className="font-medium">
                {Math.round(status.time_proof_test_pass_rate * 100)}%
              </span>
            </div>
            <Progress value={status.time_proof_test_pass_rate * 100} className="h-2" />
            
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground italic">
                "If someone reads this in 2055 — can they understand what we knew, 
                what we did not know, and why decisions were made?"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Civilizational Design */}
      <Card className="border-dashed">
        <CardContent className="py-4">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium">The system can die.</p>
            <p className="text-sm text-muted-foreground">The structure lives on.</p>
            <p className="text-xs text-muted-foreground/70 italic">
              This is civilizational design.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusCard({ 
  icon, 
  label, 
  value, 
  variant = 'default' 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number;
  variant?: 'default' | 'success' | 'warning' | 'error';
}) {
  const variantClasses = {
    default: '',
    success: 'text-green-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
  };

  return (
    <div className="p-3 rounded-lg bg-muted/50 text-center">
      <div className="flex justify-center mb-1 text-muted-foreground">
        {icon}
      </div>
      <p className={`text-lg font-bold ${variantClasses[variant]}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
