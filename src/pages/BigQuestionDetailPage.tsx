/**
 * Big Question Detail Page
 * 
 * Shows a single Big Question with full details.
 * URL: /big-questions/:code
 * 
 * Part of Block 56.
 */

import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { BigQuestionDetail } from '@/components/big-questions/BigQuestionDetail';

export default function BigQuestionDetailPage() {
  const { code } = useParams<{ code: string }>();
  const [searchParams] = useSearchParams();
  const countryCode = searchParams.get('country');

  if (!code) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Ingen frågekod angiven.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <BigQuestionDetail 
          questionCode={code} 
          countryCode={countryCode}
        />
      </div>
    </div>
  );
}
