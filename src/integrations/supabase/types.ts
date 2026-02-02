export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      action_evaluations: {
        Row: {
          action_id: string
          confidence_level: number
          cost_rationale: string
          cost_score: number
          dependencies: string[] | null
          effect_rationale: string
          effect_score: number
          evaluated_at: string
          evaluation_context: Json | null
          id: string
          kpi_impact_forecast: Json | null
          model_used: string
          potential_side_effects: string[] | null
          priority: Database["public"]["Enums"]["priority_level"]
          recommendation: string
          reversibility_rationale: string
          reversibility_score: number
          risk_rationale: string
          risk_score: number
          summary: string
          weighted_score: number
        }
        Insert: {
          action_id: string
          confidence_level?: number
          cost_rationale: string
          cost_score: number
          dependencies?: string[] | null
          effect_rationale: string
          effect_score: number
          evaluated_at?: string
          evaluation_context?: Json | null
          id?: string
          kpi_impact_forecast?: Json | null
          model_used?: string
          potential_side_effects?: string[] | null
          priority: Database["public"]["Enums"]["priority_level"]
          recommendation: string
          reversibility_rationale: string
          reversibility_score: number
          risk_rationale: string
          risk_score: number
          summary: string
          weighted_score: number
        }
        Update: {
          action_id?: string
          confidence_level?: number
          cost_rationale?: string
          cost_score?: number
          dependencies?: string[] | null
          effect_rationale?: string
          effect_score?: number
          evaluated_at?: string
          evaluation_context?: Json | null
          id?: string
          kpi_impact_forecast?: Json | null
          model_used?: string
          potential_side_effects?: string[] | null
          priority?: Database["public"]["Enums"]["priority_level"]
          recommendation?: string
          reversibility_rationale?: string
          reversibility_score?: number
          risk_rationale?: string
          risk_score?: number
          summary?: string
          weighted_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "action_evaluations_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "action_options"
            referencedColumns: ["id"]
          },
        ]
      }
      action_options: {
        Row: {
          category: string
          created_at: string
          description: string
          estimated_cost_sek: number | null
          estimated_timeframe_months: number | null
          external_references: Json | null
          id: string
          proposed_at: string
          proposed_by: string | null
          responsible_department: string
          source_document: string | null
          status: Database["public"]["Enums"]["action_status"]
          target_kpi_ids: string[]
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          estimated_cost_sek?: number | null
          estimated_timeframe_months?: number | null
          external_references?: Json | null
          id?: string
          proposed_at?: string
          proposed_by?: string | null
          responsible_department: string
          source_document?: string | null
          status?: Database["public"]["Enums"]["action_status"]
          target_kpi_ids?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          estimated_cost_sek?: number | null
          estimated_timeframe_months?: number | null
          external_references?: Json | null
          id?: string
          proposed_at?: string
          proposed_by?: string | null
          responsible_department?: string
          source_document?: string | null
          status?: Database["public"]["Enums"]["action_status"]
          target_kpi_ids?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      analysis_audit_log: {
        Row: {
          action: string
          actor: string | null
          context: Json | null
          entity_id: string
          entity_snapshot: Json
          entity_type: string
          id: string
          logged_at: string
        }
        Insert: {
          action: string
          actor?: string | null
          context?: Json | null
          entity_id: string
          entity_snapshot: Json
          entity_type: string
          id?: string
          logged_at?: string
        }
        Update: {
          action?: string
          actor?: string | null
          context?: Json | null
          entity_id?: string
          entity_snapshot?: Json
          entity_type?: string
          id?: string
          logged_at?: string
        }
        Relationships: []
      }
      analysis_chain_revisions: {
        Row: {
          analysis_chain_id: string
          analysis_method: Database["public"]["Enums"]["analysis_method"] | null
          checksum: string
          created_at: string
          id: string
          input_data_checksums: Json | null
          level: number
          level_content: Json
          level_title: string
          method_rationale: string | null
          previous_checksum: string | null
          revision_number: number
          revision_reason: string | null
        }
        Insert: {
          analysis_chain_id: string
          analysis_method?:
            | Database["public"]["Enums"]["analysis_method"]
            | null
          checksum: string
          created_at?: string
          id?: string
          input_data_checksums?: Json | null
          level: number
          level_content: Json
          level_title: string
          method_rationale?: string | null
          previous_checksum?: string | null
          revision_number?: number
          revision_reason?: string | null
        }
        Update: {
          analysis_chain_id?: string
          analysis_method?:
            | Database["public"]["Enums"]["analysis_method"]
            | null
          checksum?: string
          created_at?: string
          id?: string
          input_data_checksums?: Json | null
          level?: number
          level_content?: Json
          level_title?: string
          method_rationale?: string | null
          previous_checksum?: string | null
          revision_number?: number
          revision_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_chain_revisions_analysis_chain_id_fkey"
            columns: ["analysis_chain_id"]
            isOneToOne: false
            referencedRelation: "analysis_chains"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_chains: {
        Row: {
          alternatives_tested: Json | null
          analysis_method: Database["public"]["Enums"]["analysis_method"] | null
          checksum: string | null
          created_at: string
          current_revision: number | null
          id: string
          level: number
          level_content: Json
          level_title: string
          method_rationale: string | null
          observation_id: string
          sequence_order: number
        }
        Insert: {
          alternatives_tested?: Json | null
          analysis_method?:
            | Database["public"]["Enums"]["analysis_method"]
            | null
          checksum?: string | null
          created_at?: string
          current_revision?: number | null
          id?: string
          level: number
          level_content: Json
          level_title: string
          method_rationale?: string | null
          observation_id: string
          sequence_order?: number
        }
        Update: {
          alternatives_tested?: Json | null
          analysis_method?:
            | Database["public"]["Enums"]["analysis_method"]
            | null
          checksum?: string | null
          created_at?: string
          current_revision?: number | null
          id?: string
          level?: number
          level_content?: Json
          level_title?: string
          method_rationale?: string | null
          observation_id?: string
          sequence_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "analysis_chains_observation_id_fkey"
            columns: ["observation_id"]
            isOneToOne: false
            referencedRelation: "observations"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_kpi_relevance: {
        Row: {
          assignment_id: string
          created_at: string
          id: string
          is_primary: boolean
          kpi_id: string
          relevance_rationale: string | null
          relevance_weight: number
        }
        Insert: {
          assignment_id: string
          created_at?: string
          id?: string
          is_primary?: boolean
          kpi_id: string
          relevance_rationale?: string | null
          relevance_weight?: number
        }
        Update: {
          assignment_id?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          kpi_id?: string
          relevance_rationale?: string | null
          relevance_weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "assignment_kpi_relevance_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "public_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_kpi_relevance_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_outcomes: {
        Row: {
          assignment_id: string
          calculated_at: string
          calculated_for_period_end: string
          calculated_for_period_start: string
          calculation_version: string
          decline_percentage: number | null
          id: string
          improvement_percentage: number | null
          kpi_outcomes: Json
          months_with_decline: number
          months_with_improvement: number
          months_with_stagnation: number
          stagnation_percentage: number | null
          total_kpis_tracked: number
        }
        Insert: {
          assignment_id: string
          calculated_at?: string
          calculated_for_period_end: string
          calculated_for_period_start: string
          calculation_version?: string
          decline_percentage?: number | null
          id?: string
          improvement_percentage?: number | null
          kpi_outcomes?: Json
          months_with_decline?: number
          months_with_improvement?: number
          months_with_stagnation?: number
          stagnation_percentage?: number | null
          total_kpis_tracked?: number
        }
        Update: {
          assignment_id?: string
          calculated_at?: string
          calculated_for_period_end?: string
          calculated_for_period_start?: string
          calculation_version?: string
          decline_percentage?: number | null
          id?: string
          improvement_percentage?: number | null
          kpi_outcomes?: Json
          months_with_decline?: number
          months_with_improvement?: number
          months_with_stagnation?: number
          stagnation_percentage?: number | null
          total_kpis_tracked?: number
        }
        Relationships: [
          {
            foreignKeyName: "assignment_outcomes_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "public_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      calculated_indicators: {
        Row: {
          created_at: string
          formula: string
          id: string
          kpi_id: string
          last_calculated_at: string | null
          source_kpi_ids: string[]
          weights: number[]
        }
        Insert: {
          created_at?: string
          formula: string
          id?: string
          kpi_id: string
          last_calculated_at?: string | null
          source_kpi_ids: string[]
          weights: number[]
        }
        Update: {
          created_at?: string
          formula?: string
          id?: string
          kpi_id?: string
          last_calculated_at?: string | null
          source_kpi_ids?: string[]
          weights?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "calculated_indicators_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_priority_snapshots: {
        Row: {
          calculation_duration_ms: number | null
          created_at: string
          full_ranking: Json
          id: string
          snapshot_date: string
          top_declines: Json
          top_improvements: Json
          top_relevant: Json
          total_objects_scored: number
          weight_version_id: string | null
        }
        Insert: {
          calculation_duration_ms?: number | null
          created_at?: string
          full_ranking?: Json
          id?: string
          snapshot_date: string
          top_declines?: Json
          top_improvements?: Json
          top_relevant?: Json
          total_objects_scored?: number
          weight_version_id?: string | null
        }
        Update: {
          calculation_duration_ms?: number | null
          created_at?: string
          full_ranking?: Json
          id?: string
          snapshot_date?: string
          top_declines?: Json
          top_improvements?: Json
          top_relevant?: Json
          total_objects_scored?: number
          weight_version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_priority_snapshots_weight_version_id_fkey"
            columns: ["weight_version_id"]
            isOneToOne: false
            referencedRelation: "relevance_weight_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      data_lineage: {
        Row: {
          aggregation_level: string
          analysis_chain_id: string | null
          checksum: string
          collected_at: string
          collection_interval: string
          collection_method: string
          corrections_applied: Json | null
          created_at: string
          data_cleaning_notes: string | null
          data_source_id: string
          id: string
          kpi_value_id: string | null
          methodology_changes: Json | null
          missing_data_count: number | null
          observation_id: string | null
          original_source: string
          raw_values: Json
          transformations_applied: Json
          version: number
        }
        Insert: {
          aggregation_level: string
          analysis_chain_id?: string | null
          checksum: string
          collected_at: string
          collection_interval: string
          collection_method: string
          corrections_applied?: Json | null
          created_at?: string
          data_cleaning_notes?: string | null
          data_source_id: string
          id?: string
          kpi_value_id?: string | null
          methodology_changes?: Json | null
          missing_data_count?: number | null
          observation_id?: string | null
          original_source: string
          raw_values: Json
          transformations_applied?: Json
          version?: number
        }
        Update: {
          aggregation_level?: string
          analysis_chain_id?: string | null
          checksum?: string
          collected_at?: string
          collection_interval?: string
          collection_method?: string
          corrections_applied?: Json | null
          created_at?: string
          data_cleaning_notes?: string | null
          data_source_id?: string
          id?: string
          kpi_value_id?: string | null
          methodology_changes?: Json | null
          missing_data_count?: number | null
          observation_id?: string | null
          original_source?: string
          raw_values?: Json
          transformations_applied?: Json
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "data_lineage_analysis_chain_id_fkey"
            columns: ["analysis_chain_id"]
            isOneToOne: false
            referencedRelation: "analysis_chains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_lineage_data_source_id_fkey"
            columns: ["data_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_lineage_kpi_value_id_fkey"
            columns: ["kpi_value_id"]
            isOneToOne: false
            referencedRelation: "kpi_values"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_lineage_observation_id_fkey"
            columns: ["observation_id"]
            isOneToOne: false
            referencedRelation: "observations"
            referencedColumns: ["id"]
          },
        ]
      }
      data_sources: {
        Row: {
          api_endpoint: string | null
          auth_type: string | null
          base_url: string | null
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          last_fetch_error: string | null
          last_successful_fetch: string | null
          metadata: Json | null
          name: string
          reliability_score: number
          requires_auth: boolean
          source_type: Database["public"]["Enums"]["data_source_type"]
          update_frequency: Database["public"]["Enums"]["update_frequency"]
          updated_at: string
        }
        Insert: {
          api_endpoint?: string | null
          auth_type?: string | null
          base_url?: string | null
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          last_fetch_error?: string | null
          last_successful_fetch?: string | null
          metadata?: Json | null
          name: string
          reliability_score?: number
          requires_auth?: boolean
          source_type?: Database["public"]["Enums"]["data_source_type"]
          update_frequency: Database["public"]["Enums"]["update_frequency"]
          updated_at?: string
        }
        Update: {
          api_endpoint?: string | null
          auth_type?: string | null
          base_url?: string | null
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          last_fetch_error?: string | null
          last_successful_fetch?: string | null
          metadata?: Json | null
          name?: string
          reliability_score?: number
          requires_auth?: boolean
          source_type?: Database["public"]["Enums"]["data_source_type"]
          update_frequency?: Database["public"]["Enums"]["update_frequency"]
          updated_at?: string
        }
        Relationships: []
      }
      decision_timeline: {
        Row: {
          action_id: string | null
          affected_kpi_ids: string[]
          created_at: string
          decision_id: string | null
          event_date: string
          event_description: string | null
          event_timestamp: string | null
          event_title: string
          event_type: string | null
          id: string
          responsible_entity: string | null
          responsible_level: string | null
          source_document: string | null
          source_url: string | null
        }
        Insert: {
          action_id?: string | null
          affected_kpi_ids?: string[]
          created_at?: string
          decision_id?: string | null
          event_date: string
          event_description?: string | null
          event_timestamp?: string | null
          event_title: string
          event_type?: string | null
          id?: string
          responsible_entity?: string | null
          responsible_level?: string | null
          source_document?: string | null
          source_url?: string | null
        }
        Update: {
          action_id?: string | null
          affected_kpi_ids?: string[]
          created_at?: string
          decision_id?: string | null
          event_date?: string
          event_description?: string | null
          event_timestamp?: string | null
          event_title?: string
          event_type?: string | null
          id?: string
          responsible_entity?: string | null
          responsible_level?: string | null
          source_document?: string | null
          source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "decision_timeline_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "action_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decision_timeline_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "policy_decisions"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluation_weights: {
        Row: {
          cost_weight: number
          created_at: string
          description: string | null
          effect_weight: number
          id: string
          is_active: boolean
          name: string
          reversibility_weight: number
          risk_weight: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cost_weight?: number
          created_at?: string
          description?: string | null
          effect_weight?: number
          id?: string
          is_active?: boolean
          name: string
          reversibility_weight?: number
          risk_weight?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cost_weight?: number
          created_at?: string
          description?: string | null
          effect_weight?: number
          id?: string
          is_active?: boolean
          name?: string
          reversibility_weight?: number
          risk_weight?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evaluation_weights_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      factor_contributions: {
        Row: {
          analysis_chain_id: string
          contribution_strength: number
          created_at: string
          description: string
          evidence_periods: number
          evidence_total_periods: number
          factor_kpi_id: string | null
          factor_name: string
          id: string
          sequence_order: number
          stability_score: number
          time_relation: string
          uncertainty: number
        }
        Insert: {
          analysis_chain_id: string
          contribution_strength: number
          created_at?: string
          description: string
          evidence_periods: number
          evidence_total_periods: number
          factor_kpi_id?: string | null
          factor_name: string
          id?: string
          sequence_order?: number
          stability_score: number
          time_relation: string
          uncertainty: number
        }
        Update: {
          analysis_chain_id?: string
          contribution_strength?: number
          created_at?: string
          description?: string
          evidence_periods?: number
          evidence_total_periods?: number
          factor_kpi_id?: string | null
          factor_name?: string
          id?: string
          sequence_order?: number
          stability_score?: number
          time_relation?: string
          uncertainty?: number
        }
        Relationships: [
          {
            foreignKeyName: "factor_contributions_analysis_chain_id_fkey"
            columns: ["analysis_chain_id"]
            isOneToOne: false
            referencedRelation: "analysis_chains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factor_contributions_factor_kpi_id_fkey"
            columns: ["factor_kpi_id"]
            isOneToOne: false
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      governance_outcomes: {
        Row: {
          actions_with_effect: number | null
          actions_without_effect: number | null
          calculated_at: string | null
          governance_period_id: string
          id: string
          kpi_id: string
          months_declined: number | null
          months_improved: number | null
          months_stagnant: number | null
          snapshot_date: string
        }
        Insert: {
          actions_with_effect?: number | null
          actions_without_effect?: number | null
          calculated_at?: string | null
          governance_period_id: string
          id?: string
          kpi_id: string
          months_declined?: number | null
          months_improved?: number | null
          months_stagnant?: number | null
          snapshot_date: string
        }
        Update: {
          actions_with_effect?: number | null
          actions_without_effect?: number | null
          calculated_at?: string | null
          governance_period_id?: string
          id?: string
          kpi_id?: string
          months_declined?: number | null
          months_improved?: number | null
          months_stagnant?: number | null
          snapshot_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "governance_outcomes_governance_period_id_fkey"
            columns: ["governance_period_id"]
            isOneToOne: false
            referencedRelation: "governance_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "governance_outcomes_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      governance_periods: {
        Row: {
          areas: Database["public"]["Enums"]["responsibility_area"][]
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          level: Database["public"]["Enums"]["responsibility_level"]
          party_constellation: string[] | null
          period_name: string
          region_code: string | null
          start_date: string
        }
        Insert: {
          areas: Database["public"]["Enums"]["responsibility_area"][]
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          level: Database["public"]["Enums"]["responsibility_level"]
          party_constellation?: string[] | null
          period_name: string
          region_code?: string | null
          start_date: string
        }
        Update: {
          areas?: Database["public"]["Enums"]["responsibility_area"][]
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          level?: Database["public"]["Enums"]["responsibility_level"]
          party_constellation?: string[] | null
          period_name?: string
          region_code?: string | null
          start_date?: string
        }
        Relationships: []
      }
      ingest_log: {
        Row: {
          completed_at: string | null
          data_source_id: string
          error_message: string | null
          id: string
          metadata: Json | null
          records_failed: number | null
          records_fetched: number | null
          records_inserted: number | null
          records_updated: number | null
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          data_source_id: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          records_failed?: number | null
          records_fetched?: number | null
          records_inserted?: number | null
          records_updated?: number | null
          started_at?: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          data_source_id?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          records_failed?: number | null
          records_fetched?: number | null
          records_inserted?: number | null
          records_updated?: number | null
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingest_log_data_source_id_fkey"
            columns: ["data_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_notes: {
        Row: {
          action_id: string | null
          author_id: string
          content: string
          created_at: string
          id: string
          is_private: boolean
          kpi_id: string | null
          observation_id: string | null
          updated_at: string
        }
        Insert: {
          action_id?: string | null
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_private?: boolean
          kpi_id?: string | null
          observation_id?: string | null
          updated_at?: string
        }
        Update: {
          action_id?: string | null
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_private?: boolean
          kpi_id?: string | null
          observation_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "internal_notes_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "action_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internal_notes_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internal_notes_observation_id_fkey"
            columns: ["observation_id"]
            isOneToOne: false
            referencedRelation: "observations"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          description: string
          id: string
          kpi_id: string
          kpi_value_id: string | null
          metadata: Json | null
          resolved_at: string | null
          severity: Database["public"]["Enums"]["kpi_status"]
          title: string
          triggered_at: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          description: string
          id?: string
          kpi_id: string
          kpi_value_id?: string | null
          metadata?: Json | null
          resolved_at?: string | null
          severity: Database["public"]["Enums"]["kpi_status"]
          title: string
          triggered_at?: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          description?: string
          id?: string
          kpi_id?: string
          kpi_value_id?: string | null
          metadata?: Json | null
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["kpi_status"]
          title?: string
          triggered_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kpi_alerts_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_alerts_kpi_value_id_fkey"
            columns: ["kpi_value_id"]
            isOneToOne: false
            referencedRelation: "kpi_values"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_data_source_mapping: {
        Row: {
          created_at: string
          data_source_id: string
          id: string
          is_primary: boolean
          kpi_id: string
          transformation_config: Json | null
          weight: number
        }
        Insert: {
          created_at?: string
          data_source_id: string
          id?: string
          is_primary?: boolean
          kpi_id: string
          transformation_config?: Json | null
          weight?: number
        }
        Update: {
          created_at?: string
          data_source_id?: string
          id?: string
          is_primary?: boolean
          kpi_id?: string
          transformation_config?: Json | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "kpi_data_source_mapping_data_source_id_fkey"
            columns: ["data_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_data_source_mapping_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_definitions: {
        Row: {
          breakdown_dimensions: string[]
          calculation_formula: string | null
          category: Database["public"]["Enums"]["kpi_category"]
          code: string
          created_at: string
          description: string
          id: string
          is_active: boolean
          is_inverted: boolean
          kpi_index: number
          name: string
          rationale: string
          red_flag_conditions: Json
          unit: string
          updated_at: string
        }
        Insert: {
          breakdown_dimensions?: string[]
          calculation_formula?: string | null
          category: Database["public"]["Enums"]["kpi_category"]
          code: string
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          is_inverted?: boolean
          kpi_index: number
          name: string
          rationale: string
          red_flag_conditions?: Json
          unit: string
          updated_at?: string
        }
        Update: {
          breakdown_dimensions?: string[]
          calculation_formula?: string | null
          category?: Database["public"]["Enums"]["kpi_category"]
          code?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          is_inverted?: boolean
          kpi_index?: number
          name?: string
          rationale?: string
          red_flag_conditions?: Json
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      kpi_responsibility_matrix: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          kpi_id: string
          primary_area: Database["public"]["Enums"]["responsibility_area"]
          primary_level: Database["public"]["Enums"]["responsibility_level"]
          secondary_areas:
            | Database["public"]["Enums"]["responsibility_area"][]
            | null
          secondary_levels:
            | Database["public"]["Enums"]["responsibility_level"][]
            | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          kpi_id: string
          primary_area: Database["public"]["Enums"]["responsibility_area"]
          primary_level?: Database["public"]["Enums"]["responsibility_level"]
          secondary_areas?:
            | Database["public"]["Enums"]["responsibility_area"][]
            | null
          secondary_levels?:
            | Database["public"]["Enums"]["responsibility_level"][]
            | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          kpi_id?: string
          primary_area?: Database["public"]["Enums"]["responsibility_area"]
          primary_level?: Database["public"]["Enums"]["responsibility_level"]
          secondary_areas?:
            | Database["public"]["Enums"]["responsibility_area"][]
            | null
          secondary_levels?:
            | Database["public"]["Enums"]["responsibility_level"][]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "kpi_responsibility_matrix_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: true
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_value_revisions: {
        Row: {
          checksum: string
          confidence: number
          created_at: string
          id: string
          is_provisional: boolean
          kpi_value_id: string
          previous_checksum: string | null
          previous_value: number | null
          revised_by: string | null
          revision_number: number
          revision_reason: string | null
          revision_type: string
          status: Database["public"]["Enums"]["kpi_status"]
          trend: Database["public"]["Enums"]["trend_direction"]
          trend_percent: number | null
          value: number
        }
        Insert: {
          checksum: string
          confidence: number
          created_at?: string
          id?: string
          is_provisional?: boolean
          kpi_value_id: string
          previous_checksum?: string | null
          previous_value?: number | null
          revised_by?: string | null
          revision_number?: number
          revision_reason?: string | null
          revision_type?: string
          status: Database["public"]["Enums"]["kpi_status"]
          trend: Database["public"]["Enums"]["trend_direction"]
          trend_percent?: number | null
          value: number
        }
        Update: {
          checksum?: string
          confidence?: number
          created_at?: string
          id?: string
          is_provisional?: boolean
          kpi_value_id?: string
          previous_checksum?: string | null
          previous_value?: number | null
          revised_by?: string | null
          revision_number?: number
          revision_reason?: string | null
          revision_type?: string
          status?: Database["public"]["Enums"]["kpi_status"]
          trend?: Database["public"]["Enums"]["trend_direction"]
          trend_percent?: number | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "kpi_value_revisions_kpi_value_id_fkey"
            columns: ["kpi_value_id"]
            isOneToOne: false
            referencedRelation: "kpi_values"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_values: {
        Row: {
          checksum: string | null
          confidence: number
          created_at: string
          current_revision: number | null
          data_source_id: string | null
          granularity: string
          id: string
          is_immutable: boolean | null
          is_provisional: boolean
          kpi_id: string
          period_end: string
          period_start: string
          previous_value: number | null
          raw_data: Json | null
          region_code: string | null
          status: Database["public"]["Enums"]["kpi_status"]
          trend: Database["public"]["Enums"]["trend_direction"]
          trend_percent: number | null
          updated_at: string
          value: number
        }
        Insert: {
          checksum?: string | null
          confidence?: number
          created_at?: string
          current_revision?: number | null
          data_source_id?: string | null
          granularity?: string
          id?: string
          is_immutable?: boolean | null
          is_provisional?: boolean
          kpi_id: string
          period_end: string
          period_start: string
          previous_value?: number | null
          raw_data?: Json | null
          region_code?: string | null
          status?: Database["public"]["Enums"]["kpi_status"]
          trend?: Database["public"]["Enums"]["trend_direction"]
          trend_percent?: number | null
          updated_at?: string
          value: number
        }
        Update: {
          checksum?: string | null
          confidence?: number
          created_at?: string
          current_revision?: number | null
          data_source_id?: string | null
          granularity?: string
          id?: string
          is_immutable?: boolean | null
          is_provisional?: boolean
          kpi_id?: string
          period_end?: string
          period_start?: string
          previous_value?: number | null
          raw_data?: Json | null
          region_code?: string | null
          status?: Database["public"]["Enums"]["kpi_status"]
          trend?: Database["public"]["Enums"]["trend_direction"]
          trend_percent?: number | null
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "kpi_values_data_source_id_fkey"
            columns: ["data_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_values_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      lineage_chain_links: {
        Row: {
          created_at: string
          id: string
          link_type: string
          source_checksum: string
          source_id: string | null
          source_type: string
          target_checksum: string
          target_id: string
          target_type: string
          transformation_applied: string | null
          weight_used: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          link_type: string
          source_checksum: string
          source_id?: string | null
          source_type: string
          target_checksum: string
          target_id: string
          target_type: string
          transformation_applied?: string | null
          weight_used?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          link_type?: string
          source_checksum?: string
          source_id?: string | null
          source_type?: string
          target_checksum?: string
          target_id?: string
          target_type?: string
          transformation_applied?: string | null
          weight_used?: number | null
        }
        Relationships: []
      }
      master_index_components: {
        Row: {
          created_at: string | null
          id: string
          kpi_id: string
          master_index_id: string
          normalization_method: string | null
          weight: number
          weight_rationale: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          kpi_id: string
          master_index_id: string
          normalization_method?: string | null
          weight: number
          weight_rationale?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          kpi_id?: string
          master_index_id?: string
          normalization_method?: string | null
          weight?: number
          weight_rationale?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "master_index_components_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_index_components_master_index_id_fkey"
            columns: ["master_index_id"]
            isOneToOne: false
            referencedRelation: "master_index_config"
            referencedColumns: ["id"]
          },
        ]
      }
      master_index_config: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      master_index_revisions: {
        Row: {
          checksum: string
          component_checksums: Json | null
          component_values: Json
          confidence: number | null
          created_at: string
          id: string
          master_index_value_id: string
          previous_checksum: string | null
          previous_value: number | null
          revision_number: number
          revision_reason: string | null
          trend: Database["public"]["Enums"]["trend_direction"] | null
          value: number
          weight_version_used: string | null
        }
        Insert: {
          checksum: string
          component_checksums?: Json | null
          component_values: Json
          confidence?: number | null
          created_at?: string
          id?: string
          master_index_value_id: string
          previous_checksum?: string | null
          previous_value?: number | null
          revision_number?: number
          revision_reason?: string | null
          trend?: Database["public"]["Enums"]["trend_direction"] | null
          value: number
          weight_version_used?: string | null
        }
        Update: {
          checksum?: string
          component_checksums?: Json | null
          component_values?: Json
          confidence?: number | null
          created_at?: string
          id?: string
          master_index_value_id?: string
          previous_checksum?: string | null
          previous_value?: number | null
          revision_number?: number
          revision_reason?: string | null
          trend?: Database["public"]["Enums"]["trend_direction"] | null
          value?: number
          weight_version_used?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "master_index_revisions_master_index_value_id_fkey"
            columns: ["master_index_value_id"]
            isOneToOne: false
            referencedRelation: "master_index_values"
            referencedColumns: ["id"]
          },
        ]
      }
      master_index_values: {
        Row: {
          calculated_at: string | null
          checksum: string | null
          component_values: Json
          confidence: number | null
          current_revision: number | null
          id: string
          master_index_id: string
          period_end: string
          period_start: string
          previous_value: number | null
          trend: Database["public"]["Enums"]["trend_direction"] | null
          trend_percent: number | null
          value: number
        }
        Insert: {
          calculated_at?: string | null
          checksum?: string | null
          component_values?: Json
          confidence?: number | null
          current_revision?: number | null
          id?: string
          master_index_id: string
          period_end: string
          period_start: string
          previous_value?: number | null
          trend?: Database["public"]["Enums"]["trend_direction"] | null
          trend_percent?: number | null
          value: number
        }
        Update: {
          calculated_at?: string | null
          checksum?: string | null
          component_values?: Json
          confidence?: number | null
          current_revision?: number | null
          id?: string
          master_index_id?: string
          period_end?: string
          period_start?: string
          previous_value?: number | null
          trend?: Database["public"]["Enums"]["trend_direction"] | null
          trend_percent?: number | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "master_index_values_master_index_id_fkey"
            columns: ["master_index_id"]
            isOneToOne: false
            referencedRelation: "master_index_config"
            referencedColumns: ["id"]
          },
        ]
      }
      observation_revisions: {
        Row: {
          analysis_version: string
          checksum: string
          confidence_level: number
          created_at: string
          description: string
          id: string
          model_version: string
          observation_id: string
          observation_type: Database["public"]["Enums"]["observation_type"]
          previous_checksum: string | null
          revision_number: number
          revision_reason: string | null
          signal_strength: number
          status: Database["public"]["Enums"]["analysis_status"]
          title: string
        }
        Insert: {
          analysis_version: string
          checksum: string
          confidence_level: number
          created_at?: string
          description: string
          id?: string
          model_version: string
          observation_id: string
          observation_type: Database["public"]["Enums"]["observation_type"]
          previous_checksum?: string | null
          revision_number?: number
          revision_reason?: string | null
          signal_strength: number
          status: Database["public"]["Enums"]["analysis_status"]
          title: string
        }
        Update: {
          analysis_version?: string
          checksum?: string
          confidence_level?: number
          created_at?: string
          description?: string
          id?: string
          model_version?: string
          observation_id?: string
          observation_type?: Database["public"]["Enums"]["observation_type"]
          previous_checksum?: string | null
          revision_number?: number
          revision_reason?: string | null
          signal_strength?: number
          status?: Database["public"]["Enums"]["analysis_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "observation_revisions_observation_id_fkey"
            columns: ["observation_id"]
            isOneToOne: false
            referencedRelation: "observations"
            referencedColumns: ["id"]
          },
        ]
      }
      observations: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          analysis_version: string
          checksum: string | null
          confidence_level: number
          created_at: string
          current_revision: number | null
          description: string
          detected_at: string
          id: string
          kpi_id: string
          kpi_value_id: string | null
          model_version: string
          observation_period_end: string
          observation_period_start: string
          observation_type: Database["public"]["Enums"]["observation_type"]
          signal_strength: number
          status: Database["public"]["Enums"]["analysis_status"]
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          analysis_version?: string
          checksum?: string | null
          confidence_level: number
          created_at?: string
          current_revision?: number | null
          description: string
          detected_at?: string
          id?: string
          kpi_id: string
          kpi_value_id?: string | null
          model_version?: string
          observation_period_end: string
          observation_period_start: string
          observation_type: Database["public"]["Enums"]["observation_type"]
          signal_strength: number
          status?: Database["public"]["Enums"]["analysis_status"]
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          analysis_version?: string
          checksum?: string | null
          confidence_level?: number
          created_at?: string
          current_revision?: number | null
          description?: string
          detected_at?: string
          id?: string
          kpi_id?: string
          kpi_value_id?: string | null
          model_version?: string
          observation_period_end?: string
          observation_period_start?: string
          observation_type?: Database["public"]["Enums"]["observation_type"]
          signal_strength?: number
          status?: Database["public"]["Enums"]["analysis_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "observations_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observations_kpi_value_id_fkey"
            columns: ["kpi_value_id"]
            isOneToOne: false
            referencedRelation: "kpi_values"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_decisions: {
        Row: {
          created_at: string
          decision_date: string
          description: string | null
          effectiveness_score: number | null
          expected_effect: string | null
          id: string
          measured_effect: string | null
          status: string
          target_kpis: string[]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          decision_date: string
          description?: string | null
          effectiveness_score?: number | null
          expected_effect?: string | null
          id?: string
          measured_effect?: string | null
          status?: string
          target_kpis?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          decision_date?: string
          description?: string | null
          effectiveness_score?: number | null
          expected_effect?: string | null
          id?: string
          measured_effect?: string | null
          status?: string
          target_kpis?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          id: string
          is_public_profile: boolean | null
          organization: string | null
          party_affiliation: string | null
          position_title: string | null
          region_code: string | null
          responsibility_areas:
            | Database["public"]["Enums"]["responsibility_area"][]
            | null
          responsibility_level:
            | Database["public"]["Enums"]["responsibility_level"]
            | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          id: string
          is_public_profile?: boolean | null
          organization?: string | null
          party_affiliation?: string | null
          position_title?: string | null
          region_code?: string | null
          responsibility_areas?:
            | Database["public"]["Enums"]["responsibility_area"][]
            | null
          responsibility_level?:
            | Database["public"]["Enums"]["responsibility_level"]
            | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_public_profile?: boolean | null
          organization?: string | null
          party_affiliation?: string | null
          position_title?: string | null
          region_code?: string | null
          responsibility_areas?:
            | Database["public"]["Enums"]["responsibility_area"][]
            | null
          responsibility_level?:
            | Database["public"]["Enums"]["responsibility_level"]
            | null
          updated_at?: string | null
        }
        Relationships: []
      }
      public_assignments: {
        Row: {
          assignment_type: string
          created_at: string
          end_date: string | null
          governance_period_id: string | null
          id: string
          official_id: string
          responsibility_areas: Database["public"]["Enums"]["responsibility_area"][]
          responsibility_level: Database["public"]["Enums"]["responsibility_level"]
          source_document: string | null
          source_url: string | null
          start_date: string
          title: string
        }
        Insert: {
          assignment_type: string
          created_at?: string
          end_date?: string | null
          governance_period_id?: string | null
          id?: string
          official_id: string
          responsibility_areas?: Database["public"]["Enums"]["responsibility_area"][]
          responsibility_level?: Database["public"]["Enums"]["responsibility_level"]
          source_document?: string | null
          source_url?: string | null
          start_date: string
          title: string
        }
        Update: {
          assignment_type?: string
          created_at?: string
          end_date?: string | null
          governance_period_id?: string | null
          id?: string
          official_id?: string
          responsibility_areas?: Database["public"]["Enums"]["responsibility_area"][]
          responsibility_level?: Database["public"]["Enums"]["responsibility_level"]
          source_document?: string | null
          source_url?: string | null
          start_date?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_assignments_governance_period_id_fkey"
            columns: ["governance_period_id"]
            isOneToOne: false
            referencedRelation: "governance_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_assignments_official_id_fkey"
            columns: ["official_id"]
            isOneToOne: false
            referencedRelation: "public_officials"
            referencedColumns: ["id"]
          },
        ]
      }
      public_officials: {
        Row: {
          birth_year: number | null
          created_at: string
          data_sources: string[] | null
          full_name: string
          id: string
          last_verified_at: string | null
          party_affiliation: string | null
          riksdagen_id: string | null
          updated_at: string
          wikipedia_url: string | null
        }
        Insert: {
          birth_year?: number | null
          created_at?: string
          data_sources?: string[] | null
          full_name: string
          id?: string
          last_verified_at?: string | null
          party_affiliation?: string | null
          riksdagen_id?: string | null
          updated_at?: string
          wikipedia_url?: string | null
        }
        Update: {
          birth_year?: number | null
          created_at?: string
          data_sources?: string[] | null
          full_name?: string
          id?: string
          last_verified_at?: string | null
          party_affiliation?: string | null
          riksdagen_id?: string | null
          updated_at?: string
          wikipedia_url?: string | null
        }
        Relationships: []
      }
      relevance_scores: {
        Row: {
          acceleration_raw: number
          acceleration_weighted: number
          breadth_raw: number
          breadth_weighted: number
          calculated_at: string
          calculation_details: Json
          data_confidence_contribution: number
          data_confidence_raw: number
          id: string
          impact_raw: number
          impact_weighted: number
          object_code: string | null
          object_id: string
          object_type: string
          persistence_raw: number
          persistence_weighted: number
          primary_reason: string
          rank: number | null
          responsibility_raw: number
          responsibility_weighted: number
          secondary_reasons: string[] | null
          should_highlight: boolean
          total_score: number
          valid_until: string | null
          weight_version_id: string | null
        }
        Insert: {
          acceleration_raw: number
          acceleration_weighted: number
          breadth_raw: number
          breadth_weighted: number
          calculated_at?: string
          calculation_details?: Json
          data_confidence_contribution: number
          data_confidence_raw: number
          id?: string
          impact_raw: number
          impact_weighted: number
          object_code?: string | null
          object_id: string
          object_type: string
          persistence_raw: number
          persistence_weighted: number
          primary_reason: string
          rank?: number | null
          responsibility_raw: number
          responsibility_weighted: number
          secondary_reasons?: string[] | null
          should_highlight?: boolean
          total_score: number
          valid_until?: string | null
          weight_version_id?: string | null
        }
        Update: {
          acceleration_raw?: number
          acceleration_weighted?: number
          breadth_raw?: number
          breadth_weighted?: number
          calculated_at?: string
          calculation_details?: Json
          data_confidence_contribution?: number
          data_confidence_raw?: number
          id?: string
          impact_raw?: number
          impact_weighted?: number
          object_code?: string | null
          object_id?: string
          object_type?: string
          persistence_raw?: number
          persistence_weighted?: number
          primary_reason?: string
          rank?: number | null
          responsibility_raw?: number
          responsibility_weighted?: number
          secondary_reasons?: string[] | null
          should_highlight?: boolean
          total_score?: number
          valid_until?: string | null
          weight_version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relevance_scores_weight_version_id_fkey"
            columns: ["weight_version_id"]
            isOneToOne: false
            referencedRelation: "relevance_weight_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      relevance_weight_versions: {
        Row: {
          acceleration_weight: number
          breadth_weight: number
          change_reason: string | null
          created_at: string
          created_by: string | null
          data_confidence_weight: number
          description: string | null
          id: string
          impact_weight: number
          is_active: boolean
          name: string
          persistence_weight: number
          responsibility_weight: number
          version: number
        }
        Insert: {
          acceleration_weight?: number
          breadth_weight?: number
          change_reason?: string | null
          created_at?: string
          created_by?: string | null
          data_confidence_weight?: number
          description?: string | null
          id?: string
          impact_weight?: number
          is_active?: boolean
          name: string
          persistence_weight?: number
          responsibility_weight?: number
          version: number
        }
        Update: {
          acceleration_weight?: number
          breadth_weight?: number
          change_reason?: string | null
          created_at?: string
          created_by?: string | null
          data_confidence_weight?: number
          description?: string | null
          id?: string
          impact_weight?: number
          is_active?: boolean
          name?: string
          persistence_weight?: number
          responsibility_weight?: number
          version?: number
        }
        Relationships: []
      }
      role_audit_log: {
        Row: {
          action: string
          id: string
          performed_at: string
          performed_by: string | null
          reason: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          action: string
          id?: string
          performed_at?: string
          performed_by?: string | null
          reason?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          action?: string
          id?: string
          performed_at?: string
          performed_by?: string | null
          reason?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      role_responsibilities: {
        Row: {
          assigned_at: string
          id: string
          kpi_id: string
          responsibility_level: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          id?: string
          kpi_id: string
          responsibility_level: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          id?: string
          kpi_id?: string
          responsibility_level?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_responsibilities_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_responsibilities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_relevance_preferences: {
        Row: {
          boost_factor: number
          boost_local: boolean
          created_at: string
          id: string
          preferred_demographics: string[] | null
          preferred_regions: string[] | null
          preferred_responsibility_areas: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          boost_factor?: number
          boost_local?: boolean
          created_at?: string
          id?: string
          preferred_demographics?: string[] | null
          preferred_regions?: string[] | null
          preferred_responsibility_areas?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          boost_factor?: number
          boost_local?: boolean
          created_at?: string
          id?: string
          preferred_demographics?: string[] | null
          preferred_regions?: string[] | null
          preferred_responsibility_areas?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_relevance_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          notes: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          notes?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          notes?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_complete_lineage: {
        Row: {
          created_at: string | null
          id: string | null
          link_type: string | null
          source_checksum: string | null
          source_id: string | null
          source_name: string | null
          source_type: string | null
          target_checksum: string | null
          target_id: string | null
          target_name: string | null
          target_type: string | null
          transformation_applied: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          link_type?: string | null
          source_checksum?: string | null
          source_id?: string | null
          source_name?: never
          source_type?: string | null
          target_checksum?: string | null
          target_id?: string | null
          target_name?: never
          target_type?: string | null
          transformation_applied?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          link_type?: string | null
          source_checksum?: string | null
          source_id?: string | null
          source_name?: never
          source_type?: string | null
          target_checksum?: string | null
          target_id?: string | null
          target_name?: never
          target_type?: string | null
          transformation_applied?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      compute_checksum: { Args: { data: Json }; Returns: string }
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_kpi_responsibility: {
        Args: { _kpi_id: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      action_status:
        | "proposed"
        | "under_review"
        | "approved"
        | "in_progress"
        | "completed"
        | "rejected"
        | "deferred"
      analysis_method:
        | "trend_detection"
        | "change_point_detection"
        | "correlation_analysis"
        | "lag_analysis"
        | "regression"
        | "decomposition"
        | "anomaly_detection"
      analysis_status: "pending" | "in_progress" | "completed" | "verified"
      app_role:
        | "public"
        | "researcher"
        | "department_lead"
        | "minister"
        | "prime_minister"
        | "system_admin"
      data_source_type: "api" | "file_feed" | "manual" | "calculated"
      kpi_category:
        | "demografi_halsa"
        | "arbete_produktivitet"
        | "ekonomisk_barkraft"
        | "social_stabilitet"
        | "karnsystem_funktion"
        | "infrastruktur"
        | "systemrisk_styrning"
      kpi_status: "positive" | "warning" | "critical" | "neutral"
      observation_type:
        | "trend_deviation"
        | "threshold_breach"
        | "correlation_detected"
        | "pattern_match"
        | "lag_signal"
        | "anomaly"
      priority_level: "critical" | "high" | "medium" | "low" | "monitor"
      responsibility_area:
        | "halsa"
        | "arbete"
        | "utbildning"
        | "trygghet"
        | "ekonomi"
        | "infrastruktur"
        | "integration"
        | "miljo"
      responsibility_level: "nationell" | "regional" | "kommunal"
      trend_direction: "up" | "down" | "stable"
      update_frequency:
        | "realtime"
        | "daily"
        | "weekly"
        | "monthly"
        | "quarterly"
        | "yearly"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      action_status: [
        "proposed",
        "under_review",
        "approved",
        "in_progress",
        "completed",
        "rejected",
        "deferred",
      ],
      analysis_method: [
        "trend_detection",
        "change_point_detection",
        "correlation_analysis",
        "lag_analysis",
        "regression",
        "decomposition",
        "anomaly_detection",
      ],
      analysis_status: ["pending", "in_progress", "completed", "verified"],
      app_role: [
        "public",
        "researcher",
        "department_lead",
        "minister",
        "prime_minister",
        "system_admin",
      ],
      data_source_type: ["api", "file_feed", "manual", "calculated"],
      kpi_category: [
        "demografi_halsa",
        "arbete_produktivitet",
        "ekonomisk_barkraft",
        "social_stabilitet",
        "karnsystem_funktion",
        "infrastruktur",
        "systemrisk_styrning",
      ],
      kpi_status: ["positive", "warning", "critical", "neutral"],
      observation_type: [
        "trend_deviation",
        "threshold_breach",
        "correlation_detected",
        "pattern_match",
        "lag_signal",
        "anomaly",
      ],
      priority_level: ["critical", "high", "medium", "low", "monitor"],
      responsibility_area: [
        "halsa",
        "arbete",
        "utbildning",
        "trygghet",
        "ekonomi",
        "infrastruktur",
        "integration",
        "miljo",
      ],
      responsibility_level: ["nationell", "regional", "kommunal"],
      trend_direction: ["up", "down", "stable"],
      update_frequency: [
        "realtime",
        "daily",
        "weekly",
        "monthly",
        "quarterly",
        "yearly",
      ],
    },
  },
} as const
