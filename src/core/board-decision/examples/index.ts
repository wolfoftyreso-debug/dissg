/**
 * BOARD DECISION EXAMPLES — INDEX
 * 
 * Complete production-ready examples for all organization types.
 */

// Housing Association
export { BRF_ROOF_RENOVATION_DPD } from './brf-roof-renovation';

// Investment Board
export { INVESTMENT_PORTFOLIO_DPD } from './investment-portfolio';

// Corporate Board
export { CORPORATE_MA_DPD } from './corporate-ma';

// Municipal Board
export { MUNICIPAL_INFRASTRUCTURE_DPD } from './municipal-infrastructure';

/**
 * All examples by organization type
 */
export const DPD_EXAMPLES = {
  housing_association: 'brf-roof-renovation',
  investment_board: 'investment-portfolio',
  corporate_board: 'corporate-ma',
  municipal_board: 'municipal-infrastructure',
} as const;
