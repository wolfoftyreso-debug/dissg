/**
 * PUBLIC TRANSPARENCY: VALIDATOR
 * 
 * Upload a response.
 * See exactly which rules were applied.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { GOVERNANCE_RULES, evaluateChange } from '@/core/governance';
import { GDG_ANSWER_TYPES } from '@/core/truth-engine/standards';

interface ValidationResult {
  category: string;
  rule: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
}

export default function Validator() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = () => {
    setIsValidating(true);
    
    try {
      const parsed = JSON.parse(input);
      const validationResults: ValidationResult[] = [];

      // Check structure
      validationResults.push({
        category: 'Structure',
        rule: 'JSON Valid',
        status: 'pass',
        message: 'Input is valid JSON',
      });

      // Check for required fields
      const requiredFields = ['id', 'type', 'domain'];
      for (const field of requiredFields) {
        validationResults.push({
          category: 'Structure',
          rule: `Field: ${field}`,
          status: parsed[field] ? 'pass' : 'fail',
          message: parsed[field] ? `${field} present` : `Missing required field: ${field}`,
        });
      }

      // Check answer type
      if (parsed.answer_type) {
        const isValidType = GDG_ANSWER_TYPES.includes(parsed.answer_type);
        validationResults.push({
          category: 'Semantic',
          rule: 'Answer Type',
          status: isValidType ? 'pass' : 'fail',
          message: isValidType 
            ? `Valid answer type: ${parsed.answer_type}`
            : `Invalid answer type: ${parsed.answer_type}. Must be one of: ${GDG_ANSWER_TYPES.join(', ')}`,
        });
      }

      // Check for forbidden language
      const forbiddenWords = ['should', 'must', 'recommend', 'advice', 'best', 'worst', 'good', 'bad'];
      const text = JSON.stringify(parsed).toLowerCase();
      for (const word of forbiddenWords) {
        if (text.includes(word)) {
          validationResults.push({
            category: 'Language',
            rule: `Forbidden: "${word}"`,
            status: 'fail',
            message: `Contains forbidden normative language: "${word}"`,
          });
        }
      }
      
      if (!forbiddenWords.some(w => text.includes(w))) {
        validationResults.push({
          category: 'Language',
          rule: 'No Normative Language',
          status: 'pass',
          message: 'No forbidden normative language detected',
        });
      }

      // Check confidence
      if (parsed.confidence !== undefined) {
        const conf = parsed.confidence;
        validationResults.push({
          category: 'Uncertainty',
          rule: 'Confidence Range',
          status: conf >= 0 && conf <= 1 ? 'pass' : 'fail',
          message: conf >= 0 && conf <= 1 
            ? `Confidence ${conf} is within valid range [0, 1]`
            : `Confidence ${conf} outside valid range [0, 1]`,
        });

        if (conf < 0.5) {
          validationResults.push({
            category: 'Uncertainty',
            rule: 'Low Confidence Warning',
            status: 'warn',
            message: `Confidence ${conf} is below threshold (0.5). Output should be suppressed.`,
          });
        }
      }

      // Check for uncertainty block
      if (parsed.uncertainty) {
        validationResults.push({
          category: 'Uncertainty',
          rule: 'Uncertainty Block',
          status: 'pass',
          message: 'Uncertainty information present',
        });
      } else {
        validationResults.push({
          category: 'Uncertainty',
          rule: 'Uncertainty Block',
          status: 'warn',
          message: 'No uncertainty block. Consider adding.',
        });
      }

      // Check governance rules
      if (parsed.change_type) {
        const govResult = evaluateChange({
          change_type: parsed.change_type,
          target_id: parsed.id || 'unknown',
          timestamp: new Date().toISOString(),
        });

        for (const result of govResult.results) {
          validationResults.push({
            category: 'Governance',
            rule: result.rule_id,
            status: result.allowed ? 'pass' : 'fail',
            message: result.reason,
          });
        }
      }

      setResults(validationResults);
    } catch (e) {
      setResults([{
        category: 'Structure',
        rule: 'JSON Parse',
        status: 'fail',
        message: `Invalid JSON: ${e instanceof Error ? e.message : 'Unknown error'}`,
      }]);
    }

    setIsValidating(false);
  };

  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  const warnCount = results.filter(r => r.status === 'warn').length;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="border-b border-border pb-8">
          <h1 className="text-2xl font-mono font-bold">Validator</h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm">
            Upload a response. See exactly which rules were applied.
          </p>
        </header>

        {/* Input */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold">Input</h2>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste JSON here. Example: {"id": "test", "type": "node", "domain": "health", "answer_type": "TREND_CHANGE", "confidence": 0.8}'
            className="font-mono text-sm min-h-[200px]"
          />
          <Button onClick={handleValidate} disabled={!input.trim() || isValidating}>
            {isValidating ? 'Validating...' : 'Validate'}
          </Button>
        </section>

        {/* Results */}
        {results.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-mono font-semibold">Results</h2>
              <div className="font-mono text-sm flex gap-4">
                <span className="text-green-500">✓ {passCount}</span>
                <span className="text-destructive">✗ {failCount}</span>
                <span className="text-amber-500">⚠ {warnCount}</span>
              </div>
            </div>

            {/* Group by category */}
            {['Structure', 'Semantic', 'Language', 'Uncertainty', 'Governance'].map(category => {
              const categoryResults = results.filter(r => r.category === category);
              if (categoryResults.length === 0) return null;

              return (
                <div key={category} className="space-y-2">
                  <h3 className="font-mono text-sm text-muted-foreground">{category}</h3>
                  <div className="space-y-1">
                    {categoryResults.map((result, i) => (
                      <div 
                        key={i}
                        className={`p-3 rounded border font-mono text-sm flex items-start gap-3 ${
                          result.status === 'pass' 
                            ? 'bg-primary/10 border-primary/20' 
                            : result.status === 'fail'
                            ? 'bg-destructive/10 border-destructive/20'
                            : 'bg-muted border-muted-foreground/20'
                        }`}
                      >
                        <span className={
                          result.status === 'pass' ? 'text-primary' :
                          result.status === 'fail' ? 'text-destructive' : 'text-muted-foreground'
                        }>
                          {result.status === 'pass' ? '✓' : result.status === 'fail' ? '✗' : '⚠'}
                        </span>
                        <div>
                          <div className="font-medium">{result.rule}</div>
                          <div className="text-muted-foreground text-xs mt-0.5">
                            {result.message}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* Rules Reference */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold">Rules Applied</h2>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {GOVERNANCE_RULES.map(rule => (
              <div 
                key={rule.id}
                className="bg-muted/30 p-2 rounded border border-border"
              >
                <span className="text-muted-foreground">[{rule.id}]</span> {rule.name}
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-8 text-center">
          <p className="font-mono text-xs text-muted-foreground">
            All validation rules are machine-enforced and cannot be bypassed.
          </p>
        </footer>
      </div>
    </div>
  );
}
