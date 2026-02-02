/**
 * 🔗 SEO Library Index
 * 
 * Block 48: Auto Internal Link Engine
 * 
 * Exports for semantic link generation and validation.
 */

// Link engine
export { 
  generateSemanticLinks,
  validateLinkQuality,
  type LinkQualityReport,
} from './linkEngine';

// Types
export type {
  SemanticLink,
  LinkGroup,
  GeneratedLinks,
  PageContext,
  LinkRelationType,
  PageType,
  ScopeLevel,
} from './linkTypes';

export {
  LINK_CONFIG,
  SCOPE_HIERARCHY,
  SCOPE_CHILDREN,
} from './linkTypes';
