import React from 'react';
import { PrioritizedDashboard } from '@/components/relevance';

const PrioritizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <PrioritizedDashboard />
      </div>
    </div>
  );
};

export default PrioritizedPage;
