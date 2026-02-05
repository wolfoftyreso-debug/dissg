 /**
  * LIVE CASE TEST
  * 
  * End-to-end: "Hur många bor i Sverige?" → Full answer
  */
 
 import type { AnswerPacketV2, GeneratedAnswer, IntentMatch } from '../types';
 import { matchIntent, validateInputs } from '../generator/intent-matcher';
 import { generateAnswer } from '../generator/answer-generator';
 
 // Import all packets
 import { POPULATION_BASIC_V2 } from '../packets/population-basic-v2';
 import { POPULATION_TREND } from '../packets/population-trend';
 import { POPULATION_COMPARISON } from '../packets/population-comparison';
 import { AGE_STRUCTURE } from '../packets/age-structure';
 import { GDP_BASIC } from '../packets/gdp-basic';
 import { LIFE_EXPECTANCY } from '../packets/life-expectancy';
 
 /**
  * All registered packets
  */
 const ALL_PACKETS: readonly AnswerPacketV2[] = [
   POPULATION_BASIC_V2,
   POPULATION_TREND,
   POPULATION_COMPARISON,
   AGE_STRUCTURE,
   GDP_BASIC,
   LIFE_EXPECTANCY,
 ];
 
 /**
  * Run a single live case
  */
 export function runLiveCase(question: string): {
   question: string;
   match: IntentMatch | null;
   validation: { valid: boolean; missing: string[] } | null;
   answer: GeneratedAnswer | null;
 } {
   console.log('\n' + '='.repeat(60));
   console.log(`LIVE CASE: "${question}"`);
   console.log('='.repeat(60));
   
   // Step 1: Match intent
   const match = matchIntent(question, ALL_PACKETS);
   
   if (!match) {
     console.log('❌ No matching packet found');
     return { question, match: null, validation: null, answer: null };
   }
   
   console.log(`✓ Matched: ${match.packet_id}`);
   console.log(`  Confidence: ${(match.confidence * 100).toFixed(0)}%`);
   console.log(`  Params: ${JSON.stringify(match.extracted_params)}`);
   
   // Step 2: Find packet
   const packet = ALL_PACKETS.find(p => p.id === match.packet_id);
   if (!packet) {
     console.log('❌ Packet not found in registry');
     return { question, match, validation: null, answer: null };
   }
   
   // Step 3: Validate inputs
   const validation = validateInputs(packet, match.extracted_params);
   
   if (!validation.valid) {
     console.log(`❌ Missing inputs: ${validation.missing.join(', ')}`);
     return { question, match, validation, answer: null };
   }
   
   console.log('✓ All required inputs present');
   
   // Step 4: Generate answer
   const answer = generateAnswer(packet, match.extracted_params);
   
   if (!answer.success) {
     console.log(`❌ Generation failed: ${answer.error}`);
     return { question, match, validation, answer };
   }
   
   console.log('\n--- GENERATED ANSWER ---');
   console.log(answer.text);
   console.log('\n--- FOOTNOTES ---');
   answer.footnotes.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
   console.log('\n--- CONFIDENCE ---');
   console.log(`  Coverage: ${(answer.confidence.coverage * 100).toFixed(0)}%`);
   console.log(`  Source Agreement: ${(answer.confidence.source_agreement * 100).toFixed(0)}%`);
   
   return { question, match, validation, answer };
 }
 
 /**
  * Run all test cases
  */
 export function runAllLiveCases(): void {
   const testCases = [
     // Swedish
     'Hur många bor i Sverige?',
     'Vad är befolkningen i Sverige?',
     
     // English
     'How many people live in Sweden?',
     'What is the population of Germany?',
     'What is life expectancy in Japan?',
     'GDP per capita in Sweden',
     'What is the median age in Germany?',
     
     // Comparison (should need two countries)
     'Compare Sweden and Germany',
     
     // Blocked patterns (should fail)
     'Why is the population increasing?',
     
     // Unknown country (should fail gracefully)
     'Population of Narnia',
   ];
   
   const results = testCases.map(q => runLiveCase(q));
   
   console.log('\n' + '='.repeat(60));
   console.log('SUMMARY');
   console.log('='.repeat(60));
   
   const successful = results.filter(r => r.answer?.success).length;
   const matched = results.filter(r => r.match).length;
   const total = results.length;
   
   console.log(`Matched: ${matched}/${total}`);
   console.log(`Successful: ${successful}/${total}`);
 }