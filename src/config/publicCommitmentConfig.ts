/**
 * PUBLIC COMMITMENT FORMAT
 * ═══════════════════════════════════════════════════════════════
 * 
 * Ett standardiserat format för politiska aktörer att:
 * 1. Acceptera systemets verklighetsbeskrivning
 * 2. Definiera sitt ansvarsområde
 * 3. Sätta mätbara mål
 * 4. Acceptera öppen uppföljning
 */

export interface PublicCommitment {
  id: string;
  signatoryName: string;
  signatoryType: 'party' | 'government' | 'municipality' | 'region' | 'agency' | 'organization';
  signedAt: string;
  validUntil: string;
  
  // The core pledge
  corePledge: CorePledge;
  
  // Specific KPI commitments
  kpiCommitments: KPICommitment[];
  
  // Accountability settings
  accountability: AccountabilitySettings;
  
  // Public statement
  publicStatement: string;
  
  // Verification
  verified: boolean;
  verificationBadge?: string;
}

export interface CorePledge {
  // Accept the system as truth reference
  acceptsDataAsReference: boolean;
  
  // Commits to transparent follow-up
  acceptsTransparentFollowup: boolean;
  
  // Will not manipulate or spin data
  pledgesNoManipulation: boolean;
  
  // Will publish progress regularly
  acceptsRegularReporting: boolean;
  
  // Reporting frequency
  reportingFrequency: 'monthly' | 'quarterly' | 'yearly';
}

export interface KPICommitment {
  kpiId: string;
  kpiName: string;
  
  // Current baseline value
  baselineValue: number;
  baselineDate: string;
  
  // Target
  targetValue: number;
  targetDate: string;
  
  // Direction (improve = make better according to KPI definition)
  direction: 'improve' | 'maintain' | 'prevent_decline';
  
  // Priority level for this signatory
  priority: 'primary' | 'secondary' | 'supporting';
  
  // Specific measures planned (optional)
  plannedMeasures?: string[];
  
  // Progress tracking
  currentValue?: number;
  lastUpdated?: string;
  progressPercent?: number;
}

export interface AccountabilitySettings {
  // Public dashboard URL
  dashboardPublic: boolean;
  
  // Allow comparison with other signatories
  allowComparison: boolean;
  
  // Accept automated alerts on deviation
  acceptAutomatedAlerts: boolean;
  
  // Commit to public response on red flags
  respondToRedFlags: boolean;
  
  // Maximum response time (days)
  maxResponseTimeDays: number;
}

/**
 * STANDARD COMMITMENT TEMPLATE
 */
export const COMMITMENT_TEMPLATE: Omit<PublicCommitment, 'id' | 'signatoryName' | 'signatoryType' | 'signedAt' | 'validUntil' | 'kpiCommitments' | 'publicStatement' | 'verified'> = {
  corePledge: {
    acceptsDataAsReference: true,
    acceptsTransparentFollowup: true,
    pledgesNoManipulation: true,
    acceptsRegularReporting: true,
    reportingFrequency: 'quarterly',
  },
  accountability: {
    dashboardPublic: true,
    allowComparison: true,
    acceptAutomatedAlerts: true,
    respondToRedFlags: true,
    maxResponseTimeDays: 14,
  },
};

/**
 * Generate standard public statement text
 */
export function generatePublicStatement(
  signatoryName: string,
  kpiCommitments: KPICommitment[]
): string {
  const primaryKPIs = kpiCommitments
    .filter(c => c.priority === 'primary')
    .map(c => c.kpiName);
  
  return `${signatoryName} åtar sig att:

1. VERKLIGHETSGRUND
   Vi accepterar systemets öppna indikatorer som gemensam verklighetsbeskrivning.
   Vårt uppdrag är att förbättra dessa över tid.

2. FOKUSOMRÅDEN
   ${primaryKPIs.length > 0 
     ? `Vi prioriterar särskilt: ${primaryKPIs.join(', ')}`
     : 'Vi arbetar för förbättring av samtliga indikatorer inom vårt ansvarsområde.'}

3. UPPFÖLJNING
   Vi publicerar våra framsteg öppet varje kvartal.
   Vid negativ utveckling svarar vi inom 14 dagar.

4. LÖFTE
   Vi lovar inte att lyckas.
   Vi lovar att mäta, visa och justera öppet.

Bedöm oss på utfallet.`;
}

/**
 * Calculate commitment progress
 */
export function calculateCommitmentProgress(commitment: KPICommitment): number {
  if (!commitment.currentValue) return 0;
  
  const baseline = commitment.baselineValue;
  const target = commitment.targetValue;
  const current = commitment.currentValue;
  
  if (target === baseline) return 100;
  
  const progress = ((current - baseline) / (target - baseline)) * 100;
  return Math.max(0, Math.min(100, progress));
}

/**
 * Determine commitment status
 */
export function getCommitmentStatus(
  commitment: KPICommitment,
  daysRemaining: number
): 'on_track' | 'at_risk' | 'behind' | 'achieved' | 'failed' {
  const progress = calculateCommitmentProgress(commitment);
  const expectedProgress = Math.max(0, 100 - (daysRemaining / 365) * 100);
  
  if (progress >= 100) return 'achieved';
  if (daysRemaining <= 0 && progress < 100) return 'failed';
  if (progress >= expectedProgress * 0.9) return 'on_track';
  if (progress >= expectedProgress * 0.7) return 'at_risk';
  return 'behind';
}

/**
 * Example commitments for demonstration
 */
export const EXAMPLE_COMMITMENTS: PublicCommitment[] = [
  {
    id: 'demo_commitment_1',
    signatoryName: 'Exempelparti',
    signatoryType: 'party',
    signedAt: '2025-01-15',
    validUntil: '2029-09-15',
    corePledge: {
      acceptsDataAsReference: true,
      acceptsTransparentFollowup: true,
      pledgesNoManipulation: true,
      acceptsRegularReporting: true,
      reportingFrequency: 'quarterly',
    },
    kpiCommitments: [
      {
        kpiId: 'employment_rate_net',
        kpiName: 'Sysselsättningsgrad',
        baselineValue: 68.7,
        baselineDate: '2025-01-01',
        targetValue: 72.0,
        targetDate: '2029-09-01',
        direction: 'improve',
        priority: 'primary',
        plannedMeasures: [
          'Arbetsmarknadsreform',
          'Utbildningssatsning',
          'Integrationspaket',
        ],
        currentValue: 68.7,
        lastUpdated: '2025-01-28',
        progressPercent: 0,
      },
      {
        kpiId: 'violent_crime_rate',
        kpiName: 'Grova Våldsbrott',
        baselineValue: 42.8,
        baselineDate: '2025-01-01',
        targetValue: 35.0,
        targetDate: '2029-09-01',
        direction: 'improve',
        priority: 'primary',
        plannedMeasures: [
          'Förstärkta insatser mot gängkriminalitet',
          'Förebyggande arbete',
        ],
        currentValue: 42.8,
        lastUpdated: '2025-01-28',
        progressPercent: 0,
      },
    ],
    accountability: {
      dashboardPublic: true,
      allowComparison: true,
      acceptAutomatedAlerts: true,
      respondToRedFlags: true,
      maxResponseTimeDays: 14,
    },
    publicStatement: '',
    verified: false,
  },
];

// Generate the statement for example
EXAMPLE_COMMITMENTS[0].publicStatement = generatePublicStatement(
  EXAMPLE_COMMITMENTS[0].signatoryName,
  EXAMPLE_COMMITMENTS[0].kpiCommitments
);
