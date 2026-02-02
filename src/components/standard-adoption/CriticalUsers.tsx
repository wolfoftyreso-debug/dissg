/**
 * CRITICAL USERS
 * 
 * The three critical user groups that drive adoption:
 * 1. Journalism (active)
 * 2. AI Systems (automatic)
 * 3. Central Banks (passive)
 */

import React from 'react';
import { CRITICAL_USERS, ADOPTION_INSIGHT, type CriticalUser } from '@/config/deFactoStandardConfig';

interface CriticalUsersProps {
  language?: 'en' | 'sv';
  variant?: 'full' | 'cards' | 'timeline';
  className?: string;
}

export function CriticalUsers({
  language = 'en',
  variant = 'full',
  className = '',
}: CriticalUsersProps) {
  const labels = {
    en: {
      title: 'The Critical Users',
      whyTheyUseIt: 'Why they use it',
      adoptionSignal: 'Adoption signal',
      active: 'Active',
      passive: 'Passive',
      automatic: 'Automatic',
    },
    sv: {
      title: 'De kritiska användarna',
      whyTheyUseIt: 'Varför de använder det',
      adoptionSignal: 'Adoptionssignal',
      active: 'Aktiv',
      passive: 'Passiv',
      automatic: 'Automatisk',
    },
  }[language];

  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
        {CRITICAL_USERS.map((user) => (
          <CriticalUserCard key={user.id} user={user} language={language} labels={labels} />
        ))}
      </div>
    );
  }

  if (variant === 'timeline') {
    return (
      <div className={`space-y-0 ${className}`}>
        {CRITICAL_USERS.map((user, i) => (
          <CriticalUserTimeline 
            key={user.id} 
            user={user} 
            language={language} 
            labels={labels}
            isLast={i === CRITICAL_USERS.length - 1}
          />
        ))}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`space-y-8 ${className}`}>
      <h2 className="text-xl font-bold text-center">{labels.title}</h2>
      
      <div className="space-y-6">
        {CRITICAL_USERS.map((user) => (
          <CriticalUserFull key={user.id} user={user} language={language} labels={labels} />
        ))}
      </div>
      
      {/* Adoption Insight */}
      <div className="border-t-4 border-primary pt-6 text-center">
        <p className="text-lg font-semibold text-primary">
          📌 {ADOPTION_INSIGHT[language]}
        </p>
      </div>
    </div>
  );
}

function CriticalUserCard({
  user,
  language,
  labels,
}: {
  user: CriticalUser;
  language: 'en' | 'sv';
  labels: { active: string; passive: string; automatic: string };
}) {
  const typeLabel = labels[user.adoptionType];
  
  return (
    <div className="border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{user.icon}</span>
          <span className="w-6 h-6 border border-muted-foreground flex items-center justify-center text-xs font-mono">
            {user.priority}
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 bg-muted font-mono uppercase">
          {typeLabel}
        </span>
      </div>
      
      <h3 className="font-bold">{user.name[language]}</h3>
      
      <p className="text-sm text-muted-foreground">
        {user.description[language]}
      </p>
    </div>
  );
}

function CriticalUserTimeline({
  user,
  language,
  labels,
  isLast,
}: {
  user: CriticalUser;
  language: 'en' | 'sv';
  labels: { adoptionSignal: string };
  isLast: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-2 border-primary flex items-center justify-center text-2xl bg-card">
          {user.icon}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-border" />}
      </div>
      
      <div className="pb-8">
        <h3 className="font-bold">{user.name[language]}</h3>
        <p className="text-sm text-muted-foreground mt-1">{user.description[language]}</p>
        <div className="mt-3 text-sm border-l-2 border-primary pl-3">
          <span className="text-xs text-muted-foreground uppercase">{labels.adoptionSignal}</span>
          <p className="font-medium mt-0.5">{user.adoptionSignal[language]}</p>
        </div>
      </div>
    </div>
  );
}

function CriticalUserFull({
  user,
  language,
  labels,
}: {
  user: CriticalUser;
  language: 'en' | 'sv';
  labels: { whyTheyUseIt: string; adoptionSignal: string; active: string; passive: string; automatic: string };
}) {
  const typeLabel = labels[user.adoptionType];
  
  return (
    <div className="border-2 border-border bg-card p-6">
      <div className="flex items-start gap-4">
        <div className="text-center">
          <span className="text-4xl">{user.icon}</span>
          <div className="mt-2 text-xs font-mono px-2 py-0.5 bg-muted">
            #{user.priority}
          </div>
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{user.name[language]}</h3>
            <span className="text-xs px-3 py-1 border border-border font-mono uppercase">
              {typeLabel}
            </span>
          </div>
          
          <p className="text-muted-foreground">{user.description[language]}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {labels.whyTheyUseIt}
              </span>
              <ul className="mt-2 space-y-1">
                {user.whyTheyUseIt[language].map((reason, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 bg-primary" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-primary/5 border-l-2 border-primary p-3">
              <span className="text-xs text-primary uppercase tracking-wider">
                {labels.adoptionSignal}
              </span>
              <p className="text-sm font-medium mt-1">
                {user.adoptionSignal[language]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
