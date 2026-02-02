/**
 * QA CHECKLIST DASHBOARD
 * 
 * Visual display of all 12 QA checks and Day-0 readiness.
 */

import React from 'react';
import {
  QA_CHECKLIST,
  DAY0_CRITERIA,
  getAllQAChecks,
  type QACheckStatus,
} from '@/config/qaGoLiveConfig';

interface QACheckItemProps {
  id: string;
  title: { en: string; sv: string };
  checks: { en: string; sv: string }[];
  failAction: { en: string; sv: string };
  status?: QACheckStatus;
  language?: 'en' | 'sv';
}

function QACheckItem({ id, title, checks, failAction, status = 'pending', language = 'en' }: QACheckItemProps) {
  const statusStyles = {
    pass: 'border-primary bg-primary/5',
    fail: 'border-destructive bg-destructive/5',
    pending: 'border-border',
    not_applicable: 'border-muted opacity-50',
  };

  const statusLabels = {
    pass: { en: '✓ Pass', sv: '✓ Godkänd' },
    fail: { en: '✗ Fail', sv: '✗ Underkänd' },
    pending: { en: '○ Pending', sv: '○ Väntar' },
    not_applicable: { en: '— N/A', sv: '— Ej tillämplig' },
  };

  return (
    <div className={`border p-4 ${statusStyles[status]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs text-muted-foreground">{id}</span>
        <span className={`text-xs ${status === 'pass' ? 'text-primary' : status === 'fail' ? 'text-destructive' : 'text-muted-foreground'}`}>
          {statusLabels[status][language]}
        </span>
      </div>
      <h4 className="font-semibold text-sm mb-2">{title[language]}</h4>
      <ul className="space-y-1 mb-3">
        {checks.map((check, i) => (
          <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
            <span className="text-muted-foreground/50">•</span>
            <span>{check[language]}</span>
          </li>
        ))}
      </ul>
      <div className="text-xs text-destructive/80 border-t pt-2 mt-2">
        <span className="font-medium">Fail →</span> {failAction[language]}
      </div>
    </div>
  );
}

interface Day0ReadinessProps {
  ready: boolean;
  language?: 'en' | 'sv';
}

function Day0Readiness({ ready, language = 'en' }: Day0ReadinessProps) {
  const labels = {
    en: { title: 'Day-0 Go-Live Criteria', ready: 'READY', notReady: 'NOT READY' },
    sv: { title: 'Dag-0 go-live-kriterier', ready: 'REDO', notReady: 'INTE REDO' },
  }[language];

  return (
    <div className={`border-2 p-6 ${ready ? 'border-primary bg-primary/5' : 'border-amber-500 bg-amber-500/5'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">{labels.title}</h3>
        <span className={`px-3 py-1 text-sm font-bold ${ready ? 'bg-primary text-primary-foreground' : 'bg-amber-500 text-white'}`}>
          {ready ? labels.ready : labels.notReady}
        </span>
      </div>
      
      <ul className="space-y-2 mb-4">
        {DAY0_CRITERIA.criteria.map((criterion, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span className={ready ? 'text-primary' : 'text-muted-foreground'}>
              {ready ? '✓' : '○'}
            </span>
            <span>{criterion[language]}</span>
          </li>
        ))}
      </ul>
      
      <div className="text-sm text-muted-foreground border-t pt-4 italic">
        {DAY0_CRITERIA.readyWhen[language]}
      </div>
    </div>
  );
}

interface QAChecklistDashboardProps {
  language?: 'en' | 'sv';
  results?: Record<string, QACheckStatus>;
}

export function QAChecklistDashboard({ language = 'en', results = {} }: QAChecklistDashboardProps) {
  const allChecks = getAllQAChecks();
  const passCount = Object.values(results).filter(s => s === 'pass').length;
  const day0Ready = passCount === allChecks.length;

  const labels = {
    en: { 
      title: 'Final QA & Go-Live Playbook',
      subtitle: 'Continuous quality assurance checklist',
      progress: 'checks passing',
    },
    sv: { 
      title: 'Final QA & Go-Live-spelbok',
      subtitle: 'Kontinuerlig kvalitetssäkringschecklista',
      progress: 'kontroller godkända',
    },
  }[language];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold">{labels.title}</h1>
        <p className="text-muted-foreground">{labels.subtitle}</p>
        <div className="mt-2 text-sm">
          <span className="font-mono">{passCount}/{allChecks.length}</span>{' '}
          <span className="text-muted-foreground">{labels.progress}</span>
        </div>
      </div>

      {/* Day-0 Readiness */}
      <Day0Readiness ready={day0Ready} language={language} />

      {/* QA Sections */}
      {Object.entries(QA_CHECKLIST.sections).map(([sectionKey, section]) => (
        <div key={sectionKey} className="space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">
            <span className="font-mono text-muted-foreground mr-2">{sectionKey}.</span>
            {section.title[language]}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(section).map(([key, item]) => {
              if (key === 'title' || typeof item !== 'object' || !('id' in item)) return null;
              return (
                <QACheckItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  checks={item.checks}
                  failAction={item.failAction}
                  status={results[item.id] || 'pending'}
                  language={language}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
