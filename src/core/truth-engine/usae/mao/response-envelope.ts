 /**
  * RESPONSE ENVELOPE
  * 
  * The outer wrapper for all API responses.
  * This is the contract AI agents depend on.
  */
 
 import type { UnifiedAnswerBody } from './unified-body';
 
 /**
  * SUCCESS RESPONSE
  */
 export interface MAOSuccessResponse {
   readonly success: true;
   readonly data: UnifiedAnswerBody;
   readonly meta: ResponseMeta;
 }
 
 /**
  * BLOCKED RESPONSE (Question not allowed)
  */
 export interface MAOBlockedResponse {
   readonly success: false;
   readonly blocked: true;
   readonly reason: string;
   readonly blocked_by: string;
   readonly redirect?: string;
   readonly meta: ResponseMeta;
 }
 
 /**
  * NO DATA RESPONSE (Coverage too low)
  */
 export interface MAONoDataResponse {
   readonly success: false;
   readonly blocked: false;
   readonly no_data: true;
   readonly reason: string;
   readonly coverage_found: number;
   readonly coverage_required: number;
   readonly suggestions?: readonly string[];
   readonly meta: ResponseMeta;
 }
 
 /**
  * ERROR RESPONSE
  */
 export interface MAOErrorResponse {
   readonly success: false;
   readonly blocked: false;
   readonly no_data: false;
   readonly error: true;
   readonly error_code: string;
   readonly error_message: string;
   readonly meta: ResponseMeta;
 }
 
 /**
  * RESPONSE META
  */
 export interface ResponseMeta {
   readonly request_id: string;
   readonly timestamp: string;
   readonly processing_time_ms: number;
   readonly mao_version: string;
   readonly answer_type?: string;
   readonly domain?: string;
 }
 
 /**
  * UNIFIED RESPONSE TYPE
  */
 export type MAOResponse = 
   | MAOSuccessResponse 
   | MAOBlockedResponse 
   | MAONoDataResponse 
   | MAOErrorResponse;
 
 /**
  * CREATE SUCCESS RESPONSE
  */
 export function createSuccessResponse(
   data: UnifiedAnswerBody,
   request_id: string,
   processing_time_ms: number
 ): MAOSuccessResponse {
   return {
     success: true,
     data,
     meta: {
       request_id,
       timestamp: new Date().toISOString(),
       processing_time_ms,
       mao_version: '1.0.0',
       answer_type: data.answer_type,
       domain: data.domain,
     },
   };
 }
 
 /**
  * CREATE BLOCKED RESPONSE
  */
 export function createBlockedResponse(
   reason: string,
   blocked_by: string,
   request_id: string,
   redirect?: string
 ): MAOBlockedResponse {
   return {
     success: false,
     blocked: true,
     reason,
     blocked_by,
     redirect,
     meta: {
       request_id,
       timestamp: new Date().toISOString(),
       processing_time_ms: 0,
       mao_version: '1.0.0',
     },
   };
 }
 
 /**
  * CREATE NO DATA RESPONSE
  */
 export function createNoDataResponse(
   reason: string,
   coverage_found: number,
   coverage_required: number,
   request_id: string,
   suggestions?: string[]
 ): MAONoDataResponse {
   return {
     success: false,
     blocked: false,
     no_data: true,
     reason,
     coverage_found,
     coverage_required,
     suggestions,
     meta: {
       request_id,
       timestamp: new Date().toISOString(),
       processing_time_ms: 0,
       mao_version: '1.0.0',
     },
   };
 }