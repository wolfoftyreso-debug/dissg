/**
 * Index Explorer Page
 * 
 * Main entry point for the Index system.
 */

import React from 'react';
import { IndexExplorer } from '@/components/indices';

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <IndexExplorer className="h-screen" />
    </div>
  );
}
