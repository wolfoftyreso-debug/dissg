/**
 * LAMBDA FORMAL DEFINITION DISPLAY
 * 
 * ISO/IEC-style technical specification document.
 * "Global Lambda 1.0 makes reality measurable without making it ideological."
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText,
  Target,
  Hash,
  Gauge,
  Layers,
  Activity,
  Scale,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Sparkles
} from 'lucide-react';
import { LAMBDA_FORMAL_SPEC } from '@/config/lambdaFormalSpec';

interface LambdaFormalDefinitionProps {
  language?: 'sv' | 'en';
}

export const LambdaFormalDefinition: React.FC<LambdaFormalDefinitionProps> = ({
  language = 'sv',
}) => {
  const spec = LAMBDA_FORMAL_SPEC;

  const SectionHeader: React.FC<{ number: number; title: string; icon: React.ReactNode }> = ({ 
    number, title, icon 
  }) => (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-mono font-bold">
        {number}
      </div>
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Document Header */}
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-muted/50 to-background">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-xl font-mono">{spec.documentId}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {spec.classification} • Version {spec.version}
                </p>
              </div>
            </div>
            <Badge variant="default" className="font-mono">
              {spec.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <h1 className="text-3xl font-bold mb-2">GLOBAL LAMBDA 1.0</h1>
            <p className="text-lg text-muted-foreground">FORMELL DEFINITION</p>
            <p className="text-sm text-muted-foreground mt-2">Teknisk / Standard-stil</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 1: Purpose */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader 
            number={spec.purpose.sectionNumber} 
            title={spec.purpose.title[language]} 
            icon={<Target className="h-5 w-5" />} 
          />
          
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Avsett att:
              </h4>
              <ul className="space-y-1">
                {spec.purpose.intended[language].map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                Utan att:
              </h4>
              <ul className="space-y-1">
                {spec.purpose.notIntended[language].map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-destructive">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Definition */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader 
            number={spec.definition.sectionNumber} 
            title={spec.definition.title[language]} 
            icon={<Hash className="h-5 w-5" />} 
          />
          
          <p className="text-muted-foreground mb-6">
            {spec.definition.text[language]}
          </p>
          
          <div className="p-6 bg-muted rounded-lg text-center mb-4">
            <code className="text-3xl font-mono font-bold">
              {spec.definition.formula.display}
            </code>
          </div>
          
          <div className="grid gap-2">
            {spec.definition.variables.map((v) => (
              <div key={v.symbol} className="flex items-center gap-3 p-2 border rounded">
                <code className="font-mono font-bold text-primary">{v.symbol}</code>
                <span className="text-sm text-muted-foreground">= {v.description[language]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Interpretation */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader 
            number={spec.interpretation.sectionNumber} 
            title={spec.interpretation.title[language]} 
            icon={<Gauge className="h-5 w-5" />} 
          />
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium">Lambda-intervall</th>
                  <th className="text-left py-2 px-3 font-medium">Systemtillstånd</th>
                  <th className="text-left py-2 px-3 font-medium">Beskrivning</th>
                </tr>
              </thead>
              <tbody>
                {spec.interpretation.ranges.map((row, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 px-3 font-mono font-bold">{row.range}</td>
                    <td className="py-2 px-3">
                      <Badge variant={row.color === 'destructive' ? 'destructive' : 'secondary'}>
                        {row.state[language]}
                      </Badge>
                    </td>
                    <td className="py-2 px-3 text-muted-foreground">{row.description[language]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4 italic">
            {spec.interpretation.note[language]}
          </p>
        </CardContent>
      </Card>

      {/* Section 4: Scope */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader 
            number={spec.scope.sectionNumber} 
            title={spec.scope.title[language]} 
            icon={<Layers className="h-5 w-5" />} 
          />
          
          <p className="text-muted-foreground mb-4">
            {spec.scope.intro[language]}
          </p>
          
          <div className="grid gap-2">
            {spec.scope.levels.map((level) => (
              <div key={level.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <span className="text-xl">{level.emoji}</span>
                <span>{level.name[language]}</span>
              </div>
            ))}
          </div>
          
          <p className="text-sm font-medium mt-4 p-3 bg-muted rounded">
            {spec.scope.principle[language]}
          </p>
        </CardContent>
      </Card>

      {/* Section 5: Sensor Layer */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader 
            number={spec.sensorLayer.sectionNumber} 
            title={spec.sensorLayer.title[language]} 
            icon={<Activity className="h-5 w-5" />} 
          />
          
          <p className="text-muted-foreground mb-4">
            {spec.sensorLayer.intro[language]}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {spec.sensorLayer.categories.map((cat) => (
              <Badge key={cat.id} variant="outline" className="justify-center py-2">
                {cat.name[language]}
              </Badge>
            ))}
          </div>
          
          <div className="space-y-2">
            {spec.sensorLayer.principles.map((p, i) => (
              <p key={i} className="text-sm text-muted-foreground italic">
                • {p[language]}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Normalization */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader 
            number={spec.normalization.sectionNumber} 
            title={spec.normalization.title[language]} 
            icon={<Scale className="h-5 w-5" />} 
          />
          
          <div className="grid gap-2 mb-4">
            {spec.normalization.requirements.map((req, i) => (
              <div key={i} className="flex items-center gap-2 p-2 border rounded">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm">{req[language]}</span>
              </div>
            ))}
          </div>
          
          <p className="text-sm font-medium p-3 bg-primary/5 rounded border border-primary/20">
            {spec.normalization.principle[language]}
          </p>
        </CardContent>
      </Card>

      {/* Section 7: Optimal Reference */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader 
            number={spec.optimalReference.sectionNumber} 
            title={spec.optimalReference.title[language]} 
            icon={<Target className="h-5 w-5" />} 
          />
          
          <blockquote className="p-4 bg-muted rounded-lg border-l-4 border-primary mb-4">
            <p className="text-sm italic">
              {spec.optimalReference.definition[language]}
            </p>
          </blockquote>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {spec.optimalReference.properties.map((prop, i) => (
              <Badge key={i} variant="secondary">
                ✓ {prop[language]}
              </Badge>
            ))}
          </div>
          
          <p className="text-sm font-medium text-center p-3 bg-secondary rounded">
            {spec.optimalReference.clarification[language]}
          </p>
        </CardContent>
      </Card>

      {/* Section 8: Uncertainty */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader 
            number={spec.uncertainty.sectionNumber} 
            title={spec.uncertainty.title[language]} 
            icon={<AlertTriangle className="h-5 w-5" />} 
          />
          
          <p className="text-muted-foreground mb-4">
            {spec.uncertainty.intro[language]}
          </p>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            {spec.uncertainty.requirements.map((req, i) => (
              <div key={i} className="flex items-center gap-2 p-2 border rounded">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm">{req[language]}</span>
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-destructive/10 rounded border border-destructive/30 text-center">
            <p className="font-bold text-destructive">
              ⚠️ {spec.uncertainty.rule[language]}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 9: Limitations */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader 
            number={spec.limitations.sectionNumber} 
            title={spec.limitations.title[language]} 
            icon={<ShieldAlert className="h-5 w-5" />} 
          />
          
          <div className="space-y-2 mb-4">
            {spec.limitations.statements.map((s, i) => (
              <div key={i} className="flex items-center gap-2 p-2 border border-destructive/20 rounded bg-destructive/5">
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm">{s[language]}</span>
              </div>
            ))}
          </div>
          
          <p className="text-sm font-medium text-center p-3 bg-muted rounded">
            {spec.limitations.conclusion[language]}
          </p>
        </CardContent>
      </Card>

      {/* Section 10: Usage */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader 
            number={spec.usage.sectionNumber} 
            title={spec.usage.title[language]} 
            icon={<CheckCircle2 className="h-5 w-5" />} 
          />
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {spec.usage.allowed.intro[language]}
              </h4>
              <ul className="space-y-1">
                {spec.usage.allowed.items.map((item, i) => (
                  <li key={i} className="text-sm flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    {item[language]}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                {spec.usage.forbidden.intro[language]}
              </h4>
              <ul className="space-y-1">
                {spec.usage.forbidden.items.map((item, i) => (
                  <li key={i} className="text-sm flex items-center gap-2">
                    <span className="text-destructive">✗</span>
                    {item[language]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 11: Core Principle */}
      <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-background">
        <CardContent className="pt-6">
          <SectionHeader 
            number={spec.corePrinciple.sectionNumber} 
            title={spec.corePrinciple.title[language]} 
            icon={<Sparkles className="h-5 w-5" />} 
          />
          
          <div className="text-center py-8">
            <blockquote className="text-2xl font-semibold">
              "{spec.corePrinciple.statement[language]}"
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* Document Footer */}
      <div className="text-center text-sm text-muted-foreground py-4">
        <p>Document ID: {spec.documentId} • Version: {spec.version} • Status: {spec.status}</p>
        <p>Effective Date: {spec.effectiveDate}</p>
      </div>
    </div>
  );
};

export default LambdaFormalDefinition;
