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
      access_tiers: {
        Row: {
          code: string
          created_at: string | null
          features: Json
          id: string
          is_active: boolean | null
          limits: Json | null
          name: string
          price_monthly: number | null
          tier_type: string
        }
        Insert: {
          code: string
          created_at?: string | null
          features: Json
          id?: string
          is_active?: boolean | null
          limits?: Json | null
          name: string
          price_monthly?: number | null
          tier_type: string
        }
        Update: {
          code?: string
          created_at?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          limits?: Json | null
          name?: string
          price_monthly?: number | null
          tier_type?: string
        }
        Relationships: []
      }
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
      action_outcome_links: {
        Row: {
          action_id: string | null
          attribution_confidence: number | null
          baseline_period: string | null
          baseline_value: number | null
          change_percent: number | null
          confounding_factors: string[] | null
          id: string
          linked_at: string | null
          methodology_note: string | null
          observation_summary: string
          observed_period: string | null
          observed_value: number | null
          outcome_reference_id: string
          outcome_type: string
          pattern_type: string | null
        }
        Insert: {
          action_id?: string | null
          attribution_confidence?: number | null
          baseline_period?: string | null
          baseline_value?: number | null
          change_percent?: number | null
          confounding_factors?: string[] | null
          id?: string
          linked_at?: string | null
          methodology_note?: string | null
          observation_summary: string
          observed_period?: string | null
          observed_value?: number | null
          outcome_reference_id: string
          outcome_type: string
          pattern_type?: string | null
        }
        Update: {
          action_id?: string | null
          attribution_confidence?: number | null
          baseline_period?: string | null
          baseline_value?: number | null
          change_percent?: number | null
          confounding_factors?: string[] | null
          id?: string
          linked_at?: string | null
          methodology_note?: string | null
          observation_summary?: string
          observed_period?: string | null
          observed_value?: number | null
          outcome_reference_id?: string
          outcome_type?: string
          pattern_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "action_outcome_links_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "policy_actions"
            referencedColumns: ["id"]
          },
        ]
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
      api_keys: {
        Row: {
          allowed_countries: string[] | null
          allowed_endpoints: string[] | null
          allowed_nuts_levels: number[] | null
          can_access_correlations: boolean | null
          can_access_feeds: boolean | null
          can_bulk_export: boolean | null
          can_white_label: boolean | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          license_tier: string
          organization_name: string | null
          query_complexity_limit: number | null
          rate_limit_per_day: number | null
          rate_limit_per_minute: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          allowed_countries?: string[] | null
          allowed_endpoints?: string[] | null
          allowed_nuts_levels?: number[] | null
          can_access_correlations?: boolean | null
          can_access_feeds?: boolean | null
          can_bulk_export?: boolean | null
          can_white_label?: boolean | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          license_tier?: string
          organization_name?: string | null
          query_complexity_limit?: number | null
          rate_limit_per_day?: number | null
          rate_limit_per_minute?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          allowed_countries?: string[] | null
          allowed_endpoints?: string[] | null
          allowed_nuts_levels?: number[] | null
          can_access_correlations?: boolean | null
          can_access_feeds?: boolean | null
          can_bulk_export?: boolean | null
          can_white_label?: boolean | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          license_tier?: string
          organization_name?: string | null
          query_complexity_limit?: number | null
          rate_limit_per_day?: number | null
          rate_limit_per_minute?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      api_usage_log: {
        Row: {
          api_key_id: string | null
          country_code: string | null
          created_at: string | null
          endpoint: string
          id: string
          ip_address: unknown
          method: string
          query_complexity: number | null
          query_params: Json | null
          response_status: number | null
          response_time_ms: number | null
          user_agent: string | null
        }
        Insert: {
          api_key_id?: string | null
          country_code?: string | null
          created_at?: string | null
          endpoint: string
          id?: string
          ip_address?: unknown
          method?: string
          query_complexity?: number | null
          query_params?: Json | null
          response_status?: number | null
          response_time_ms?: number | null
          user_agent?: string | null
        }
        Update: {
          api_key_id?: string | null
          country_code?: string | null
          created_at?: string | null
          endpoint?: string
          id?: string
          ip_address?: unknown
          method?: string
          query_complexity?: number | null
          query_params?: Json | null
          response_status?: number | null
          response_time_ms?: number | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_log_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
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
      attribution_log: {
        Row: {
          api_key_id: string | null
          attribution_provided: boolean | null
          attribution_required: boolean | null
          checked_at: string | null
          content_id: string | null
          content_type: string
          id: string
          publication_url: string | null
        }
        Insert: {
          api_key_id?: string | null
          attribution_provided?: boolean | null
          attribution_required?: boolean | null
          checked_at?: string | null
          content_id?: string | null
          content_type: string
          id?: string
          publication_url?: string | null
        }
        Update: {
          api_key_id?: string | null
          attribution_provided?: boolean | null
          attribution_required?: boolean | null
          checked_at?: string | null
          content_id?: string | null
          content_type?: string
          id?: string
          publication_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attribution_log_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
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
      causal_chains: {
        Row: {
          alternative_explanations: Json | null
          chain_code: string
          chain_confidence: number | null
          chain_steps: Json
          created_at: string | null
          first_movement_date: string | null
          id: string
          outcome_description: string
          outcome_observed_date: string | null
          related_action_ids: string[] | null
          related_kpi_ids: string[] | null
          total_chain_duration_months: number | null
          uncertainty_factors: string[] | null
        }
        Insert: {
          alternative_explanations?: Json | null
          chain_code: string
          chain_confidence?: number | null
          chain_steps: Json
          created_at?: string | null
          first_movement_date?: string | null
          id?: string
          outcome_description: string
          outcome_observed_date?: string | null
          related_action_ids?: string[] | null
          related_kpi_ids?: string[] | null
          total_chain_duration_months?: number | null
          uncertainty_factors?: string[] | null
        }
        Update: {
          alternative_explanations?: Json | null
          chain_code?: string
          chain_confidence?: number | null
          chain_steps?: Json
          created_at?: string | null
          first_movement_date?: string | null
          id?: string
          outcome_description?: string
          outcome_observed_date?: string | null
          related_action_ids?: string[] | null
          related_kpi_ids?: string[] | null
          total_chain_duration_months?: number | null
          uncertainty_factors?: string[] | null
        }
        Relationships: []
      }
      countries: {
        Row: {
          bloc: string | null
          code: string
          code_alpha3: string | null
          created_at: string
          currency_code: string | null
          data_depth: Database["public"]["Enums"]["data_depth_level"]
          data_quality_score: number | null
          gdp_per_capita: number | null
          has_feeds_enabled: boolean
          has_municipal_data: boolean
          has_politician_profiles: boolean
          has_regional_data: boolean
          has_responsibility_model: boolean
          has_simulation: boolean
          id: string
          is_active: boolean
          languages: string[] | null
          last_data_update: string | null
          name: string
          name_local: string | null
          population: number | null
          region: string
          subregion: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          bloc?: string | null
          code: string
          code_alpha3?: string | null
          created_at?: string
          currency_code?: string | null
          data_depth?: Database["public"]["Enums"]["data_depth_level"]
          data_quality_score?: number | null
          gdp_per_capita?: number | null
          has_feeds_enabled?: boolean
          has_municipal_data?: boolean
          has_politician_profiles?: boolean
          has_regional_data?: boolean
          has_responsibility_model?: boolean
          has_simulation?: boolean
          id?: string
          is_active?: boolean
          languages?: string[] | null
          last_data_update?: string | null
          name: string
          name_local?: string | null
          population?: number | null
          region: string
          subregion?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          bloc?: string | null
          code?: string
          code_alpha3?: string | null
          created_at?: string
          currency_code?: string | null
          data_depth?: Database["public"]["Enums"]["data_depth_level"]
          data_quality_score?: number | null
          gdp_per_capita?: number | null
          has_feeds_enabled?: boolean
          has_municipal_data?: boolean
          has_politician_profiles?: boolean
          has_regional_data?: boolean
          has_responsibility_model?: boolean
          has_simulation?: boolean
          id?: string
          is_active?: boolean
          languages?: string[] | null
          last_data_update?: string | null
          name?: string
          name_local?: string | null
          population?: number | null
          region?: string
          subregion?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      country_comparability: {
        Row: {
          comparability_notes: string | null
          country_a: string
          country_b: string
          coverage_match: number | null
          definition_match: number | null
          id: string
          kpi_code: string | null
          last_assessed: string
          level: Database["public"]["Enums"]["comparability_level"]
          limitations: string[] | null
          methodology_match: number | null
          score: number
        }
        Insert: {
          comparability_notes?: string | null
          country_a: string
          country_b: string
          coverage_match?: number | null
          definition_match?: number | null
          id?: string
          kpi_code?: string | null
          last_assessed?: string
          level: Database["public"]["Enums"]["comparability_level"]
          limitations?: string[] | null
          methodology_match?: number | null
          score?: number
        }
        Update: {
          comparability_notes?: string | null
          country_a?: string
          country_b?: string
          coverage_match?: number | null
          definition_match?: number | null
          id?: string
          kpi_code?: string | null
          last_assessed?: string
          level?: Database["public"]["Enums"]["comparability_level"]
          limitations?: string[] | null
          methodology_match?: number | null
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "country_comparability_country_a_fkey"
            columns: ["country_a"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "country_comparability_country_b_fkey"
            columns: ["country_b"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
      country_gmi_weights: {
        Row: {
          country_code: string
          created_at: string
          gmi_version: string
          id: string
          is_active: boolean
          override_reason: string | null
          weight_overrides: Json
        }
        Insert: {
          country_code: string
          created_at?: string
          gmi_version: string
          id?: string
          is_active?: boolean
          override_reason?: string | null
          weight_overrides?: Json
        }
        Update: {
          country_code?: string
          created_at?: string
          gmi_version?: string
          id?: string
          is_active?: boolean
          override_reason?: string | null
          weight_overrides?: Json
        }
        Relationships: [
          {
            foreignKeyName: "country_gmi_weights_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "country_gmi_weights_gmi_version_fkey"
            columns: ["gmi_version"]
            isOneToOne: false
            referencedRelation: "global_master_index_config"
            referencedColumns: ["version"]
          },
        ]
      }
      critical_signal_overrides: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          kpi_id: string | null
          observation_id: string | null
          override_type: string
          reason: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          kpi_id?: string | null
          observation_id?: string | null
          override_type?: string
          reason: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          kpi_id?: string | null
          observation_id?: string | null
          override_type?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "critical_signal_overrides_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "critical_signal_overrides_observation_id_fkey"
            columns: ["observation_id"]
            isOneToOne: false
            referencedRelation: "observations"
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
      decision_milestones: {
        Row: {
          completed_date: string | null
          created_at: string | null
          decision_id: string
          description: string | null
          id: string
          responsible_entity: string | null
          status: string
          target_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          completed_date?: string | null
          created_at?: string | null
          decision_id: string
          description?: string | null
          id?: string
          responsible_entity?: string | null
          status?: string
          target_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          completed_date?: string | null
          created_at?: string | null
          decision_id?: string
          description?: string | null
          id?: string
          responsible_entity?: string | null
          status?: string
          target_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "decision_milestones_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "policy_decisions"
            referencedColumns: ["id"]
          },
        ]
      }
      decision_outcomes: {
        Row: {
          attribution_score: number | null
          baseline_date: string | null
          baseline_value: number | null
          change_absolute: number | null
          change_percent: number | null
          confidence_level: number | null
          created_at: string | null
          current_value: number
          decision_id: string
          id: string
          kpi_id: string
          measurement_date: string
          notes: string | null
          target_achieved: boolean | null
          target_value: number | null
          updated_at: string | null
        }
        Insert: {
          attribution_score?: number | null
          baseline_date?: string | null
          baseline_value?: number | null
          change_absolute?: number | null
          change_percent?: number | null
          confidence_level?: number | null
          created_at?: string | null
          current_value: number
          decision_id: string
          id?: string
          kpi_id: string
          measurement_date: string
          notes?: string | null
          target_achieved?: boolean | null
          target_value?: number | null
          updated_at?: string | null
        }
        Update: {
          attribution_score?: number | null
          baseline_date?: string | null
          baseline_value?: number | null
          change_absolute?: number | null
          change_percent?: number | null
          confidence_level?: number | null
          created_at?: string | null
          current_value?: number
          decision_id?: string
          id?: string
          kpi_id?: string
          measurement_date?: string
          notes?: string | null
          target_achieved?: boolean | null
          target_value?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "decision_outcomes_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "policy_decisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decision_outcomes_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
        ]
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
      discovered_effects: {
        Row: {
          analysis_method: string
          assumptions: Json
          confidence_score: number
          counterexamples: number | null
          discovered_at: string | null
          duration_months: number | null
          effect_direction: string | null
          effect_magnitude: number | null
          effect_type: string
          geo_scope: string | null
          id: string
          is_verified: boolean | null
          limitations: string[] | null
          p_value: number | null
          replications: number | null
          sample_size: number | null
          source_action_id: string | null
          standard_error: number | null
          target_index_code: string | null
          target_kpi_id: string | null
          time_lag_months: number | null
          time_period_end: string | null
          time_period_start: string | null
          verified_at: string | null
        }
        Insert: {
          analysis_method: string
          assumptions?: Json
          confidence_score: number
          counterexamples?: number | null
          discovered_at?: string | null
          duration_months?: number | null
          effect_direction?: string | null
          effect_magnitude?: number | null
          effect_type: string
          geo_scope?: string | null
          id?: string
          is_verified?: boolean | null
          limitations?: string[] | null
          p_value?: number | null
          replications?: number | null
          sample_size?: number | null
          source_action_id?: string | null
          standard_error?: number | null
          target_index_code?: string | null
          target_kpi_id?: string | null
          time_lag_months?: number | null
          time_period_end?: string | null
          time_period_start?: string | null
          verified_at?: string | null
        }
        Update: {
          analysis_method?: string
          assumptions?: Json
          confidence_score?: number
          counterexamples?: number | null
          discovered_at?: string | null
          duration_months?: number | null
          effect_direction?: string | null
          effect_magnitude?: number | null
          effect_type?: string
          geo_scope?: string | null
          id?: string
          is_verified?: boolean | null
          limitations?: string[] | null
          p_value?: number | null
          replications?: number | null
          sample_size?: number | null
          source_action_id?: string | null
          standard_error?: number | null
          target_index_code?: string | null
          target_kpi_id?: string | null
          time_lag_months?: number | null
          time_period_end?: string | null
          time_period_start?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discovered_effects_target_kpi_id_fkey"
            columns: ["target_kpi_id"]
            isOneToOne: false
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      eu_cluster_members: {
        Row: {
          cluster_id: string
          country_code: string
          distance_to_centroid: number | null
          id: string
          joined_at: string | null
          membership_score: number | null
          nuts_code: string
        }
        Insert: {
          cluster_id: string
          country_code: string
          distance_to_centroid?: number | null
          id?: string
          joined_at?: string | null
          membership_score?: number | null
          nuts_code: string
        }
        Update: {
          cluster_id?: string
          country_code?: string
          distance_to_centroid?: number | null
          id?: string
          joined_at?: string | null
          membership_score?: number | null
          nuts_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "eu_cluster_members_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "eu_clusters"
            referencedColumns: ["id"]
          },
        ]
      }
      eu_clusters: {
        Row: {
          algorithm_used: string | null
          calculated_at: string | null
          centroid_values: Json | null
          cluster_type: string
          code: string
          description: string | null
          id: string
          is_active: boolean | null
          member_count: number | null
          name: string
          nuts_level: number | null
        }
        Insert: {
          algorithm_used?: string | null
          calculated_at?: string | null
          centroid_values?: Json | null
          cluster_type: string
          code: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          member_count?: number | null
          name: string
          nuts_level?: number | null
        }
        Update: {
          algorithm_used?: string | null
          calculated_at?: string | null
          centroid_values?: Json | null
          cluster_type?: string
          code?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          member_count?: number | null
          name?: string
          nuts_level?: number | null
        }
        Relationships: []
      }
      eu_correlations: {
        Row: {
          analysis_method: string | null
          calculated_at: string | null
          correlation_coefficient: number
          id: string
          interpretation: string | null
          is_significant: boolean | null
          kpi_a_id: string
          kpi_b_id: string
          nuts_level: number | null
          p_value: number | null
          period_end: string
          period_start: string
          sample_size: number | null
          stability_score: number | null
          time_lag_months: number | null
        }
        Insert: {
          analysis_method?: string | null
          calculated_at?: string | null
          correlation_coefficient: number
          id?: string
          interpretation?: string | null
          is_significant?: boolean | null
          kpi_a_id: string
          kpi_b_id: string
          nuts_level?: number | null
          p_value?: number | null
          period_end: string
          period_start: string
          sample_size?: number | null
          stability_score?: number | null
          time_lag_months?: number | null
        }
        Update: {
          analysis_method?: string | null
          calculated_at?: string | null
          correlation_coefficient?: number
          id?: string
          interpretation?: string | null
          is_significant?: boolean | null
          kpi_a_id?: string
          kpi_b_id?: string
          nuts_level?: number | null
          p_value?: number | null
          period_end?: string
          period_start?: string
          sample_size?: number | null
          stability_score?: number | null
          time_lag_months?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "eu_correlations_kpi_a_id_fkey"
            columns: ["kpi_a_id"]
            isOneToOne: false
            referencedRelation: "eu_kpi_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eu_correlations_kpi_b_id_fkey"
            columns: ["kpi_b_id"]
            isOneToOne: false
            referencedRelation: "eu_kpi_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      eu_data_sources: {
        Row: {
          api_base_url: string | null
          api_documentation_url: string | null
          code: string
          countries_covered: string[] | null
          created_at: string | null
          data_categories: string[] | null
          description: string | null
          id: string
          is_active: boolean | null
          last_error: string | null
          last_successful_fetch: string | null
          name: string
          nuts_level_support: number[] | null
          reliability_score: number | null
          typical_lag_days: number | null
          update_frequency: Database["public"]["Enums"]["update_frequency"]
          updated_at: string | null
        }
        Insert: {
          api_base_url?: string | null
          api_documentation_url?: string | null
          code: string
          countries_covered?: string[] | null
          created_at?: string | null
          data_categories?: string[] | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_error?: string | null
          last_successful_fetch?: string | null
          name: string
          nuts_level_support?: number[] | null
          reliability_score?: number | null
          typical_lag_days?: number | null
          update_frequency?: Database["public"]["Enums"]["update_frequency"]
          updated_at?: string | null
        }
        Update: {
          api_base_url?: string | null
          api_documentation_url?: string | null
          code?: string
          countries_covered?: string[] | null
          created_at?: string | null
          data_categories?: string[] | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_error?: string | null
          last_successful_fetch?: string | null
          name?: string
          nuts_level_support?: number[] | null
          reliability_score?: number | null
          typical_lag_days?: number | null
          update_frequency?: Database["public"]["Enums"]["update_frequency"]
          updated_at?: string | null
        }
        Relationships: []
      }
      eu_feed_definitions: {
        Row: {
          category: string
          code: string
          created_at: string | null
          description: string | null
          id: string
          include_clusters: boolean | null
          is_active: boolean | null
          max_events_per_day: number | null
          min_effect_threshold: number | null
          min_nuts_level: number | null
          name: string
          tier: Database["public"]["Enums"]["feed_tier"]
        }
        Insert: {
          category: string
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          include_clusters?: boolean | null
          is_active?: boolean | null
          max_events_per_day?: number | null
          min_effect_threshold?: number | null
          min_nuts_level?: number | null
          name: string
          tier?: Database["public"]["Enums"]["feed_tier"]
        }
        Update: {
          category?: string
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          include_clusters?: boolean | null
          is_active?: boolean | null
          max_events_per_day?: number | null
          min_effect_threshold?: number | null
          min_nuts_level?: number | null
          name?: string
          tier?: Database["public"]["Enums"]["feed_tier"]
        }
        Relationships: []
      }
      eu_kpi_definitions: {
        Row: {
          category: string
          code: string
          comparability_score: number | null
          created_at: string | null
          data_quality_notes: string | null
          description: string | null
          ecb_indicator_code: string | null
          ecdc_indicator_code: string | null
          eurostat_indicator_code: string | null
          gmi_component: string | null
          gmi_weight: number | null
          id: string
          is_active: boolean | null
          is_inverted: boolean | null
          max_nuts_level: number | null
          min_nuts_level: number | null
          name: string
          name_local: string | null
          normalization_method: string | null
          unit: string
        }
        Insert: {
          category: string
          code: string
          comparability_score?: number | null
          created_at?: string | null
          data_quality_notes?: string | null
          description?: string | null
          ecb_indicator_code?: string | null
          ecdc_indicator_code?: string | null
          eurostat_indicator_code?: string | null
          gmi_component?: string | null
          gmi_weight?: number | null
          id?: string
          is_active?: boolean | null
          is_inverted?: boolean | null
          max_nuts_level?: number | null
          min_nuts_level?: number | null
          name: string
          name_local?: string | null
          normalization_method?: string | null
          unit: string
        }
        Update: {
          category?: string
          code?: string
          comparability_score?: number | null
          created_at?: string | null
          data_quality_notes?: string | null
          description?: string | null
          ecb_indicator_code?: string | null
          ecdc_indicator_code?: string | null
          eurostat_indicator_code?: string | null
          gmi_component?: string | null
          gmi_weight?: number | null
          id?: string
          is_active?: boolean | null
          is_inverted?: boolean | null
          max_nuts_level?: number | null
          min_nuts_level?: number | null
          name?: string
          name_local?: string | null
          normalization_method?: string | null
          unit?: string
        }
        Relationships: []
      }
      eu_kpi_values: {
        Row: {
          confidence: number | null
          country_code: string
          created_at: string | null
          data_source_code: string
          estimation_method: string | null
          flags: string[] | null
          id: string
          is_estimated: boolean | null
          kpi_id: string
          nuts_code: string
          period_end: string
          period_start: string
          previous_value: number | null
          source_indicator_code: string | null
          source_url: string | null
          trend: Database["public"]["Enums"]["trend_direction"] | null
          trend_percent: number | null
          updated_at: string | null
          value: number
          value_normalized: number | null
        }
        Insert: {
          confidence?: number | null
          country_code: string
          created_at?: string | null
          data_source_code: string
          estimation_method?: string | null
          flags?: string[] | null
          id?: string
          is_estimated?: boolean | null
          kpi_id: string
          nuts_code: string
          period_end: string
          period_start: string
          previous_value?: number | null
          source_indicator_code?: string | null
          source_url?: string | null
          trend?: Database["public"]["Enums"]["trend_direction"] | null
          trend_percent?: number | null
          updated_at?: string | null
          value: number
          value_normalized?: number | null
        }
        Update: {
          confidence?: number | null
          country_code?: string
          created_at?: string | null
          data_source_code?: string
          estimation_method?: string | null
          flags?: string[] | null
          id?: string
          is_estimated?: boolean | null
          kpi_id?: string
          nuts_code?: string
          period_end?: string
          period_start?: string
          previous_value?: number | null
          source_indicator_code?: string | null
          source_url?: string | null
          trend?: Database["public"]["Enums"]["trend_direction"] | null
          trend_percent?: number | null
          updated_at?: string | null
          value?: number
          value_normalized?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "eu_kpi_values_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "eu_kpi_values_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "eu_kpi_definitions"
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
      event_taxonomy: {
        Row: {
          category: string
          code: string
          created_at: string | null
          definition: string
          detection_keywords: Json | null
          expected_data_links: Json | null
          expected_kpi_impacts: Json | null
          geographic_scope: string | null
          id: string
          is_active: boolean | null
          name: string
          name_local: Json | null
          parent_event_id: string | null
          severity_scale: Json | null
          typical_duration: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          code: string
          created_at?: string | null
          definition: string
          detection_keywords?: Json | null
          expected_data_links?: Json | null
          expected_kpi_impacts?: Json | null
          geographic_scope?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_local?: Json | null
          parent_event_id?: string | null
          severity_scale?: Json | null
          typical_duration?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          code?: string
          created_at?: string | null
          definition?: string
          detection_keywords?: Json | null
          expected_data_links?: Json | null
          expected_kpi_impacts?: Json | null
          geographic_scope?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_local?: Json | null
          parent_event_id?: string | null
          severity_scale?: Json | null
          typical_duration?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_taxonomy_parent_event_id_fkey"
            columns: ["parent_event_id"]
            isOneToOne: false
            referencedRelation: "event_taxonomy"
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
      fast_data_sources: {
        Row: {
          api_endpoint: string | null
          code: string
          created_at: string | null
          data_type: string
          fallback_value: Json | null
          id: string
          is_active: boolean | null
          is_realtime: boolean | null
          last_updated_at: string | null
          last_value: Json | null
          latency_ms: number | null
          name: string
          update_frequency_seconds: number | null
        }
        Insert: {
          api_endpoint?: string | null
          code: string
          created_at?: string | null
          data_type: string
          fallback_value?: Json | null
          id?: string
          is_active?: boolean | null
          is_realtime?: boolean | null
          last_updated_at?: string | null
          last_value?: Json | null
          latency_ms?: number | null
          name: string
          update_frequency_seconds?: number | null
        }
        Update: {
          api_endpoint?: string | null
          code?: string
          created_at?: string | null
          data_type?: string
          fallback_value?: Json | null
          id?: string
          is_active?: boolean | null
          is_realtime?: boolean | null
          last_updated_at?: string | null
          last_value?: Json | null
          latency_ms?: number | null
          name?: string
          update_frequency_seconds?: number | null
        }
        Relationships: []
      }
      fast_data_values: {
        Row: {
          id: string
          is_live: boolean | null
          latency_ms: number | null
          metadata: Json | null
          recorded_at: string | null
          source_id: string | null
          unit: string | null
          value: number
        }
        Insert: {
          id?: string
          is_live?: boolean | null
          latency_ms?: number | null
          metadata?: Json | null
          recorded_at?: string | null
          source_id?: string | null
          unit?: string | null
          value: number
        }
        Update: {
          id?: string
          is_live?: boolean | null
          latency_ms?: number | null
          metadata?: Json | null
          recorded_at?: string | null
          source_id?: string | null
          unit?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "fast_data_values_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "fast_data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_definitions: {
        Row: {
          category: string
          code: string
          created_at: string
          default_frequency: string
          description: string
          id: string
          include_links: boolean
          include_metrics: boolean
          include_why_now: boolean
          is_active: boolean
          max_events_per_day: number
          min_confidence: number
          min_duration_periods: number
          min_effect_threshold: number
          name: string
          tier: Database["public"]["Enums"]["feed_tier"]
          updated_at: string
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          default_frequency?: string
          description: string
          id?: string
          include_links?: boolean
          include_metrics?: boolean
          include_why_now?: boolean
          is_active?: boolean
          max_events_per_day?: number
          min_confidence?: number
          min_duration_periods?: number
          min_effect_threshold?: number
          name: string
          tier?: Database["public"]["Enums"]["feed_tier"]
          updated_at?: string
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          default_frequency?: string
          description?: string
          id?: string
          include_links?: boolean
          include_metrics?: boolean
          include_why_now?: boolean
          is_active?: boolean
          max_events_per_day?: number
          min_confidence?: number
          min_duration_periods?: number
          min_effect_threshold?: number
          name?: string
          tier?: Database["public"]["Enums"]["feed_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      feed_delivery_log: {
        Row: {
          delivered_at: string
          delivery_method: Database["public"]["Enums"]["delivery_method"]
          error_message: string | null
          event_id: string
          id: string
          response_code: number | null
          response_time_ms: number | null
          retry_count: number
          status: string
          subscription_id: string
        }
        Insert: {
          delivered_at?: string
          delivery_method: Database["public"]["Enums"]["delivery_method"]
          error_message?: string | null
          event_id: string
          id?: string
          response_code?: number | null
          response_time_ms?: number | null
          retry_count?: number
          status?: string
          subscription_id: string
        }
        Update: {
          delivered_at?: string
          delivery_method?: Database["public"]["Enums"]["delivery_method"]
          error_message?: string | null
          event_id?: string
          id?: string
          response_code?: number | null
          response_time_ms?: number | null
          retry_count?: number
          status?: string
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_delivery_log_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "feed_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_delivery_log_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "feed_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_event_interactions: {
        Row: {
          created_at: string
          event_id: string
          id: string
          interaction_context: Json | null
          interaction_type: string
          subscription_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          interaction_context?: Json | null
          interaction_type: string
          subscription_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          interaction_context?: Json | null
          interaction_type?: string
          subscription_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feed_event_interactions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "feed_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_event_interactions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "feed_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_events: {
        Row: {
          checksum: string
          confidence: string
          data_sources: string[]
          decision_ids: string[] | null
          explore_url: string | null
          feed_id: string
          generated_at: string
          generation_context: Json | null
          id: string
          kpi_ids: string[]
          methodology_url: string | null
          metrics: Json
          observation_ids: string[] | null
          scope_code: string | null
          scope_type: string
          severity: Database["public"]["Enums"]["feed_severity"]
          source_urls: Json | null
          summary: string
          valid_from: string
          valid_until: string | null
          why_now: Json
        }
        Insert: {
          checksum: string
          confidence?: string
          data_sources?: string[]
          decision_ids?: string[] | null
          explore_url?: string | null
          feed_id: string
          generated_at?: string
          generation_context?: Json | null
          id?: string
          kpi_ids?: string[]
          methodology_url?: string | null
          metrics?: Json
          observation_ids?: string[] | null
          scope_code?: string | null
          scope_type?: string
          severity?: Database["public"]["Enums"]["feed_severity"]
          source_urls?: Json | null
          summary: string
          valid_from?: string
          valid_until?: string | null
          why_now?: Json
        }
        Update: {
          checksum?: string
          confidence?: string
          data_sources?: string[]
          decision_ids?: string[] | null
          explore_url?: string | null
          feed_id?: string
          generated_at?: string
          generation_context?: Json | null
          id?: string
          kpi_ids?: string[]
          methodology_url?: string | null
          metrics?: Json
          observation_ids?: string[] | null
          scope_code?: string | null
          scope_type?: string
          severity?: Database["public"]["Enums"]["feed_severity"]
          source_urls?: Json | null
          summary?: string
          valid_from?: string
          valid_until?: string | null
          why_now?: Json
        }
        Relationships: [
          {
            foreignKeyName: "feed_events_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "feed_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_subscriptions: {
        Row: {
          api_key_id: string | null
          created_at: string
          custom_frequency: string | null
          custom_max_events_per_day: number | null
          delivery_method: Database["public"]["Enums"]["delivery_method"]
          demographic_filter: Json | null
          feed_id: string
          id: string
          is_active: boolean
          is_paused: boolean
          kpi_category_filter: string[] | null
          min_severity: Database["public"]["Enums"]["feed_severity"]
          pause_until: string | null
          region_filter: string[] | null
          responsibility_level_filter: string[] | null
          updated_at: string
          user_id: string | null
          webhook_secret: string | null
          webhook_url: string | null
        }
        Insert: {
          api_key_id?: string | null
          created_at?: string
          custom_frequency?: string | null
          custom_max_events_per_day?: number | null
          delivery_method?: Database["public"]["Enums"]["delivery_method"]
          demographic_filter?: Json | null
          feed_id: string
          id?: string
          is_active?: boolean
          is_paused?: boolean
          kpi_category_filter?: string[] | null
          min_severity?: Database["public"]["Enums"]["feed_severity"]
          pause_until?: string | null
          region_filter?: string[] | null
          responsibility_level_filter?: string[] | null
          updated_at?: string
          user_id?: string | null
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Update: {
          api_key_id?: string | null
          created_at?: string
          custom_frequency?: string | null
          custom_max_events_per_day?: number | null
          delivery_method?: Database["public"]["Enums"]["delivery_method"]
          demographic_filter?: Json | null
          feed_id?: string
          id?: string
          is_active?: boolean
          is_paused?: boolean
          kpi_category_filter?: string[] | null
          min_severity?: Database["public"]["Enums"]["feed_severity"]
          pause_until?: string | null
          region_filter?: string[] | null
          responsibility_level_filter?: string[] | null
          updated_at?: string
          user_id?: string | null
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feed_subscriptions_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "feed_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_threshold_adjustments: {
        Row: {
          adjusted_by: string
          adjustment_type: string
          created_at: string
          evidence: Json | null
          feed_id: string
          id: string
          new_value: number
          old_value: number
          reason: string
        }
        Insert: {
          adjusted_by?: string
          adjustment_type: string
          created_at?: string
          evidence?: Json | null
          feed_id: string
          id?: string
          new_value: number
          old_value: number
          reason: string
        }
        Update: {
          adjusted_by?: string
          adjustment_type?: string
          created_at?: string
          evidence?: Json | null
          feed_id?: string
          id?: string
          new_value?: number
          old_value?: number
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_threshold_adjustments_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "feed_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      global_changelog: {
        Row: {
          affected_downstream: string[] | null
          change_magnitude: number | null
          change_reason: string | null
          change_type: string
          changed_at: string
          changed_by: string | null
          entity_code: string | null
          entity_id: string | null
          entity_type: string
          id: string
          is_breaking_change: boolean | null
          metadata: Json | null
          new_value: Json | null
          old_value: Json | null
          recalculation_completed: boolean | null
          requires_recalculation: boolean | null
          source_reference: string | null
        }
        Insert: {
          affected_downstream?: string[] | null
          change_magnitude?: number | null
          change_reason?: string | null
          change_type: string
          changed_at?: string
          changed_by?: string | null
          entity_code?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          is_breaking_change?: boolean | null
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          recalculation_completed?: boolean | null
          requires_recalculation?: boolean | null
          source_reference?: string | null
        }
        Update: {
          affected_downstream?: string[] | null
          change_magnitude?: number | null
          change_reason?: string | null
          change_type?: string
          changed_at?: string
          changed_by?: string | null
          entity_code?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          is_breaking_change?: boolean | null
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          recalculation_completed?: boolean | null
          requires_recalculation?: boolean | null
          source_reference?: string | null
        }
        Relationships: []
      }
      global_data_sources: {
        Row: {
          api_base_url: string | null
          api_documentation_url: string | null
          code: string
          countries_covered: string[] | null
          created_at: string
          data_depth: Database["public"]["Enums"]["data_depth_level"]
          geographic_coverage: string
          id: string
          indicator_catalog_url: string | null
          indicator_count: number | null
          is_active: boolean
          last_error: string | null
          last_successful_fetch: string | null
          name: string
          reliability_score: number
          requires_auth: boolean
          typical_lag_days: number | null
          update_frequency: Database["public"]["Enums"]["update_frequency"]
          updated_at: string
        }
        Insert: {
          api_base_url?: string | null
          api_documentation_url?: string | null
          code: string
          countries_covered?: string[] | null
          created_at?: string
          data_depth: Database["public"]["Enums"]["data_depth_level"]
          geographic_coverage: string
          id?: string
          indicator_catalog_url?: string | null
          indicator_count?: number | null
          is_active?: boolean
          last_error?: string | null
          last_successful_fetch?: string | null
          name: string
          reliability_score?: number
          requires_auth?: boolean
          typical_lag_days?: number | null
          update_frequency: Database["public"]["Enums"]["update_frequency"]
          updated_at?: string
        }
        Update: {
          api_base_url?: string | null
          api_documentation_url?: string | null
          code?: string
          countries_covered?: string[] | null
          created_at?: string
          data_depth?: Database["public"]["Enums"]["data_depth_level"]
          geographic_coverage?: string
          id?: string
          indicator_catalog_url?: string | null
          indicator_count?: number | null
          is_active?: boolean
          last_error?: string | null
          last_successful_fetch?: string | null
          name?: string
          reliability_score?: number
          requires_auth?: boolean
          typical_lag_days?: number | null
          update_frequency?: Database["public"]["Enums"]["update_frequency"]
          updated_at?: string
        }
        Relationships: []
      }
      global_events: {
        Row: {
          affected_population: number | null
          confidence_score: number | null
          created_at: string | null
          description: string | null
          event_time: string
          event_type_id: string | null
          geo_city: string | null
          geo_coordinates: Json | null
          geo_country: string | null
          geo_precision: string | null
          geo_region: string | null
          id: string
          impact_radius_km: number | null
          intensity: number | null
          is_verified: boolean | null
          related_countries: string[] | null
          related_kpis: string[] | null
          source_events: Json | null
          time_precision: string | null
          title: string
          updated_at: string | null
          verified_by: string | null
        }
        Insert: {
          affected_population?: number | null
          confidence_score?: number | null
          created_at?: string | null
          description?: string | null
          event_time: string
          event_type_id?: string | null
          geo_city?: string | null
          geo_coordinates?: Json | null
          geo_country?: string | null
          geo_precision?: string | null
          geo_region?: string | null
          id?: string
          impact_radius_km?: number | null
          intensity?: number | null
          is_verified?: boolean | null
          related_countries?: string[] | null
          related_kpis?: string[] | null
          source_events?: Json | null
          time_precision?: string | null
          title: string
          updated_at?: string | null
          verified_by?: string | null
        }
        Update: {
          affected_population?: number | null
          confidence_score?: number | null
          created_at?: string | null
          description?: string | null
          event_time?: string
          event_type_id?: string | null
          geo_city?: string | null
          geo_coordinates?: Json | null
          geo_country?: string | null
          geo_precision?: string | null
          geo_region?: string | null
          id?: string
          impact_radius_km?: number | null
          intensity?: number | null
          is_verified?: boolean | null
          related_countries?: string[] | null
          related_kpis?: string[] | null
          source_events?: Json | null
          time_precision?: string | null
          title?: string
          updated_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "global_events_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "event_taxonomy"
            referencedColumns: ["id"]
          },
        ]
      }
      global_feed_definitions: {
        Row: {
          category: string
          code: string
          created_at: string | null
          data_depth_required:
            | Database["public"]["Enums"]["data_depth_level"]
            | null
          description: string | null
          id: string
          is_active: boolean | null
          max_countries_per_event: number | null
          max_events_per_day: number | null
          min_gmi_change: number | null
          name: string
          regions: string[] | null
          tier: Database["public"]["Enums"]["feed_tier"]
        }
        Insert: {
          category: string
          code: string
          created_at?: string | null
          data_depth_required?:
            | Database["public"]["Enums"]["data_depth_level"]
            | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_countries_per_event?: number | null
          max_events_per_day?: number | null
          min_gmi_change?: number | null
          name: string
          regions?: string[] | null
          tier?: Database["public"]["Enums"]["feed_tier"]
        }
        Update: {
          category?: string
          code?: string
          created_at?: string | null
          data_depth_required?:
            | Database["public"]["Enums"]["data_depth_level"]
            | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_countries_per_event?: number | null
          max_events_per_day?: number | null
          min_gmi_change?: number | null
          name?: string
          regions?: string[] | null
          tier?: Database["public"]["Enums"]["feed_tier"]
        }
        Relationships: []
      }
      global_feed_events: {
        Row: {
          checksum: string
          countries: string[]
          data_sources: string[] | null
          event_type: string
          feed_id: string
          generated_at: string | null
          gmi_changes: Json | null
          id: string
          kpi_codes: string[] | null
          metrics: Json
          region: string | null
          severity: Database["public"]["Enums"]["feed_severity"]
          summary: string
          title: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          checksum: string
          countries: string[]
          data_sources?: string[] | null
          event_type: string
          feed_id: string
          generated_at?: string | null
          gmi_changes?: Json | null
          id?: string
          kpi_codes?: string[] | null
          metrics?: Json
          region?: string | null
          severity?: Database["public"]["Enums"]["feed_severity"]
          summary: string
          title: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          checksum?: string
          countries?: string[]
          data_sources?: string[] | null
          event_type?: string
          feed_id?: string
          generated_at?: string | null
          gmi_changes?: Json | null
          id?: string
          kpi_codes?: string[] | null
          metrics?: Json
          region?: string | null
          severity?: Database["public"]["Enums"]["feed_severity"]
          summary?: string
          title?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "global_feed_events_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "global_feed_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      global_kpi_mappings: {
        Row: {
          created_at: string
          gmi_component: string | null
          id: string
          internal_kpi_code: string
          internal_kpi_name: string
          is_active: boolean
          mapping_confidence: number
          notes: string | null
          source_code: string
          source_indicator_code: string
          source_indicator_name: string | null
          transformation: string | null
          transformation_formula: string | null
          unit_conversion: number | null
        }
        Insert: {
          created_at?: string
          gmi_component?: string | null
          id?: string
          internal_kpi_code: string
          internal_kpi_name: string
          is_active?: boolean
          mapping_confidence?: number
          notes?: string | null
          source_code: string
          source_indicator_code: string
          source_indicator_name?: string | null
          transformation?: string | null
          transformation_formula?: string | null
          unit_conversion?: number | null
        }
        Update: {
          created_at?: string
          gmi_component?: string | null
          id?: string
          internal_kpi_code?: string
          internal_kpi_name?: string
          is_active?: boolean
          mapping_confidence?: number
          notes?: string | null
          source_code?: string
          source_indicator_code?: string
          source_indicator_name?: string | null
          transformation?: string | null
          transformation_formula?: string | null
          unit_conversion?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "global_kpi_mappings_source_code_fkey"
            columns: ["source_code"]
            isOneToOne: false
            referencedRelation: "global_data_sources"
            referencedColumns: ["code"]
          },
        ]
      }
      global_kpi_values: {
        Row: {
          confidence: number
          country_code: string
          created_at: string
          data_quality: Database["public"]["Enums"]["data_depth_level"]
          data_source_code: string
          estimation_method: string | null
          gmi_component: string | null
          granularity: string
          id: string
          is_estimated: boolean
          kpi_code: string
          period_end: string
          period_start: string
          previous_value: number | null
          region_code: string | null
          source_indicator_code: string | null
          source_url: string | null
          trend: Database["public"]["Enums"]["trend_direction"] | null
          trend_percent: number | null
          uncertainty_range: number | null
          unit: string
          updated_at: string
          value: number
          value_normalized: number | null
        }
        Insert: {
          confidence?: number
          country_code: string
          created_at?: string
          data_quality?: Database["public"]["Enums"]["data_depth_level"]
          data_source_code: string
          estimation_method?: string | null
          gmi_component?: string | null
          granularity?: string
          id?: string
          is_estimated?: boolean
          kpi_code: string
          period_end: string
          period_start: string
          previous_value?: number | null
          region_code?: string | null
          source_indicator_code?: string | null
          source_url?: string | null
          trend?: Database["public"]["Enums"]["trend_direction"] | null
          trend_percent?: number | null
          uncertainty_range?: number | null
          unit: string
          updated_at?: string
          value: number
          value_normalized?: number | null
        }
        Update: {
          confidence?: number
          country_code?: string
          created_at?: string
          data_quality?: Database["public"]["Enums"]["data_depth_level"]
          data_source_code?: string
          estimation_method?: string | null
          gmi_component?: string | null
          granularity?: string
          id?: string
          is_estimated?: boolean
          kpi_code?: string
          period_end?: string
          period_start?: string
          previous_value?: number | null
          region_code?: string | null
          source_indicator_code?: string | null
          source_url?: string | null
          trend?: Database["public"]["Enums"]["trend_direction"] | null
          trend_percent?: number | null
          uncertainty_range?: number | null
          unit?: string
          updated_at?: string
          value?: number
          value_normalized?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "global_kpi_values_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
      global_master_index_config: {
        Row: {
          components: Json
          created_at: string
          default_weights: Json
          description: string | null
          id: string
          is_active: boolean
          missing_data_handling: string
          normalization_method: string
          valid_from: string
          valid_until: string | null
          version: string
        }
        Insert: {
          components?: Json
          created_at?: string
          default_weights?: Json
          description?: string | null
          id?: string
          is_active?: boolean
          missing_data_handling?: string
          normalization_method?: string
          valid_from?: string
          valid_until?: string | null
          version: string
        }
        Update: {
          components?: Json
          created_at?: string
          default_weights?: Json
          description?: string | null
          id?: string
          is_active?: boolean
          missing_data_handling?: string
          normalization_method?: string
          valid_from?: string
          valid_until?: string | null
          version?: string
        }
        Relationships: []
      }
      global_master_index_values: {
        Row: {
          average_confidence: number | null
          bloc_rank: number | null
          calculated_at: string
          component_values: Json
          country_code: string
          data_completeness: number
          data_gaps: string[] | null
          global_rank: number | null
          gmi_version: string
          id: string
          period_end: string
          period_start: string
          previous_value: number | null
          region_code: string | null
          regional_rank: number | null
          trend: Database["public"]["Enums"]["trend_direction"] | null
          trend_percent: number | null
          value: number
        }
        Insert: {
          average_confidence?: number | null
          bloc_rank?: number | null
          calculated_at?: string
          component_values?: Json
          country_code: string
          data_completeness?: number
          data_gaps?: string[] | null
          global_rank?: number | null
          gmi_version: string
          id?: string
          period_end: string
          period_start: string
          previous_value?: number | null
          region_code?: string | null
          regional_rank?: number | null
          trend?: Database["public"]["Enums"]["trend_direction"] | null
          trend_percent?: number | null
          value: number
        }
        Update: {
          average_confidence?: number | null
          bloc_rank?: number | null
          calculated_at?: string
          component_values?: Json
          country_code?: string
          data_completeness?: number
          data_gaps?: string[] | null
          global_rank?: number | null
          gmi_version?: string
          id?: string
          period_end?: string
          period_start?: string
          previous_value?: number | null
          region_code?: string | null
          regional_rank?: number | null
          trend?: Database["public"]["Enums"]["trend_direction"] | null
          trend_percent?: number | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "global_master_index_values_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "global_master_index_values_gmi_version_fkey"
            columns: ["gmi_version"]
            isOneToOne: false
            referencedRelation: "global_master_index_config"
            referencedColumns: ["version"]
          },
        ]
      }
      gmi_scores: {
        Row: {
          calculated_at: string | null
          calculation_notes: string | null
          comparability_level: Database["public"]["Enums"]["comparability_level"]
          country_code: string
          data_completeness: number | null
          data_freshness_months: number | null
          demographics_score: number | null
          economy_score: number | null
          education_score: number | null
          employment_score: number | null
          environment_score: number | null
          gmi_rank: number | null
          gmi_score: number
          gmi_version: string
          governance_score: number | null
          health_score: number | null
          id: string
          indicators_available: number
          indicators_total: number
          period_year: number
          previous_score: number | null
          trend: Database["public"]["Enums"]["trend_direction"] | null
          trend_percent: number | null
        }
        Insert: {
          calculated_at?: string | null
          calculation_notes?: string | null
          comparability_level?: Database["public"]["Enums"]["comparability_level"]
          country_code: string
          data_completeness?: number | null
          data_freshness_months?: number | null
          demographics_score?: number | null
          economy_score?: number | null
          education_score?: number | null
          employment_score?: number | null
          environment_score?: number | null
          gmi_rank?: number | null
          gmi_score: number
          gmi_version: string
          governance_score?: number | null
          health_score?: number | null
          id?: string
          indicators_available: number
          indicators_total: number
          period_year: number
          previous_score?: number | null
          trend?: Database["public"]["Enums"]["trend_direction"] | null
          trend_percent?: number | null
        }
        Update: {
          calculated_at?: string | null
          calculation_notes?: string | null
          comparability_level?: Database["public"]["Enums"]["comparability_level"]
          country_code?: string
          data_completeness?: number | null
          data_freshness_months?: number | null
          demographics_score?: number | null
          economy_score?: number | null
          education_score?: number | null
          employment_score?: number | null
          environment_score?: number | null
          gmi_rank?: number | null
          gmi_score?: number
          gmi_version?: string
          governance_score?: number | null
          health_score?: number | null
          id?: string
          indicators_available?: number
          indicators_total?: number
          period_year?: number
          previous_score?: number | null
          trend?: Database["public"]["Enums"]["trend_direction"] | null
          trend_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gmi_scores_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "gmi_scores_gmi_version_fkey"
            columns: ["gmi_version"]
            isOneToOne: false
            referencedRelation: "global_master_index_config"
            referencedColumns: ["version"]
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
      ingest_mappings: {
        Row: {
          created_at: string | null
          geo_code_format: string | null
          geo_field_path: string | null
          geo_level: string | null
          id: string
          is_active: boolean | null
          mapping_confidence: number | null
          scale_factor: number | null
          schema_version: number
          source_code: string
          source_field_name: string | null
          source_field_path: string
          source_unit: string | null
          target_kpi_code: string
          target_unit: string | null
          time_field_path: string | null
          time_format: string | null
          transformation_formula: string | null
          transformation_type: string
        }
        Insert: {
          created_at?: string | null
          geo_code_format?: string | null
          geo_field_path?: string | null
          geo_level?: string | null
          id?: string
          is_active?: boolean | null
          mapping_confidence?: number | null
          scale_factor?: number | null
          schema_version: number
          source_code: string
          source_field_name?: string | null
          source_field_path: string
          source_unit?: string | null
          target_kpi_code: string
          target_unit?: string | null
          time_field_path?: string | null
          time_format?: string | null
          transformation_formula?: string | null
          transformation_type?: string
        }
        Update: {
          created_at?: string | null
          geo_code_format?: string | null
          geo_field_path?: string | null
          geo_level?: string | null
          id?: string
          is_active?: boolean | null
          mapping_confidence?: number | null
          scale_factor?: number | null
          schema_version?: number
          source_code?: string
          source_field_name?: string | null
          source_field_path?: string
          source_unit?: string | null
          target_kpi_code?: string
          target_unit?: string | null
          time_field_path?: string | null
          time_format?: string | null
          transformation_formula?: string | null
          transformation_type?: string
        }
        Relationships: []
      }
      ingest_pipeline_runs: {
        Row: {
          completed_at: string | null
          duration_ms: number | null
          error_details: Json | null
          error_message: string | null
          fetch_id: string
          id: string
          layer_1_completed_at: string | null
          layer_1_status: string | null
          layer_2_completed_at: string | null
          layer_2_status: string | null
          layer_3_completed_at: string | null
          layer_3_status: string | null
          layer_4_completed_at: string | null
          layer_4_status: string | null
          mapping_errors: number | null
          records_aggregated: number | null
          records_fetched: number | null
          records_mapped: number | null
          records_validated: number | null
          retry_count: number | null
          source_code: string
          started_at: string | null
          status: string
          validation_errors: number | null
        }
        Insert: {
          completed_at?: string | null
          duration_ms?: number | null
          error_details?: Json | null
          error_message?: string | null
          fetch_id: string
          id?: string
          layer_1_completed_at?: string | null
          layer_1_status?: string | null
          layer_2_completed_at?: string | null
          layer_2_status?: string | null
          layer_3_completed_at?: string | null
          layer_3_status?: string | null
          layer_4_completed_at?: string | null
          layer_4_status?: string | null
          mapping_errors?: number | null
          records_aggregated?: number | null
          records_fetched?: number | null
          records_mapped?: number | null
          records_validated?: number | null
          retry_count?: number | null
          source_code: string
          started_at?: string | null
          status?: string
          validation_errors?: number | null
        }
        Update: {
          completed_at?: string | null
          duration_ms?: number | null
          error_details?: Json | null
          error_message?: string | null
          fetch_id?: string
          id?: string
          layer_1_completed_at?: string | null
          layer_1_status?: string | null
          layer_2_completed_at?: string | null
          layer_2_status?: string | null
          layer_3_completed_at?: string | null
          layer_3_status?: string | null
          layer_4_completed_at?: string | null
          layer_4_status?: string | null
          mapping_errors?: number | null
          records_aggregated?: number | null
          records_fetched?: number | null
          records_mapped?: number | null
          records_validated?: number | null
          retry_count?: number | null
          source_code?: string
          started_at?: string | null
          status?: string
          validation_errors?: number | null
        }
        Relationships: []
      }
      ingest_schemas: {
        Row: {
          breaking_changes: Json | null
          change_type: string | null
          detected_at: string | null
          detected_fields: string[] | null
          field_types: Json | null
          id: string
          is_current: boolean | null
          schema_definition: Json
          source_code: string
          superseded_at: string | null
          version: number
        }
        Insert: {
          breaking_changes?: Json | null
          change_type?: string | null
          detected_at?: string | null
          detected_fields?: string[] | null
          field_types?: Json | null
          id?: string
          is_current?: boolean | null
          schema_definition: Json
          source_code: string
          superseded_at?: string | null
          version?: number
        }
        Update: {
          breaking_changes?: Json | null
          change_type?: string | null
          detected_at?: string | null
          detected_fields?: string[] | null
          field_types?: Json | null
          id?: string
          is_current?: boolean | null
          schema_definition?: Json
          source_code?: string
          superseded_at?: string | null
          version?: number
        }
        Relationships: []
      }
      ingest_sources: {
        Row: {
          auth_config: Json | null
          auth_type: string | null
          base_url: string | null
          code: string
          consecutive_failures: number | null
          countries_covered: string[] | null
          created_at: string | null
          documentation_url: string | null
          geographic_coverage: string
          id: string
          is_active: boolean | null
          last_error: string | null
          last_fetch_at: string | null
          last_success_at: string | null
          license_type: string | null
          license_url: string | null
          name: string
          schedule_cron: string | null
          schedule_type: string
          source_type: string
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          auth_config?: Json | null
          auth_type?: string | null
          base_url?: string | null
          code: string
          consecutive_failures?: number | null
          countries_covered?: string[] | null
          created_at?: string | null
          documentation_url?: string | null
          geographic_coverage?: string
          id?: string
          is_active?: boolean | null
          last_error?: string | null
          last_fetch_at?: string | null
          last_success_at?: string | null
          license_type?: string | null
          license_url?: string | null
          name: string
          schedule_cron?: string | null
          schedule_type?: string
          source_type: string
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          auth_config?: Json | null
          auth_type?: string | null
          base_url?: string | null
          code?: string
          consecutive_failures?: number | null
          countries_covered?: string[] | null
          created_at?: string | null
          documentation_url?: string | null
          geographic_coverage?: string
          id?: string
          is_active?: boolean | null
          last_error?: string | null
          last_fetch_at?: string | null
          last_success_at?: string | null
          license_type?: string | null
          license_url?: string | null
          name?: string
          schedule_cron?: string | null
          schedule_type?: string
          source_type?: string
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ingest_validation_rules: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          kpi_code: string | null
          rule_config: Json
          rule_name: string
          rule_type: string
          severity: string
          source_code: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          kpi_code?: string | null
          rule_config: Json
          rule_name: string
          rule_type: string
          severity?: string
          source_code?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          kpi_code?: string | null
          rule_config?: Json
          rule_name?: string
          rule_type?: string
          severity?: string
          source_code?: string | null
        }
        Relationships: []
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
      knowledge_boundaries: {
        Row: {
          assessed_at: string | null
          assessor: string | null
          caveats: string[] | null
          data_gaps: string[] | null
          entity_id: string
          entity_type: string
          explicit_assumptions: string[] | null
          id: string
          implicit_assumptions: string[] | null
          known_confidence: number | null
          known_facts: Json
          methodological_limits: string[] | null
          missing_data_types: string[] | null
          missing_geographies: string[] | null
          missing_time_periods: string[] | null
          unknown_aspects: string[] | null
        }
        Insert: {
          assessed_at?: string | null
          assessor?: string | null
          caveats?: string[] | null
          data_gaps?: string[] | null
          entity_id: string
          entity_type: string
          explicit_assumptions?: string[] | null
          id?: string
          implicit_assumptions?: string[] | null
          known_confidence?: number | null
          known_facts?: Json
          methodological_limits?: string[] | null
          missing_data_types?: string[] | null
          missing_geographies?: string[] | null
          missing_time_periods?: string[] | null
          unknown_aspects?: string[] | null
        }
        Update: {
          assessed_at?: string | null
          assessor?: string | null
          caveats?: string[] | null
          data_gaps?: string[] | null
          entity_id?: string
          entity_type?: string
          explicit_assumptions?: string[] | null
          id?: string
          implicit_assumptions?: string[] | null
          known_confidence?: number | null
          known_facts?: Json
          methodological_limits?: string[] | null
          missing_data_types?: string[] | null
          missing_geographies?: string[] | null
          missing_time_periods?: string[] | null
          unknown_aspects?: string[] | null
        }
        Relationships: []
      }
      knowledge_graph_edges: {
        Row: {
          confidence: number | null
          created_at: string | null
          edge_type: string
          id: string
          properties: Json | null
          source_node_id: string | null
          target_node_id: string | null
          valid_from: string | null
          valid_until: string | null
          weight: number | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          edge_type: string
          id?: string
          properties?: Json | null
          source_node_id?: string | null
          target_node_id?: string | null
          valid_from?: string | null
          valid_until?: string | null
          weight?: number | null
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          edge_type?: string
          id?: string
          properties?: Json | null
          source_node_id?: string | null
          target_node_id?: string | null
          valid_from?: string | null
          valid_until?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_graph_edges_source_node_id_fkey"
            columns: ["source_node_id"]
            isOneToOne: false
            referencedRelation: "knowledge_graph_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_graph_edges_target_node_id_fkey"
            columns: ["target_node_id"]
            isOneToOne: false
            referencedRelation: "knowledge_graph_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_graph_nodes: {
        Row: {
          created_at: string | null
          embedding_text: string | null
          entity_id: string | null
          entity_table: string | null
          id: string
          label: string
          node_type: string
          properties: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          embedding_text?: string | null
          entity_id?: string | null
          entity_table?: string | null
          id?: string
          label: string
          node_type: string
          properties?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          embedding_text?: string | null
          entity_id?: string | null
          entity_table?: string | null
          id?: string
          label?: string
          node_type?: string
          properties?: Json | null
          updated_at?: string | null
        }
        Relationships: []
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
      learning_replications: {
        Row: {
          conditions: Json | null
          deviation_explanation: string | null
          deviation_from_original: number | null
          effect_observed: string | null
          geo_context: string
          id: string
          learning_id: string | null
          recorded_at: string | null
          replicated: boolean
          source_effect_id: string | null
          time_context: string
        }
        Insert: {
          conditions?: Json | null
          deviation_explanation?: string | null
          deviation_from_original?: number | null
          effect_observed?: string | null
          geo_context: string
          id?: string
          learning_id?: string | null
          recorded_at?: string | null
          replicated: boolean
          source_effect_id?: string | null
          time_context: string
        }
        Update: {
          conditions?: Json | null
          deviation_explanation?: string | null
          deviation_from_original?: number | null
          effect_observed?: string | null
          geo_context?: string
          id?: string
          learning_id?: string | null
          recorded_at?: string | null
          replicated?: boolean
          source_effect_id?: string | null
          time_context?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_replications_learning_id_fkey"
            columns: ["learning_id"]
            isOneToOne: false
            referencedRelation: "learnings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_replications_source_effect_id_fkey"
            columns: ["source_effect_id"]
            isOneToOne: false
            referencedRelation: "discovered_effects"
            referencedColumns: ["id"]
          },
        ]
      }
      learnings: {
        Row: {
          blocking_factors: string[] | null
          context_conditions: Json
          context_geo: string[]
          context_time_end: string | null
          context_time_start: string
          counterexample_contexts: Json | null
          counterexamples: number | null
          created_at: string | null
          detailed_description: string | null
          effect_confidence: number
          effect_magnitude: string | null
          enabling_factors: string[] | null
          evidence_grade: string | null
          id: string
          last_validated_at: string | null
          learning_code: string
          observed_effect: string
          replication_contexts: Json | null
          replications: number | null
          required_conditions: string[] | null
          source_action_ids: string[] | null
          source_effect_ids: string[] | null
          summary: string
          updated_at: string | null
        }
        Insert: {
          blocking_factors?: string[] | null
          context_conditions?: Json
          context_geo: string[]
          context_time_end?: string | null
          context_time_start: string
          counterexample_contexts?: Json | null
          counterexamples?: number | null
          created_at?: string | null
          detailed_description?: string | null
          effect_confidence: number
          effect_magnitude?: string | null
          enabling_factors?: string[] | null
          evidence_grade?: string | null
          id?: string
          last_validated_at?: string | null
          learning_code: string
          observed_effect: string
          replication_contexts?: Json | null
          replications?: number | null
          required_conditions?: string[] | null
          source_action_ids?: string[] | null
          source_effect_ids?: string[] | null
          summary: string
          updated_at?: string | null
        }
        Update: {
          blocking_factors?: string[] | null
          context_conditions?: Json
          context_geo?: string[]
          context_time_end?: string | null
          context_time_start?: string
          counterexample_contexts?: Json | null
          counterexamples?: number | null
          created_at?: string | null
          detailed_description?: string | null
          effect_confidence?: number
          effect_magnitude?: string | null
          enabling_factors?: string[] | null
          evidence_grade?: string | null
          id?: string
          last_validated_at?: string | null
          learning_code?: string
          observed_effect?: string
          replication_contexts?: Json | null
          replications?: number | null
          required_conditions?: string[] | null
          source_action_ids?: string[] | null
          source_effect_ids?: string[] | null
          summary?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      license_agreements: {
        Row: {
          accepted_from_ip: unknown
          api_key_id: string | null
          billing_contact_email: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          license_tier: string
          license_version: string
          organization_country: string | null
          organization_name: string | null
          special_terms: Json | null
          terms_accepted_at: string | null
          user_id: string | null
        }
        Insert: {
          accepted_from_ip?: unknown
          api_key_id?: string | null
          billing_contact_email?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          license_tier: string
          license_version?: string
          organization_country?: string | null
          organization_name?: string | null
          special_terms?: Json | null
          terms_accepted_at?: string | null
          user_id?: string | null
        }
        Update: {
          accepted_from_ip?: unknown
          api_key_id?: string | null
          billing_contact_email?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          license_tier?: string
          license_version?: string
          organization_country?: string | null
          organization_name?: string | null
          special_terms?: Json | null
          terms_accepted_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "license_agreements_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "license_agreements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      media_events: {
        Row: {
          clean_text: string | null
          confidence_score: number | null
          created_at: string | null
          deduplication_hash: string | null
          detected_language: string | null
          duplicate_of: string | null
          entities_extracted: Json | null
          event_types_detected: Json | null
          external_id: string | null
          fetched_at: string | null
          geo_resolution: Json | null
          id: string
          is_duplicate: boolean | null
          original_language: string | null
          processed_at: string | null
          published_at: string | null
          sentiment_intensity: number | null
          source_id: string | null
          source_url: string | null
          summary: string | null
          time_resolution: Json | null
          title: string
          topic_classification: Json | null
          volume_indicator: number | null
        }
        Insert: {
          clean_text?: string | null
          confidence_score?: number | null
          created_at?: string | null
          deduplication_hash?: string | null
          detected_language?: string | null
          duplicate_of?: string | null
          entities_extracted?: Json | null
          event_types_detected?: Json | null
          external_id?: string | null
          fetched_at?: string | null
          geo_resolution?: Json | null
          id?: string
          is_duplicate?: boolean | null
          original_language?: string | null
          processed_at?: string | null
          published_at?: string | null
          sentiment_intensity?: number | null
          source_id?: string | null
          source_url?: string | null
          summary?: string | null
          time_resolution?: Json | null
          title: string
          topic_classification?: Json | null
          volume_indicator?: number | null
        }
        Update: {
          clean_text?: string | null
          confidence_score?: number | null
          created_at?: string | null
          deduplication_hash?: string | null
          detected_language?: string | null
          duplicate_of?: string | null
          entities_extracted?: Json | null
          event_types_detected?: Json | null
          external_id?: string | null
          fetched_at?: string | null
          geo_resolution?: Json | null
          id?: string
          is_duplicate?: boolean | null
          original_language?: string | null
          processed_at?: string | null
          published_at?: string | null
          sentiment_intensity?: number | null
          source_id?: string | null
          source_url?: string | null
          summary?: string | null
          time_resolution?: Json | null
          title?: string
          topic_classification?: Json | null
          volume_indicator?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_events_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "media_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_events_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "media_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      media_kpi_correlations: {
        Row: {
          calculated_at: string | null
          correlation_coefficient: number | null
          id: string
          is_significant: boolean | null
          kpi_id: string | null
          lag_days: number | null
          period_end: string | null
          period_start: string | null
          sample_size: number | null
          topic: string
        }
        Insert: {
          calculated_at?: string | null
          correlation_coefficient?: number | null
          id?: string
          is_significant?: boolean | null
          kpi_id?: string | null
          lag_days?: number | null
          period_end?: string | null
          period_start?: string | null
          sample_size?: number | null
          topic: string
        }
        Update: {
          calculated_at?: string | null
          correlation_coefficient?: number | null
          id?: string
          is_significant?: boolean | null
          kpi_id?: string | null
          lag_days?: number | null
          period_end?: string | null
          period_start?: string | null
          sample_size?: number | null
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_kpi_correlations_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      media_sources: {
        Row: {
          api_endpoint: string | null
          base_url: string | null
          bias_assessment: string | null
          code: string
          country_code: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          language: string | null
          last_fetch_at: string | null
          last_fetch_error: string | null
          metadata: Json | null
          name: string
          reliability_score: number | null
          rss_feed_url: string | null
          source_type: string
          update_frequency: string | null
          updated_at: string | null
        }
        Insert: {
          api_endpoint?: string | null
          base_url?: string | null
          bias_assessment?: string | null
          code: string
          country_code?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          last_fetch_at?: string | null
          last_fetch_error?: string | null
          metadata?: Json | null
          name: string
          reliability_score?: number | null
          rss_feed_url?: string | null
          source_type: string
          update_frequency?: string | null
          updated_at?: string | null
        }
        Update: {
          api_endpoint?: string | null
          base_url?: string | null
          bias_assessment?: string | null
          code?: string
          country_code?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          last_fetch_at?: string | null
          last_fetch_error?: string | null
          metadata?: Json | null
          name?: string
          reliability_score?: number | null
          rss_feed_url?: string | null
          source_type?: string
          update_frequency?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      media_volume_aggregates: {
        Row: {
          article_count: number | null
          avg_sentiment: number | null
          country_code: string | null
          created_at: string | null
          date: string
          event_type: string | null
          id: string
          intensity_score: number | null
          region_code: string | null
          topic: string | null
          unique_sources: number | null
        }
        Insert: {
          article_count?: number | null
          avg_sentiment?: number | null
          country_code?: string | null
          created_at?: string | null
          date: string
          event_type?: string | null
          id?: string
          intensity_score?: number | null
          region_code?: string | null
          topic?: string | null
          unique_sources?: number | null
        }
        Update: {
          article_count?: number | null
          avg_sentiment?: number | null
          country_code?: string | null
          created_at?: string | null
          date?: string
          event_type?: string | null
          id?: string
          intensity_score?: number | null
          region_code?: string | null
          topic?: string | null
          unique_sources?: number | null
        }
        Relationships: []
      }
      nuts_regions: {
        Row: {
          area_km2: number | null
          capital_city: string | null
          code: string
          country_code: string
          created_at: string | null
          geometry_simplified: Json | null
          id: string
          is_active: boolean | null
          name: string
          name_local: string | null
          nuts_level: number
          parent_code: string | null
          population: number | null
          updated_at: string | null
        }
        Insert: {
          area_km2?: number | null
          capital_city?: string | null
          code: string
          country_code: string
          created_at?: string | null
          geometry_simplified?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          name_local?: string | null
          nuts_level: number
          parent_code?: string | null
          population?: number | null
          updated_at?: string | null
        }
        Update: {
          area_km2?: number | null
          capital_city?: string | null
          code?: string
          country_code?: string
          created_at?: string | null
          geometry_simplified?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_local?: string | null
          nuts_level?: number
          parent_code?: string | null
          population?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nuts_regions_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
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
      pipeline_status: {
        Row: {
          avg_duration_ms: number | null
          config: Json | null
          consecutive_failures: number | null
          id: string
          items_failed: number | null
          items_processed: number | null
          last_error: string | null
          last_error_at: string | null
          last_run_at: string | null
          last_success_at: string | null
          next_scheduled_at: string | null
          pipeline_name: string
          pipeline_type: string
          status: string
          updated_at: string | null
        }
        Insert: {
          avg_duration_ms?: number | null
          config?: Json | null
          consecutive_failures?: number | null
          id?: string
          items_failed?: number | null
          items_processed?: number | null
          last_error?: string | null
          last_error_at?: string | null
          last_run_at?: string | null
          last_success_at?: string | null
          next_scheduled_at?: string | null
          pipeline_name: string
          pipeline_type: string
          status: string
          updated_at?: string | null
        }
        Update: {
          avg_duration_ms?: number | null
          config?: Json | null
          consecutive_failures?: number | null
          id?: string
          items_failed?: number | null
          items_processed?: number | null
          last_error?: string | null
          last_error_at?: string | null
          last_run_at?: string | null
          last_success_at?: string | null
          next_scheduled_at?: string | null
          pipeline_name?: string
          pipeline_type?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      policy_actions: {
        Row: {
          action_type: string
          announced_date: string | null
          budget_amount_sek: number | null
          budget_type: string | null
          created_at: string | null
          decision_reference: string | null
          description: string | null
          effective_date: string
          end_date: string | null
          expected_effects: Json | null
          geo_scope: string
          id: string
          related_kpi_ids: string[] | null
          responsible_body: string
          sector: string | null
          source_url: string | null
          target_population: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          action_type: string
          announced_date?: string | null
          budget_amount_sek?: number | null
          budget_type?: string | null
          created_at?: string | null
          decision_reference?: string | null
          description?: string | null
          effective_date: string
          end_date?: string | null
          expected_effects?: Json | null
          geo_scope: string
          id?: string
          related_kpi_ids?: string[] | null
          responsible_body: string
          sector?: string | null
          source_url?: string | null
          target_population?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          action_type?: string
          announced_date?: string | null
          budget_amount_sek?: number | null
          budget_type?: string | null
          created_at?: string | null
          decision_reference?: string | null
          description?: string | null
          effective_date?: string
          end_date?: string | null
          expected_effects?: Json | null
          geo_scope?: string
          id?: string
          related_kpi_ids?: string[] | null
          responsible_body?: string
          sector?: string | null
          source_url?: string | null
          target_population?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      policy_decisions: {
        Row: {
          budget_sek: number | null
          category: string | null
          created_at: string
          decision_date: string
          description: string | null
          effectiveness_score: number | null
          evaluation_date: string | null
          expected_effect: string | null
          id: string
          implementation_end: string | null
          implementation_start: string | null
          measured_effect: string | null
          responsible_department: string | null
          responsible_minister: string | null
          status: string
          target_kpis: string[]
          title: string
          updated_at: string
        }
        Insert: {
          budget_sek?: number | null
          category?: string | null
          created_at?: string
          decision_date: string
          description?: string | null
          effectiveness_score?: number | null
          evaluation_date?: string | null
          expected_effect?: string | null
          id?: string
          implementation_end?: string | null
          implementation_start?: string | null
          measured_effect?: string | null
          responsible_department?: string | null
          responsible_minister?: string | null
          status?: string
          target_kpis?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          budget_sek?: number | null
          category?: string | null
          created_at?: string
          decision_date?: string
          description?: string | null
          effectiveness_score?: number | null
          evaluation_date?: string | null
          expected_effect?: string | null
          id?: string
          implementation_end?: string | null
          implementation_start?: string | null
          measured_effect?: string | null
          responsible_department?: string | null
          responsible_minister?: string | null
          status?: string
          target_kpis?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      policy_violations: {
        Row: {
          action_taken: string | null
          api_key_id: string | null
          created_at: string | null
          description: string | null
          evidence: Json | null
          id: string
          resolved_at: string | null
          severity: string
          violation_type: string
        }
        Insert: {
          action_taken?: string | null
          api_key_id?: string | null
          created_at?: string | null
          description?: string | null
          evidence?: Json | null
          id?: string
          resolved_at?: string | null
          severity?: string
          violation_type: string
        }
        Update: {
          action_taken?: string | null
          api_key_id?: string | null
          created_at?: string | null
          description?: string | null
          evidence?: Json | null
          id?: string
          resolved_at?: string | null
          severity?: string
          violation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "policy_violations_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      precomputed_aggregations: {
        Row: {
          aggregation_key: string
          aggregation_type: string
          computation_version: string | null
          computed_at: string
          confidence: number | null
          coverage: number | null
          granularity: string
          id: string
          period_end: string
          period_start: string
          result_data: Json
          source_count: number | null
          valid_until: string | null
        }
        Insert: {
          aggregation_key: string
          aggregation_type: string
          computation_version?: string | null
          computed_at?: string
          confidence?: number | null
          coverage?: number | null
          granularity: string
          id?: string
          period_end: string
          period_start: string
          result_data: Json
          source_count?: number | null
          valid_until?: string | null
        }
        Update: {
          aggregation_key?: string
          aggregation_type?: string
          computation_version?: string | null
          computed_at?: string
          confidence?: number | null
          coverage?: number | null
          granularity?: string
          id?: string
          period_end?: string
          period_start?: string
          result_data?: Json
          source_count?: number | null
          valid_until?: string | null
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
      public_data_sources: {
        Row: {
          api_endpoint: string | null
          base_url: string | null
          category: string
          code: string
          country_code: string | null
          created_at: string | null
          extraction_mode: string
          extraction_status: string | null
          id: string
          is_active: boolean | null
          last_extracted_at: string | null
          metadata: Json | null
          name: string
          quality_score: number | null
          record_count: number | null
          update_frequency: string | null
          updated_at: string | null
        }
        Insert: {
          api_endpoint?: string | null
          base_url?: string | null
          category: string
          code: string
          country_code?: string | null
          created_at?: string | null
          extraction_mode: string
          extraction_status?: string | null
          id?: string
          is_active?: boolean | null
          last_extracted_at?: string | null
          metadata?: Json | null
          name: string
          quality_score?: number | null
          record_count?: number | null
          update_frequency?: string | null
          updated_at?: string | null
        }
        Update: {
          api_endpoint?: string | null
          base_url?: string | null
          category?: string
          code?: string
          country_code?: string | null
          created_at?: string | null
          extraction_mode?: string
          extraction_status?: string | null
          id?: string
          is_active?: boolean | null
          last_extracted_at?: string | null
          metadata?: Json | null
          name?: string
          quality_score?: number | null
          record_count?: number | null
          update_frequency?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      quality_flags: {
        Row: {
          action_taken: string | null
          adjusted_confidence: number | null
          created_at: string | null
          details: Json | null
          entity_id: string
          entity_type: string
          flag_type: string
          id: string
          is_resolved: boolean | null
          message: string | null
          original_confidence: number | null
          resolved_at: string | null
          resolved_by: string | null
          rule_id: string | null
          severity: string
        }
        Insert: {
          action_taken?: string | null
          adjusted_confidence?: number | null
          created_at?: string | null
          details?: Json | null
          entity_id: string
          entity_type: string
          flag_type: string
          id?: string
          is_resolved?: boolean | null
          message?: string | null
          original_confidence?: number | null
          resolved_at?: string | null
          resolved_by?: string | null
          rule_id?: string | null
          severity: string
        }
        Update: {
          action_taken?: string | null
          adjusted_confidence?: number | null
          created_at?: string | null
          details?: Json | null
          entity_id?: string
          entity_type?: string
          flag_type?: string
          id?: string
          is_resolved?: boolean | null
          message?: string | null
          original_confidence?: number | null
          resolved_at?: string | null
          resolved_by?: string | null
          rule_id?: string | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "quality_flags_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "quality_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_rules: {
        Row: {
          applies_to: string
          auto_action: string | null
          code: string
          condition_config: Json | null
          condition_sql: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          rule_type: string
          severity: string | null
        }
        Insert: {
          applies_to: string
          auto_action?: string | null
          code: string
          condition_config?: Json | null
          condition_sql?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          rule_type: string
          severity?: string | null
        }
        Update: {
          applies_to?: string
          auto_action?: string | null
          code?: string
          condition_config?: Json | null
          condition_sql?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          rule_type?: string
          severity?: string | null
        }
        Relationships: []
      }
      query_cache: {
        Row: {
          cache_tier: string | null
          computation_time_ms: number | null
          created_at: string
          expires_at: string
          hit_count: number | null
          id: string
          last_accessed_at: string | null
          query_fingerprint: string
          query_params: Json
          result_data: Json
          result_size_bytes: number | null
        }
        Insert: {
          cache_tier?: string | null
          computation_time_ms?: number | null
          created_at?: string
          expires_at: string
          hit_count?: number | null
          id?: string
          last_accessed_at?: string | null
          query_fingerprint: string
          query_params: Json
          result_data: Json
          result_size_bytes?: number | null
        }
        Update: {
          cache_tier?: string | null
          computation_time_ms?: number | null
          created_at?: string
          expires_at?: string
          hit_count?: number | null
          id?: string
          last_accessed_at?: string | null
          query_fingerprint?: string
          query_params?: Json
          result_data?: Json
          result_size_bytes?: number | null
        }
        Relationships: []
      }
      regional_subdivisions: {
        Row: {
          area_km2: number | null
          code: string
          country_code: string
          created_at: string
          data_quality_score: number | null
          id: string
          level: number
          name: string
          name_local: string | null
          parent_code: string | null
          population: number | null
        }
        Insert: {
          area_km2?: number | null
          code: string
          country_code: string
          created_at?: string
          data_quality_score?: number | null
          id?: string
          level: number
          name: string
          name_local?: string | null
          parent_code?: string | null
          population?: number | null
        }
        Update: {
          area_km2?: number | null
          code?: string
          country_code?: string
          created_at?: string
          data_quality_score?: number | null
          id?: string
          level?: number
          name?: string
          name_local?: string | null
          parent_code?: string | null
          population?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "regional_subdivisions_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
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
      semantic_concepts: {
        Row: {
          calculation_method: string | null
          category: string
          code: string
          created_at: string | null
          definition: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_code: string | null
          related_codes: string[] | null
          source_standards: string[] | null
          standard_precision: number | null
          standard_unit: string | null
        }
        Insert: {
          calculation_method?: string | null
          category: string
          code: string
          created_at?: string | null
          definition?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_code?: string | null
          related_codes?: string[] | null
          source_standards?: string[] | null
          standard_precision?: number | null
          standard_unit?: string | null
        }
        Update: {
          calculation_method?: string | null
          category?: string
          code?: string
          created_at?: string | null
          definition?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_code?: string | null
          related_codes?: string[] | null
          source_standards?: string[] | null
          standard_precision?: number | null
          standard_unit?: string | null
        }
        Relationships: []
      }
      simulation_definitions: {
        Row: {
          code: string
          created_at: string | null
          default_assumptions: Json | null
          description: string | null
          id: string
          input_schema: Json
          is_active: boolean | null
          model_version: string | null
          name: string
          output_schema: Json
          simulation_type: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          default_assumptions?: Json | null
          description?: string | null
          id?: string
          input_schema: Json
          is_active?: boolean | null
          model_version?: string | null
          name: string
          output_schema: Json
          simulation_type: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          default_assumptions?: Json | null
          description?: string | null
          id?: string
          input_schema?: Json
          is_active?: boolean | null
          model_version?: string | null
          name?: string
          output_schema?: Json
          simulation_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      simulation_runs: {
        Row: {
          affected_kpis: Json | null
          assumptions: Json | null
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          execution_time_ms: number | null
          historical_sensitivity: Json | null
          id: string
          input_parameters: Json
          name: string | null
          results: Json | null
          simulation_id: string | null
          status: string | null
          uncertainty_bounds: Json | null
          user_id: string | null
        }
        Insert: {
          affected_kpis?: Json | null
          assumptions?: Json | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          historical_sensitivity?: Json | null
          id?: string
          input_parameters: Json
          name?: string | null
          results?: Json | null
          simulation_id?: string | null
          status?: string | null
          uncertainty_bounds?: Json | null
          user_id?: string | null
        }
        Update: {
          affected_kpis?: Json | null
          assumptions?: Json | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          historical_sensitivity?: Json | null
          id?: string
          input_parameters?: Json
          name?: string | null
          results?: Json | null
          simulation_id?: string | null
          status?: string | null
          uncertainty_bounds?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "simulation_runs_simulation_id_fkey"
            columns: ["simulation_id"]
            isOneToOne: false
            referencedRelation: "simulation_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      surfaced_insights: {
        Row: {
          created_at: string | null
          data_quality_score: number | null
          display_tier: number | null
          expires_at: string | null
          id: string
          insight_code: string
          is_active: boolean | null
          is_new: boolean | null
          is_replicated: boolean | null
          is_stable: boolean | null
          method_description: string | null
          population_affected: number | null
          priority_score: number | null
          similar_case_ids: string[] | null
          source_id: string | null
          source_type: string | null
          summary_line: string
          surfaced_at: string | null
          visualization_config: Json | null
          visualization_type: string | null
          why_explanation_id: string | null
        }
        Insert: {
          created_at?: string | null
          data_quality_score?: number | null
          display_tier?: number | null
          expires_at?: string | null
          id?: string
          insight_code: string
          is_active?: boolean | null
          is_new?: boolean | null
          is_replicated?: boolean | null
          is_stable?: boolean | null
          method_description?: string | null
          population_affected?: number | null
          priority_score?: number | null
          similar_case_ids?: string[] | null
          source_id?: string | null
          source_type?: string | null
          summary_line: string
          surfaced_at?: string | null
          visualization_config?: Json | null
          visualization_type?: string | null
          why_explanation_id?: string | null
        }
        Update: {
          created_at?: string | null
          data_quality_score?: number | null
          display_tier?: number | null
          expires_at?: string | null
          id?: string
          insight_code?: string
          is_active?: boolean | null
          is_new?: boolean | null
          is_replicated?: boolean | null
          is_stable?: boolean | null
          method_description?: string | null
          population_affected?: number | null
          priority_score?: number | null
          similar_case_ids?: string[] | null
          source_id?: string | null
          source_type?: string | null
          summary_line?: string
          surfaced_at?: string | null
          visualization_config?: Json | null
          visualization_type?: string | null
          why_explanation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "surfaced_insights_why_explanation_id_fkey"
            columns: ["why_explanation_id"]
            isOneToOne: false
            referencedRelation: "causal_chains"
            referencedColumns: ["id"]
          },
        ]
      }
      system_metrics: {
        Row: {
          id: string
          metric_name: string
          metric_unit: string | null
          metric_value: number
          recorded_at: string
          tags: Json | null
        }
        Insert: {
          id?: string
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          recorded_at?: string
          tags?: Json | null
        }
        Update: {
          id?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          recorded_at?: string
          tags?: Json | null
        }
        Relationships: []
      }
      user_access: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          organization_id: string | null
          tier_id: string | null
          user_id: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          organization_id?: string | null
          tier_id?: string | null
          user_id?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          organization_id?: string | null
          tier_id?: string | null
          user_id?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_access_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "access_tiers"
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
          department: string | null
          id: string
          notes: string | null
          region: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          department?: string | null
          id?: string
          notes?: string | null
          region?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          department?: string | null
          id?: string
          notes?: string | null
          region?: string | null
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
      user_ui_preferences: {
        Row: {
          created_at: string | null
          current_layer: string | null
          custom_dashboards: Json | null
          default_country: string | null
          default_region: string | null
          id: string
          notification_settings: Json | null
          pinned_countries: string[] | null
          pinned_kpis: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_layer?: string | null
          custom_dashboards?: Json | null
          default_country?: string | null
          default_region?: string | null
          id?: string
          notification_settings?: Json | null
          pinned_countries?: string[] | null
          pinned_kpis?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_layer?: string | null
          custom_dashboards?: Json | null
          default_country?: string | null
          default_region?: string | null
          id?: string
          notification_settings?: Json | null
          pinned_countries?: string[] | null
          pinned_kpis?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      calculate_decision_effectiveness: {
        Args: { p_decision_id: string }
        Returns: {
          avg_change_percent: number
          declined_kpis: number
          improved_kpis: number
          overall_score: number
          total_kpis: number
          unchanged_kpis: number
        }[]
      }
      compute_checksum: { Args: { data: Json }; Returns: string }
      get_gov_role: { Args: { _user_id: string }; Returns: string }
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_gov_role: {
        Args: { _role: string; _user_id: string }
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
        | "statsminister"
        | "departementsansvarig"
        | "operativ"
      comparability_level: "full" | "partial" | "limited" | "none"
      data_depth_level: "global_baseline" | "regional_bloc" | "national_deep"
      data_source_type: "api" | "file_feed" | "manual" | "calculated"
      delivery_method: "api" | "webhook" | "sse" | "kafka"
      feed_severity: "low" | "medium" | "high" | "critical"
      feed_tier: "open" | "plus" | "pro"
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
        "statsminister",
        "departementsansvarig",
        "operativ",
      ],
      comparability_level: ["full", "partial", "limited", "none"],
      data_depth_level: ["global_baseline", "regional_bloc", "national_deep"],
      data_source_type: ["api", "file_feed", "manual", "calculated"],
      delivery_method: ["api", "webhook", "sse", "kafka"],
      feed_severity: ["low", "medium", "high", "critical"],
      feed_tier: ["open", "plus", "pro"],
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
