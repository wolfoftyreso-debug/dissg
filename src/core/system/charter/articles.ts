 /**
  * CHARTER ARTICLES
  * 
  * The 10 immutable principles. Violation = system shutdown.
  */
 
 export interface CharterArticle {
   readonly number: number;
   readonly title: string;
   readonly principle: string;
   readonly rationale: string;
   readonly enforcement: 'automatic' | 'steward_review' | 'guardian_veto';
   readonly violation_response: 'warn' | 'block' | 'shutdown';
 }
 
 export const CHARTER_ARTICLES: readonly CharterArticle[] = [
   {
     number: 1,
     title: 'Observation Before Interpretation',
     principle: 'The system presents what is observed, never what it means.',
     rationale: 'Interpretation is the domain of the user, not the system.',
     enforcement: 'automatic',
     violation_response: 'block',
   },
   {
     number: 2,
     title: 'No Central Truth',
     principle: 'The system never declares a single "correct" answer or ranking.',
     rationale: 'Truth is multi-dimensional. Rankings are editorial choices.',
     enforcement: 'automatic',
     violation_response: 'block',
   },
   {
     number: 3,
     title: 'Same Method For All',
     principle: 'The same analytical method applies to all entities equally.',
     rationale: 'Consistency prevents bias and enables comparison.',
     enforcement: 'steward_review',
     violation_response: 'block',
   },
   {
     number: 4,
     title: 'Transparency About Uncertainty',
     principle: 'Every output includes explicit uncertainty declarations.',
     rationale: 'Hiding uncertainty is a form of deception.',
     enforcement: 'automatic',
     violation_response: 'block',
   },
   {
     number: 5,
     title: 'No Normative Language',
     principle: 'The system never uses value words or prescriptive language.',
     rationale: 'Value judgments are for users, not systems.',
     enforcement: 'automatic',
     violation_response: 'block',
   },
   {
     number: 6,
     title: 'Sources Over Results',
     principle: 'Provenance is always visible. No orphan data.',
     rationale: 'Unverifiable claims have no place in the system.',
     enforcement: 'automatic',
     violation_response: 'block',
   },
   {
     number: 7,
     title: 'Reproducibility',
     principle: 'Any output can be exactly reproduced from inputs.',
     rationale: 'Non-reproducible results are not science.',
     enforcement: 'automatic',
     violation_response: 'block',
   },
   {
     number: 8,
     title: 'Mandatory Negative Space',
     principle: 'The system explicitly states what it cannot say.',
     rationale: 'Silence is better than speculation.',
     enforcement: 'automatic',
     violation_response: 'block',
   },
   {
     number: 9,
     title: 'Ownership Neutrality',
     principle: 'No owner, sponsor, or actor receives preferential treatment.',
     rationale: 'Capture by interests destroys legitimacy.',
     enforcement: 'guardian_veto',
     violation_response: 'shutdown',
   },
   {
     number: 10,
     title: 'Exit-Safe Mode',
     principle: 'If principles are violated, system freezes to read-only.',
     rationale: 'Better to stop than to corrupt.',
     enforcement: 'automatic',
     violation_response: 'shutdown',
   },
 ] as const;
 
 export function getArticle(number: number): CharterArticle | undefined {
   return CHARTER_ARTICLES.find(a => a.number === number);
 }
 
 export function getArticlesByEnforcement(type: CharterArticle['enforcement']): CharterArticle[] {
   return CHARTER_ARTICLES.filter(a => a.enforcement === type);
 }