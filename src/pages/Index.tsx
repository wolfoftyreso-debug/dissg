/**
 * ============================================================================
 * DISSG – LANDING PAGE
 * ============================================================================
 * 
 * Avanza-inspirerad landing med ODIS-struktur.
 * Hero, kalkylator, nyheter, features och app-promo.
 */

import { useNavigate } from 'react-router-dom';
import { MachineReadableHead } from '@/components/seo';
import { useGeo } from '@/contexts/GeoContext';
import {
  HeroSection,
  InsightCalculator,
  NewsSection,
  FeaturesSection,
  AppPromoSection,
} from '@/components/landing';

const Index = () => {
  const navigate = useNavigate();
  const { scope } = useGeo();
  
  const handleStartDiagnosis = () => {
    navigate('/diagnostics');
  };

  return (
    <div className="flex flex-col bg-background">
      {/* Machine-readable metadata */}
      <MachineReadableHead
        entityType={scope.level as any}
        entityCode={scope.code}
        dataTimestamp={new Date().toISOString()}
      />

      {/* Main content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection onStartDiagnosis={handleStartDiagnosis} />

        {/* Insight Calculator (Avanza sparkalkylatorn) */}
        <InsightCalculator />

        {/* News/Features Section */}
        <NewsSection />

        {/* Getting Started Features */}
        <FeaturesSection />

        {/* App Promotion */}
        <AppPromoSection />
      </main>
    </div>
  );
};

export default Index;
