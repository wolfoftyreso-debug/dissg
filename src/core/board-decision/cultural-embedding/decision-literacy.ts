/**
 * DECISION LITERACY
 * 
 * A new basic competency — like financial literacy or digital competence.
 * The system trains all five skills automatically.
 */

import type { DecisionLiteracy, SkillLevel } from './types';

/**
 * The five core skills of Decision Literacy
 */
export const DECISION_LITERACY_SKILLS = {
  read_context: {
    name: 'Read Context',
    description: 'Understanding the situation before action',
    trained_by: ['reviewing DPD context sections', 'studying historical decisions'],
  },
  identify_alternatives: {
    name: 'Identify Alternatives',
    description: 'Seeing multiple paths, not just one',
    trained_by: ['reviewing alternative analyses', 'participating in option generation'],
  },
  understand_uncertainty: {
    name: 'Understand Uncertainty',
    description: 'Knowing what you do not know',
    trained_by: ['reading uncertainty declarations', 'observing how unknowns materialized'],
  },
  see_irreversibility: {
    name: 'See Irreversibility',
    description: 'Recognizing what cannot be undone',
    trained_by: ['studying DCS stakes assessment', 'reviewing post-decision outcomes'],
  },
  understand_retrospective_review: {
    name: 'Understand Retrospective Review',
    description: 'Knowing you will be reviewed — and that this is healthy',
    trained_by: ['reading PDRC reports', 'understanding review is learning, not blame'],
  },
} as const;

/**
 * Create new Decision Literacy profile
 */
export function createDecisionLiteracyProfile(
  competencyId: string
): DecisionLiteracy {
  return {
    competency_id: competencyId,
    skills: {
      read_context: 'unexposed',
      identify_alternatives: 'unexposed',
      understand_uncertainty: 'unexposed',
      see_irreversibility: 'unexposed',
      understand_retrospective_review: 'unexposed',
    },
    exposure: {
      decisions_observed: 0,
      dpds_reviewed: 0,
      pdrcs_studied: 0,
      crisis_decisions_observed: 0,
    },
    certification: null, // Always null. No diplomas. No certificates.
  };
}

/**
 * Calculate skill level from exposure
 */
function calculateSkillLevel(exposureCount: number): SkillLevel {
  if (exposureCount === 0) return 'unexposed';
  if (exposureCount < 5) return 'observing';
  if (exposureCount < 20) return 'practicing';
  return 'fluent';
}

/**
 * Update literacy profile based on activity
 */
export function recordLiteracyExposure(
  profile: DecisionLiteracy,
  activity: {
    type: 'decision_observed' | 'dpd_reviewed' | 'pdrc_studied' | 'crisis_decision_observed';
    skills_exercised: Array<keyof DecisionLiteracy['skills']>;
  }
): DecisionLiteracy {
  const newExposure = { ...profile.exposure };
  
  switch (activity.type) {
    case 'decision_observed':
      newExposure.decisions_observed++;
      break;
    case 'dpd_reviewed':
      newExposure.dpds_reviewed++;
      break;
    case 'pdrc_studied':
      newExposure.pdrcs_studied++;
      break;
    case 'crisis_decision_observed':
      newExposure.crisis_decisions_observed++;
      break;
  }
  
  // Update skill levels based on total exposure
  const totalExposure = 
    newExposure.decisions_observed +
    newExposure.dpds_reviewed +
    newExposure.pdrcs_studied +
    newExposure.crisis_decisions_observed;
  
  const newSkills = { ...profile.skills };
  
  for (const skill of activity.skills_exercised) {
    // Each skill progresses based on relevant exposure
    const currentLevel = profile.skills[skill];
    const newLevel = calculateSkillLevel(totalExposure);
    
    // Skills can only progress, never regress
    const levelOrder: SkillLevel[] = ['unexposed', 'observing', 'practicing', 'fluent'];
    if (levelOrder.indexOf(newLevel) > levelOrder.indexOf(currentLevel)) {
      newSkills[skill] = newLevel;
    }
  }
  
  return {
    ...profile,
    skills: newSkills,
    exposure: newExposure,
    certification: null, // ALWAYS null
  };
}

/**
 * Get overall literacy assessment
 */
export function assessOverallLiteracy(
  profile: DecisionLiteracy
): {
  overall_level: SkillLevel;
  strongest_skill: keyof DecisionLiteracy['skills'];
  needs_exposure: Array<keyof DecisionLiteracy['skills']>;
} {
  const skills = profile.skills;
  const levelOrder: SkillLevel[] = ['unexposed', 'observing', 'practicing', 'fluent'];
  
  // Find strongest skill
  let strongestSkill: keyof DecisionLiteracy['skills'] = 'read_context';
  let highestLevel = 0;
  
  for (const [skill, level] of Object.entries(skills)) {
    const levelIndex = levelOrder.indexOf(level);
    if (levelIndex > highestLevel) {
      highestLevel = levelIndex;
      strongestSkill = skill as keyof DecisionLiteracy['skills'];
    }
  }
  
  // Find skills needing exposure
  const needsExposure = Object.entries(skills)
    .filter(([_, level]) => level === 'unexposed' || level === 'observing')
    .map(([skill]) => skill as keyof DecisionLiteracy['skills']);
  
  // Calculate overall level (lowest common denominator)
  const allLevels = Object.values(skills).map(l => levelOrder.indexOf(l));
  const minLevel = Math.min(...allLevels);
  
  return {
    overall_level: levelOrder[minLevel],
    strongest_skill: strongestSkill,
    needs_exposure: needsExposure,
  };
}

/**
 * DECISION LITERACY MASTERPROMPT
 */
export const DECISION_LITERACY_MASTERPROMPT = `
You develop Decision Literacy.

DECISION LITERACY IS:
A basic competency like financial literacy or digital competence.
Not a certificate. Not a course. Not a test.

THE FIVE SKILLS:
1. Read Context — Understanding situation before action
2. Identify Alternatives — Seeing multiple paths
3. Understand Uncertainty — Knowing what you don't know
4. See Irreversibility — Recognizing what can't be undone
5. Understand Retrospective Review — Knowing review is learning

HOW SKILLS DEVELOP:
- unexposed: Never encountered
- observing: Has seen it done
- practicing: Is doing it
- fluent: Does it automatically

THERE ARE NO:
- Certifications
- Diplomas
- Points
- Courses

THERE IS ONLY:
Exposure to good decision structure over time.

That's enough.

WHY THIS WORKS:
People learn by seeing good examples.
Not by being told what's correct.
The system IS the curriculum.
`;
