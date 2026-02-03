/**
 * LAMBDA PEDAGOGICAL DISPLAY
 * 
 * Complete 5-level explanation pyramid with seamless drilling.
 * "Earn Understanding, Never Ask for Trust"
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronDown,
  ChevronRight,
  Gauge,
  Layers,
  Calculator,
  AlertTriangle,
  Database,
  ExternalLink,
  HelpCircle,
  Car
} from 'lucide-react';
import {
  LAMBDA_L0_SIMPLE,
  LAMBDA_L1_MECHANISM,
  LAMBDA_L2_METHOD,
  LAMBDA_L3_LIMITATIONS,
  LAMBDA_L4_RAWDATA,
  LAMBDA_EXPLANATION_LEVELS,
  type LambdaExplanationLevel,
} from '@/config/lambdaPedagogyConfig';

interface LambdaPedagogicalViewProps {
  startLevel?: LambdaExplanationLevel;
  language?: 'en' | 'sv';
  entityName?: string;
  lambdaValue?: number;
}

export const LambdaPedagogicalView: React.FC<LambdaPedagogicalViewProps> = ({
  startLevel = 'L0',
  language = 'sv',
  entityName = 'World',
  lambdaValue = 0.94,
}) => {
  const [currentLevel, setCurrentLevel] = useState<LambdaExplanationLevel>(startLevel);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['L0']));
  
  const toggleSection = (level: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(level)) {
      newExpanded.delete(level);
    } else {
      newExpanded.add(level);
    }
    setExpandedSections(newExpanded);
  };
  
  const goDeeper = (level: LambdaExplanationLevel) => {
    setCurrentLevel(level);
    setExpandedSections(prev => new Set(prev).add(level));
  };

  return (
    <div className="space-y-4">
      {/* Level Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {(Object.keys(LAMBDA_EXPLANATION_LEVELS) as LambdaExplanationLevel[]).map((level, index) => (
          <React.Fragment key={level}>
            <Button
              variant={expandedSections.has(level) ? 'default' : 'outline'}
              size="sm"
              onClick={() => goDeeper(level)}
              className="whitespace-nowrap"
            >
              {level}: {LAMBDA_EXPLANATION_LEVELS[level].name}
            </Button>
            {index < 4 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </React.Fragment>
        ))}
      </div>
      
      {/* L0: 18-Year-Old */}
      <Card className={`border-2 ${expandedSections.has('L0') ? 'border-primary' : ''}`}>
        <CardHeader 
          className="cursor-pointer"
          onClick={() => toggleSection('L0')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">L0: Lambda för 18-åring</CardTitle>
                <CardDescription>15 sekunder till förståelse</CardDescription>
              </div>
            </div>
            {expandedSections.has('L0') ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </CardHeader>
        
        {expandedSections.has('L0') && (
          <CardContent className="space-y-6">
            {/* Headline */}
            <div className="text-center py-6 bg-muted/30 rounded-lg">
              <h2 className="text-3xl font-bold mb-4">
                {LAMBDA_L0_SIMPLE.headline[language]}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {LAMBDA_L0_SIMPLE.oneSentence[language]}
              </p>
            </div>
            
            {/* Three Points */}
            <div className="grid md:grid-cols-3 gap-4">
              {LAMBDA_L0_SIMPLE.threePoints[language].map((point, i) => (
                <div 
                  key={i}
                  className={`p-4 rounded-lg text-center ${
                    i === 0 ? 'bg-primary/10 border-primary/20' :
                    i === 1 ? 'bg-secondary border-secondary' :
                    'bg-destructive/10 border-destructive/20'
                  } border`}
                >
                  <span className="font-mono text-lg">{point}</span>
                </div>
              ))}
            </div>
            
            {/* Car Analogy */}
            <div className="p-4 bg-muted rounded-lg flex items-start gap-4">
              <Car className="h-8 w-8 text-muted-foreground mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Motoranalogin</h4>
                <p className="text-muted-foreground">
                  {LAMBDA_L0_SIMPLE.carAnalogy[language]}
                </p>
              </div>
            </div>
            
            {/* What It Is Not */}
            <div className="grid md:grid-cols-3 gap-2">
              {LAMBDA_L0_SIMPLE.whatItIsNot[language].map((item) => (
                <Badge key={item} variant="outline" className="justify-center py-2">
                  ❌ {item}
                </Badge>
              ))}
            </div>
            
            {/* Bottom Line */}
            <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-lg font-medium">
                {LAMBDA_L0_SIMPLE.bottomLine[language]}
              </p>
            </div>
            
            <Button onClick={() => goDeeper('L1')} className="w-full">
              Fördjupa: Vad driver Lambda? <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        )}
      </Card>
      
      {/* L1: Mechanism */}
      <Card className={`border-2 ${expandedSections.has('L1') ? 'border-primary' : ''}`}>
        <CardHeader 
          className="cursor-pointer"
          onClick={() => toggleSection('L1')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">L1: Mekanism</CardTitle>
                <CardDescription>Vad driver Lambda?</CardDescription>
              </div>
            </div>
            {expandedSections.has('L1') ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </CardHeader>
        
        {expandedSections.has('L1') && (
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              {LAMBDA_L1_MECHANISM.coreConcept[language]}
            </p>
            
            {/* Sensor Categories Grid */}
            <div className="grid md:grid-cols-2 gap-3">
              {LAMBDA_L1_MECHANISM.sensorCategories.map((cat) => (
                <div key={cat.id} className="p-3 border rounded-lg flex items-start gap-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <div>
                    <h4 className="font-medium">{cat.name[language]}</h4>
                    <p className="text-sm text-muted-foreground">
                      {cat.description[language]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Stress Analysis */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Systemstressanalys
              </h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {LAMBDA_L1_MECHANISM.stressAnalysis[language]}
              </p>
            </div>
            
            <Button onClick={() => goDeeper('L2')} variant="outline" className="w-full">
              Fördjupa: Hur beräknas Lambda? <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        )}
      </Card>
      
      {/* L2: Method */}
      <Card className={`border-2 ${expandedSections.has('L2') ? 'border-primary' : ''}`}>
        <CardHeader 
          className="cursor-pointer"
          onClick={() => toggleSection('L2')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">L2: Metod</CardTitle>
                <CardDescription>Hur beräknas Lambda?</CardDescription>
              </div>
            </div>
            {expandedSections.has('L2') ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </CardHeader>
        
        {expandedSections.has('L2') && (
          <CardContent className="space-y-6">
            {/* Formula */}
            <div className="p-6 bg-muted rounded-lg text-center">
              <code className="text-2xl font-mono font-bold">
                {LAMBDA_L2_METHOD.formula.main}
              </code>
              <p className="text-sm text-muted-foreground mt-2">
                {LAMBDA_L2_METHOD.formula.explanation[language]}
              </p>
            </div>
            
            {/* Steps */}
            <div className="space-y-3">
              {LAMBDA_L2_METHOD.steps.map((step) => (
                <div key={step.step} className="flex items-start gap-4 p-3 border rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                  <div>
                    <h4 className="font-medium">{step.name[language]}</h4>
                    <p className="text-sm text-muted-foreground">
                      {step.description[language]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Reproducibility */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2">✓ Reproducerbarhet</h4>
              <p className="text-sm text-muted-foreground">
                {LAMBDA_L2_METHOD.reproducibility[language]}
              </p>
            </div>
            
            <Button onClick={() => goDeeper('L3')} variant="outline" className="w-full">
              Fördjupa: Vad visar Lambda INTE? <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        )}
      </Card>
      
      {/* L3: Limitations */}
      <Card className={`border-2 ${expandedSections.has('L3') ? 'border-primary' : ''}`}>
        <CardHeader 
          className="cursor-pointer"
          onClick={() => toggleSection('L3')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-lg">L3: Begränsningar</CardTitle>
                <CardDescription>Vad Lambda INTE visar</CardDescription>
              </div>
            </div>
            {expandedSections.has('L3') ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </CardHeader>
        
        {expandedSections.has('L3') && (
          <CardContent className="space-y-4">
            {LAMBDA_L3_LIMITATIONS.criticalLimitations.map((lim) => (
              <div key={lim.id} className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  {lim.title[language]}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {lim.description[language]}
                </p>
              </div>
            ))}
            
            <Separator />
            
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Ärlig disclaimer
              </h4>
              <p className="text-sm text-muted-foreground">
                {LAMBDA_L3_LIMITATIONS.honestDisclaimer[language]}
              </p>
            </div>
            
            <Button onClick={() => goDeeper('L4')} variant="outline" className="w-full">
              Fördjupa: Rådata & full transparens <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        )}
      </Card>
      
      {/* L4: Raw Data */}
      <Card className={`border-2 ${expandedSections.has('L4') ? 'border-primary' : ''}`}>
        <CardHeader 
          className="cursor-pointer"
          onClick={() => toggleSection('L4')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">L4: Rådata</CardTitle>
                <CardDescription>Full transparens & replikering</CardDescription>
              </div>
            </div>
            {expandedSections.has('L4') ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </CardHeader>
        
        {expandedSections.has('L4') && (
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Datatillgång</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {LAMBDA_L4_RAWDATA.dataAccess[language]}
              </p>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Granskningslogg</h4>
              <p className="text-sm text-muted-foreground">
                {LAMBDA_L4_RAWDATA.auditTrail[language]}
              </p>
            </div>
            
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Replikeringsguide
              </h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {LAMBDA_L4_RAWDATA.replicationGuide[language]}
              </p>
            </div>
            
            <div className="text-center text-sm text-muted-foreground pt-4">
              <Gauge className="h-6 w-6 mx-auto mb-2 text-primary" />
              Du har nått botten av förklaringspyramiden.<br/>
              <strong>Lambda = transparent mätning, inte dold magi.</strong>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default LambdaPedagogicalView;
