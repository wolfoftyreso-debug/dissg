/**
 * Collective Learning Tracker Demo Page
 */

import React from 'react';
import { CollectiveLearningTracker } from '@/components/learning/CollectiveLearningTracker';

export default function CollectiveLearningDemo() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <CollectiveLearningTracker />
      </div>
    </div>
  );
}
