/**
 * Country Stories Demo Page
 * Entry point for Comparative Country Stories
 */

import React, { useState } from 'react';
import { StoryFeed } from '@/components/stories/StoryFeed';
import { CountryStoryViewer } from '@/components/stories/CountryStoryViewer';
import type { CountryStory } from '@/config/countryStoriesConfig';

export default function StoriesDemo() {
  const [selectedStory, setSelectedStory] = useState<CountryStory | null>(null);

  if (selectedStory) {
    return (
      <CountryStoryViewer
        story={selectedStory}
        onBack={() => setSelectedStory(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Comparative Country Stories</h1>
          <p className="text-muted-foreground">
            Datadriven verklighetsberättelse – vad hände, inte vad man borde tycka
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <StoryFeed onSelectStory={setSelectedStory} />
      </main>
    </div>
  );
}
