/**
 * Onboarding Page
 * Introduces users to the three core questions
 */

import { useNavigate } from 'react-router-dom';
import { CoreQuestionsOnboarding } from '@/components/onboarding';

export default function OnboardingPage() {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/public');
  };

  const handleSkip = () => {
    navigate('/public');
  };

  return (
    <CoreQuestionsOnboarding 
      onComplete={handleComplete}
      onSkip={handleSkip}
    />
  );
}
