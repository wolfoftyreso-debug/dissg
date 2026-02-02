/**
 * USER COVENANT
 * 
 * Användaröverenskommelsen – vad användaren accepterar genom att använda plattformen.
 */

import React from 'react';
import { USER_COVENANT } from '@/config/truthOracleDoctrineConfig';
import { PlatformDisclaimer } from './PlatformDisclaimer';

interface UserCovenantProps {
  language?: 'sv' | 'en';
  onAccept?: () => void;
  showAcceptButton?: boolean;
}

export function UserCovenant({ 
  language = 'en', 
  onAccept,
  showAcceptButton = false
}: UserCovenantProps) {
  return (
    <div className="max-w-2xl mx-auto bg-card border border-border">
      {/* Header */}
      <div className="border-b border-border p-6 text-center">
        <h1 className="text-2xl font-bold text-foreground tracking-wide uppercase">
          {USER_COVENANT.title[language]}
        </h1>
      </div>

      {/* Preamble */}
      <div className="p-6 border-b border-border">
        <p className="text-muted-foreground text-center">
          {USER_COVENANT.preamble[language]}
        </p>
      </div>

      {/* Articles */}
      <div className="divide-y divide-border">
        {USER_COVENANT.articles.map((article) => (
          <div key={article.number} className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 border border-border flex items-center justify-center">
                <span className="text-lg font-mono text-foreground">
                  {article.number}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  {article.title[language]}
                </h2>
                <p className="text-muted-foreground">
                  {article.text[language]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Closing */}
      <div className="p-6 border-t border-border bg-muted/30">
        <p className="text-center text-foreground font-medium">
          {USER_COVENANT.closing[language]}
        </p>
      </div>

      {/* Platform Disclaimer */}
      <PlatformDisclaimer language={language} variant="footer" />

      {/* Accept Button */}
      {showAcceptButton && onAccept && (
        <div className="p-6 border-t border-border">
          <button
            onClick={onAccept}
            className="w-full py-3 border border-foreground text-foreground font-medium hover:bg-foreground hover:text-background transition-colors"
          >
            {language === 'sv' ? 'Jag förstår och accepterar' : 'I understand and accept'}
          </button>
        </div>
      )}
    </div>
  );
}
