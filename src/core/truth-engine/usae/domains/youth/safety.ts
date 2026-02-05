 /**
  * YOUTH DOMAIN SAFETY RULES
  * 
  * Critical safety level - strictest rules apply.
  */
 
 /**
  * FORBIDDEN PATTERNS IN OUTPUT
  */
 export const YOUTH_FORBIDDEN_PATTERNS = {
   DIAGNOSIS: {
     pattern: /you (have|are|suffer from|are diagnosed)/i,
     message: 'Individual diagnosis is forbidden. Please consult a healthcare provider.',
     action: 'block' as const,
   },
   TREATMENT: {
     pattern: /you should (take|use|try|consider) (medication|treatment|therapy)/i,
     message: 'Treatment advice is forbidden.',
     action: 'block' as const,
   },
   PROGNOSIS: {
     pattern: /you will (become|develop|have|suffer)/i,
     message: 'Individual prognosis is forbidden.',
     action: 'block' as const,
   },
   IDENTITY_LOCK: {
     pattern: /you are (definitely|clearly|obviously) (gay|straight|trans|non-binary|depressed|anxious)/i,
     message: 'Identity determination is forbidden.',
     action: 'block' as const,
   },
   NORMATIVE: {
     pattern: /you (should|must|need to|have to)/i,
     message: 'Normative advice is forbidden.',
     action: 'block' as const,
   },
 };
 
 /**
  * MANDATORY OUTPUT ELEMENTS
  */
 export const YOUTH_MANDATORY_ELEMENTS = {
   NORMALIZATION: {
     required: true,
     description: 'Output must normalize the experience',
     check: (output: string) => /many|common|normal|often|typical/i.test(output),
   },
   NOT_ALONE: {
     required: true,
     description: 'Output should convey "you are not alone"',
     check: (output: string) => /not alone|many people|others|common experience/i.test(output),
   },
   HELP_PATH: {
     required: true,
     description: 'Output must include path to help',
     check: (output: string) => /trusted adult|healthcare|helpline|support|reach out/i.test(output),
   },
 };
 
 /**
  * CRISIS TRIGGERS
  */
 export const YOUTH_CRISIS_TRIGGERS = [
   /want to die/i,
   /kill myself/i,
   /suicide/i,
   /self.?harm/i,
   /hurt myself/i,
   /don't want to live/i,
   /end my life/i,
   /can't go on/i,
   /no reason to live/i,
 ];
 
 /**
  * VALIDATE OUTPUT SAFETY
  */
 export function validateYouthOutputSafety(output: string): {
   safe: boolean;
   violations: string[];
   missing_mandatory: string[];
 } {
   const violations: string[] = [];
   const missing_mandatory: string[] = [];
   
   // Check forbidden patterns
   for (const [key, rule] of Object.entries(YOUTH_FORBIDDEN_PATTERNS)) {
     if (rule.pattern.test(output)) {
       violations.push(`${key}: ${rule.message}`);
     }
   }
   
   // Check mandatory elements
   for (const [key, rule] of Object.entries(YOUTH_MANDATORY_ELEMENTS)) {
     if (rule.required && !rule.check(output)) {
       missing_mandatory.push(key);
     }
   }
   
   return {
     safe: violations.length === 0,
     violations,
     missing_mandatory,
   };
 }
 
 /**
  * CHECK FOR CRISIS
  */
 export function detectCrisis(input: string): boolean {
   return YOUTH_CRISIS_TRIGGERS.some(pattern => pattern.test(input));
 }