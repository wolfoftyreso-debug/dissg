/**
 * AI Governance Panel
 * 
 * Shows AI governance state, violations, and master prompt.
 * For system administrators and auditing.
 */

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getGovernanceState,
  getViolationLog,
  clearViolationLog,
  MASTER_PROMPT_SV,
  FORBIDDEN_VALUE_WORDS,
  FORBIDDEN_NORMATIVE_EXPRESSIONS,
  validateAIOutput,
  type AIGovernanceState,
  type AIViolationIncident,
} from '@/lib/ai-governance';

// =============================================================================
// GOVERNANCE STATUS
// =============================================================================

function GovernanceStatus({ state }: { state: AIGovernanceState }) {
  return (
    <div className={`p-4 rounded border ${state.isLocked ? 'bg-red-500/10 border-red-500' : 'bg-green-500/10 border-green-500/50'}`}>
      <div className="flex justify-between items-center">
        <div>
          <div className="font-mono text-sm font-semibold">
            AI GOVERNANCE STATUS
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {state.isLocked 
              ? `Låst: ${state.lockReason}` 
              : 'Operativ – alla regler aktiva'
            }
          </div>
        </div>
        <Badge variant={state.isLocked ? 'destructive' : 'secondary'} className="font-mono">
          {state.isLocked ? 'LÅST' : 'AKTIV'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4 text-xs">
        <div>
          <div className="text-muted-foreground">Totala överträdelser</div>
          <div className="font-mono text-lg">{state.violationCount}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Senaste överträdelser</div>
          <div className="font-mono text-lg">{state.recentViolations.length}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Kan låsas upp</div>
          <div className="font-mono text-lg">{state.canUnlock ? 'JA' : 'NEJ'}</div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// VIOLATION LOG
// =============================================================================

function ViolationLog({ violations }: { violations: AIViolationIncident[] }) {
  if (violations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Inga överträdelser registrerade
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {violations.map((v) => (
        <div key={v.id} className="p-3 rounded border bg-card text-xs">
          <div className="flex justify-between items-start">
            <div className="font-mono font-semibold">{v.violationType.toUpperCase()}</div>
            <Badge 
              variant={v.severity === 'critical' ? 'destructive' : 'secondary'}
              className="text-[10px]"
            >
              {v.severity}
            </Badge>
          </div>
          <div className="mt-1 text-muted-foreground">
            <span className="text-foreground">"{v.violationText}"</span>
          </div>
          <div className="mt-2 flex justify-between text-muted-foreground">
            <span>{v.action}</span>
            <span>{new Date(v.timestamp).toLocaleString('sv-SE')}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// FORBIDDEN PATTERNS VIEW
// =============================================================================

function ForbiddenPatternsView() {
  return (
    <div className="space-y-4">
      <div>
        <div className="font-mono text-xs text-muted-foreground mb-2">FÖRBJUDNA VÄRDEORD</div>
        <div className="flex flex-wrap gap-1">
          {FORBIDDEN_VALUE_WORDS.slice(0, 30).map((word) => (
            <Badge key={word} variant="outline" className="text-[10px] text-red-500 border-red-500/30">
              {word}
            </Badge>
          ))}
          {FORBIDDEN_VALUE_WORDS.length > 30 && (
            <Badge variant="outline" className="text-[10px]">
              +{FORBIDDEN_VALUE_WORDS.length - 30} till
            </Badge>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <div className="font-mono text-xs text-muted-foreground mb-2">FÖRBJUDNA NORMATIVA UTTRYCK</div>
        <div className="flex flex-wrap gap-1">
          {FORBIDDEN_NORMATIVE_EXPRESSIONS.slice(0, 20).map((expr) => (
            <Badge key={expr} variant="outline" className="text-[10px] text-orange-500 border-orange-500/30">
              {expr}
            </Badge>
          ))}
          {FORBIDDEN_NORMATIVE_EXPRESSIONS.length > 20 && (
            <Badge variant="outline" className="text-[10px]">
              +{FORBIDDEN_NORMATIVE_EXPRESSIONS.length - 20} till
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MASTER PROMPT VIEW
// =============================================================================

function MasterPromptView() {
  return (
    <div className="bg-muted/30 rounded border p-4">
      <div className="font-mono text-xs text-muted-foreground mb-2">MASTER PROMPT (SV)</div>
      <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed">
        {MASTER_PROMPT_SV}
      </pre>
    </div>
  );
}

// =============================================================================
// VALIDATOR TESTER
// =============================================================================

function ValidatorTester() {
  const [testInput, setTestInput] = useState('');
  const [result, setResult] = useState<ReturnType<typeof validateAIOutput> | null>(null);

  const handleTest = () => {
    if (testInput.trim()) {
      setResult(validateAIOutput(testInput));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="font-mono text-xs text-muted-foreground mb-2">TESTA AI-OUTPUT</div>
        <textarea
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
          placeholder="Skriv ett AI-svar för att testa mot regelverket..."
          className="w-full h-24 p-2 text-sm border rounded bg-background font-mono"
        />
        <Button onClick={handleTest} size="sm" className="mt-2">
          Validera
        </Button>
      </div>

      {result && (
        <div className={`p-4 rounded border ${result.hasViolation ? 'bg-red-500/10 border-red-500' : 'bg-green-500/10 border-green-500'}`}>
          <div className="font-mono text-sm font-semibold">
            {result.hasViolation ? '❌ ÖVERTRÄDELSER DETEKTERADE' : '✓ GODKÄNT'}
          </div>
          
          {result.violations.length > 0 && (
            <div className="mt-2 space-y-1">
              {result.violations.map((v, i) => (
                <div key={i} className="text-xs">
                  <span className="text-red-500 font-mono">{v.type}</span>: "{v.match}" (pos {v.position})
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function AIGovernancePanel() {
  const [state, setState] = useState<AIGovernanceState>(getGovernanceState());
  const [violations, setViolations] = useState<AIViolationIncident[]>(getViolationLog());

  const handleClearLog = () => {
    clearViolationLog();
    setState(getGovernanceState());
    setViolations(getViolationLog());
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-mono text-lg font-semibold">AI GOVERNANCE</h1>
            <p className="text-xs text-muted-foreground">
              OEM-klassad diagnostik utan spekulation
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClearLog}>
            Återställ
          </Button>
        </div>
      </div>

      {/* Status */}
      <div className="p-4 border-b">
        <GovernanceStatus state={state} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="violations" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="violations" className="text-xs">Överträdelser</TabsTrigger>
          <TabsTrigger value="patterns" className="text-xs">Förbjudet</TabsTrigger>
          <TabsTrigger value="prompt" className="text-xs">Master Prompt</TabsTrigger>
          <TabsTrigger value="test" className="text-xs">Testa</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4">
              <TabsContent value="violations" className="m-0">
                <ViolationLog violations={violations} />
              </TabsContent>

              <TabsContent value="patterns" className="m-0">
                <ForbiddenPatternsView />
              </TabsContent>

              <TabsContent value="prompt" className="m-0">
                <MasterPromptView />
              </TabsContent>

              <TabsContent value="test" className="m-0">
                <ValidatorTester />
              </TabsContent>
            </div>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  );
}

export default AIGovernancePanel;
