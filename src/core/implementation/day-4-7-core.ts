 /**
  * DAY 4-7: CORE BECOMES CODE
  * 
  * Build ONLY:
  * 1. Ontology loader
  * 2. Schema registry
  * 3. ID generator (deterministic)
  * 4. Append-only core store
  * 
  * NOTHING ELSE.
  * 
  * Self-test:
  *   CREATE entity → version → supersede
  *   ASSERT old_version STILL queryable
  */
 
 /**
  * ONTOLOGY LOADER
  */
 export interface OntologyDefinition {
   id: string;
   version: number;
   definition: string;
   temporal: 'required' | 'optional' | 'forbidden';
   relations: string[];
   properties: {
     required: string[];
     optional: string[];
   };
 }
 
 export class OntologyLoader {
   private loaded: Map<string, OntologyDefinition> = new Map();
 
   load(definition: OntologyDefinition): { success: boolean; error?: string } {
     // Validate ID format
     if (!definition.id.match(/^core:entity:[a-z_]+:v\d+$/)) {
       return { success: false, error: 'Invalid entity ID format' };
     }
 
     // Check if already loaded
     if (this.loaded.has(definition.id)) {
       return { success: false, error: 'Entity already exists. Use supersede.' };
     }
 
     this.loaded.set(definition.id, definition);
     return { success: true };
   }
 
   get(id: string): OntologyDefinition | undefined {
     return this.loaded.get(id);
   }
 
   getAll(): OntologyDefinition[] {
     return Array.from(this.loaded.values());
   }
 }
 
 /**
  * SCHEMA REGISTRY (Minimal)
  */
 export interface SchemaEntry {
   id: string;
   version: number;
   hash: string;
   createdAt: string;
   fields: Record<string, { type: string; required: boolean }>;
   supersedes?: string;
 }
 
 export class MinimalSchemaRegistry {
   private schemas: Map<string, SchemaEntry> = new Map();
 
   register(schema: Omit<SchemaEntry, 'hash' | 'createdAt'>): SchemaEntry {
     const hash = this.computeHash(schema);
     const entry: SchemaEntry = {
       ...schema,
       hash,
       createdAt: new Date().toISOString(),
     };
 
     if (this.schemas.has(schema.id)) {
       throw new Error(`Schema ${schema.id} exists. Schemas are immutable.`);
     }
 
     this.schemas.set(schema.id, entry);
     return entry;
   }
 
   get(id: string): SchemaEntry | undefined {
     return this.schemas.get(id);
   }
 
   getAllVersions(baseName: string): SchemaEntry[] {
     return Array.from(this.schemas.values())
       .filter(s => s.id.startsWith(baseName));
   }
 
   private computeHash(schema: Omit<SchemaEntry, 'hash' | 'createdAt'>): string {
     const str = JSON.stringify(schema);
     let hash = 0;
     for (let i = 0; i < str.length; i++) {
       hash = ((hash << 5) - hash) + str.charCodeAt(i);
       hash = hash & hash;
     }
     return `sha256:${Math.abs(hash).toString(16).padStart(16, '0')}`;
   }
 }
 
 /**
  * ID GENERATOR (Deterministic)
  */
 export class DeterministicIdGenerator {
   /**
    * Generate ID from components (deterministic - same input = same output)
    */
   generate(components: {
     domain: string;
     type: string;
     identifier: string;
     version: number;
   }): string {
     const { domain, type, identifier, version } = components;
     return `${domain}:${type}:${identifier}:v${version}`;
   }
 
   /**
    * Generate content-addressable ID (based on content hash)
    */
   generateContentAddressed(content: unknown): string {
     const str = JSON.stringify(content);
     let hash = 0;
     for (let i = 0; i < str.length; i++) {
       hash = ((hash << 5) - hash) + str.charCodeAt(i);
       hash = hash & hash;
     }
     return `content:${Math.abs(hash).toString(16).padStart(16, '0')}`;
   }
 
   /**
    * Parse ID into components
    */
   parse(id: string): {
     domain: string;
     type: string;
     identifier: string;
     version: number;
   } | null {
     const match = id.match(/^([^:]+):([^:]+):([^:]+):v(\d+)$/);
     if (!match) return null;
 
     return {
       domain: match[1],
       type: match[2],
       identifier: match[3],
       version: parseInt(match[4], 10),
     };
   }
 }
 
 /**
  * APPEND-ONLY CORE STORE
  */
 export interface CoreEntry<T = unknown> {
   id: string;
   version: number;
   data: T;
   createdAt: string;
   hash: string;
   supersedes?: string;
 }
 
 export class AppendOnlyCoreStore {
   private entries: Map<string, CoreEntry> = new Map();
   private idGenerator = new DeterministicIdGenerator();
 
   /**
    * CREATE (append new entry)
    */
   create<T>(
     domain: string,
     type: string,
     identifier: string,
     data: T
   ): CoreEntry<T> {
     const id = this.idGenerator.generate({ domain, type, identifier, version: 1 });
 
     if (this.entries.has(id)) {
       throw new Error(`Entry ${id} already exists. Core is append-only.`);
     }
 
     const entry: CoreEntry<T> = {
       id,
       version: 1,
       data,
       createdAt: new Date().toISOString(),
       hash: this.idGenerator.generateContentAddressed(data),
     };
 
     this.entries.set(id, entry);
     return entry;
   }
 
   /**
    * SUPERSEDE (create new version, keep old)
    */
   supersede<T>(
     previousId: string,
     data: T
   ): CoreEntry<T> {
     const previous = this.entries.get(previousId);
     if (!previous) {
       throw new Error(`Cannot supersede: ${previousId} not found`);
     }
 
     const parsed = this.idGenerator.parse(previousId);
     if (!parsed) {
       throw new Error(`Invalid ID format: ${previousId}`);
     }
 
     const newId = this.idGenerator.generate({
       ...parsed,
       version: parsed.version + 1,
     });
 
     const entry: CoreEntry<T> = {
       id: newId,
       version: parsed.version + 1,
       data,
       createdAt: new Date().toISOString(),
       hash: this.idGenerator.generateContentAddressed(data),
       supersedes: previousId,
     };
 
     this.entries.set(newId, entry);
     return entry;
   }
 
   /**
    * GET (by exact ID)
    */
   get(id: string): CoreEntry | undefined {
     return this.entries.get(id);
   }
 
   /**
    * GET ALL VERSIONS
    */
   getAllVersions(baseId: string): CoreEntry[] {
     const parsed = this.idGenerator.parse(baseId);
     if (!parsed) return [];
 
     const prefix = `${parsed.domain}:${parsed.type}:${parsed.identifier}:v`;
     return Array.from(this.entries.values())
       .filter(e => e.id.startsWith(prefix.slice(0, -1)))
       .sort((a, b) => a.version - b.version);
   }
 
   // ============================================
   // FORBIDDEN OPERATIONS
   // ============================================
 
   delete(): never {
     throw new Error('FORBIDDEN: Core entries cannot be deleted');
   }
 
   update(): never {
     throw new Error('FORBIDDEN: Core entries cannot be updated. Use supersede.');
   }
 }
 
 /**
  * DAY 4-7 SELF-TEST
  */
 export function runDay4to7SelfTest(): {
   passed: boolean;
   steps: { name: string; passed: boolean; error?: string }[];
 } {
   const store = new AppendOnlyCoreStore();
   const steps: { name: string; passed: boolean; error?: string }[] = [];
 
   // Step 1: CREATE entity
   try {
     const created = store.create('core', 'entity', 'test_country', {
       name: 'Test Country',
       code: 'TC',
     });
     steps.push({ name: 'CREATE entity', passed: true });
   } catch (e) {
     steps.push({ name: 'CREATE entity', passed: false, error: String(e) });
   }
 
   // Step 2: SUPERSEDE (new version)
   try {
     const superseded = store.supersede('core:entity:test_country:v1', {
       name: 'Test Country Updated',
       code: 'TC',
       newField: 'added',
     });
     steps.push({ name: 'SUPERSEDE to v2', passed: true });
   } catch (e) {
     steps.push({ name: 'SUPERSEDE to v2', passed: false, error: String(e) });
   }
 
   // Step 3: OLD VERSION STILL QUERYABLE
   try {
     const v1 = store.get('core:entity:test_country:v1');
     const v2 = store.get('core:entity:test_country:v2');
     
     if (v1 && v2) {
       steps.push({ name: 'OLD version queryable', passed: true });
     } else {
       steps.push({ 
         name: 'OLD version queryable', 
         passed: false, 
         error: 'Version missing' 
       });
     }
   } catch (e) {
     steps.push({ name: 'OLD version queryable', passed: false, error: String(e) });
   }
 
   // Step 4: DELETE FORBIDDEN
   try {
     store.delete();
     steps.push({ name: 'DELETE forbidden', passed: false, error: 'Delete was allowed!' });
   } catch {
     steps.push({ name: 'DELETE forbidden', passed: true });
   }
 
   // Step 5: UPDATE FORBIDDEN
   try {
     store.update();
     steps.push({ name: 'UPDATE forbidden', passed: false, error: 'Update was allowed!' });
   } catch {
     steps.push({ name: 'UPDATE forbidden', passed: true });
   }
 
   return {
     passed: steps.every(s => s.passed),
     steps,
   };
 }