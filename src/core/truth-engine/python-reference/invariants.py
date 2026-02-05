 """
 TRUTH ENGINE - INVARIANT RUNNER
 
 All invariants are HARD STOPS.
 Violation = rejection. No exceptions.
 
 THE FIVE LAWS:
 1. No object without temporal axis
 2. No measure without unit
 3. No value without source
 4. No schema without definition
 5. No invalid base class
 """
 
 from typing import List, Dict, Any, Tuple, Optional
 from dataclasses import dataclass
 from enum import Enum
 
 
 class Severity(Enum):
     CRITICAL = "critical"
     HIGH = "high"
 
 
 @dataclass
 class InvariantResult:
     passed: bool
     invariant_id: str
     message: str
     details: Optional[Any] = None
 
 
 # Required temporal fields
 REQUIRED_TIME_FIELDS = {"observed_at", "valid_from"}
 
 # Valid base classes
 VALID_BASE_CLASSES = {
     "entity", "attribute", "relation", "event",
     "measure", "source", "schema", "version", "conclusion"
 }
 
 
 def assert_has_time(record: Dict[str, Any]) -> InvariantResult:
     """LAW 1: No object without temporal axis."""
     if record.get("base_class") == "measure":
         temporal = record.get("temporal", {})
         has_temporal = (
             temporal.get("observed_at") and
             temporal.get("valid_from")
         )
         return InvariantResult(
             passed=has_temporal,
             invariant_id="INV-001",
             message="Temporal envelope present" if has_temporal 
                     else "VIOLATION: Measure lacks temporal envelope"
         )
     
     # Non-measures must have created_at
     has_created = bool(record.get("created_at"))
     return InvariantResult(
         passed=has_created,
         invariant_id="INV-001",
         message="Creation timestamp present" if has_created
                 else "VIOLATION: Object lacks created_at"
     )
 
 
 def assert_has_unit(record: Dict[str, Any]) -> InvariantResult:
     """LAW 2: No measure without unit."""
     if record.get("base_class") != "measure":
         return InvariantResult(passed=True, invariant_id="INV-002", message="Not a measure")
     
     unit = record.get("unit", "")
     has_unit = bool(unit and len(unit) > 0)
     
     return InvariantResult(
         passed=has_unit,
         invariant_id="INV-002",
         message=f"Unit specified: {unit}" if has_unit
                 else "VIOLATION: Measure lacks unit"
     )
 
 
 def assert_has_source(record: Dict[str, Any]) -> InvariantResult:
     """LAW 3: No value without source."""
     if record.get("base_class") != "measure":
         return InvariantResult(passed=True, invariant_id="INV-003", message="Not a measure")
     
     source = record.get("source", {})
     has_source = (
         source.get("source_id") and
         source.get("source_version")
     )
     
     return InvariantResult(
         passed=has_source,
         invariant_id="INV-003",
         message=f"Source specified: {source.get('source_id')}" if has_source
                 else "VIOLATION: Measure lacks source envelope"
     )
 
 
 def assert_has_definition(record: Dict[str, Any]) -> InvariantResult:
     """LAW 4: No schema without definition."""
     if record.get("base_class") != "schema":
         return InvariantResult(passed=True, invariant_id="INV-004", message="Not a schema")
     
     definition = record.get("definition", "")
     has_definition = bool(definition and len(definition) > 10)
     
     return InvariantResult(
         passed=has_definition,
         invariant_id="INV-004",
         message="Definition present" if has_definition
                 else "VIOLATION: Schema lacks meaningful definition"
     )
 
 
 def assert_valid_base_class(record: Dict[str, Any]) -> InvariantResult:
     """LAW 5: Valid base class."""
     base_class = record.get("base_class", "")
     valid = base_class in VALID_BASE_CLASSES
     
     return InvariantResult(
         passed=valid,
         invariant_id="INV-005",
         message=f"Valid base class: {base_class}" if valid
                 else f"VIOLATION: Invalid base class: {base_class}"
     )
 
 
 # All invariants
 CORE_INVARIANTS = [
     ("INV-001", "Temporal Requirement", assert_has_time),
     ("INV-002", "Unit Requirement", assert_has_unit),
     ("INV-003", "Source Requirement", assert_has_source),
     ("INV-004", "Definition Requirement", assert_has_definition),
     ("INV-005", "Ontological Closure", assert_valid_base_class),
 ]
 
 
 def run_invariants(record: Dict[str, Any]) -> Tuple[bool, List[InvariantResult]]:
     """Run all invariants."""
     results = [check(record) for _, _, check in CORE_INVARIANTS]
     violations = [r for r in results if not r.passed]
     return len(violations) == 0, results
 
 
 def enforce_invariants(record: Dict[str, Any]) -> None:
     """HARD STOP - Raises on any violation."""
     passed, results = run_invariants(record)
     
     if not passed:
         violations = [r for r in results if not r.passed]
         messages = "; ".join(v.message for v in violations)
         raise ValueError(f"INVARIANT VIOLATION: {messages}")