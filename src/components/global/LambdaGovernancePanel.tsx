/**
 * LAMBDA GOVERNANCE & IMMUNITY PANEL
 * 
 * "No owner of truth. Only custodians of process."
 * 
 * Visualizes governance structure, immunity status,
 * and protection mechanisms.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Lock, 
  Building2,
  Users,
  Globe,
  AlertTriangle,
  CheckCircle2, 
  XCircle,
  Ban,
  Eye,
  Scale,
  Siren,
  BookOpen,
} from 'lucide-react';
import {
  GOVERNANCE_LAYERS,
  POLITICAL_IMMUNITY,
  CORPORATE_IMMUNITY,
  LEGAL_POSITION,
  KILL_SWITCH_TRIGGERS,
  KILL_SWITCH_RESPONSES,
  KILL_SWITCH_DOCTRINE,
  STATE_RELATIONS,
  DEBATE_RESPONSE_TEMPLATE,
  NARRATIVE_PROTECTION,
  OWNERSHIP_MODEL,
  OWNERSHIP_PRINCIPLE,
  LONG_TERM_PROTECTION,
  GOVERNANCE_AXIOM,
  SURVIVAL_DOCTRINE,
  type ImmunityStatus,
} from '@/config/lambdaGovernance';

// =============================================================================
// TYPES
// =============================================================================

interface LambdaGovernancePanelProps {
  immunityStatus: ImmunityStatus;
  language?: 'sv' | 'en';
  showKillSwitch?: boolean;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const LambdaGovernancePanel: React.FC<LambdaGovernancePanelProps> = ({
  immunityStatus,
  language = 'sv',
  showKillSwitch = true,
}) => {
  const allLayersIntact = Object.values(immunityStatus.governanceLayers).every(s => s === 'intact');
  const isFullyImmune = immunityStatus.political === 'immune' && immunityStatus.corporate === 'immune';

  return (
    <div className="space-y-6">
      {/* Axiom header */}
      <Card className="border-dashed">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">
                {GOVERNANCE_AXIOM[language]}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {SURVIVAL_DOCTRINE[language]}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall immunity status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {language === 'sv' ? 'Immunitetsstatus' : 'Immunity Status'}
            </CardTitle>
            <Badge variant={isFullyImmune ? 'default' : 'destructive'} className="gap-1">
              {isFullyImmune ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  {language === 'sv' ? 'Fullständig' : 'Complete'}
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3 w-3" />
                  {language === 'sv' ? 'Varning' : 'Warning'}
                </>
              )}
            </Badge>
          </div>
          <CardDescription>
            {language === 'sv' 
              ? `Senaste integritetskontroll: ${new Date(immunityStatus.lastIntegrityCheck).toLocaleString()}`
              : `Last integrity check: ${new Date(immunityStatus.lastIntegrityCheck).toLocaleString()}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ImmunityIndicator
              label={language === 'sv' ? 'Politisk' : 'Political'}
              status={immunityStatus.political}
              language={language}
            />
            <ImmunityIndicator
              label={language === 'sv' ? 'Kommersiell' : 'Corporate'}
              status={immunityStatus.corporate}
              language={language}
            />
            <ImmunityIndicator
              label={language === 'sv' ? 'Governance-lager' : 'Governance Layers'}
              status={allLayersIntact ? 'immune' : 'compromised'}
              language={language}
            />
            <ImmunityIndicator
              label={language === 'sv' ? 'Kill Switch' : 'Kill Switch'}
              status={immunityStatus.killSwitchArmed ? 'immune' : 'unknown'}
              language={language}
            />
          </div>
        </CardContent>
      </Card>

      {/* Three-layer governance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {language === 'sv' ? 'Tre-lagers styrning' : 'Three-Layer Governance'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {GOVERNANCE_LAYERS.map(layer => (
              <div 
                key={layer.id}
                className={`p-4 rounded-lg border ${
                  immunityStatus.governanceLayers[layer.id] === 'intact'
                    ? 'border-primary/50 bg-primary/5'
                    : immunityStatus.governanceLayers[layer.id] === 'warning'
                    ? 'border-yellow-500/50 bg-yellow-500/5'
                    : 'border-destructive/50 bg-destructive/5'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{layer.icon}</span>
                  <span className="font-medium">{layer.name[language]}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {layer.description[language]}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {layer.mandateType === 'permanent' && (language === 'sv' ? 'Permanent' : 'Permanent')}
                    {layer.mandateType === 'rotating' && (language === 'sv' ? 'Roterande' : 'Rotating')}
                    {layer.mandateType === 'open' && (language === 'sv' ? 'Öppen' : 'Open')}
                  </Badge>
                  {layer.publicProtocols && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <BookOpen className="h-3 w-3" />
                      {language === 'sv' ? 'Publik' : 'Public'}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Immunity protections */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Political immunity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Scale className="h-4 w-4" />
              {language === 'sv' ? 'Politisk immunitet' : 'Political Immunity'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 mb-4">
              {POLITICAL_IMMUNITY.builtin_protections.map(protection => (
                <li key={protection} className="text-xs flex items-center gap-2">
                  <Ban className="h-3 w-3 text-destructive" />
                  <span className="font-mono">{protection.replace(/_/g, ' ')}</span>
                </li>
              ))}
            </ul>
            <div className="p-2 bg-muted rounded text-xs">
              <strong>{language === 'sv' ? 'Vid utmaning:' : 'When challenged:'}</strong>
              <p className="mt-1 italic">"{POLITICAL_IMMUNITY.challenge_response[language]}"</p>
            </div>
          </CardContent>
        </Card>

        {/* Corporate immunity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {language === 'sv' ? 'Företagsimmunitet' : 'Corporate Immunity'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 mb-4">
              {CORPORATE_IMMUNITY.forbidden_in_architecture.map(forbidden => (
                <li key={forbidden} className="text-xs flex items-center gap-2">
                  <XCircle className="h-3 w-3 text-destructive" />
                  <span className="font-mono">{forbidden.replace(/_/g, ' ')}</span>
                </li>
              ))}
            </ul>
            <div className="p-2 bg-primary/10 rounded text-xs">
              <strong>{language === 'sv' ? 'Princip:' : 'Principle:'}</strong>
              <p className="mt-1">{CORPORATE_IMMUNITY.principle[language]}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legal positioning */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {language === 'sv' ? 'Juridisk positionering' : 'Legal Positioning'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                {language === 'sv' ? 'Systemet är INTE' : 'System is NOT'}
              </div>
              <ul className="space-y-1">
                {LEGAL_POSITION.system_is_not.map(item => (
                  <li key={item} className="text-sm flex items-center gap-2">
                    <XCircle className="h-3 w-3 text-destructive" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                {language === 'sv' ? 'Systemet ÄR' : 'System IS'}
              </div>
              <ul className="space-y-1">
                {LEGAL_POSITION.system_is.map(item => (
                  <li key={item} className="text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Separator className="my-4" />
          <p className="text-sm font-medium text-center italic">
            "{LEGAL_POSITION.doctrine[language]}"
          </p>
        </CardContent>
      </Card>

      {/* Kill switch */}
      {showKillSwitch && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Siren className="h-5 w-5" />
              {language === 'sv' ? 'Kill Switch' : 'Kill Switch'}
            </CardTitle>
            <CardDescription>
              {KILL_SWITCH_DOCTRINE[language]}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                {language === 'sv' ? 'Utlösare' : 'Triggers'}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {KILL_SWITCH_TRIGGERS.map(trigger => (
                  <div key={trigger.code} className="p-2 bg-destructive/10 rounded text-xs">
                    <div className="font-medium">{trigger.name[language]}</div>
                    <div className="text-muted-foreground">{trigger.description[language]}</div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                {language === 'sv' ? 'Systemsvar' : 'System Response'}
              </div>
              <div className="flex gap-2">
                {KILL_SWITCH_RESPONSES.map(response => (
                  <Badge key={response.action} variant="outline" className="text-xs">
                    {response.description[language]}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">
                {language === 'sv' ? 'Kill Switch status' : 'Kill Switch Status'}
              </span>
              <Badge variant={immunityStatus.killSwitchArmed ? 'default' : 'secondary'}>
                {immunityStatus.killSwitchArmed 
                  ? (language === 'sv' ? 'Aktiverad' : 'Armed')
                  : (language === 'sv' ? 'Inaktiv' : 'Inactive')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* State relations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {language === 'sv' ? 'Förhållande till stater & FN' : 'Relationship to States & UN'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-3">{STATE_RELATIONS.principle[language]}</p>
          <Alert variant="destructive" className="bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {STATE_RELATIONS.warning[language]}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Ownership model */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {language === 'sv' ? 'Ägarmodell' : 'Ownership Model'}
          </CardTitle>
          <CardDescription>
            {OWNERSHIP_PRINCIPLE[language]}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {OWNERSHIP_MODEL.map(entity => (
              <div key={entity.type} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{entity.name[language]}</span>
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Lock className="h-3 w-3" />
                    {language === 'sv' ? 'Ej köpbar' : 'Not buyable'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {entity.responsibility[language]}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Long-term protection */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="text-center">
            <Shield className="h-8 w-8 mx-auto text-primary mb-3" />
            <p className="text-sm max-w-xl mx-auto">
              {LONG_TERM_PROTECTION.doctrine[language]}
            </p>
            <div className="flex justify-center gap-4 mt-4">
              {LONG_TERM_PROTECTION.what_does_not_protect.map(item => (
                <Badge key={item} variant="outline" className="gap-1">
                  <XCircle className="h-3 w-3 text-destructive" />
                  {language === 'sv' ? `Inte ${item}` : `Not ${item}`}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

const ImmunityIndicator: React.FC<{
  label: string;
  status: 'immune' | 'compromised' | 'unknown';
  language: 'sv' | 'en';
}> = ({ label, status, language }) => {
  const config = {
    immune: {
      icon: CheckCircle2,
      color: 'text-primary',
      bg: 'bg-primary/10',
      text: language === 'sv' ? 'Immun' : 'Immune',
    },
    compromised: {
      icon: XCircle,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
      text: language === 'sv' ? 'Komprometterad' : 'Compromised',
    },
    unknown: {
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      text: language === 'sv' ? 'Okänd' : 'Unknown',
    },
  };

  const { icon: Icon, color, bg, text } = config[status];

  return (
    <div className={`p-3 rounded-lg ${bg} text-center`}>
      <Icon className={`h-5 w-5 mx-auto ${color}`} />
      <div className="text-xs font-medium mt-1">{label}</div>
      <div className={`text-xs ${color}`}>{text}</div>
    </div>
  );
};

export default LambdaGovernancePanel;
