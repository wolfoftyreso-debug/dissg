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
  LandingHeader,
  HeroSection,
  InsightCalculator,
  NewsSection,
  FeaturesSection,
  AppPromoSection,
  LandingFooter,
} from '@/components/landing';

const Index = () => {
  const navigate = useNavigate();
  const { scope } = useGeo();
  
  const handleStartDiagnosis = () => {
    navigate('/diagnostics');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Machine-readable metadata */}
      <MachineReadableHead
        entityType={scope.level as any}
        entityCode={scope.code}
        dataTimestamp={new Date().toISOString()}
      />

      {/* ODIS-style Header */}
      <LandingHeader onStartDiagnosis={handleStartDiagnosis} />

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

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default Index;
