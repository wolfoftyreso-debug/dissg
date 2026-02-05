 /**
  * TEMPORAL AXIS
  * 
  * No data point may lack time dimension.
  * This enables: backtesting, reproducible AI training, manipulation detection.
  */
 
 // =============================================================================
 // TEMPORAL FIELDS (mandatory on all objects)
 // =============================================================================
 
 export interface TemporalAxis {
   /**
    * When the data was observed/recorded in the system
    * This is the system timestamp, not the real-world timestamp
    */
   observedAt: string;
   
   /**
    * When the data became valid in reality
    * For historical data, this is when the fact was true
    */
   validFrom: string;
   
   /**
    * When the data ceased to be valid (null = still valid)
    * For superseded data, this is when the new version took over
    */
   validTo: string | null;
 }
 
 // =============================================================================
 // TEMPORAL PRECISION
 // =============================================================================
 
 export type TemporalPrecision = 
   | 'instant'   // Exact timestamp
   | 'second'
   | 'minute'
   | 'hour'
   | 'day'
   | 'week'
   | 'month'
   | 'quarter'
   | 'year'
   | 'decade'
   | 'century';
 
 export interface TemporalMetadata extends TemporalAxis {
   /**
    * Precision of validFrom/validTo timestamps
    */
   precision: TemporalPrecision;
   
   /**
    * Timezone of the original data (if known)
    */
   originalTimezone?: string;
   
   /**
    * Whether this is a point-in-time or period measurement
    */
   temporalType: 'point' | 'period' | 'cumulative';
   
   /**
    * For period data, the aggregation period
    */
   aggregationPeriod?: {
     unit: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
     count: number;
   };
 }
 
 // =============================================================================
 // VALIDATION
 // =============================================================================
 
 export interface TemporalValidationResult {
   valid: boolean;
   errors: string[];
   warnings: string[];
 }
 
 /**
  * Validate temporal axis completeness
  */
 export function validateTemporalAxis(axis: Partial<TemporalAxis>): TemporalValidationResult {
   const errors: string[] = [];
   const warnings: string[] = [];
   
   // Required fields
   if (!axis.observedAt) {
     errors.push('Missing observedAt timestamp');
   }
   
   if (!axis.validFrom) {
     errors.push('Missing validFrom timestamp');
   }
   
   // validTo can be null, but must be present as a field
   if (!('validTo' in axis)) {
     errors.push('Missing validTo field (can be null)');
   }
   
   // Logical checks
   if (axis.observedAt && axis.validFrom) {
     const observed = new Date(axis.observedAt);
     const validFrom = new Date(axis.validFrom);
     
     if (isNaN(observed.getTime())) {
       errors.push('Invalid observedAt timestamp format');
     }
     
     if (isNaN(validFrom.getTime())) {
       errors.push('Invalid validFrom timestamp format');
     }
     
     // observedAt should be >= validFrom (we observe after or when something becomes valid)
     if (observed < validFrom) {
       warnings.push('observedAt is before validFrom (data observed before it was valid?)');
     }
   }
   
   if (axis.validTo) {
     const validTo = new Date(axis.validTo);
     
     if (isNaN(validTo.getTime())) {
       errors.push('Invalid validTo timestamp format');
     }
     
     if (axis.validFrom) {
       const validFrom = new Date(axis.validFrom);
       if (validTo < validFrom) {
         errors.push('validTo is before validFrom');
       }
     }
   }
   
   return {
     valid: errors.length === 0,
     errors,
     warnings,
   };
 }
 
 /**
  * Create a temporal axis for current data
  */
 export function createCurrentTemporalAxis(validFrom: string): TemporalAxis {
   return {
     observedAt: new Date().toISOString(),
     validFrom,
     validTo: null,
   };
 }
 
 /**
  * Close a temporal axis (supersede)
  */
 export function closeTemporalAxis(axis: TemporalAxis, closedAt: string): TemporalAxis {
   return {
     ...axis,
     validTo: closedAt,
   };
 }
 
 // =============================================================================
 // TEMPORAL QUERIES
 // =============================================================================
 
 /**
  * Check if data is valid at a specific point in time
  */
 export function isValidAt(axis: TemporalAxis, timestamp: string): boolean {
   const checkTime = new Date(timestamp);
   const validFrom = new Date(axis.validFrom);
   
   if (checkTime < validFrom) return false;
   
   if (axis.validTo) {
     const validTo = new Date(axis.validTo);
     if (checkTime >= validTo) return false;
   }
   
   return true;
 }
 
 /**
  * Get the current (valid now) version from a list of temporal objects
  */
 export function getCurrentVersion<T extends { temporal: TemporalAxis }>(
   objects: T[]
 ): T | null {
   const now = new Date().toISOString();
   return objects.find(obj => isValidAt(obj.temporal, now)) ?? null;
 }
 
 /**
  * Get the version valid at a specific time
  */
 export function getVersionAt<T extends { temporal: TemporalAxis }>(
   objects: T[],
   timestamp: string
 ): T | null {
   return objects.find(obj => isValidAt(obj.temporal, timestamp)) ?? null;
 }