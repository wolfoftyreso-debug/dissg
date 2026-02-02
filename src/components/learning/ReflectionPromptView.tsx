/**
 * BLOCK QE — "STOP & REFLECT"
 * 
 * "Vad tror du hände här?"
 * (inga svar, bara reflektion)
 * 
 * "Låt oss titta på datan."
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, ArrowRight, Brain } from 'lucide-react';
import type { ReflectionPrompt } from '@/config/guidedLearningPathsConfig';

interface ReflectionPromptViewProps {
  reflection: ReflectionPrompt;
  onContinue: () => void;
}

export function ReflectionPromptView({ 
  reflection, 
  onContinue 
}: ReflectionPromptViewProps) {
  const [userThought, setUserThought] = useState('');
  const [hasReflected, setHasReflected] = useState(false);

  const handleReflect = () => {
    setHasReflected(true);
  };

  return (
    <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Stanna och reflektera
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasReflected ? (
          <>
            <p className="text-lg font-medium">
              {reflection.questionSv}
            </p>
            <p className="text-sm text-muted-foreground">
              Ta en stund att fundera innan du fortsätter. 
              Det finns inga rätt eller fel svar.
            </p>
            <Textarea
              placeholder="Skriv dina tankar här (valfritt)..."
              value={userThought}
              onChange={(e) => setUserThought(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleReflect} className="w-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              Jag har reflekterat
            </Button>
          </>
        ) : (
          <>
            <p className="text-lg font-medium text-primary">
              {reflection.followUpSv}
            </p>
            <p className="text-sm text-muted-foreground">
              Låt oss nu se vad datan faktiskt visar och jämföra med dina förväntningar.
            </p>
            {userThought && (
              <div className="p-3 bg-muted rounded-lg text-sm">
                <span className="text-xs text-muted-foreground block mb-1">
                  Din reflektion:
                </span>
                {userThought}
              </div>
            )}
            <Button onClick={onContinue} className="w-full">
              Visa datan
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
