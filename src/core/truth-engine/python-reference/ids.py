 """
 TRUTH ENGINE - DETERMINISTIC ID GENERATOR
 
 IDs are content-addressable.
 Same content = same ID = no duplicates.
 
 NO UUID. NO AUTO-INCREMENT. NO SHORTCUTS.
 """
 
 import hashlib
 import json
 from typing import Any, Dict, Optional, Tuple
 
 
 def semantic_hash(*parts: str) -> str:
     """Generate deterministic hash from semantic parts."""
     joined = "::".join(parts)
     return hashlib.sha256(joined.encode("utf-8")).hexdigest()[:12]
 
 
 def canonical_json(obj: Any) -> str:
     """Canonical JSON serialization (sorted keys)."""
     return json.dumps(obj, sort_keys=True, separators=(',', ':'))
 
 
 def content_hash(content: Any) -> str:
     """Generate content-addressable hash."""
     canonical = canonical_json(content)
     return hashlib.sha256(canonical.encode("utf-8")).hexdigest()[:12]
 
 
 def make_id(namespace: str, obj_type: str, name: str, version: str) -> str:
     """
     Generate semantic ID.
     
     Format: {namespace}:{obj_type}:{name}:{version}
     Example: core:measure:population_resident:v1
     """
     return f"{namespace}:{obj_type}:{name}:{version}"
 
 
 def generate_source_id(organization: str, name: str) -> str:
     """Generate source ID."""
     return make_id("core", "source", semantic_hash(organization, name), "v1")
 
 
 def generate_schema_id(name: str, version: int) -> str:
     """Generate schema ID."""
     return make_id("core", "schema", name, f"v{version}")
 
 
 def generate_entity_id(entity_type: str, identifiers: Dict[str, str]) -> str:
     """Generate entity ID."""
     id_hash = content_hash({"entity_type": entity_type, "identifiers": identifiers})
     return make_id("core", "entity", id_hash, "v1")
 
 
 def generate_measure_id(schema_id: str, entity_id: str, observed_at: str) -> str:
     """Generate measure ID."""
     id_hash = content_hash({
         "schema_id": schema_id,
         "entity_id": entity_id,
         "observed_at": observed_at
     })
     return make_id("core", "measure", id_hash, "v1")
 
 
 def parse_id(id_str: str) -> Optional[Tuple[str, str, str, str]]:
     """Parse ID components."""
     parts = id_str.split(":")
     if len(parts) != 4:
         return None
     return tuple(parts)
 
 
 def is_valid_id(id_str: str) -> bool:
     """Validate ID format."""
     parsed = parse_id(id_str)
     if not parsed:
         return False
     
     valid_types = [
         "entity", "attribute", "relation", "event",
         "measure", "source", "schema", "version", "conclusion"
     ]
     return parsed[1] in valid_types