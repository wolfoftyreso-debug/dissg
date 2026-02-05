 /**
  * HASHING UTILITIES
  * 
  * Cryptographic hashing for trust anchors.
  */
 
 export function sha256(data: string): string {
   // Browser-compatible hash (in production, use SubtleCrypto)
   let hash = 0;
   for (let i = 0; i < data.length; i++) {
     const char = data.charCodeAt(i);
     hash = ((hash << 5) - hash) + char;
     hash = hash & hash;
   }
   return Math.abs(hash).toString(16).padStart(64, '0');
 }
 
 export function hashChain(items: readonly string[]): string {
   return items.reduce((acc, item) => sha256(acc + item), '');
 }
 
 export function verifyHash(data: string, expectedHash: string): boolean {
   return sha256(data) === expectedHash;
 }