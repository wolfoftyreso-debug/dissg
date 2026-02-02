/**
 * Learning Path Catalog
 * Browse and select learning paths
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ChevronRight, BookOpen } from 'lucide-react';
import type { LearningPath, PathLevel } from '@/config/guidedLearningPathsConfig';
import { PATH_LEVELS, EXAMPLE_LEARNING_PATHS } from '@/config/guidedLearningPathsConfig';

interface LearningPathCatalogProps {
  onSelectPath: (path: LearningPath) => void;
}

const LEVEL_COLORS: Record<PathLevel, string> = {
  quick: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  foundation: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  deep: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
};

export function LearningPathCatalog({ onSelectPath }: LearningPathCatalogProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Guidade lärandevägar</h1>
              <p className="text-muted-foreground">
                Förstå världen, steg för steg – med data som grund
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Principle banner */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <p className="text-lg text-center">
              <span className="font-medium">Systemet lär inte ut svar.</span>
              <span className="text-muted-foreground ml-2">
                Systemet lär ut hur man ser.
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Level filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="secondary">Alla nivåer</Badge>
          {(Object.entries(PATH_LEVELS) as [PathLevel, typeof PATH_LEVELS[PathLevel]][]).map(([level, info]) => (
            <Badge 
              key={level} 
              variant="outline" 
              className={`cursor-pointer ${LEVEL_COLORS[level]}`}
            >
              {info.labelSv} ({info.duration})
            </Badge>
          ))}
        </div>

        {/* Paths grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXAMPLE_LEARNING_PATHS.map((path) => (
            <Card 
              key={path.id} 
              className="hover:border-primary/50 transition-colors cursor-pointer group"
              onClick={() => onSelectPath(path)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{path.icon}</span>
                  <Badge 
                    variant="outline" 
                    className={LEVEL_COLORS[path.level]}
                  >
                    {PATH_LEVELS[path.level].labelSv}
                  </Badge>
                </div>
                <CardTitle className="mt-2">{path.titleSv}</CardTitle>
                <CardDescription>{path.descriptionSv}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>~{path.estimatedMinutes} min</span>
                    <span>•</span>
                    <span>{path.steps.length} steg</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Starta
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming soon */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Fler lärandevägar kommer snart: Utbildning, Miljö, Institutioner...
          </p>
        </div>
      </main>
    </div>
  );
}
