/**
 * Cognitive Bias Exposure Layer Demo Page
 */

import React from 'react';
import { CognitiveBiasPanel } from '@/components/insights/CognitiveBiasPanel';

export default function CognitiveBiasDemo() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <CognitiveBiasPanel />
      </div>
    </div>
  );
}
