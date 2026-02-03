# 🖥️ FRONTEND: REALITY INTERFACE SPECIFICATION

## "Operatörer av verkligheten, inte användare"

**Version**: 1.0  
**Status**: Canonical  
**Classification**: Core Experience Layer

---

## FOUNDATIONAL PRINCIPLE

> **This is not a website. This is a control panel for reality.**

We don't build interfaces for "looking at data."  
We build interfaces for **thinking in indices.**

The moment someone uses this, they should feel:
- "I see how things connect"
- "I can zoom into reality"
- "I can twist time"

---

# PART I: THE FOUR CANONICAL VIEWS

## 1.1 View Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                    REALITY INTERFACE VIEWS                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │   INDEX     │  │    TIME     │  │  RELATIONS  │  │ SIMULATION │ │
│  │    VIEW     │  │    VIEW     │  │    VIEW     │  │    VIEW    │ │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├────────────┤ │
│  │ Hierarchical│  │  Timeline   │  │   Graph     │  │  What-If   │ │
│  │ Relational  │  │  Scrubber   │  │   Nodes     │  │  Scenarios │ │
│  │ Filterable  │  │  Evolution  │  │   Arrows    │  │  Forecasts │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
│       ▲               ▲                ▲                 ▲         │
│       │               │                │                 │         │
│     FREE            FREE           FREE/SOFT          PREMIUM      │
│                                      LOCK                          │
│                                                                     │
│  ═══════════════════════════════════════════════════════════════   │
│  NO OTHER VIEWS. Everything maps to these four.                     │
│  ═══════════════════════════════════════════════════════════════   │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## VIEW 1: INDEX VIEW (Default)

### 1.1 Purpose

**"Google, but correct."**

The hierarchical, relational, filterable exploration of all indexed reality.

### 1.2 Structure

```typescript
interface IndexView {
  mode: 'hierarchy' | 'flat' | 'grid';
  
  // Navigation
  navigation: {
    breadcrumb: BreadcrumbPath;      // Economy → Inflation → Sweden → Region
    current_node: IndexNode;
    children: IndexNode[];
    siblings: IndexNode[];
    parent: IndexNode | null;
  };
  
  // Filtering
  filters: {
    jurisdiction: JurisdictionFilter;
    time_range: TimeRangeFilter;
    category: CategoryFilter[];
    confidence: ConfidenceFilter;
    source_type: SourceTypeFilter;
  };
  
  // Display
  display: {
    sort: SortConfig;
    density: 'compact' | 'normal' | 'expanded';
    show_metadata: boolean;
    show_relations: boolean;
  };
}

interface IndexNode {
  id: GlobalHash;
  type: 'category' | 'domain' | 'indicator' | 'claim';
  
  // Identity
  title: string;
  slug: string;
  description: string;
  
  // Hierarchy
  level: number;
  path: string[];                    // ['economy', 'inflation', 'cpi']
  children_count: number;
  
  // Current value (if applicable)
  current_value: {
    value: ClaimValue;
    observed_at: ISO8601;
    confidence: number;
  } | null;
  
  // Always visible metadata
  metadata: {
    jurisdiction: JurisdictionBadge;
    source: SourceBadge;
    validity: ValidityBadge;
    confidence: ConfidenceBadge;
  };
  
  // Quick stats
  stats: {
    total_claims: number;
    versions: number;
    relations: number;
    last_updated: ISO8601;
  };
}
```

### 1.3 Visual Design

```
┌────────────────────────────────────────────────────────────────────┐
│  REALITY INDEX                                    [🔍] [≡] [⚙️]    │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📍 Economy › Inflation › Consumer Prices › Sweden                 │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  FILTER: 🌍 Sweden  📅 2020-2024  📊 All Sources  ⚡ >0.7    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │                                                                ││
│  │  📈 Consumer Price Index (CPI)                                 ││
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                ││
│  │  Current: 412.3 (index 1980=100)                               ││
│  │  Change: +2.1% YoY                                             ││
│  │                                                                ││
│  │  ┌────────────────────────────────────────────────────────┐   ││
│  │  │ 📍 Sweden  │ 📅 Valid: 2024-01 → current │ ⚡ 1.0      │   ││
│  │  │ 📄 SCB    │ 🔗 12 relations              │ 📊 Official │   ││
│  │  └────────────────────────────────────────────────────────┘   ││
│  │                                                                ││
│  │  └─ 📁 By Region (21)                                         ││
│  │  └─ 📁 By Category (12)                                       ││
│  │  └─ 📁 Historical (480 versions)                              ││
│  │                                                                ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │  📈 Producer Price Index (PPI)                                 ││
│  │  ...                                                           ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### 1.4 Interaction Model

```typescript
const INDEX_INTERACTIONS = {
  // Always free
  free: [
    'navigate_hierarchy',
    'filter_by_jurisdiction',
    'filter_by_time',
    'view_metadata',
    'view_current_value',
    'follow_relation',
    'copy_link',
  ],
  
  // Soft lock (show but restrict)
  soft_locked: [
    'compare_jurisdictions',     // 🔒 Show preview, lock action
    'bulk_export',               // 🔒 "Export 50 items" → login
    'create_watchlist',          // 🔒 "Save for later" → login
  ],
  
  // Hard lock (premium)
  premium: [
    'create_custom_relation',
    'build_private_index',
    'api_access',
  ],
};
```

---

## VIEW 2: TIME VIEW

### 2.1 Purpose

**"Drag through time. See reality evolve."**

The temporal dimension is our most powerful asset. No one else has verified history.

### 2.2 Structure

```typescript
interface TimeView {
  // Time control
  timeline: {
    range: TimeRange;
    resolution: 'day' | 'week' | 'month' | 'quarter' | 'year';
    current_position: ISO8601;
    playing: boolean;
    playback_speed: number;
  };
  
  // What's displayed
  subjects: TimeViewSubject[];
  
  // Events layer
  events: {
    show_events: boolean;
    event_types: EventType[];
    event_markers: TimelineEvent[];
  };
  
  // Version tracking
  versions: {
    show_version_changes: boolean;
    highlight_supersessions: boolean;
  };
}

interface TimeViewSubject {
  id: GlobalHash;
  type: 'indicator' | 'index' | 'jurisdiction';
  
  // Time series
  series: TimeSeriesPoint[];
  
  // Version history
  version_history: VersionHistoryPoint[];
  
  // Styling
  style: {
    color: string;
    line_type: 'solid' | 'dashed';
    show_confidence_band: boolean;
  };
}

interface TimeSeriesPoint {
  timestamp: ISO8601;
  value: number;
  confidence: number;
  confidence_interval: [number, number] | null;
  version_id: GlobalHash;
  flags: DataFlag[];
}

interface TimelineEvent {
  id: string;
  type: 'decision' | 'law' | 'supersession' | 'methodology_change';
  timestamp: ISO8601;
  title: string;
  description: string;
  affects: GlobalHash[];          // Which indices affected
  source: SourceReference;
}
```

### 2.3 Visual Design

```
┌────────────────────────────────────────────────────────────────────┐
│  TIME VIEW                                        [🔍] [≡] [⚙️]    │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📈 Consumer Price Index (CPI) - Sweden                            │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                                                              │  │
│  │     450 ┤                                          ╭───      │  │
│  │         │                                      ╭───╯         │  │
│  │     400 ┤                              ╭───────╯             │  │
│  │         │                          ╭───╯                     │  │
│  │     350 ┤                      ╭───╯                         │  │
│  │         │                  ╭───╯                             │  │
│  │     300 ┤              ╭───╯                                 │  │
│  │         │          ╭───╯                                     │  │
│  │     250 ┤      ╭───╯                                         │  │
│  │         │  ╭───╯                                             │  │
│  │     200 ┼──╯                                                 │  │
│  │         └────┬────┬────┬────┬────┬────┬────┬────┬────┬────   │  │
│  │           2015  2016  2017  2018  2019  2020  2021  2022     │  │
│  │                           ▲         ▲                        │  │
│  │                           │         │                        │  │
│  │                     [Methodology]  [COVID                    │  │
│  │                       change]      adjustment]               │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ ◀◀  ◀  [═══════════════════════●═══════════════════] ▶  ▶▶  │  │
│  │        2015                   2020                   2024    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  📍 EVENTS AT POSITION                                             │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 📅 2020-03-11: WHO declares COVID-19 pandemic                │  │
│  │    → Affects: CPI, GDP, Unemployment + 147 more              │  │
│  │ 📅 2020-01-01: Methodology update v2.3                       │  │
│  │    → SCB revised seasonal adjustment                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │ 📄 SCB  │ 📅 Showing: Jan 2020  │ ⚡ 1.0  │ Version: v47     ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### 2.4 Time Interactions

```typescript
const TIME_INTERACTIONS = {
  // Always free
  free: [
    'scrub_timeline',
    'zoom_in_out',
    'view_events',
    'view_version_history',
    'compare_two_points',
  ],
  
  // Soft lock
  soft_locked: [
    'overlay_multiple_indices',   // 🔒 Add 3rd index → login
    'export_time_series',         // 🔒 "Download CSV" → login
    'set_alerts',                 // 🔒 "Notify on change" → premium
  ],
  
  // Premium
  premium: [
    'predictive_projection',
    'custom_date_ranges',
    'api_historical_access',
  ],
};
```

---

## VIEW 3: RELATIONS VIEW

### 3.1 Purpose

**"See causes and effects. Understand dependencies."**

This is Palantir-level capability — but for all of society.

### 3.2 Structure

```typescript
interface RelationsView {
  // Graph state
  graph: {
    nodes: RelationNode[];
    edges: RelationEdge[];
    layout: 'force' | 'hierarchical' | 'radial' | 'timeline';
  };
  
  // Focus
  focus: {
    center_node: GlobalHash | null;
    depth: number;                   // How many levels to show
    direction: 'all' | 'upstream' | 'downstream';
  };
  
  // Filtering
  filters: {
    relation_types: RelationType[];
    min_confidence: number;
    jurisdiction_scope: JurisdictionScope;
  };
  
  // Analysis
  analysis: {
    show_impact_paths: boolean;
    highlight_critical_dependencies: boolean;
    calculate_propagation: boolean;  // Premium
  };
}

interface RelationNode {
  id: GlobalHash;
  type: IndexEntityType;
  
  // Display
  label: string;
  size: 'small' | 'medium' | 'large';  // Based on importance
  color: string;                        // Based on category
  
  // Metadata preview
  preview: {
    current_value: ClaimValue | null;
    confidence: number;
    jurisdiction: string;
    last_updated: ISO8601;
  };
  
  // Graph metrics
  metrics: {
    in_degree: number;           // How many depend on this
    out_degree: number;          // How many this depends on
    centrality: number;          // Graph importance
  };
}

interface RelationEdge {
  id: string;
  source: GlobalHash;
  target: GlobalHash;
  
  type: RelationType;
  
  // Edge properties
  properties: {
    strength: number | null;
    confidence: number;
    lag: Duration | null;
    direction: 'unidirectional' | 'bidirectional';
  };
  
  // Display
  style: {
    width: number;               // Based on strength
    color: string;               // Based on type
    dashed: boolean;             // If confidence < 0.8
    animated: boolean;           // If showing flow
  };
}
```

### 3.3 Visual Design

```
┌────────────────────────────────────────────────────────────────────┐
│  RELATIONS VIEW                                   [🔍] [≡] [⚙️]    │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Showing: Dependencies of "Consumer Price Index (CPI)"            │
│  Depth: 2 levels  │  Direction: All  │  Types: All                │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                                                              │  │
│  │         ┌─────────┐                                          │  │
│  │         │ Oil     │                                          │  │
│  │         │ Price   │─────────────────┐                        │  │
│  │         └─────────┘                 │                        │  │
│  │              │                      │                        │  │
│  │              ▼                      ▼                        │  │
│  │         ┌─────────┐           ┌─────────┐                    │  │
│  │         │ Import  │──────────▶│ Producer│                    │  │
│  │         │ Prices  │           │  Prices │                    │  │
│  │         └─────────┘           └─────────┘                    │  │
│  │              │                      │                        │  │
│  │              │         ┌────────────┘                        │  │
│  │              ▼         ▼                                     │  │
│  │         ┌─────────────────┐                                  │  │
│  │         │     ★ CPI ★     │◀─────────────┐                   │  │
│  │         │  (Focus Node)   │              │                   │  │
│  │         └─────────────────┘              │                   │  │
│  │              │         │            ┌─────────┐              │  │
│  │              │         │            │ Wage    │              │  │
│  │              ▼         ▼            │ Index   │              │  │
│  │         ┌─────────┐ ┌─────────┐     └─────────┘              │  │
│  │         │ Pension │ │ Contract│                              │  │
│  │         │ Index   │ │ Adjust  │                              │  │
│  │         └─────────┘ └─────────┘                              │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  LEGEND                                                            │
│  ──────── depends_on    ─ ─ ─ ─  correlates_with                  │
│  ━━━━━━━━ regulates     ════════ supersedes                       │
│                                                                     │
│  SELECTED EDGE: Oil Price → CPI                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Type: correlates_with │ Strength: 0.72 │ Lag: 3 months      │  │
│  │ Confidence: 0.85 │ Method: computed │ Evidence: 47 points   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 🔒 Create Custom Relation    🔒 Build Private Graph          │  │
│  │     [Upgrade to Analyst]         [Upgrade to Analyst]        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### 3.4 Relations Interactions

```typescript
const RELATIONS_INTERACTIONS = {
  // Always free
  free: [
    'explore_graph',
    'zoom_pan',
    'view_edge_details',
    'change_layout',
    'filter_relation_types',
    'change_depth',
  ],
  
  // Soft lock
  soft_locked: [
    'trace_impact_path',          // 🔒 "Show full chain" → login
    'export_graph',               // 🔒 "Download graph" → login
    'save_view',                  // 🔒 "Save this view" → login
  ],
  
  // Premium (creates serious value)
  premium: [
    'create_custom_relation',     // 🔒 Analyst tier
    'build_private_graph',        // 🔒 Analyst tier
    'calculate_propagation',      // 🔒 Institutional tier
    'api_graph_access',           // 🔒 Institutional tier
  ],
};
```

---

## VIEW 4: SIMULATION VIEW (Premium)

### 4.1 Purpose

**"What if this changes? What happens next?"**

This is where people pay without hesitation.

### 4.2 Structure

```typescript
interface SimulationView {
  // Scenario definition
  scenario: {
    id: UUID;
    name: string;
    description: string;
    
    // What changes
    interventions: Intervention[];
    
    // Constraints
    constraints: SimulationConstraint[];
  };
  
  // Simulation engine
  engine: {
    method: 'monte_carlo' | 'bayesian' | 'historical_analog';
    iterations: number;
    confidence_level: number;
    time_horizon: Duration;
  };
  
  // Results
  results: SimulationResult | null;
  
  // Comparison
  comparison: {
    baseline: 'current' | 'historical_scenario';
    compare_to: UUID[];           // Other scenario IDs
  };
}

interface Intervention {
  target_id: GlobalHash;
  type: 'set_value' | 'change_percent' | 'remove' | 'add_relation';
  value: any;
  effective_from: ISO8601;
  effective_to: ISO8601 | null;
}

interface SimulationResult {
  scenario_id: UUID;
  computed_at: ISO8601;
  
  // Affected indices
  impacts: Impact[];
  
  // Propagation timeline
  propagation: PropagationStep[];
  
  // Confidence
  confidence: {
    overall: number;
    by_step: Record<number, number>;
  };
  
  // Warnings
  warnings: SimulationWarning[];
}

interface Impact {
  target_id: GlobalHash;
  target_name: string;
  
  // Effect
  effect: {
    baseline_value: number;
    projected_value: number;
    change_absolute: number;
    change_percent: number;
    confidence_interval: [number, number];
  };
  
  // Timing
  timing: {
    first_impact: ISO8601;
    peak_impact: ISO8601;
    stabilization: ISO8601 | null;
  };
  
  // Causation path
  causation_path: GlobalHash[];
}
```

### 4.3 Visual Design

```
┌────────────────────────────────────────────────────────────────────┐
│  SIMULATION VIEW                                  [🔍] [≡] [⚙️]    │
│  🔒 PREMIUM FEATURE                                                │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  SCENARIO: "What if oil price increases 20%?"                      │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ INTERVENTION                                                 │  │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━               │  │
│  │ Target: Oil Price (Brent Crude)                              │  │
│  │ Action: Increase by 20%                                      │  │
│  │ From: 2024-06-01  To: indefinite                             │  │
│  │                                                              │  │
│  │ [+ Add another intervention]                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ PROJECTED IMPACTS (47 indices affected)                      │  │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━               │  │
│  │                                                              │  │
│  │ 📈 Consumer Price Index (CPI)                                │  │
│  │    +2.3% to +4.1% (95% CI)                                   │  │
│  │    Peak impact: Month 6  │  Confidence: 0.82                 │  │
│  │    Path: Oil → Import Prices → Producer Prices → CPI        │  │
│  │                                                              │  │
│  │ 📈 Transportation Index                                      │  │
│  │    +5.2% to +8.7% (95% CI)                                   │  │
│  │    Peak impact: Month 2  │  Confidence: 0.91                 │  │
│  │    Path: Oil → Fuel Prices → Transportation                 │  │
│  │                                                              │  │
│  │ 📉 GDP Growth                                                │  │
│  │    -0.3% to -0.8% (95% CI)                                   │  │
│  │    Peak impact: Month 9  │  Confidence: 0.67                 │  │
│  │    Path: Oil → CPI → Consumption → GDP                      │  │
│  │                                                              │  │
│  │ [Show all 47 impacts...]                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ PROPAGATION TIMELINE                                         │  │
│  │                                                              │  │
│  │  Month 0   Month 3   Month 6   Month 9   Month 12           │  │
│  │    │         │         │         │         │                 │  │
│  │    ●─────────●─────────●─────────●─────────●                 │  │
│  │    ▲         ▲         ▲         ▲         ▲                 │  │
│  │   Oil     Import     CPI      GDP       Long-term           │  │
│  │  shock    prices   impact   impact    adjustment            │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ⚠️ LIMITATIONS                                                    │
│  • Simulation assumes no policy response                           │
│  • Based on historical correlations 2010-2024                      │
│  • Does not account for supply chain disruptions                   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ [Export Report]  [Save Scenario]  [Share with Team]          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### 4.4 Simulation Access Control

```typescript
const SIMULATION_ACCESS = {
  // Preview only (free users see this)
  preview: {
    can_see: true,
    can_interact: false,
    message: 'Simulation is an Analyst feature. See what's possible.',
    demo_scenario: true,            // Show pre-built demo
  },
  
  // Analyst tier
  analyst: {
    can_see: true,
    can_interact: true,
    interventions_limit: 3,
    scenarios_limit: 10,
    methods: ['historical_analog'],
    export: true,
  },
  
  // Institutional tier
  institutional: {
    can_see: true,
    can_interact: true,
    interventions_limit: null,      // Unlimited
    scenarios_limit: null,
    methods: ['monte_carlo', 'bayesian', 'historical_analog'],
    export: true,
    api_access: true,
    team_sharing: true,
  },
};
```

---

# PART II: ALWAYS-VISIBLE METADATA

## 2.1 The Sacred Four

> **Every claim, every node, every view MUST show:**
> - **Source**
> - **Validity**
> - **Jurisdiction**
> - **Confidence**

Never hidden. Never collapsed. Never optional.

```typescript
interface MetadataBadges {
  // Always visible in compact form
  compact: {
    source: {
      icon: '📄' | '🏛️' | '📊';
      code: string;           // "SCB", "EU", "WHO"
      tooltip: string;        // Full name + link
    };
    
    validity: {
      icon: '📅';
      status: 'current' | 'historical' | 'superseded' | 'pending';
      date_range: string;     // "Jan 2024 → current"
    };
    
    jurisdiction: {
      icon: '📍';
      code: string;           // "SE", "EU", "Global"
      flag: string;           // 🇸🇪, 🇪🇺, 🌍
    };
    
    confidence: {
      icon: '⚡';
      score: number;          // 0.95
      label: string;          // "Official"
      color: string;          // Green for >0.8, yellow for 0.5-0.8, etc.
    };
  };
  
  // Expanded on hover/click
  expanded: {
    source: {
      full_name: string;
      authority_type: string;
      access_url: URL;
      access_date: ISO8601;
      methodology_url: URL | null;
    };
    
    validity: {
      observed_at: ISO8601;
      valid_from: ISO8601;
      valid_to: ISO8601 | null;
      superseded_by: GlobalHash | null;
      version: SemanticVersion;
    };
    
    jurisdiction: {
      scope: JurisdictionScope;
      country: CountryInfo;
      region: RegionInfo | null;
      applies_to: string[];
    };
    
    confidence: {
      score: number;
      method: ConfidenceMethod;
      factors: ConfidenceFactors;
      quality_flags: string[];
    };
  };
}
```

## 2.2 Badge Component

```tsx
// MetadataBadge.tsx
interface MetadataBadgeProps {
  source: SourceInfo;
  validity: ValidityInfo;
  jurisdiction: JurisdictionInfo;
  confidence: ConfidenceInfo;
  variant: 'inline' | 'card' | 'expanded';
}

function MetadataBadge({ 
  source, 
  validity, 
  jurisdiction, 
  confidence,
  variant 
}: MetadataBadgeProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 text-xs",
      variant === 'inline' && "flex-wrap",
      variant === 'card' && "flex-col items-start",
      variant === 'expanded' && "grid grid-cols-2 gap-4"
    )}>
      {/* Source */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="gap-1">
              <span>{source.icon}</span>
              <span>{source.code}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p className="font-medium">{source.full_name}</p>
              <p className="text-muted-foreground">{source.authority_type}</p>
              <a href={source.access_url} className="text-primary hover:underline">
                View source →
              </a>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* Validity */}
      <Badge variant={getValidityVariant(validity.status)} className="gap-1">
        <span>📅</span>
        <span>{validity.date_range}</span>
      </Badge>
      
      {/* Jurisdiction */}
      <Badge variant="outline" className="gap-1">
        <span>{jurisdiction.flag}</span>
        <span>{jurisdiction.code}</span>
      </Badge>
      
      {/* Confidence */}
      <Badge 
        variant="outline" 
        className={cn("gap-1", getConfidenceColor(confidence.score))}
      >
        <span>⚡</span>
        <span>{(confidence.score * 100).toFixed(0)}%</span>
        <span className="text-muted-foreground">({confidence.label})</span>
      </Badge>
    </div>
  );
}
```

## 2.3 Why This Matters

```
┌────────────────────────────────────────────────────────────────────┐
│                    WHY ALWAYS-VISIBLE METADATA                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  JOURNALISTS TRUST US                                               │
│  → They can verify every claim                                      │
│  → They can cite us confidently                                     │
│  → They link to us instead of PDFs                                  │
│                                                                     │
│  LAWYERS CAN USE US                                                 │
│  → Every claim has legal provenance                                 │
│  → Versioning provides audit trail                                  │
│  → Jurisdiction is always clear                                     │
│                                                                     │
│  AUTHORITIES CAN'T IGNORE US                                        │
│  → We're more rigorous than they are                                │
│  → We cite their own sources                                        │
│  → We're transparent where they're not                              │
│                                                                     │
│  AI CAN REASON CORRECTLY                                            │
│  → Confidence scores enable weighted reasoning                      │
│  → Temporal validity prevents hallucination                         │
│  → Source chains enable verification                                │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

# PART III: ACCESS CONTROL ARCHITECTURE

## 3.1 The Freemium Gradient

```typescript
const ACCESS_LEVELS = {
  // Anonymous (no account)
  anonymous: {
    description: 'Full read access. No barriers to understanding.',
    
    can_do: [
      'navigate_all_indices',
      'view_all_data',
      'view_all_metadata',
      'view_all_relations',
      'view_time_series',
      'copy_links',
      'share_to_social',
    ],
    
    soft_locked: [
      'compare_3plus_indices',
      'export_data',
      'create_watchlist',
    ],
    
    hard_locked: [
      'create_relations',
      'simulation',
      'api_access',
    ],
    
    limits: {
      rate_limit: '100 requests/day',
      time_series_depth: '5 years',
      relation_depth: 2,
    },
  },
  
  // Observer (free account)
  observer: {
    description: 'Tracked access. Saves preferences.',
    
    inherits: 'anonymous',
    
    unlocks: [
      'compare_unlimited_indices',
      'save_views',
      'create_watchlist',
      'email_alerts',
    ],
    
    soft_locked: [
      'export_data',
      'bulk_operations',
    ],
    
    limits: {
      rate_limit: '1000 requests/day',
      time_series_depth: '10 years',
      relation_depth: 3,
      watchlist_size: 20,
    },
  },
  
  // Analyst (paid)
  analyst: {
    description: 'Professional tools. Create and analyze.',
    price: '€99-299/month',
    
    inherits: 'observer',
    
    unlocks: [
      'export_data',
      'create_custom_relations',
      'build_private_indices',
      'simulation_basic',
      'scenario_lab',
      'api_read_access',
    ],
    
    limits: {
      rate_limit: '10000 requests/day',
      time_series_depth: 'unlimited',
      relation_depth: 'unlimited',
      private_indices: 10,
      scenarios: 25,
      api_requests: '5000/day',
    },
  },
  
  // Institutional (enterprise)
  institutional: {
    description: 'Full platform access. Team features.',
    price: '€2000-20000/month',
    
    inherits: 'analyst',
    
    unlocks: [
      'simulation_advanced',
      'api_full_access',
      'bulk_export',
      'team_accounts',
      'custom_integrations',
      'priority_support',
      'cross_jurisdiction_analysis',
    ],
    
    limits: {
      rate_limit: 'custom',
      everything: 'unlimited',
    },
  },
};
```

## 3.2 Soft Lock UI Pattern

```tsx
// SoftLock.tsx
interface SoftLockProps {
  feature: string;
  requiredTier: 'observer' | 'analyst' | 'institutional';
  preview?: ReactNode;          // What to show as teaser
  children: ReactNode;          // Actual feature UI
}

function SoftLock({ feature, requiredTier, preview, children }: SoftLockProps) {
  const { user, tier } = useAuth();
  const hasAccess = checkAccess(tier, requiredTier);
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  return (
    <div className="relative group">
      {/* Blurred/dimmed preview */}
      <div className="opacity-50 pointer-events-none blur-[2px]">
        {preview || children}
      </div>
      
      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/80">
        <Card className="p-6 max-w-sm text-center">
          <LockIcon className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">{feature}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {getFeatureDescription(feature)}
          </p>
          <Button onClick={() => showUpgradeModal(requiredTier)}>
            {user ? `Upgrade to ${requiredTier}` : 'Create free account'}
          </Button>
        </Card>
      </div>
    </div>
  );
}

// Usage
function ExportButton({ data }: { data: IndexData }) {
  return (
    <SoftLock 
      feature="Export Data" 
      requiredTier="analyst"
      preview={
        <Button disabled>
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export 47 items
        </Button>
      }
    >
      <ExportDialog data={data} />
    </SoftLock>
  );
}
```

## 3.3 The "Desire Architecture"

```
┌────────────────────────────────────────────────────────────────────┐
│                    DESIRE ARCHITECTURE                              │
│                    (How to make people pay)                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PRINCIPLE: Show 100% of data. Lock 0% of truth.                   │
│             Lock only ACTION and CAPABILITY.                        │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │                                                                ││
│  │  FREE                          │  PAID                         ││
│  │  ────                          │  ────                         ││
│  │  • See everything              │  • Do everything              ││
│  │  • Understand everything       │  • Create                     ││
│  │  • Navigate everything         │  • Simulate                   ││
│  │  • Verify everything           │  • Export                     ││
│  │  • Share links                 │  • Build on top               ││
│  │                                │  • Predict                    ││
│  │                                                                ││
│  │  ⬇️                              ⬇️                             ││
│  │  "I know what's happening"     "I can act on what I know"     ││
│  │                                                                ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  THE FEELING WE CREATE:                                             │
│                                                                     │
│  "Everything is here. I just can't use it yet."                    │
│                                                                     │
│  This is infinitely more powerful than:                            │
│  "Some data is hidden. I don't know what I'm missing."             │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

# PART IV: NO LOGIN UNTIL NECESSARY

## 4.1 Login Triggers

```typescript
const LOGIN_TRIGGERS = {
  // NEVER require login for
  never: [
    'viewing_data',
    'navigating_indices',
    'viewing_metadata',
    'following_relations',
    'viewing_time_series',
    'copying_links',
    'reading_documentation',
  ],
  
  // Require login ONLY when
  required_for: [
    'saving_views',
    'creating_watchlists',
    'setting_alerts',
    'accessing_api',
    'creating_relations',
    'running_simulations',
    'exporting_data',
    'team_features',
  ],
  
  // The conversion moment
  conversion_triggers: [
    {
      action: 'compare_3rd_index',
      message: 'Compare unlimited indices with a free account',
      friction: 'low',
    },
    {
      action: 'save_view',
      message: 'Save this view for later',
      friction: 'low',
    },
    {
      action: 'export_csv',
      message: 'Export requires an Analyst account',
      friction: 'high',
    },
    {
      action: 'run_simulation',
      message: 'Simulation is an Analyst feature',
      friction: 'high',
    },
  ],
};
```

## 4.2 Why This Matters

```
┌────────────────────────────────────────────────────────────────────┐
│                    ZERO-FRICTION ACCESS                             │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  GOOGLE CAN INDEX EVERYTHING                                        │
│  → Every page is accessible                                         │
│  → Every URL is stable                                              │
│  → Schema.org markup everywhere                                     │
│  → We become the authoritative source                               │
│                                                                     │
│  LLMs CAN READ EVERYTHING                                           │
│  → No authentication barriers                                       │
│  → Structured data throughout                                       │
│  → Perfect for RAG systems                                          │
│  → They cite us, not sources                                        │
│                                                                     │
│  THRESHOLD IS ZERO                                                  │
│  → Anyone can verify a claim                                        │
│  → Anyone can follow a link                                         │
│  → Anyone can understand data                                       │
│  → Trust builds without commitment                                  │
│                                                                     │
│  CONVERSION IS BRUTAL                                               │
│  → People already know value                                        │
│  → They've invested time                                            │
│  → They hit walls at exact right moment                             │
│  → Decision is obvious                                              │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

# PART V: COMPONENT ARCHITECTURE

## 5.1 Core Components

```typescript
// Core view components
const CORE_COMPONENTS = {
  views: {
    IndexExplorer: 'Main index navigation and hierarchy',
    TimelineView: 'Temporal exploration with scrubber',
    RelationGraph: 'Interactive relation visualization',
    SimulationLab: 'What-if scenario builder',
  },
  
  shared: {
    MetadataBadge: 'Always-visible source/validity/jurisdiction/confidence',
    IndexNode: 'Single index item with metadata',
    ClaimCard: 'Individual claim with full context',
    RelationEdge: 'Single relation with properties',
    TimeSeriesChart: 'Time series with events layer',
    SearchBar: 'Global index search',
    FilterPanel: 'Filtering across all dimensions',
    BreadcrumbNav: 'Hierarchical navigation',
  },
  
  premium: {
    SoftLock: 'Upgrade prompt overlay',
    ExportDialog: 'Data export interface',
    SimulationBuilder: 'Scenario configuration',
    PrivateIndexCreator: 'Custom index builder',
    CompareView: 'Multi-index comparison',
  },
  
  utility: {
    ConfidenceIndicator: 'Visual confidence display',
    JurisdictionSelector: 'Jurisdiction picker with flags',
    TimeRangePicker: 'Date range selection',
    SourceLink: 'Link to original source',
    VersionHistory: 'Object version timeline',
  },
};
```

## 5.2 State Management

```typescript
// Global state structure
interface AppState {
  // Navigation
  navigation: {
    currentView: 'index' | 'time' | 'relations' | 'simulation';
    breadcrumb: string[];
    focusedNode: GlobalHash | null;
  };
  
  // Filters (persist across views)
  filters: {
    jurisdiction: JurisdictionFilter;
    timeRange: TimeRange;
    categories: string[];
    minConfidence: number;
    sourceTypes: string[];
  };
  
  // View-specific state
  indexView: IndexViewState;
  timeView: TimeViewState;
  relationsView: RelationsViewState;
  simulationView: SimulationViewState;
  
  // User state
  user: {
    tier: AccessTier;
    preferences: UserPreferences;
    watchlist: GlobalHash[];
    savedViews: SavedView[];
  };
  
  // Cache
  cache: {
    indices: Map<GlobalHash, IndexObject>;
    relations: Map<string, Relation>;
    timeSeries: Map<string, TimeSeriesData>;
  };
}
```

---

# PART VI: URL STRUCTURE (SEO-Critical)

## 6.1 Canonical URLs

```typescript
const URL_STRUCTURE = {
  // Index view
  index: {
    root: '/index',
    category: '/index/:category',                    // /index/economy
    domain: '/index/:category/:domain',              // /index/economy/inflation
    indicator: '/index/:category/:domain/:slug',     // /index/economy/inflation/cpi-sweden
    jurisdiction: '/index/:category/:domain/:slug/:jurisdiction',
  },
  
  // Time view
  time: {
    indicator: '/time/:slug',                        // /time/cpi-sweden
    range: '/time/:slug/:from/:to',                  // /time/cpi-sweden/2020-01/2024-01
  },
  
  // Relations view
  relations: {
    node: '/relations/:slug',                        // /relations/cpi-sweden
    edge: '/relations/:source/:target',              // /relations/cpi-sweden/pension-index
  },
  
  // Direct claim access
  claim: {
    by_hash: '/claim/:hash',                         // /claim/abc123...
    by_slug: '/data/:slug',                          // /data/cpi-sweden-2024-01
    version: '/data/:slug/v/:version',               // /data/cpi-sweden-2024-01/v/1.2.3
  },
  
  // API (mirrors web)
  api: {
    index: '/api/v1/index/:path*',
    claim: '/api/v1/claim/:hash',
    time: '/api/v1/time/:slug',
    relations: '/api/v1/relations/:slug',
  },
};
```

## 6.2 Schema.org Integration

```typescript
// Every page includes structured data
function generateStructuredData(claim: IndexClaim): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    
    // Identity
    '@id': claim.canonical_url,
    identifier: claim.id,
    name: claim.title,
    description: claim.claim.statement,
    
    // Creator/Publisher
    creator: {
      '@type': 'Organization',
      name: claim.source.authority.name,
      url: claim.source.access_url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Reality Index',
      url: 'https://reality.index',
    },
    
    // Temporal
    temporalCoverage: `${claim.time.valid_from}/${claim.time.valid_to || '..'}`,
    datePublished: claim.immutability.created_at,
    dateModified: claim.time.observed_at,
    
    // Spatial
    spatialCoverage: {
      '@type': 'Place',
      name: claim.jurisdiction.country,
      geo: claim.jurisdiction.custom_area,
    },
    
    // Quality
    measurementTechnique: claim.confidence.method,
    variableMeasured: {
      '@type': 'PropertyValue',
      name: claim.claim.statement,
      value: claim.claim.value.value,
      unitText: claim.claim.unit,
    },
    
    // Relations
    isBasedOn: claim.relations
      .filter(r => r.type === 'derived_from')
      .map(r => ({ '@id': r.target_id })),
    
    // Versioning
    version: `${claim.immutability.version.major}.${claim.immutability.version.minor}`,
    isPartOf: {
      '@type': 'DataCatalog',
      name: 'Reality Index Global Catalog',
    },
  };
}
```

---

# PART VII: THE RESULT

## 7.1 When Frontend Works

```
┌────────────────────────────────────────────────────────────────────┐
│                    FRONTEND SUCCESS METRICS                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PEOPLE LINK TO US                                                  │
│  → Wikipedia cites our indices                                      │
│  → News articles embed our charts                                   │
│  → Reports reference our URLs                                       │
│  → Academic papers cite our claims                                  │
│                                                                     │
│  PEOPLE USE US IN DECISIONS                                         │
│  → Policy briefs reference our data                                 │
│  → Consultants build on our analysis                                │
│  → Journalists verify with us                                       │
│  → Citizens understand because of us                                │
│                                                                     │
│  PEOPLE BUILD ON TOP                                                │
│  → Dashboards embed our API                                         │
│  → Tools integrate our data                                         │
│  → LLMs ground in our facts                                         │
│  → Systems depend on our structure                                  │
│                                                                     │
│  ═══════════════════════════════════════════════════════════════   │
│                                                                     │
│  AT THIS POINT, WE ARE NOT A PRODUCT.                               │
│                                                                     │
│  WE ARE:                                                            │
│                                                                     │
│  ╔═══════════════════════════════════════════════════════════════╗ │
│  ║  INFRASTRUCTURE EVERYONE ASSUMES EXISTS                        ║ │
│  ╚═══════════════════════════════════════════════════════════════╝ │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

**END OF FRONTEND SPECIFICATION**

*"The interface is not for looking at data. It's for thinking in indices."*
