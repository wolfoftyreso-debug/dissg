 """
 TRUTH ENGINE - APPEND-ONLY CORE STORE
 
 Fundamental law: No delete. No update.
 
 Allowed operations: CREATE, READ, SUPERSEDE
 Forbidden operations: UPDATE, DELETE
 """
 
 import hashlib
 import json
 from datetime import datetime
 from typing import List, Dict, Any, Optional
 from dataclasses import dataclass, field
 
 from invariants import enforce_invariants
 from ids import is_valid_id
 
 
 @dataclass
 class WriteLogEntry:
     id: str
     operation: str  # 'CREATE' or 'SUPERSEDE'
     timestamp: str
     writer: str
     object_hash: str
 
 
 @dataclass
 class WriteResult:
     success: bool
     operation: str
     id: str
     timestamp: str
     error: Optional[str] = None
 
 
 class AppendOnlyStore:
     """
     Append-only truth store.
     
     NO DELETE. NO UPDATE. EVER.
     """
     
     def __init__(self):
         self._records: Dict[str, Dict[str, Any]] = {}
         self._write_log: List[WriteLogEntry] = []
     
     def _hash_object(self, obj: Dict[str, Any]) -> str:
         """Generate hash for audit log."""
         canonical = json.dumps(obj, sort_keys=True)
         return hashlib.sha256(canonical.encode()).hexdigest()[:12]
     
     def create(self, record: Dict[str, Any], writer: str) -> WriteResult:
         """
         CREATE - Write new object (only if ID doesn't exist).
         """
         timestamp = datetime.utcnow().isoformat() + "Z"
         record_id = record.get("id", "")
         
         # Enforce all invariants BEFORE write
         try:
             enforce_invariants(record)
         except ValueError as e:
             return WriteResult(
                 success=False,
                 operation="CREATE",
                 id=record_id,
                 timestamp=timestamp,
                 error=str(e)
             )
         
         # Check for duplicate ID (no overwrites)
         if record_id in self._records:
             return WriteResult(
                 success=False,
                 operation="CREATE",
                 id=record_id,
                 timestamp=timestamp,
                 error="FORBIDDEN: Object with this ID already exists. Use SUPERSEDE instead."
             )
         
         # Validate ID format
         if not is_valid_id(record_id):
             return WriteResult(
                 success=False,
                 operation="CREATE",
                 id=record_id,
                 timestamp=timestamp,
                 error="INVALID: ID format is incorrect"
             )
         
         # Write to store (immutable copy)
         self._records[record_id] = dict(record)
         
         # Log the write
         self._write_log.append(WriteLogEntry(
             id=record_id,
             operation="CREATE",
             timestamp=timestamp,
             writer=writer,
             object_hash=self._hash_object(record)
         ))
         
         return WriteResult(
             success=True,
             operation="CREATE",
             id=record_id,
             timestamp=timestamp
         )
     
     def read(self, id: str) -> Optional[Dict[str, Any]]:
         """READ - Get object by ID."""
         return self._records.get(id)
     
     def read_all(self, base_class: Optional[str] = None) -> List[Dict[str, Any]]:
         """READ ALL - Get all objects, optionally filtered by type."""
         all_records = list(self._records.values())
         if base_class:
             return [r for r in all_records if r.get("base_class") == base_class]
         return all_records
     
     def exists(self, id: str) -> bool:
         """EXISTS - Check if ID exists."""
         return id in self._records
     
     def get_write_log(self) -> List[WriteLogEntry]:
         """GET WRITE LOG - Audit trail."""
         return list(self._write_log)
     
     def update(self) -> None:
         """FORBIDDEN: UPDATE operation is not permitted."""
         raise PermissionError(
             "FORBIDDEN: UPDATE operation is not permitted. "
             "Truth Engine is append-only."
         )
     
     def delete(self) -> None:
         """FORBIDDEN: DELETE operation is not permitted."""
         raise PermissionError(
             "FORBIDDEN: DELETE operation is not permitted. "
             "Truth Engine is append-only."
         )
     
     def stats(self) -> Dict[str, Any]:
         """STORE STATS"""
         by_class: Dict[str, int] = {}
         for record in self._records.values():
             bc = record.get("base_class", "unknown")
             by_class[bc] = by_class.get(bc, 0) + 1
         
         return {
             "total_objects": len(self._records),
             "objects_by_class": by_class,
             "total_writes": len(self._write_log)
         }