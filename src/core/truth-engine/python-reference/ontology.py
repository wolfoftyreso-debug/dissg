 """
 TRUTH ENGINE - CORE ONTOLOGY
 
 The 9 permitted base classes.
 NO OTHER TYPES MAY EXIST.
 
 This is the Python reference implementation for standalone deployment.
 The TypeScript version in ../core/ontology.ts is functionally identical.
 """
 
 from enum import Enum
 from dataclasses import dataclass
 from typing import Optional, Dict, Tuple
 from datetime import datetime
 
 
 class BaseType(Enum):
     """The 9 permitted base classes. No other types may exist."""
     ENTITY = "entity"
     ATTRIBUTE = "attribute"
     RELATION = "relation"
     EVENT = "event"
     MEASURE = "measure"
     SOURCE = "source"
     SCHEMA = "schema"
     VERSION = "version"
     CONCLUSION = "conclusion"
 
 
 @dataclass(frozen=True)
 class TemporalEnvelope:
     """Required for all objects."""
     observed_at: str  # ISO 8601
     valid_from: str   # ISO 8601
     valid_to: Optional[str] = None  # ISO 8601 or None for ongoing
 
 
 @dataclass(frozen=True)
 class SourceEnvelope:
     """Required for all data."""
     source_id: str
     source_version: str
     source_accessed_at: str
 
 
 @dataclass(frozen=True)
 class UncertaintyEnvelope:
     """Required for all measures."""
     confidence_interval: Tuple[float, float]
     coverage: float  # 0-1
     methodology_note: str
 
 
 @dataclass(frozen=True)
 class CoreObject:
     """Base for all truth engine objects."""
     id: str
     base_class: BaseType
     schema_id: str
     created_at: str
     created_by: str
 
 
 @dataclass(frozen=True)
 class Entity(CoreObject):
     """A thing that exists."""
     entity_type: str
     name: str
     identifiers: Dict[str, str]
 
 
 @dataclass(frozen=True)
 class Source(CoreObject):
     """Origin of data."""
     name: str
     organization: str
     url: Optional[str]
     reliability_score: float  # 0-1
     methodology_url: Optional[str]
 
 
 @dataclass(frozen=True)
 class Schema(CoreObject):
     """Definition of a measure."""
     name: str
     definition: str
     unit: str
     dimension: str
     version: int
     supersedes: Optional[str]
 
 
 @dataclass(frozen=True)
 class Measure(CoreObject):
     """A quantified observation."""
     entity_id: str
     value: float
     unit: str
     temporal: TemporalEnvelope
     source: SourceEnvelope
     uncertainty: UncertaintyEnvelope
 
 
 def is_valid_base_class(value: str) -> bool:
     """Type guard for base class validation."""
     try:
         BaseType(value)
         return True
     except ValueError:
         return False