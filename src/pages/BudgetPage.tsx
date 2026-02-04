/**
 * Budget Page
 * 
 * Simple government budget comparison for understanding
 * how different governments spend money
 */

import React from 'react';
import { GovernmentBudgetExplorer } from '@/components/budget';

const BudgetPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <GovernmentBudgetExplorer />
      </div>
    </div>
  );
};

export default BudgetPage;
