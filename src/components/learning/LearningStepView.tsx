/**
 * Individual Learning Step View
 * Renders the content of a single step in the learning path
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  MousePointer, 
  Move, 
  Globe, 
  Calendar,
  Layers,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import type { LearningStep, InteractionType } from '@/config/guidedLearningPathsConfig';
import { STEP_TYPE_LABELS, INTERACTION_PROMPTS } from '@/config/guidedLearningPathsConfig';

interface LearningStepViewProps {
  step: LearningStep;
  onShowReflection?: () => void;
}

const INTERACTION_ICONS: Record<InteractionType, React.ReactNode> = {
  click_explore: <MousePointer className="h-4 w-4" />,
  drag_compare: <Move className="h-4 w-4" />,
  select_region: <Globe className="h-4 w-4" />,
  change_period: <Calendar className="h-4 w-4" />,
  toggle_layer: <Layers className="h-4 w-4" />,
};

// Mock data for visualizations
const generateMockTimelineData = () => {
  const data = [];
  for (let year = 2000; year <= 2024; year++) {
    data.push({
      year,
      value: 50 + Math.sin((year - 2000) * 0.3) * 20 + Math.random() * 10,
    });
  }
  return data;
};

export function LearningStepView({ step, onShowReflection }: LearningStepViewProps) {
  const mockData = generateMockTimelineData();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {STEP_TYPE_LABELS[step.type].sv}
          </Badge>
        </div>
        <CardTitle className="text-xl">{step.titleSv}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main content text */}
        <p className="text-muted-foreground leading-relaxed">
          {step.content.textSv}
        </p>
        
        {/* Visualization based on type */}
        {step.content.visualizationType === 'timeline' && (
          <div className="h-[300px] w-full bg-muted/30 rounded-lg p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [value.toFixed(1), 'Värde']}
                  labelFormatter={(label) => `År ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {step.content.visualizationType === 'chart' && (
          <div className="h-[250px] w-full bg-muted/30 rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">
              [Interaktiv visualisering laddas här]
            </span>
          </div>
        )}
        
        {step.content.visualizationType === 'map' && (
          <div className="h-[300px] w-full bg-muted/30 rounded-lg flex items-center justify-center">
            <Globe className="h-12 w-12 text-muted-foreground" />
            <span className="text-muted-foreground ml-2">
              [Regionkarta laddas här]
            </span>
          </div>
        )}
        
        {step.content.visualizationType === 'comparison' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">Globalt</div>
              <div className="text-sm text-muted-foreground">Värde: 72.4</div>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-chart-2">Din region</div>
              <div className="text-sm text-muted-foreground">Värde: 78.1</div>
            </div>
          </div>
        )}
        
        {step.content.visualizationType === 'canvas' && (
          <div className="h-[250px] w-full bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-center">
            <Button variant="outline">
              Öppna korrelationscanvas
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
        
        {/* Interaction prompt */}
        {step.interaction && (
          <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
            {INTERACTION_ICONS[step.interaction]}
            <span className="text-sm">
              {INTERACTION_PROMPTS[step.interaction].sv}
            </span>
          </div>
        )}
        
        {/* Reflection prompt trigger */}
        {step.reflection && (
          <Button 
            variant="secondary" 
            onClick={onShowReflection}
            className="w-full gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Stanna och reflektera
          </Button>
        )}
        
        {/* Source references */}
        {step.content.sourceReferences && step.content.sourceReferences.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Källor: </span>
            {step.content.sourceReferences.join(', ')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
