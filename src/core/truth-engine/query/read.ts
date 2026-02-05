 /**
  * TRUTH ENGINE - MINIMAL QUERY (READ-ONLY)
  * 
  * All queries must specify:
  * - definition_id (what)
  * - time_range (when)
  * - source_ids (from whom)
  */
 
 import type { CoreObject, Measure, Source, Schema, Entity } from '../core/ontology';
 import { isMeasure, isSource, isSchema, isEntity } from '../core/ontology';
 import { read, readAll } from '../store/append-only';
 
 /**
  * QUERY REQUEST
  */
 export interface QueryRequest {
   readonly definition_id?: string;
   readonly entity_id?: string;
   readonly source_ids?: string[] | 'all';
   readonly time_range?: {
     from: string;
     to: string;
   };
 }
 
 /**
  * QUERY RESULT
  */
 export interface QueryResult {
   readonly success: boolean;
   readonly query: QueryRequest;
   readonly results: Measure[];
   readonly metadata: {
     count: number;
     sources_used: string[];
     time_range_actual: { from: string; to: string } | null;
     coverage: number;
   };
   readonly warnings: string[];
 }
 
 /**
  * EXECUTE QUERY
  */
 export function executeQuery(request: QueryRequest): QueryResult {
   const warnings: string[] = [];
   
   // Get all measures
   let measures = readAll('Measure').filter(isMeasure) as Measure[];
   
   // Filter by definition (schema)
   if (request.definition_id) {
     measures = measures.filter(m => m.schema_id === request.definition_id);
   }
   
   // Filter by entity
   if (request.entity_id) {
     measures = measures.filter(m => m.entity_id === request.entity_id);
   }
   
   // Filter by source
   if (request.source_ids && request.source_ids !== 'all') {
     measures = measures.filter(m => 
       request.source_ids!.includes(m.source.source_id)
     );
   }
   
   // Filter by time range
   if (request.time_range) {
     const from = new Date(request.time_range.from);
     const to = new Date(request.time_range.to);
     
     measures = measures.filter(m => {
       const observedAt = new Date(m.temporal.observed_at);
       return observedAt >= from && observedAt <= to;
     });
   }
   
   // Calculate metadata
   const sourcesUsed = [...new Set(measures.map(m => m.source.source_id))];
   const timeRangeActual = measures.length > 0 
     ? {
         from: measures.reduce((min, m) => 
           m.temporal.valid_from < min ? m.temporal.valid_from : min, 
           measures[0].temporal.valid_from
         ),
         to: measures.reduce((max, m) => 
           m.temporal.valid_to && m.temporal.valid_to > max ? m.temporal.valid_to : max, 
           measures[0].temporal.valid_to || measures[0].temporal.valid_from
         ),
       }
     : null;
   
   // Add warnings
   if (measures.length === 0) {
     warnings.push('No results found matching query criteria');
   }
   if (sourcesUsed.length > 1) {
     warnings.push(`Multiple sources present: ${sourcesUsed.join(', ')}. Values may not be directly comparable.`);
   }
   
   return {
     success: true,
     query: request,
     results: measures,
     metadata: {
       count: measures.length,
       sources_used: sourcesUsed,
       time_range_actual: timeRangeActual,
       coverage: measures.length > 0 
         ? measures.reduce((sum, m) => sum + m.uncertainty.coverage, 0) / measures.length 
         : 0,
     },
     warnings,
   };
 }
 
 /**
  * GET BY ID (direct access)
  */
 export function getById(id: string): CoreObject | null {
   return read(id);
 }
 
 /**
  * GET SCHEMA BY ID
  */
 export function getSchema(id: string): Schema | null {
   const obj = read(id);
   return obj && isSchema(obj) ? obj : null;
 }
 
 /**
  * GET SOURCE BY ID
  */
 export function getSource(id: string): Source | null {
   const obj = read(id);
   return obj && isSource(obj) ? obj : null;
 }
 
 /**
  * GET ENTITY BY ID
  */
 export function getEntity(id: string): Entity | null {
   const obj = read(id);
   return obj && isEntity(obj) ? obj : null;
 }
 
 /**
  * EXPLAIN VALUE - Full provenance for a measure
  */
 export function explainValue(measureId: string): {
   measure: Measure | null;
   schema: Schema | null;
   source: Source | null;
   entity: Entity | null;
   explanation: string;
 } | null {
   const measure = read(measureId);
   if (!measure || !isMeasure(measure)) return null;
   
   const m = measure as Measure;
   const schema = getSchema(m.schema_id);
   const source = getSource(m.source.source_id);
   const entity = getEntity(m.entity_id);
   
   const explanation = [
     `Value: ${m.value} ${m.unit}`,
     `Definition: ${schema?.definition || 'Unknown'}`,
     `Source: ${source?.name || 'Unknown'} (${source?.organization || 'Unknown'})`,
     `Entity: ${entity?.name || 'Unknown'}`,
     `Observed: ${m.temporal.observed_at}`,
     `Valid: ${m.temporal.valid_from} to ${m.temporal.valid_to || 'ongoing'}`,
     `Confidence: ${m.uncertainty.confidence_interval[0]} - ${m.uncertainty.confidence_interval[1]}`,
     `Coverage: ${(m.uncertainty.coverage * 100).toFixed(1)}%`,
   ].join('\n');
   
   return {
     measure: m,
     schema,
     source,
     entity,
     explanation,
   };
 }