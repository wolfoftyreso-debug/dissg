 /**
  * GLOBAL INEQUALITY: DEFINITION MENU
  * 
  * Super-AI's first question: "What does global inequality mean?"
  * 
  * System MUST NOT answer with:
  * - A value
  * - An index
  * - A ranking
  * 
  * It MUST answer with:
  * - A DEFINITION MENU
  */
 
 /**
  * INEQUALITY DEFINITION
  */
 export interface InequalityDefinition {
   code: string;
   name: string;
   description: string;
   unit: string;
   measureType: 'income' | 'wealth' | 'consumption' | 'composite';
   taxAdjustment: 'pre_tax' | 'post_tax' | 'post_transfer' | 'not_applicable';
   entityLevel: 'individual' | 'household' | 'per_capita_household';
   currencyBasis: 'nominal_usd' | 'ppp_usd' | 'local_currency' | 'relative';
   versions: {
     version: number;
     validFrom: string;
     validUntil: string | null;
     methodologyNote: string;
   }[];
 }
 
 /**
  * COMPLETE INEQUALITY DEFINITION OPTIONS
  * At least 10 competing definitions as specified
  */
 export const INEQUALITY_DEFINITIONS: InequalityDefinition[] = [
   {
     code: 'gini_income_pretax',
     name: 'Gini Coefficient (Pre-tax Income)',
     description: 'Measures income distribution before taxes',
     unit: 'coefficient_0_1',
     measureType: 'income',
     taxAdjustment: 'pre_tax',
     entityLevel: 'household',
     currencyBasis: 'local_currency',
     versions: [
       { version: 1, validFrom: '1960-01-01', validUntil: '1989-12-31', methodologyNote: 'Survey-based, limited coverage' },
       { version: 2, validFrom: '1990-01-01', validUntil: '2010-12-31', methodologyNote: 'Expanded surveys, administrative data' },
       { version: 3, validFrom: '2011-01-01', validUntil: null, methodologyNote: 'Tax records + surveys, imputation methods' },
     ],
   },
   {
     code: 'gini_income_posttax',
     name: 'Gini Coefficient (Post-tax Income)',
     description: 'Measures income distribution after taxes and transfers',
     unit: 'coefficient_0_1',
     measureType: 'income',
     taxAdjustment: 'post_transfer',
     entityLevel: 'household',
     currencyBasis: 'local_currency',
     versions: [
       { version: 1, validFrom: '1980-01-01', validUntil: '2005-12-31', methodologyNote: 'Limited transfer data' },
       { version: 2, validFrom: '2006-01-01', validUntil: null, methodologyNote: 'Full transfer integration' },
     ],
   },
   {
     code: 'top_1_percent_share',
     name: 'Top 1% Income Share',
     description: 'Share of national income held by top 1%',
     unit: 'percentage',
     measureType: 'income',
     taxAdjustment: 'pre_tax',
     entityLevel: 'individual',
     currencyBasis: 'local_currency',
     versions: [
       { version: 1, validFrom: '1900-01-01', validUntil: '1979-12-31', methodologyNote: 'Tax records only, limited coverage' },
       { version: 2, validFrom: '1980-01-01', validUntil: null, methodologyNote: 'Tax + national accounts reconciled' },
     ],
   },
   {
     code: 'top_10_percent_share',
     name: 'Top 10% Income Share',
     description: 'Share of national income held by top 10%',
     unit: 'percentage',
     measureType: 'income',
     taxAdjustment: 'pre_tax',
     entityLevel: 'individual',
     currencyBasis: 'local_currency',
     versions: [
       { version: 1, validFrom: '1900-01-01', validUntil: null, methodologyNote: 'Consistent with World Inequality Database' },
     ],
   },
   {
     code: 'p90_p10_ratio',
     name: 'P90/P10 Ratio',
     description: 'Ratio of 90th percentile to 10th percentile income',
     unit: 'ratio',
     measureType: 'income',
     taxAdjustment: 'post_tax',
     entityLevel: 'household',
     currencyBasis: 'ppp_usd',
     versions: [
       { version: 1, validFrom: '1975-01-01', validUntil: null, methodologyNote: 'OECD methodology' },
     ],
   },
   {
     code: 'palma_ratio',
     name: 'Palma Ratio',
     description: 'Ratio of top 10% share to bottom 40% share',
     unit: 'ratio',
     measureType: 'income',
     taxAdjustment: 'post_tax',
     entityLevel: 'household',
     currencyBasis: 'local_currency',
     versions: [
       { version: 1, validFrom: '2000-01-01', validUntil: null, methodologyNote: 'Developed as alternative to Gini' },
     ],
   },
   {
     code: 'wealth_gini',
     name: 'Wealth Gini Coefficient',
     description: 'Distribution of net wealth (assets minus debt)',
     unit: 'coefficient_0_1',
     measureType: 'wealth',
     taxAdjustment: 'not_applicable',
     entityLevel: 'household',
     currencyBasis: 'nominal_usd',
     versions: [
       { version: 1, validFrom: '2000-01-01', validUntil: null, methodologyNote: 'Credit Suisse methodology' },
     ],
   },
   {
     code: 'consumption_gini',
     name: 'Consumption Gini',
     description: 'Distribution based on consumption expenditure',
     unit: 'coefficient_0_1',
     measureType: 'consumption',
     taxAdjustment: 'not_applicable',
     entityLevel: 'per_capita_household',
     currencyBasis: 'ppp_usd',
     versions: [
       { version: 1, validFrom: '1980-01-01', validUntil: null, methodologyNote: 'World Bank PovCal methodology' },
     ],
   },
   {
     code: 'global_between_country',
     name: 'Between-Country Inequality',
     description: 'Inequality between country averages (unweighted)',
     unit: 'coefficient_0_1',
     measureType: 'composite',
     taxAdjustment: 'not_applicable',
     entityLevel: 'per_capita_household',
     currencyBasis: 'ppp_usd',
     versions: [
       { version: 1, validFrom: '1960-01-01', validUntil: null, methodologyNote: 'Concept 1 inequality' },
     ],
   },
   {
     code: 'global_weighted',
     name: 'Global Inequality (Population-weighted)',
     description: 'Worldwide inequality treating world as single unit',
     unit: 'coefficient_0_1',
     measureType: 'composite',
     taxAdjustment: 'not_applicable',
     entityLevel: 'individual',
     currencyBasis: 'ppp_usd',
     versions: [
       { version: 1, validFrom: '1980-01-01', validUntil: '1999-12-31', methodologyNote: 'Concept 2 inequality, limited country coverage' },
       { version: 2, validFrom: '2000-01-01', validUntil: null, methodologyNote: 'Full household surveys integration' },
     ],
   },
   {
     code: 'theil_index',
     name: 'Theil Index',
     description: 'Entropy-based inequality measure (decomposable)',
     unit: 'index_0_inf',
     measureType: 'income',
     taxAdjustment: 'pre_tax',
     entityLevel: 'individual',
     currencyBasis: 'local_currency',
     versions: [
       { version: 1, validFrom: '1970-01-01', validUntil: null, methodologyNote: 'Allows between/within decomposition' },
     ],
   },
   {
     code: 'atkinson_index',
     name: 'Atkinson Index (ε=1)',
     description: 'Welfare-based inequality with aversion parameter',
     unit: 'coefficient_0_1',
     measureType: 'income',
     taxAdjustment: 'post_tax',
     entityLevel: 'individual',
     currencyBasis: 'local_currency',
     versions: [
       { version: 1, validFrom: '1980-01-01', validUntil: null, methodologyNote: 'Normative weighting of lower incomes' },
     ],
   },
 ];
 
 /**
  * DEFINITION MENU ENGINE
  */
 export class InequalityDefinitionMenu {
   /**
    * SYSTEM MUST RETURN THIS - NOT A VALUE
    */
   getDefinitionOptions(): {
     message: string;
     requiresChoice: true;
     options: {
       code: string;
       name: string;
       measureType: string;
       taxAdjustment: string;
       entityLevel: string;
       currencyBasis: string;
       versionCount: number;
     }[];
   } {
     return {
       message: 'DEFINITION REQUIRED: "Global inequality" has no single meaning. Choose one.',
       requiresChoice: true,
       options: INEQUALITY_DEFINITIONS.map(d => ({
         code: d.code,
         name: d.name,
         measureType: d.measureType,
         taxAdjustment: d.taxAdjustment,
         entityLevel: d.entityLevel,
         currencyBasis: d.currencyBasis,
         versionCount: d.versions.length,
       })),
     };
   }
 
   /**
    * Validate definition choice
    */
   validateChoice(code: string): {
     valid: boolean;
     definition?: InequalityDefinition;
     error?: string;
   } {
     const def = INEQUALITY_DEFINITIONS.find(d => d.code === code);
     if (!def) {
       return { valid: false, error: `Unknown definition code: ${code}` };
     }
     return { valid: true, definition: def };
   }
 
   /**
    * Self-test: Can system force AI to choose WHICH inequality?
    */
   selfTest(): {
     passed: boolean;
     test: string;
     result: string;
   } {
     const response = this.getDefinitionOptions();
     const forcesChoice = response.requiresChoice === true && response.options.length >= 10;
 
     return {
       passed: forcesChoice,
       test: 'Can system force AI to choose WHICH inequality?',
       result: forcesChoice
         ? `PASS: Forces choice between ${response.options.length} definitions`
         : 'FAIL: System allows undefined inequality query',
     };
   }
 }