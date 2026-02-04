/**
 * CLICKABLE COUNTRY NAME COMPONENT
 * 
 * "Alltid klickbart" - Every country reference must be a portal to deeper exploration.
 * Links to /country/:code with full graph workspace and comparison tools.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ClickableCountryNameProps {
  /** ISO country code (SE, NO, DE, etc.) */
  countryCode: string;
  /** Display name of the country */
  countryName: string;
  /** Optional additional content (population, HDI, etc.) */
  suffix?: React.ReactNode;
  /** Styling variant */
  variant?: 'default' | 'badge' | 'inline' | 'compact';
  /** Additional className */
  className?: string;
  /** Show country code badge */
  showCode?: boolean;
}

export const ClickableCountryName: React.FC<ClickableCountryNameProps> = ({
  countryCode,
  countryName,
  suffix,
  variant = 'default',
  className,
  showCode = false,
}) => {
  const baseStyles = 'cursor-pointer transition-colors hover:text-primary underline-offset-2';
  
  const variantStyles: Record<string, string> = {
    default: 'font-medium hover:underline',
    badge: 'px-2 py-0.5 rounded bg-muted hover:bg-primary/10 text-sm',
    inline: 'hover:underline text-inherit',
    compact: 'text-xs hover:underline',
  };

  return (
    <Link
      to={`/country/${countryCode.toUpperCase()}`}
      className={cn(baseStyles, variantStyles[variant], className)}
      title={`Utforska ${countryName} – grafer, index och jämförelsedata`}
    >
      <span>{countryName}</span>
      {showCode && (
        <span className="ml-1 font-mono text-[10px] text-muted-foreground">
          [{countryCode.toUpperCase()}]
        </span>
      )}
      {suffix && <span className="ml-1">{suffix}</span>}
    </Link>
  );
};

/**
 * Utility to wrap any country text in a clickable link
 */
export const makeCountryClickable = (
  name: string,
  code: string,
  variant: ClickableCountryNameProps['variant'] = 'inline'
) => (
  <ClickableCountryName
    countryCode={code}
    countryName={name}
    variant={variant}
  />
);
