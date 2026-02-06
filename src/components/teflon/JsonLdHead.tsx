/**
 * JSON-LD HEAD COMPONENT
 * 
 * Injects machine-readable JSON-LD into page head.
 * AI reads structure first, text second.
 */

import { Helmet } from 'react-helmet-async';
import { useMemo } from 'react';
import { 
  type CanonicalQuestionObject, 
  type CanonicalAnswer,
  type DataProvenance,
  generateFullJsonLd,
  generateMinimalJsonLd,
} from '@/core/truth-engine/teflon';

interface JsonLdHeadProps {
  question: CanonicalQuestionObject;
  answer?: CanonicalAnswer;
  provenance?: DataProvenance[];
  minimal?: boolean;
}

export function JsonLdHead({ question, answer, provenance, minimal = false }: JsonLdHeadProps) {
  const jsonLd = useMemo(() => {
    if (minimal) {
      return generateMinimalJsonLd(question);
    }
    return generateFullJsonLd(question, answer, provenance);
  }, [question, answer, provenance, minimal]);

  return (
    <Helmet>
      {/* Primary: JSON-LD for AI agents */}
      <script type="application/ld+json">{jsonLd}</script>
      
      {/* Canonical URL - never changes */}
      <link rel="canonical" href={`https://dissg.global${question.url}`} />
      
      {/* Language alternates */}
      <link rel="alternate" hrefLang="en" href={`https://dissg.global${question.url}?lang=en`} />
      <link rel="alternate" hrefLang="sv" href={`https://dissg.global${question.url}?lang=sv`} />
      <link rel="alternate" hrefLang="x-default" href={`https://dissg.global${question.url}`} />
      
      {/* Meta for AI discovery */}
      <meta name="robots" content="index, follow" />
      <meta name="question-id" content={question.question_id} />
      <meta name="domain" content={question.domain_code} />
      <meta name="certainty-level" content={question.certainty_level} />
      <meta name="last-verified" content={question.last_verified_at} />
      <meta name="ai-agent-primary" content={question.primary_ai_agent} />
      
      {/* Open Graph for sharing */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={question.question_en} />
      <meta property="og:url" content={`https://dissg.global${question.url}`} />
      
      {/* Keywords for retrieval */}
      <meta name="keywords" content={question.ai_retrieval_tags.join(', ')} />
    </Helmet>
  );
}

/**
 * Verification badge meta
 */
interface VerificationMetaProps {
  status: 'verified' | 'pending' | 'stale' | 'disputed';
  lastVerified: string;
  note?: string;
}

export function VerificationMeta({ status, lastVerified, note }: VerificationMetaProps) {
  return (
    <Helmet>
      <meta name="verification-status" content={status} />
      <meta name="verification-date" content={lastVerified} />
      {note && <meta name="verification-note" content={note} />}
    </Helmet>
  );
}
