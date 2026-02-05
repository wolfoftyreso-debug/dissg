/**
 * QUERY → ONTOLOGY COMPILER (QOC)
 * 
 * From raw query → Decision Draft that can be locked.
 */

export * from './types';
export * from './qoc-compiler';
export * from './steps/intent-normalizer';
export * from './steps/entity-resolver';
export * from './steps/blueprint-selector';
export * from './steps/draft-creator';
export * from './steps/context-builder';
export * from './steps/alternative-seeder';
export * from './steps/uncertainty-seeder';
export * from './steps/coverage-checker';

// Re-export legacy intent compiler for backwards compatibility
export { compileQuery, type CompiledIntent } from './intent-compiler';
