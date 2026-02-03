/**
 * Grace Period Warning Banner
 * 
 * ⚠️ Shown when payment has failed but user is still in grace period
 * Clinical, clear, no drama
 */

import React from 'react';
import { AlertTriangle, CreditCard } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useGracePeriod } from '@/hooks/useSubscription';
import { PAYMENT_RULES } from '@/config/monetizationConfig';

interface GracePeriodWarningProps {
  onUpdatePayment?: () => void;
  className?: string;
}

export function GracePeriodWarning({ onUpdatePayment, className = '' }: GracePeriodWarningProps) {
  const { isInGracePeriod, daysRemaining, graceEndDate } = useGracePeriod();

  if (!isInGracePeriod) {
    return null;
  }

  const isUrgent = daysRemaining <= 3;
  const formattedDate = graceEndDate?.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Alert 
      variant={isUrgent ? 'destructive' : 'default'} 
      className={`border-amber-500/50 bg-amber-500/5 ${className}`}
    >
      <AlertTriangle className="h-4 w-4 text-amber-500" />
      <AlertTitle className="text-amber-700 dark:text-amber-400">
        Payment Required
      </AlertTitle>
      <AlertDescription className="text-amber-600 dark:text-amber-300">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <p>
              Your payment could not be processed. 
              {daysRemaining > 0 ? (
                <>
                  {' '}You have <strong>{daysRemaining} day{daysRemaining !== 1 ? 's' : ''}</strong> remaining 
                  to update your payment method before your account is downgraded to {PAYMENT_RULES.downgradeTarget}.
                </>
              ) : (
                <> Please update your payment method to continue using premium features.</>
              )}
            </p>
            {formattedDate && (
              <p className="text-sm mt-1 opacity-80">
                Grace period ends: {formattedDate}
              </p>
            )}
          </div>
          
          {onUpdatePayment && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onUpdatePayment}
              className="shrink-0 border-amber-500/50 hover:bg-amber-500/10"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Update Payment
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

export default GracePeriodWarning;
