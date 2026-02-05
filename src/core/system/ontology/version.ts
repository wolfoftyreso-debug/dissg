 /**
  * ONTOLOGY VERSION
  * 
  * Immutable version tracking. Any change = new version.
  */
 
 export const ONTOLOGY_VERSION = {
   major: 1,
   minor: 0,
   patch: 0,
   hash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
   locked_at: '2026-02-05T00:00:00Z',
   steward: 'system',
 } as const;
 
 export type OntologyVersion = typeof ONTOLOGY_VERSION;
 
 export function getOntologyVersionString(): string {
   return `v${ONTOLOGY_VERSION.major}.${ONTOLOGY_VERSION.minor}.${ONTOLOGY_VERSION.patch}`;
 }