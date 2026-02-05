/**
 * TRUTH ENGINE ECOSYSTEM
 * 
 * Partner SDK, Trust Verification, Decision Artifacts, Expansion Roadmap.
 */

// Partner SDK
export {
  PARTNER_TIERS,
  VERTICAL_DOMAINS,
  SDK_CAPABILITIES,
  ECOSYSTEM_PRINCIPLES,
} from './partner-sdk-spec';

export type {
  PartnerTier,
  PartnerRateLimits,
  VerticalDomain,
  SDKCapability,
} from './partner-sdk-spec';

// Trust Verification
export {
  VERIFICATION_DIMENSIONS,
  VERIFIER_TYPES,
  PUBLIC_ARTIFACTS,
  TRUST_PRINCIPLES,
} from './trust-verification';

export type {
  VerificationDimension,
  VerifierType,
  PublicArtifact,
  TrustAttestation,
} from './trust-verification';

// Decision Artifacts
export {
  generateArtifactId,
  generateArtifactHash,
  formatCitation,
  ARTIFACT_PRINCIPLES,
} from './decision-artifacts';

export type {
  DecisionArtifact,
  ArtifactNode,
  ArtifactAssumption,
  ArtifactLimitation,
  ArtifactSource,
  ArtifactRegistry,
  ArtifactSearchCriteria,
} from './decision-artifacts';

// Expansion Roadmap
export {
  EXPANSION_ROADMAP,
  DOMAIN_EXPANSION_QUEUE,
  ROADMAP_PRINCIPLES,
} from './expansion-roadmap';

export type {
  RoadmapQuarter,
  RoadmapMetric,
  DomainExpansion,
} from './expansion-roadmap';
