/**
 * QUESTION-FIRST PAGE
 * 
 * User describes intent → System shows relevant questions.
 * "I want to do X — show me what I need to know."
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionFirstUI } from "@/components/decision/QuestionFirstUI";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import type { DecisionType } from "@/core/truth-engine/decision/registry";

export default function QuestionFirst() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<DecisionType | null>(null);

  const handleTypeSelected = (type: DecisionType) => {
    setSelectedType(type);
    // Navigate to decision demo with the selected type
    // In production, this would open a full Decision Graph view
    navigate(`/decision?type=${type.type_id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">What do you need to understand?</h1>
              <p className="text-muted-foreground mt-1">
                Describe your intent — we'll show you the relevant questions and data
              </p>
            </div>
            <Badge variant="outline" className="gap-1">
              <Info className="h-3 w-3" />
              Questions, not recommendations
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <QuestionFirstUI onDecisionTypeSelected={handleTypeSelected} />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>You describe intent → We show questions → Data answers → You decide</p>
          <p className="mt-1">Responsibility lies with you, not with AI, not with us</p>
        </div>
      </footer>
    </div>
  );
}
