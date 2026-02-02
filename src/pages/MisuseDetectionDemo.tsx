/**
 * Misuse Detection Layer Demo Page
 */

import React from 'react';
import { MisuseDetectionPanel } from '@/components/transparency/MisuseDetectionPanel';

export default function MisuseDetectionDemo() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <MisuseDetectionPanel />
      </div>
    </div>
  );
}
