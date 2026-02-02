/**
 * System Memory Archive Demo Page
 */

import React from 'react';
import { SystemMemoryArchive } from '@/components/depth/SystemMemoryArchive';

export default function SystemMemoryDemo() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <SystemMemoryArchive />
      </div>
    </div>
  );
}
