/**
 * BLOCK RH — STORY FEED
 * "Observed country comparisons"
 * 
 * Visar 3-5 aktiva stories
 * Varför de är intressanta (data, inte debatt)
 * Länkar till full analys
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, ArrowRight, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import type { CountryStory } from '@/config/countryStoriesConfig';
import { EXAMPLE_STORIES, SHIFT_TYPE_LABELS } from '@/config/countryStoriesConfig';

interface StoryFeedProps {
  stories?: CountryStory[];
  onSelectStory: (story: CountryStory) => void;
}

export function StoryFeed({ 
  stories = EXAMPLE_STORIES, 
  onSelectStory 
}: StoryFeedProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Observerade landsjämförelser
          </h2>
          <p className="text-sm text-muted-foreground">
            Faktabaserade händelsekedjor – vad hände, inte vad man borde tycka
          </p>
        </div>
        <Button variant="outline" size="sm">
          Visa alla
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stories.map((story) => (
          <StoryCard 
            key={story.id} 
            story={story} 
            onClick={() => onSelectStory(story)} 
          />
        ))}
      </div>
    </div>
  );
}

interface StoryCardProps {
  story: CountryStory;
  onClick: () => void;
}

function StoryCard({ story, onClick }: StoryCardProps) {
  const primaryOutcome = story.outcomes.primary[0];
  
  return (
    <Card 
      className="hover:border-primary/50 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {story.country.code}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {SHIFT_TYPE_LABELS[story.shift.type].sv}
          </Badge>
        </div>
        <CardTitle className="text-base leading-tight">
          {story.shift.titleSv}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {story.shift.descriptionSv}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Key outcome */}
        {primaryOutcome && (
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            {primaryOutcome.direction === 'increase' ? (
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            ) : primaryOutcome.direction === 'decrease' ? (
              <TrendingDown className="h-4 w-4 text-rose-500" />
            ) : null}
            <span className="text-sm">
              {primaryOutcome.indicatorSv}: 
              <span className="font-medium ml-1">
                {primaryOutcome.direction === 'increase' ? '+' : ''}
                {primaryOutcome.magnitude}%
              </span>
            </span>
          </div>
        )}

        {/* Why interesting */}
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Intressant eftersom:</span> Jämförbar med {story.comparisonGroup.countries.length} länder, 
          tydlig tidsperiod, observerbara utfall.
        </p>

        {/* Period */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>
            {story.period.before.start.slice(0, 4)} – {story.period.after.end.slice(0, 4)}
          </span>
          {story.period.isOngoing && (
            <Badge variant="outline" className="text-xs">Pågående</Badge>
          )}
        </div>

        {/* Read more */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Läs hela analysen
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
