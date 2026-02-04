/**
 * Data Page
 * 
 * Main entry point for the data dashboard system.
 */

import React from 'react';
import { DataDashboard } from '@/components/data';

export default function DataPage() {
  return (
    <div className="min-h-screen bg-background">
      <DataDashboard className="h-screen" />
    </div>
  );
}
