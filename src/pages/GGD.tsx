/**
 * Guided Global Diagnostics Page
 */

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GuidedDiagnostics } from '@/components/ggd';

export default function GGDPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const geoCode = searchParams.get('geo') || 'US';
  const geoName = searchParams.get('name') || 'United States';
  const deviation = parseFloat(searchParams.get('deviation') || '-18');

  return (
    <GuidedDiagnostics
      geoCode={geoCode}
      geoName={geoName}
      lambdaDeviation={deviation}
      onClose={() => navigate('/gdm')}
      isPro={true}
    />
  );
}
