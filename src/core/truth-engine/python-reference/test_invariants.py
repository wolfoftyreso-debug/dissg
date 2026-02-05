 """
 TRUTH ENGINE - INVARIANT TESTS
 
 If tests don't exist → no rules.
 
 Run with: pytest test_invariants.py -v
 """
 
 import pytest
 from datetime import datetime
 
 from invariants import (
     assert_has_time,
     assert_has_unit,
     assert_has_source,
     assert_has_definition,
     assert_valid_base_class,
     run_invariants,
     enforce_invariants
 )
 
 
 # ═══════════════════════════════════════════════════════════════
 # VALID DATA - Should pass all invariants
 # ═══════════════════════════════════════════════════════════════
 
 VALID_MEASURE = {
     "id": "core:measure:test:v1",
     "base_class": "measure",
     "schema_id": "core:schema:population_resident:v1",
     "entity_id": "core:entity:test:v1",
     "created_at": datetime.utcnow().isoformat() + "Z",
     "created_by": "test",
     "value": 10551707,
     "unit": "persons",
     "temporal": {
         "observed_at": "2023-12-31T00:00:00Z",
         "valid_from": "2023-12-31T00:00:00Z",
         "valid_to": None
     },
     "source": {
         "source_id": "core:source:scb:v1",
         "source_version": "2024-02",
         "source_accessed_at": "2025-02-05T00:00:00Z"
     },
     "uncertainty": {
         "confidence_interval": [10551707, 10551707],
         "coverage": 0.99,
         "methodology_note": "Based on population register."
     }
 }
 
 VALID_SCHEMA = {
     "id": "core:schema:population_resident:v1",
     "base_class": "schema",
     "schema_id": "core:schema:system:v1",
     "created_at": datetime.utcnow().isoformat() + "Z",
     "created_by": "test",
     "name": "Population (Resident Definition)",
     "definition": "Total number of persons registered as residents in a geographic area at a specific point in time.",
     "unit": "persons",
     "dimension": "count",
     "version": 1,
     "supersedes": None
 }
 
 
 # ═══════════════════════════════════════════════════════════════
 # LAW 1: No object without temporal axis
 # ═══════════════════════════════════════════════════════════════
 
 def test_valid_measure_has_temporal():
     result = assert_has_time(VALID_MEASURE)
     assert result.passed, result.message
 
 
 def test_measure_without_temporal_fails():
     record = {
         "base_class": "measure",
         "value": 100,
         "unit": "persons",
         "temporal": {}  # Empty temporal
     }
     result = assert_has_time(record)
     assert not result.passed
     assert result.invariant_id == "INV-001"
 
 
 def test_object_without_created_at_fails():
     record = {
         "base_class": "entity",
         "name": "Test"
         # Missing created_at
     }
     result = assert_has_time(record)
     assert not result.passed
 
 
 # ═══════════════════════════════════════════════════════════════
 # LAW 2: No measure without unit
 # ═══════════════════════════════════════════════════════════════
 
 def test_valid_measure_has_unit():
     result = assert_has_unit(VALID_MEASURE)
     assert result.passed, result.message
 
 
 def test_measure_without_unit_fails():
     record = {
         "base_class": "measure",
         "value": 100,
         "unit": ""  # Empty unit
     }
     result = assert_has_unit(record)
     assert not result.passed
     assert result.invariant_id == "INV-002"
 
 
 def test_non_measure_skips_unit_check():
     record = {"base_class": "entity"}
     result = assert_has_unit(record)
     assert result.passed
 
 
 # ═══════════════════════════════════════════════════════════════
 # LAW 3: No value without source
 # ═══════════════════════════════════════════════════════════════
 
 def test_valid_measure_has_source():
     result = assert_has_source(VALID_MEASURE)
     assert result.passed, result.message
 
 
 def test_measure_without_source_fails():
     record = {
         "base_class": "measure",
         "value": 100,
         "source": {}  # Empty source
     }
     result = assert_has_source(record)
     assert not result.passed
     assert result.invariant_id == "INV-003"
 
 
 # ═══════════════════════════════════════════════════════════════
 # LAW 4: No schema without definition
 # ═══════════════════════════════════════════════════════════════
 
 def test_valid_schema_has_definition():
     result = assert_has_definition(VALID_SCHEMA)
     assert result.passed, result.message
 
 
 def test_schema_without_definition_fails():
     record = {
         "base_class": "schema",
         "definition": "short"  # Too short
     }
     result = assert_has_definition(record)
     assert not result.passed
     assert result.invariant_id == "INV-004"
 
 
 # ═══════════════════════════════════════════════════════════════
 # LAW 5: Valid base class
 # ═══════════════════════════════════════════════════════════════
 
 def test_valid_base_class_passes():
     record = {"base_class": "measure"}
     result = assert_valid_base_class(record)
     assert result.passed
 
 
 def test_invalid_base_class_fails():
     record = {"base_class": "invalid_class"}
     result = assert_valid_base_class(record)
     assert not result.passed
     assert result.invariant_id == "INV-005"
 
 
 # ═══════════════════════════════════════════════════════════════
 # FULL INVARIANT RUN
 # ═══════════════════════════════════════════════════════════════
 
 def test_valid_measure_passes_all_invariants():
     passed, results = run_invariants(VALID_MEASURE)
     assert passed, f"Violations: {[r.message for r in results if not r.passed]}"
 
 
 def test_enforce_invariants_raises_on_violation():
     bad_record = {
         "base_class": "measure",
         "value": 100
         # Missing: unit, temporal, source
     }
     with pytest.raises(ValueError) as exc_info:
         enforce_invariants(bad_record)
     assert "INVARIANT VIOLATION" in str(exc_info.value)
 
 
 # ═══════════════════════════════════════════════════════════════
 # FIRST TRUTH: Sweden Population 2023
 # ═══════════════════════════════════════════════════════════════
 
 def test_sweden_population_2023():
     """The first truth must pass all invariants."""
     sweden_pop = {
         "id": "core:measure:pop_se_2023:v1",
         "base_class": "measure",
         "schema_id": "core:schema:population_resident:v1",
         "entity_id": "core:entity:sweden:v1",
         "created_at": "2025-02-05T00:00:00Z",
         "created_by": "truth-engine:init",
         "value": 10551707,
         "unit": "persons",
         "temporal": {
             "observed_at": "2023-12-31T00:00:00Z",
             "valid_from": "2023-12-31T00:00:00Z",
             "valid_to": None
         },
         "source": {
             "source_id": "core:source:scb:v1",
             "source_version": "2024-02",
             "source_accessed_at": "2025-02-05T00:00:00Z"
         },
         "uncertainty": {
             "confidence_interval": [10551707, 10551707],
             "coverage": 0.99,
             "methodology_note": "Based on population register. Excludes unregistered persons."
         }
     }
     
     passed, results = run_invariants(sweden_pop)
     assert passed, f"First truth failed: {[r.message for r in results if not r.passed]}"
 
 
 if __name__ == "__main__":
     pytest.main([__file__, "-v"])