/**
 * COVID-19 REALITY LAYER - Comparison Tool
 * Validates and controls cross-country comparisons
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, GitCompare } from 'lucide-react';
import type { CovidDataType } from '@/types/covid';

const DATA_TYPES: { value: CovidDataType; label: string }[] = [
  { value: 'confirmed_cases', label: 'Confirmed Cases' },
  { value: 'deaths', label: 'Deaths' },
  { value: 'hospitalizations', label: 'Hospitalizations' },
  { value: 'tests', label: 'Tests Performed' },
];

interface ValidationResult {
  isValid: boolean;
  score: number;
  reasons: string[];
  warnings: string[];
}

export function CovidComparisonTool() {
  const [countryA, setCountryA] = useState('SE');
  const [countryB, setCountryB] = useState('NO');
  const [dataType, setDataType] = useState<CovidDataType>('deaths');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = async () => {
    setIsValidating(true);
    
    // Simulate validation
    await new Promise(r => setTimeout(r, 500));
    
    // Demo validation result
    const result: ValidationResult = {
      isValid: countryA !== countryB && dataType === 'deaths',
      score: dataType === 'deaths' ? 0.75 : 0.4,
      reasons: dataType !== 'deaths' 
        ? ['Different testing strategies make case comparisons unreliable']
        : [],
      warnings: [
        'Sweden used a 30-day death window; Norway used lab-confirmed only',
        'Reporting frequency differed during spring 2020',
      ],
    };
    
    setValidation(result);
    setIsValidating(false);
  };

  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <GitCompare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Comparison Validation</p>
              <p className="text-xs text-muted-foreground">
                Not all comparisons are methodologically valid. This tool checks whether 
                the selected countries used comparable definitions and reporting methods 
                during the selected period.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Country A</Label>
              <Select value={countryA} onValueChange={setCountryA}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SE">Sweden</SelectItem>
                  <SelectItem value="NO">Norway</SelectItem>
                  <SelectItem value="DK">Denmark</SelectItem>
                  <SelectItem value="FI">Finland</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Country B</Label>
              <Select value={countryB} onValueChange={setCountryB}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SE">Sweden</SelectItem>
                  <SelectItem value="NO">Norway</SelectItem>
                  <SelectItem value="DK">Denmark</SelectItem>
                  <SelectItem value="FI">Finland</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data Type</Label>
              <Select value={dataType} onValueChange={(v) => setDataType(v as CovidDataType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATA_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            className="mt-4" 
            onClick={handleValidate}
            disabled={isValidating || countryA === countryB}
          >
            {isValidating ? 'Validating...' : 'Validate Comparison'}
          </Button>
        </CardContent>
      </Card>

      {/* Validation Result */}
      {validation && (
        <Card className={validation.isValid ? 'border-green-500/30' : 'border-destructive/30'}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {validation.isValid ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Comparison Valid (with cautions)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-destructive" />
                  <span>Comparison Not Valid</span>
                </>
              )}
              <Badge variant="outline" className="ml-auto">
                Score: {(validation.score * 100).toFixed(0)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!validation.isValid && validation.reasons.length > 0 && (
              <div className="p-3 rounded bg-destructive/10">
                <p className="text-sm font-medium text-destructive mb-2">This comparison is not methodologically valid:</p>
                <ul className="text-sm text-destructive/80 list-disc list-inside">
                  {validation.reasons.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            {validation.warnings.length > 0 && (
              <div className="p-3 rounded bg-warning/10">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning-foreground mb-1">Cautions:</p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                      {validation.warnings.map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t text-xs text-muted-foreground">
              <p className="font-medium mb-1">When comparing {countryA} and {countryB}:</p>
              <p>
                Any observed differences may be due to definitional differences, reporting practices, 
                demographic factors, or other confounders – not necessarily policy choices or 
                actual differences in outcomes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blocked Comparison Response */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Standard Response for Invalid Comparisons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/50 rounded text-sm font-mono">
            "This comparison is not methodologically valid. The countries use different 
            definitions, testing strategies, or reporting methods during the selected period."
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
