/**
 * STEWARDSHIP STATUS
 * 
 * Shows the anti-capture framework status.
 * Separation of powers. Economic firewall. Succession readiness.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Shield,
  Users,
  Clock,
  Ban,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  ROLE_DEFINITIONS,
  FORBIDDEN_REVENUE,
  ALLOWED_REVENUE,
  CHANGE_LATENCY,
} from '@/core/governance/stewardship';

export function StewardshipStatus() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-accent/10">
              <Shield className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl">Stewardship Framework</CardTitle>
              <p className="text-sm text-muted-foreground">
                Institutional immunology. Anti-capture protection.
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Separation of Powers */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Separation of Powers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {Object.entries(ROLE_DEFINITIONS).map(([key, role]) => (
              <div key={key} className="p-3 rounded-lg border bg-muted/30">
                <p className="font-medium text-sm capitalize mb-1">
                  {role.role.replace('_', ' ')}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  Owns: {role.owns.slice(0, 2).join(', ')}
                  {role.owns.length > 2 && '...'}
                </p>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs">
                    {role.change_authority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center italic">
            These roles can NEVER overlap. No group can alone change the system's nature.
          </p>
        </CardContent>
      </Card>

      {/* Change Latency */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Change Latency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(CHANGE_LATENCY).map(([component, months]) => (
              <div key={component} className="flex items-center gap-3">
                <span className="text-sm w-40 capitalize">
                  {component.replace('_', ' ')}
                </span>
                <Progress value={(months / 18) * 100} className="flex-1 h-2" />
                <span className="text-sm text-muted-foreground w-20 text-right">
                  {months} months
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center italic">
            "This change takes effect in 18 months." Makes capture impractical.
          </p>
        </CardContent>
      </Card>

      {/* No Urgency Rule */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Ban className="h-4 w-4" />
            No Urgency Rule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-destructive mb-2 flex items-center gap-1">
                <XCircle className="h-3.5 w-3.5" />
                Forbidden Motivations
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• "The market demands"</li>
                <li>• "Competitors are doing"</li>
                <li>• "Technology enables"</li>
                <li>• "Users expect"</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-primary mb-2 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Only Valid Motivation
              </p>
              <p className="text-xs text-muted-foreground italic">
                "This increases decision legibility without reducing uncertainty visibility."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Economic Firewall */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Economic Firewall
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-destructive mb-2">
                Forbidden Revenue
              </p>
              <div className="flex flex-wrap gap-1">
                {FORBIDDEN_REVENUE.map((source) => (
                  <Badge 
                    key={source} 
                    variant="outline" 
                    className="text-xs border-destructive/30 text-destructive"
                  >
                    {source.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-primary mb-2">
                Allowed Revenue
              </p>
              <div className="flex flex-wrap gap-1">
                {ALLOWED_REVENUE.map((source) => (
                  <Badge 
                    key={source} 
                    variant="outline" 
                    className="text-xs border-primary/30 text-primary"
                  >
                    {source.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-center mt-3 font-medium">
            Truth can never be incentive-affected.
          </p>
        </CardContent>
      </Card>

      {/* Anti-Capture Alert */}
      <Card className="border-accent/30 bg-accent/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-accent-foreground mt-0.5" />
            <div>
              <p className="font-medium text-sm">The Biggest Threat</p>
              <p className="text-xs text-muted-foreground mt-1">
                Capture from within by reasonable people with reasonable arguments.
                "Make it simpler", "Help users choose", "Optimize for conversion" —
                each sounds reasonable, each destroys the system.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* The Real Product */}
      <Card className="border-dashed">
        <CardContent className="py-4 text-center">
          <p className="text-sm font-medium mb-2">The Real Product</p>
          <p className="text-muted-foreground text-sm">
            Not answers. Not dashboards. Not AI features.
          </p>
          <p className="font-medium mt-2">
            A way to handle uncertainty without lying to yourself.
          </p>
          <p className="text-xs text-muted-foreground/70 italic mt-2">
            This does not age.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
