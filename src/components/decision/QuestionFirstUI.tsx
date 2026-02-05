/**
 * QUESTION-FIRST UI
 * 
 * User describes intent → System suggests Decision Type → Question tree displayed.
 * 
 * "I want to do X — show me what I need to know."
 */

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  ArrowRight, 
  Lightbulb,
  Building2,
  
  BookOpen,
  TrendingUp,
  Users,
  Activity,
  BarChart3,
  MapPin,
  Target,
  Info,
  Sparkles,
} from "lucide-react";
import { detectDecisionType, listDecisionTypes, type DecisionType } from "@/core/truth-engine/decision/registry";

interface QuestionFirstUIProps {
  onDecisionTypeSelected?: (type: DecisionType) => void;
}

const INTENT_ICONS: Record<string, React.ElementType> = {
  investment_feasibility: Building2,
  capacity_planning: Activity,
  policy_impact: BookOpen,
  market_exposure: TrendingUp,
  resource_allocation: Users,
  operational_bottleneck: Activity,
  demand_forecast: BarChart3,
  system_stability: Activity,
  regional_comparison: MapPin,
  intervention_evaluation: Target,
};

const EXAMPLE_INTENTS = [
  "I want to evaluate investing in renewable energy infrastructure",
  "I need to plan healthcare capacity for the next 12 months",
  "I want to assess the impact of an education reform",
  "I need to understand our market exposure",
  "I want to compare performance across regions",
];

export function QuestionFirstUI({ onDecisionTypeSelected }: QuestionFirstUIProps) {
  const [intent, setIntent] = useState("");
  const [detectedType, setDetectedType] = useState<DecisionType | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showAllTypes, setShowAllTypes] = useState(false);
  const allTypes = listDecisionTypes();

  const handleDetect = useCallback(() => {
    if (!intent.trim()) return;
    
    setIsDetecting(true);
    
    // Simulate detection delay for UX
    setTimeout(() => {
      const detected = detectDecisionType(intent);
      setDetectedType(detected);
      setIsDetecting(false);
    }, 500);
  }, [intent]);

  const handleSelectType = (type: DecisionType) => {
    setDetectedType(type);
    onDecisionTypeSelected?.(type);
  };

  const handleProceed = () => {
    if (detectedType) {
      onDecisionTypeSelected?.(detectedType);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intent Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            What do you want to understand?
          </CardTitle>
          <CardDescription>
            Describe your intent — we'll show you the relevant questions and data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="e.g., I want to evaluate investing in renewable energy..."
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              className="min-h-[80px] flex-1"
            />
          </div>
          <Button 
            onClick={handleDetect} 
            disabled={!intent.trim() || isDetecting}
            className="gap-2"
          >
            {isDetecting ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Find relevant questions
              </>
            )}
          </Button>

          {/* Example intents */}
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-2">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_INTENTS.slice(0, 3).map((example, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setIntent(example)}
                >
                  {example.slice(0, 40)}...
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detected Type */}
      {detectedType && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                {(() => {
                  const Icon = INTENT_ICONS[detectedType.type_id] || Activity;
                  return <Icon className="h-6 w-6 text-primary" />;
                })()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{detectedType.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {detectedType.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {detectedType.typical_node_count} questions
                  </Badge>
                  <Badge variant="outline">
                    {detectedType.complexity} complexity
                  </Badge>
                  {detectedType.domains.map(d => (
                    <Badge key={d} variant="secondary" className="text-xs">
                      {d}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button onClick={handleProceed} className="gap-2">
                    Explore questions
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowAllTypes(true)}>
                    Choose different type
                  </Button>
                </div>
              </div>
            </div>

            {/* What this provides */}
            <div className="mt-6 pt-4 border-t border-primary/20">
              <div className="flex items-start gap-2 text-sm">
                <Info className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">What you'll get:</p>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    <li>• Structured questions to explore</li>
                    <li>• Verified data with confidence levels</li>
                    <li>• Clear limitations and data gaps</li>
                  </ul>
                  <p className="mt-2 text-xs font-medium text-primary">
                    We never provide recommendations or tell you what to do.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Types (expandable) */}
      {(showAllTypes || !detectedType) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Decision Types</CardTitle>
            <CardDescription>
              Choose a structured question framework
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {allTypes.map(type => {
                const Icon = INTENT_ICONS[type.type_id] || Activity;
                return (
                  <button
                    key={type.type_id}
                    onClick={() => handleSelectType(type)}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-colors hover:bg-muted ${
                      detectedType?.type_id === type.type_id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border'
                    }`}
                  >
                    <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{type.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {type.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Principle */}
      <p className="text-xs text-muted-foreground text-center">
        You describe intent → We show questions → Data answers → You decide
      </p>
    </div>
  );
}
