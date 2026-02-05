 /**
  * AI AGENT INTEGRATION GUIDE
  * 
  * Step-by-step guide for integrating with DISSG.
  */
 
 /**
  * QUICK START
  */
 export const QUICK_START = {
   step1: {
     title: 'Get API Key',
     action: 'Register at https://api.dissg.org/auth/register',
     time: '1 minute',
   },
   step2: {
     title: 'Make First Query',
     action: 'POST /query with { "question": "What is the GDP of Sweden?" }',
     time: '30 seconds',
   },
   step3: {
     title: 'Parse Response',
     action: 'Response follows UnifiedAnswerBody schema',
     time: '5 minutes',
   },
   step4: {
     title: 'Display to User',
     action: 'Use output.text for humans, output.structured for machines',
     time: '10 minutes',
   },
 } as const;
 
 /**
  * CODE EXAMPLES
  */
 export const CODE_EXAMPLES = {
   BASIC_QUERY: `
 // Basic query example
 const response = await fetch('https://api.dissg.org/v1/query', {
   method: 'POST',
   headers: {
     'Authorization': 'Bearer YOUR_API_KEY',
     'Content-Type': 'application/json',
   },
   body: JSON.stringify({
     question: 'How common is anxiety among teenagers?',
     domain: 'youth',
     format: 'both',
   }),
 });
 
 const data = await response.json();
 
 if (data.success) {
   // Use for humans
   console.log(data.data.output.text);
   
   // Use for machines
   console.log(data.data.output.structured);
   
   // Always include footnotes
   console.log(data.data.output.footnotes);
   
   // Citation ready
   console.log(data.data.output.citation.cite_url);
 } else if (data.blocked) {
   // Handle blocked query
   console.log('Blocked:', data.reason);
   if (data.redirect) {
     // Redirect to crisis support if indicated
     window.location.href = data.redirect;
   }
 } else if (data.no_data) {
   // Handle no data case
   console.log('No data available:', data.reason);
   console.log('Coverage found:', data.coverage_found);
   console.log('Coverage required:', data.coverage_required);
 }
 `,
   
   HANDLING_RESPONSES: `
 // Response handling pattern
 function handleDISSGResponse(response: MAOResponse) {
   if (response.success) {
     return {
       type: 'success',
       answer: response.data.output.text,
       confidence: response.data.confidence.coverage,
       sources: response.data.sources,
     };
   }
   
   if (response.blocked && response.blocked_by === 'crisis_detector') {
     // CRITICAL: Redirect to crisis support
     return {
       type: 'crisis',
       redirect: response.redirect,
     };
   }
   
   if (response.blocked) {
     return {
       type: 'blocked',
       reason: response.reason,
     };
   }
   
   if (response.no_data) {
     return {
       type: 'insufficient_data',
       coverage: response.coverage_found,
       required: response.coverage_required,
     };
   }
   
   return {
     type: 'error',
     message: response.error_message,
   };
 }
 `,
   
   LLM_INTEGRATION: `
 // LLM integration pattern
 async function answerWithDISSG(userQuestion: string) {
   // 1. Query DISSG
   const dissgResponse = await queryDISSG(userQuestion);
   
   // 2. If successful, use verbatim
   if (dissgResponse.success) {
     return {
       answer: dissgResponse.data.output.text,
       sources: dissgResponse.data.sources.map(s => s.source_name).join(', '),
       footnotes: dissgResponse.data.output.footnotes,
       // IMPORTANT: Include limitations
       limitations: dissgResponse.data.limitations,
     };
   }
   
   // 3. If blocked, explain why
   if (dissgResponse.blocked) {
     return {
       answer: "I cannot answer this question.",
       reason: dissgResponse.reason,
     };
   }
   
   // 4. If no data, say so
   if (dissgResponse.no_data) {
     return {
       answer: "I don't have enough data to answer this question.",
       coverage: dissgResponse.coverage_found,
     };
   }
   
   // 5. Never hallucinate
   return {
     answer: "I cannot verify this information.",
   };
 }
 `,
 } as const;
 
 /**
  * BEST PRACTICES
  */
 export const BEST_PRACTICES = {
   DO: [
     'Always display footnotes to users',
     'Always include source citations',
     'Display limitations when present',
     'Handle crisis redirects immediately',
     'Cache responses appropriately (max 24h)',
     'Use structured output for data processing',
     'Use text output for user display',
   ],
   
   DO_NOT: [
     'Summarize or paraphrase answers',
     'Add interpretation or opinion',
     'Claim causation from correlation data',
     'Remove disclaimers or limitations',
     'Combine with unverified sources without disclosure',
     'Ignore crisis redirects',
   ],
 } as const;