/**
 * Learning Paths Page
 * Entry point for Guided Learning Paths
 */

import React, { useState } from 'react';
import { LearningPathCatalog } from '@/components/learning/LearningPathCatalog';
import { LearningPathViewer } from '@/components/learning/LearningPathViewer';
import type { LearningPath } from '@/config/guidedLearningPathsConfig';

export default function LearningPaths() {
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);

  if (selectedPath) {
    return (
      <LearningPathViewer
        path={selectedPath}
        onExit={() => setSelectedPath(null)}
        onComplete={() => setSelectedPath(null)}
      />
    );
  }

  return <LearningPathCatalog onSelectPath={setSelectedPath} />;
}
