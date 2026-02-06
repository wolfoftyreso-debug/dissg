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
      ai_response_templates: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          never_use_when: string[]
          required_placeholders: string[]
          template_code: string
          template_name: string
          template_text: string
          translations: Json
          use_when: string[]
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          never_use_when?: string[]
          required_placeholders?: string[]
          template_code: string
          template_name: string
          template_text: string
          translations?: Json
          use_when?: string[]
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          never_use_when?: string[]
          required_placeholders?: string[]
          template_code?: string
          template_name?: string
          template_text?: string
          translations?: Json
          use_when?: string[]
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
      analysis_reports: {
        Row: {
          canonical_url: string | null
          citation_count: number | null
          comparison: Json | null
          confidence_score: number | null
          content_markdown: string
          created_at: string | null
          data_last_verified: string | null
          data_period_end: string | null
          data_period_start: string | null
          deep_dive_links: string[] | null
          expires_at: string | null
          generation_prompt: string | null
          generation_timestamp: string | null
          id: string
          mechanisms: string | null
          meta_description: string | null
          meta_title: string | null
          model_used: string | null
          published_at: string | null
          question_id: string
          slug: string
          status: Database["public"]["Enums"]["report_status"] | null
          structured_data: Json | null
          subtitle: string | null
          summary: string
          timeline: Json | null
          title: string
          uncertainty: string | null
          updated_at: string | null
          version: number
          view_count: number | null
        }
        Insert: {
          canonical_url?: string | null
          citation_count?: number | null
          comparison?: Json | null
          confidence_score?: number | null
          content_markdown: string
          created_at?: string | null
          data_last_verified?: string | null
          data_period_end?: string | null
          data_period_start?: string | null
          deep_dive_links?: string[] | null
          expires_at?: string | null
          generation_prompt?: string | null
          generation_timestamp?: string | null
          id?: string
          mechanisms?: string | null
          meta_description?: string | null
          meta_title?: string | null
          model_used?: string | null
          published_at?: string | null
          question_id: string
          slug: string
          status?: Database["public"]["Enums"]["report_status"] | null
          structured_data?: Json | null
          subtitle?: string | null
          summary: string
          timeline?: Json | null
          title: string
          uncertainty?: string | null
          updated_at?: string | null
          version?: number
          view_count?: number | null
        }
        Update: {
          canonical_url?: string | null
          citation_count?: number | null
          comparison?: Json | null
          confidence_score?: number | null
          content_markdown?: string
          created_at?: string | null
          data_last_verified?: string | null
          data_period_end?: string | null
          data_period_start?: string | null
          deep_dive_links?: string[] | null
          expires_at?: string | null
          generation_prompt?: string | null
          generation_timestamp?: string | null
          id?: string
          mechanisms?: string | null
          meta_description?: string | null
          meta_title?: string | null
          model_used?: string | null
          published_at?: string | null
          question_id?: string
          slug?: string
          status?: Database["public"]["Enums"]["report_status"] | null
          structured_data?: Json | null
          subtitle?: string | null
          summary?: string
          timeline?: Json | null
          title?: string
          uncertainty?: string | null
          updated_at?: string | null
          version?: number
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_reports_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "report_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      anti_influence_log: {
        Row: {
          attempt_description: string
          attempt_type: string
          attempted_at: string
          block_reason: string
          blocked_automatically: boolean
          id: string
        }
        Insert: {
          attempt_description: string
          attempt_type: string
          attempted_at?: string
          block_reason: string
          blocked_automatically?: boolean
          id?: string
        }
        Update: {
          attempt_description?: string
          attempt_type?: string
          attempted_at?: string
          block_reason?: string
          blocked_automatically?: boolean
          id?: string
        }
        Relationships: []
      }
      api_compliance_log: {
        Row: {
          api_key_id: string | null
          block_reason: string | null
          created_at: string
          endpoint: string
          id: string
          ip_address: unknown
          method: string
          query_blocked: boolean
          request_hash: string | null
          response_included_disclaimers: boolean
          scope_accepted: boolean
          scope_declaration_id: string | null
          usage_declaration: string | null
          user_agent: string | null
          warnings_issued: string[]
        }
        Insert: {
          api_key_id?: string | null
          block_reason?: string | null
          created_at?: string
          endpoint: string
          id?: string
          ip_address?: unknown
          method: string
          query_blocked?: boolean
          request_hash?: string | null
          response_included_disclaimers?: boolean
          scope_accepted?: boolean
          scope_declaration_id?: string | null
          usage_declaration?: string | null
          user_agent?: string | null
          warnings_issued?: string[]
        }
        Update: {
          api_key_id?: string | null
          block_reason?: string | null
          created_at?: string
          endpoint?: string
          id?: string
          ip_address?: unknown
          method?: string
          query_blocked?: boolean
          request_hash?: string | null
          response_included_disclaimers?: boolean
          scope_accepted?: boolean
          scope_declaration_id?: string | null
          usage_declaration?: string | null
          user_agent?: string | null
          warnings_issued?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "api_compliance_log_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_compliance_log_scope_declaration_id_fkey"
            columns: ["scope_declaration_id"]
            isOneToOne: false
            referencedRelation: "scope_declarations"
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
      big_question_history: {
        Row: {
          change_reason: string | null
          country_code: string | null
          id: string
          importance_score: number
          period: string
          question_id: string
          rank_position: number
          recorded_at: string
        }
        Insert: {
          change_reason?: string | null
          country_code?: string | null
          id?: string
          importance_score: number
          period: string
          question_id: string
          rank_position: number
          recorded_at?: string
        }
        Update: {
          change_reason?: string | null
          country_code?: string | null
          id?: string
          importance_score?: number
          period?: string
          question_id?: string
          rank_position?: number
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "big_question_history_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "big_question_history_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "big_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      big_question_rankings: {
        Row: {
          calculated_at: string
          country_code: string | null
          cross_domain_impact: number
          data_uncertainty: number
          id: string
          importance_score: number | null
          period_end: string
          period_start: string
          population_affected: number
          question_id: string
          rank_change: number | null
          rank_position: number | null
          region_code: string | null
          trend_acceleration: number
        }
        Insert: {
          calculated_at?: string
          country_code?: string | null
          cross_domain_impact?: number
          data_uncertainty?: number
          id?: string
          importance_score?: number | null
          period_end: string
          period_start: string
          population_affected?: number
          question_id: string
          rank_change?: number | null
          rank_position?: number | null
          region_code?: string | null
          trend_acceleration?: number
        }
        Update: {
          calculated_at?: string
          country_code?: string | null
          cross_domain_impact?: number
          data_uncertainty?: number
          id?: string
          importance_score?: number | null
          period_end?: string
          period_start?: string
          population_affected?: number
          question_id?: string
          rank_change?: number | null
          rank_position?: number | null
          region_code?: string | null
          trend_acceleration?: number
        }
        Relationships: [
          {
            foreignKeyName: "big_question_rankings_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "big_question_rankings_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "big_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      big_question_summaries: {
        Row: {
          country_code: string | null
          generated_at: string
          id: string
          language_code: string
          question_id: string
          summary_text: string
          underlying_indicators: Json | null
          valid_until: string | null
          why_ranked_high: string | null
        }
        Insert: {
          country_code?: string | null
          generated_at?: string
          id?: string
          language_code?: string
          question_id: string
          summary_text: string
          underlying_indicators?: Json | null
          valid_until?: string | null
          why_ranked_high?: string | null
        }
        Update: {
          country_code?: string | null
          generated_at?: string
          id?: string
          language_code?: string
          question_id?: string
          summary_text?: string
          underlying_indicators?: Json | null
          valid_until?: string | null
          why_ranked_high?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "big_question_summaries_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "big_question_summaries_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "big_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      big_questions: {
        Row: {
          category: Database["public"]["Enums"]["question_category"]
          code: string
          created_at: string
          id: string
          is_active: boolean
          primary_kpi_codes: string[]
          question_text: string
          question_text_local: Json | null
          secondary_kpi_codes: string[] | null
          short_description: string
          updated_at: string
          what_this_does_not_show: string[]
          what_this_shows: string
        }
        Insert: {
          category: Database["public"]["Enums"]["question_category"]
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          primary_kpi_codes?: string[]
          question_text: string
          question_text_local?: Json | null
          secondary_kpi_codes?: string[] | null
          short_description: string
          updated_at?: string
          what_this_does_not_show?: string[]
          what_this_shows: string
        }
        Update: {
          category?: Database["public"]["Enums"]["question_category"]
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          primary_kpi_codes?: string[]
          question_text?: string
          question_text_local?: Json | null
          secondary_kpi_codes?: string[] | null
          short_description?: string
          updated_at?: string
          what_this_does_not_show?: string[]
          what_this_shows?: string
        }
        Relationships: []
      }
      blocked_query_patterns: {
        Row: {
          block_response_template: string
          category: string
          created_at: string
          id: string
          is_active: boolean
          pattern_keywords: string[]
          pattern_regex: string
          pattern_type: string
          redirect_suggestion: string | null
          severity: string
        }
        Insert: {
          block_response_template: string
          category: string
          created_at?: string
          id?: string
          is_active?: boolean
          pattern_keywords?: string[]
          pattern_regex: string
          pattern_type: string
          redirect_suggestion?: string | null
          severity?: string
        }
        Update: {
          block_response_template?: string
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          pattern_keywords?: string[]
          pattern_regex?: string
          pattern_type?: string
          redirect_suggestion?: string | null
          severity?: string
        }
        Relationships: []
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
      canonical_facts: {
        Row: {
          created_at: string
          expires_at: string | null
          fact_code: string
          generated_at: string
          geo_code: string
          geo_level: string
          id: string
          indicator_id: string
          is_active: boolean
          method: string
          statement: string
          statement_template: string
          time_range_end: string
          time_range_start: string
          trend_direction: string | null
          trend_magnitude: number | null
          uncertainty: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          fact_code: string
          generated_at?: string
          geo_code: string
          geo_level: string
          id?: string
          indicator_id: string
          is_active?: boolean
          method: string
          statement: string
          statement_template: string
          time_range_end: string
          time_range_start: string
          trend_direction?: string | null
          trend_magnitude?: number | null
          uncertainty: string
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          fact_code?: string
          generated_at?: string
          geo_code?: string
          geo_level?: string
          id?: string
          indicator_id?: string
          is_active?: boolean
          method?: string
          statement?: string
          statement_template?: string
          time_range_end?: string
          time_range_start?: string
          trend_direction?: string | null
          trend_magnitude?: number | null
          uncertainty?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "canonical_facts_indicator_id_fkey"
            columns: ["indicator_id"]
            isOneToOne: false
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      canonical_questions: {
        Row: {
          answer_template_id: string | null
          block_reason:
            | Database["public"]["Enums"]["question_block_reason"]
            | null
          block_redirect: string | null
          canonical_text: string
          canonical_text_local: Json | null
          comparison_baseline: string | null
          created_at: string | null
          default_time_window: string | null
          excluded_indicator_ids: string[] | null
          id: string
          intent_class: Database["public"]["Enums"]["question_intent_class"]
          is_active: boolean | null
          is_blocked: boolean | null
          metadata: Json | null
          primary_indicator_ids: string[] | null
          priority_rank: number | null
          question_id: string
          related_indicator_ids: string[] | null
          scope_level: string
          search_variants: string[] | null
          search_volume_estimate: number | null
          secondary_indicator_ids: string[] | null
          updated_at: string | null
        }
        Insert: {
          answer_template_id?: string | null
          block_reason?:
            | Database["public"]["Enums"]["question_block_reason"]
            | null
          block_redirect?: string | null
          canonical_text: string
          canonical_text_local?: Json | null
          comparison_baseline?: string | null
          created_at?: string | null
          default_time_window?: string | null
          excluded_indicator_ids?: string[] | null
          id?: string
          intent_class: Database["public"]["Enums"]["question_intent_class"]
          is_active?: boolean | null
          is_blocked?: boolean | null
          metadata?: Json | null
          primary_indicator_ids?: string[] | null
          priority_rank?: number | null
          question_id: string
          related_indicator_ids?: string[] | null
          scope_level?: string
          search_variants?: string[] | null
          search_volume_estimate?: number | null
          secondary_indicator_ids?: string[] | null
          updated_at?: string | null
        }
        Update: {
          answer_template_id?: string | null
          block_reason?:
            | Database["public"]["Enums"]["question_block_reason"]
            | null
          block_redirect?: string | null
          canonical_text?: string
          canonical_text_local?: Json | null
          comparison_baseline?: string | null
          created_at?: string | null
          default_time_window?: string | null
          excluded_indicator_ids?: string[] | null
          id?: string
          intent_class?: Database["public"]["Enums"]["question_intent_class"]
          is_active?: boolean | null
          is_blocked?: boolean | null
          metadata?: Json | null
          primary_indicator_ids?: string[] | null
          priority_rank?: number | null
          question_id?: string
          related_indicator_ids?: string[] | null
          scope_level?: string
          search_variants?: string[] | null
          search_volume_estimate?: number | null
          secondary_indicator_ids?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
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
      country_portfolio_items: {
        Row: {
          added_at: string
          country_code: string
          id: string
          notes: string | null
          portfolio_id: string
        }
        Insert: {
          added_at?: string
          country_code: string
          id?: string
          notes?: string | null
          portfolio_id: string
        }
        Update: {
          added_at?: string
          country_code?: string
          id?: string
          notes?: string | null
          portfolio_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "country_portfolio_items_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "country_portfolio_items_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "country_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      country_portfolios: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      covid_comparison_validity: {
        Row: {
          assessed_at: string
          country_a: string
          country_b: string
          data_type: string
          definition_match: boolean | null
          id: string
          invalidity_reasons: string[] | null
          is_valid: boolean
          methodology_match: boolean | null
          period_end: string
          period_start: string
          reporting_match: boolean | null
          validity_score: number | null
        }
        Insert: {
          assessed_at?: string
          country_a: string
          country_b: string
          data_type: string
          definition_match?: boolean | null
          id?: string
          invalidity_reasons?: string[] | null
          is_valid: boolean
          methodology_match?: boolean | null
          period_end: string
          period_start: string
          reporting_match?: boolean | null
          validity_score?: number | null
        }
        Update: {
          assessed_at?: string
          country_a?: string
          country_b?: string
          data_type?: string
          definition_match?: boolean | null
          id?: string
          invalidity_reasons?: string[] | null
          is_valid?: boolean
          methodology_match?: boolean | null
          period_end?: string
          period_start?: string
          reporting_match?: boolean | null
          validity_score?: number | null
        }
        Relationships: []
      }
      covid_conclusion_types: {
        Row: {
          conclusion_type: string
          created_at: string
          forbidden_phrases: string[] | null
          id: string
          is_allowed: boolean
          requires_conditions: string[] | null
          template_text: string
        }
        Insert: {
          conclusion_type: string
          created_at?: string
          forbidden_phrases?: string[] | null
          id?: string
          is_allowed?: boolean
          requires_conditions?: string[] | null
          template_text: string
        }
        Update: {
          conclusion_type?: string
          created_at?: string
          forbidden_phrases?: string[] | null
          id?: string
          is_allowed?: boolean
          requires_conditions?: string[] | null
          template_text?: string
        }
        Relationships: []
      }
      covid_excess_mortality: {
        Row: {
          age_standardized: boolean | null
          baseline_period: string | null
          country_code: string
          created_at: string
          data_source_code: string
          excess_deaths: number | null
          excess_percent: number | null
          expected_deaths: number
          expected_deaths_lower: number | null
          expected_deaths_upper: number | null
          id: string
          methodology: string
          observed_deaths: number
          period_end: string
          period_start: string
          season_adjusted: boolean | null
        }
        Insert: {
          age_standardized?: boolean | null
          baseline_period?: string | null
          country_code: string
          created_at?: string
          data_source_code: string
          excess_deaths?: number | null
          excess_percent?: number | null
          expected_deaths: number
          expected_deaths_lower?: number | null
          expected_deaths_upper?: number | null
          id?: string
          methodology: string
          observed_deaths: number
          period_end: string
          period_start: string
          season_adjusted?: boolean | null
        }
        Update: {
          age_standardized?: boolean | null
          baseline_period?: string | null
          country_code?: string
          created_at?: string
          data_source_code?: string
          excess_deaths?: number | null
          excess_percent?: number | null
          expected_deaths?: number
          expected_deaths_lower?: number | null
          expected_deaths_upper?: number | null
          id?: string
          methodology?: string
          observed_deaths?: number
          period_end?: string
          period_start?: string
          season_adjusted?: boolean | null
        }
        Relationships: []
      }
      covid_method_changes: {
        Row: {
          change_date: string
          change_type: string
          comparability_note: string
          country_code: string
          created_at: string
          data_type: string
          id: string
          impact_severity: string
          new_definition: string
          previous_definition: string
          source_url: string | null
        }
        Insert: {
          change_date: string
          change_type: string
          comparability_note: string
          country_code: string
          created_at?: string
          data_type: string
          id?: string
          impact_severity: string
          new_definition: string
          previous_definition: string
          source_url?: string | null
        }
        Update: {
          change_date?: string
          change_type?: string
          comparability_note?: string
          country_code?: string
          created_at?: string
          data_type?: string
          id?: string
          impact_severity?: string
          new_definition?: string
          previous_definition?: string
          source_url?: string | null
        }
        Relationships: []
      }
      covid_policy_periods: {
        Row: {
          country_code: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_verified: boolean | null
          policy_type: string
          region_code: string | null
          source_url: string | null
          start_date: string
          stringency_level: number | null
        }
        Insert: {
          country_code: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_verified?: boolean | null
          policy_type: string
          region_code?: string | null
          source_url?: string | null
          start_date: string
          stringency_level?: number | null
        }
        Update: {
          country_code?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_verified?: boolean | null
          policy_type?: string
          region_code?: string | null
          source_url?: string | null
          start_date?: string
          stringency_level?: number | null
        }
        Relationships: []
      }
      covid_raw_data: {
        Row: {
          age_group: string | null
          confidence_interval_lower: number | null
          confidence_interval_upper: number | null
          country_code: string
          created_at: string
          data_source_code: string
          data_type: string
          definition_version: string
          id: string
          is_preliminary: boolean | null
          period_date: string
          region_code: string | null
          reporter: string
          reporting_lag_days: number | null
          revision_number: number | null
          value: number
          value_per_100k: number | null
        }
        Insert: {
          age_group?: string | null
          confidence_interval_lower?: number | null
          confidence_interval_upper?: number | null
          country_code: string
          created_at?: string
          data_source_code: string
          data_type: string
          definition_version: string
          id?: string
          is_preliminary?: boolean | null
          period_date: string
          region_code?: string | null
          reporter: string
          reporting_lag_days?: number | null
          revision_number?: number | null
          value: number
          value_per_100k?: number | null
        }
        Update: {
          age_group?: string | null
          confidence_interval_lower?: number | null
          confidence_interval_upper?: number | null
          country_code?: string
          created_at?: string
          data_source_code?: string
          data_type?: string
          definition_version?: string
          id?: string
          is_preliminary?: boolean | null
          period_date?: string
          region_code?: string | null
          reporter?: string
          reporting_lag_days?: number | null
          revision_number?: number | null
          value?: number
          value_per_100k?: number | null
        }
        Relationships: []
      }
      covid_sensitivity_results: {
        Row: {
          analysis_code: string
          base_query_params: Json
          created_at: string
          id: string
          key_sensitivities: string[] | null
          results: Json
          stability_classification: string
          stability_score: number
          variations_tested: Json
        }
        Insert: {
          analysis_code: string
          base_query_params: Json
          created_at?: string
          id?: string
          key_sensitivities?: string[] | null
          results: Json
          stability_classification: string
          stability_score: number
          variations_tested: Json
        }
        Update: {
          analysis_code?: string
          base_query_params?: Json
          created_at?: string
          id?: string
          key_sensitivities?: string[] | null
          results?: Json
          stability_classification?: string
          stability_score?: number
          variations_tested?: Json
        }
        Relationships: []
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
      daily_learnings: {
        Row: {
          countries_with_updates: string[] | null
          generated_at: string | null
          id: string
          kpi_categories_updated: string[] | null
          learning_date: string
          notable_failures: Json | null
          replication_updates: Json | null
          summary_text: string | null
          top_learnings: Json | null
          total_confirmed_patterns: number | null
          total_falsified_patterns: number | null
          total_new_insights: number | null
          total_replications: number | null
        }
        Insert: {
          countries_with_updates?: string[] | null
          generated_at?: string | null
          id?: string
          kpi_categories_updated?: string[] | null
          learning_date: string
          notable_failures?: Json | null
          replication_updates?: Json | null
          summary_text?: string | null
          top_learnings?: Json | null
          total_confirmed_patterns?: number | null
          total_falsified_patterns?: number | null
          total_new_insights?: number | null
          total_replications?: number | null
        }
        Update: {
          countries_with_updates?: string[] | null
          generated_at?: string | null
          id?: string
          kpi_categories_updated?: string[] | null
          learning_date?: string
          notable_failures?: Json | null
          replication_updates?: Json | null
          summary_text?: string | null
          top_learnings?: Json | null
          total_confirmed_patterns?: number | null
          total_falsified_patterns?: number | null
          total_new_insights?: number | null
          total_replications?: number | null
        }
        Relationships: []
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
      data_constitution_articles: {
        Row: {
          adopted_at: string | null
          article_number: number
          article_title: string
          automated_check: boolean | null
          check_function: string | null
          created_at: string | null
          enforcement_type: string | null
          examples: string[] | null
          id: string
          principle: string
          rationale: string
          version: number | null
          violations: string[] | null
        }
        Insert: {
          adopted_at?: string | null
          article_number: number
          article_title: string
          automated_check?: boolean | null
          check_function?: string | null
          created_at?: string | null
          enforcement_type?: string | null
          examples?: string[] | null
          id?: string
          principle: string
          rationale: string
          version?: number | null
          violations?: string[] | null
        }
        Update: {
          adopted_at?: string | null
          article_number?: number
          article_title?: string
          automated_check?: boolean | null
          check_function?: string | null
          created_at?: string | null
          enforcement_type?: string | null
          examples?: string[] | null
          id?: string
          principle?: string
          rationale?: string
          version?: number | null
          violations?: string[] | null
        }
        Relationships: []
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
      data_source_types: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          examples: string[] | null
          id: string
          name_en: string
          name_sv: string
          reliability_default:
            | Database["public"]["Enums"]["data_quality_grade"]
            | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          examples?: string[] | null
          id?: string
          name_en: string
          name_sv: string
          reliability_default?:
            | Database["public"]["Enums"]["data_quality_grade"]
            | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          examples?: string[] | null
          id?: string
          name_en?: string
          name_sv?: string
          reliability_default?:
            | Database["public"]["Enums"]["data_quality_grade"]
            | null
        }
        Relationships: []
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
      data_versions: {
        Row: {
          created_at: string
          data_snapshot: Json
          entity_id: string
          entity_type: string
          id: string
          trust_log_id: string | null
          version_checksum: string
          version_number: number
        }
        Insert: {
          created_at?: string
          data_snapshot: Json
          entity_id: string
          entity_type: string
          id?: string
          trust_log_id?: string | null
          version_checksum: string
          version_number?: number
        }
        Update: {
          created_at?: string
          data_snapshot?: Json
          entity_id?: string
          entity_type?: string
          id?: string
          trust_log_id?: string | null
          version_checksum?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "data_versions_trust_log_id_fkey"
            columns: ["trust_log_id"]
            isOneToOne: false
            referencedRelation: "trust_log"
            referencedColumns: ["id"]
          },
        ]
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
      disease_burden: {
        Row: {
          age_group: string | null
          cause_code: string
          cause_level: number | null
          cause_name: string
          confidence_lower: number | null
          confidence_upper: number | null
          country_code: string
          created_at: string
          dalys: number | null
          dalys_per_100k: number | null
          data_source_code: string
          deaths: number | null
          deaths_per_100k: number | null
          gbd_study_year: number | null
          id: string
          incidence: number | null
          incidence_per_100k: number | null
          parent_cause_code: string | null
          period_year: number
          prevalence: number | null
          prevalence_per_100k: number | null
          region_code: string | null
          sex: string | null
          yld: number | null
          yld_per_100k: number | null
          yll: number | null
          yll_per_100k: number | null
        }
        Insert: {
          age_group?: string | null
          cause_code: string
          cause_level?: number | null
          cause_name: string
          confidence_lower?: number | null
          confidence_upper?: number | null
          country_code: string
          created_at?: string
          dalys?: number | null
          dalys_per_100k?: number | null
          data_source_code?: string
          deaths?: number | null
          deaths_per_100k?: number | null
          gbd_study_year?: number | null
          id?: string
          incidence?: number | null
          incidence_per_100k?: number | null
          parent_cause_code?: string | null
          period_year: number
          prevalence?: number | null
          prevalence_per_100k?: number | null
          region_code?: string | null
          sex?: string | null
          yld?: number | null
          yld_per_100k?: number | null
          yll?: number | null
          yll_per_100k?: number | null
        }
        Update: {
          age_group?: string | null
          cause_code?: string
          cause_level?: number | null
          cause_name?: string
          confidence_lower?: number | null
          confidence_upper?: number | null
          country_code?: string
          created_at?: string
          dalys?: number | null
          dalys_per_100k?: number | null
          data_source_code?: string
          deaths?: number | null
          deaths_per_100k?: number | null
          gbd_study_year?: number | null
          id?: string
          incidence?: number | null
          incidence_per_100k?: number | null
          parent_cause_code?: string | null
          period_year?: number
          prevalence?: number | null
          prevalence_per_100k?: number | null
          region_code?: string | null
          sex?: string | null
          yld?: number | null
          yld_per_100k?: number | null
          yll?: number | null
          yll_per_100k?: number | null
        }
        Relationships: []
      }
      ethics_constraints: {
        Row: {
          constraint_code: string
          constraint_description: string
          constraint_name: string
          created_at: string
          enforcement_type: string
          id: string
          is_active: boolean
          minimum_group_size: number | null
          prevents: string[]
          rationale: string
        }
        Insert: {
          constraint_code: string
          constraint_description: string
          constraint_name: string
          created_at?: string
          enforcement_type: string
          id?: string
          is_active?: boolean
          minimum_group_size?: number | null
          prevents?: string[]
          rationale: string
        }
        Update: {
          constraint_code?: string
          constraint_description?: string
          constraint_name?: string
          created_at?: string
          enforcement_type?: string
          id?: string
          is_active?: boolean
          minimum_group_size?: number | null
          prevents?: string[]
          rationale?: string
        }
        Relationships: []
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
      explanation_analytics: {
        Row: {
          clicked_back: boolean | null
          clicked_deeper: boolean | null
          confusion_signals: number | null
          created_at: string
          entry_level: number
          exit_level: number | null
          id: string
          max_depth_reached: number
          node_id: string
          session_id: string | null
          time_on_level_ms: number | null
        }
        Insert: {
          clicked_back?: boolean | null
          clicked_deeper?: boolean | null
          confusion_signals?: number | null
          created_at?: string
          entry_level: number
          exit_level?: number | null
          id?: string
          max_depth_reached?: number
          node_id: string
          session_id?: string | null
          time_on_level_ms?: number | null
        }
        Update: {
          clicked_back?: boolean | null
          clicked_deeper?: boolean | null
          confusion_signals?: number | null
          created_at?: string
          entry_level?: number
          exit_level?: number | null
          id?: string
          max_depth_reached?: number
          node_id?: string
          session_id?: string | null
          time_on_level_ms?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "explanation_analytics_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "explanation_nodes"
            referencedColumns: ["node_id"]
          },
        ]
      }
      explanation_nodes: {
        Row: {
          back_click_count: number | null
          children: string[] | null
          content: string
          created_at: string
          deeper_click_count: number | null
          explains: string | null
          id: string
          is_active: boolean
          level: number
          limitations: string[] | null
          node_id: string
          scope: string
          sources: string[] | null
          updated_at: string
          url: string
          version: number
          view_count: number | null
        }
        Insert: {
          back_click_count?: number | null
          children?: string[] | null
          content: string
          created_at?: string
          deeper_click_count?: number | null
          explains?: string | null
          id?: string
          is_active?: boolean
          level: number
          limitations?: string[] | null
          node_id: string
          scope: string
          sources?: string[] | null
          updated_at?: string
          url: string
          version?: number
          view_count?: number | null
        }
        Update: {
          back_click_count?: number | null
          children?: string[] | null
          content?: string
          created_at?: string
          deeper_click_count?: number | null
          explains?: string | null
          id?: string
          is_active?: boolean
          level?: number
          limitations?: string[] | null
          node_id?: string
          scope?: string
          sources?: string[] | null
          updated_at?: string
          url?: string
          version?: number
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "explanation_nodes_explains_fkey"
            columns: ["explains"]
            isOneToOne: false
            referencedRelation: "explanation_nodes"
            referencedColumns: ["node_id"]
          },
        ]
      }
      fact_sources: {
        Row: {
          contribution_weight: number | null
          created_at: string
          fact_id: string
          id: string
          source_id: string
        }
        Insert: {
          contribution_weight?: number | null
          created_at?: string
          fact_id: string
          id?: string
          source_id: string
        }
        Update: {
          contribution_weight?: number | null
          created_at?: string
          fact_id?: string
          id?: string
          source_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fact_sources_fact_id_fkey"
            columns: ["fact_id"]
            isOneToOne: false
            referencedRelation: "canonical_facts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fact_sources_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      fact_templates: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          language_code: string
          template_code: string
          template_text: string
          trend_type: string
          variables_required: string[]
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          language_code?: string
          template_code: string
          template_text: string
          trend_type: string
          variables_required: string[]
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          language_code?: string
          template_code?: string
          template_text?: string
          trend_type?: string
          variables_required?: string[]
        }
        Relationships: []
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
      falsified_hypotheses: {
        Row: {
          contradicting_data: string[] | null
          failed_in_contexts: string[] | null
          falsification_evidence: Json
          falsification_summary: string
          falsified_at: string | null
          hypothesis_code: string
          id: string
          might_work_in_contexts: string[] | null
          original_hypothesis: string
          originally_proposed_at: string | null
          originally_proposed_by: string | null
          related_valid_patterns: string[] | null
          what_we_learned: string
        }
        Insert: {
          contradicting_data?: string[] | null
          failed_in_contexts?: string[] | null
          falsification_evidence: Json
          falsification_summary: string
          falsified_at?: string | null
          hypothesis_code: string
          id?: string
          might_work_in_contexts?: string[] | null
          original_hypothesis: string
          originally_proposed_at?: string | null
          originally_proposed_by?: string | null
          related_valid_patterns?: string[] | null
          what_we_learned: string
        }
        Update: {
          contradicting_data?: string[] | null
          failed_in_contexts?: string[] | null
          falsification_evidence?: Json
          falsification_summary?: string
          falsified_at?: string | null
          hypothesis_code?: string
          id?: string
          might_work_in_contexts?: string[] | null
          original_hypothesis?: string
          originally_proposed_at?: string | null
          originally_proposed_by?: string | null
          related_valid_patterns?: string[] | null
          what_we_learned?: string
        }
        Relationships: []
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
      feature_usage: {
        Row: {
          created_at: string
          feature_key: string
          id: string
          period_end: string
          period_start: string
          updated_at: string
          usage_count: number
          usage_limit: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_key: string
          id?: string
          period_end?: string
          period_start?: string
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          feature_key?: string
          id?: string
          period_end?: string
          period_start?: string
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
          user_id?: string
        }
        Relationships: []
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
      global_index_answers: {
        Row: {
          aggregation_method: string | null
          citation_count: number | null
          citations: Json
          comparison: Json | null
          confidence_score: number | null
          created_at: string | null
          data_points: Json
          data_quality: Database["public"]["Enums"]["data_quality_grade"] | null
          deep_dive_links: string[] | null
          expires_at: string | null
          generated_at: string | null
          generated_by: string | null
          generation_prompt_hash: string | null
          geo_scope: string
          id: string
          is_current: boolean | null
          mechanisms: string | null
          model_used: string | null
          question_id: string
          source_checksums: string[] | null
          summary: string
          time_period_end: string | null
          time_period_start: string | null
          timeline: Json | null
          uncertainty: string | null
          view_count: number | null
        }
        Insert: {
          aggregation_method?: string | null
          citation_count?: number | null
          citations?: Json
          comparison?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          data_points?: Json
          data_quality?:
            | Database["public"]["Enums"]["data_quality_grade"]
            | null
          deep_dive_links?: string[] | null
          expires_at?: string | null
          generated_at?: string | null
          generated_by?: string | null
          generation_prompt_hash?: string | null
          geo_scope?: string
          id?: string
          is_current?: boolean | null
          mechanisms?: string | null
          model_used?: string | null
          question_id: string
          source_checksums?: string[] | null
          summary: string
          time_period_end?: string | null
          time_period_start?: string | null
          timeline?: Json | null
          uncertainty?: string | null
          view_count?: number | null
        }
        Update: {
          aggregation_method?: string | null
          citation_count?: number | null
          citations?: Json
          comparison?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          data_points?: Json
          data_quality?:
            | Database["public"]["Enums"]["data_quality_grade"]
            | null
          deep_dive_links?: string[] | null
          expires_at?: string | null
          generated_at?: string | null
          generated_by?: string | null
          generation_prompt_hash?: string | null
          geo_scope?: string
          id?: string
          is_current?: boolean | null
          mechanisms?: string | null
          model_used?: string | null
          question_id?: string
          source_checksums?: string[] | null
          summary?: string
          time_period_end?: string | null
          time_period_start?: string | null
          timeline?: Json | null
          uncertainty?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "global_index_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "global_index_questions"
            referencedColumns: ["question_id"]
          },
        ]
      }
      global_index_questions: {
        Row: {
          agent_optimization_notes: string | null
          ai_retrieval_tags: string[]
          answer_count: number | null
          answer_type: Database["public"]["Enums"]["answer_type"]
          created_at: string | null
          created_by: string | null
          cross_reference_domains: string[] | null
          data_coverage_percent: number | null
          data_quality: Database["public"]["Enums"]["data_quality_grade"] | null
          domain_code: string
          id: string
          intent_layer: Database["public"]["Enums"]["intent_layer"] | null
          is_answerable: boolean | null
          is_published: boolean | null
          last_answered_at: string | null
          misinterpretation_risk:
            | Database["public"]["Enums"]["misinterpretation_risk"]
            | null
          parent_question_id: string | null
          primary_ai_agent: Database["public"]["Enums"]["ai_agent_class"] | null
          primary_source_types: string[]
          question_en: string
          question_id: string
          question_sv: string
          question_variants: string[] | null
          related_question_ids: string[] | null
          scope: Database["public"]["Enums"]["question_scope"]
          search_volume_estimate: number | null
          secondary_ai_agents:
            | Database["public"]["Enums"]["ai_agent_class"][]
            | null
          seo_priority: number | null
          subdomain_code: string | null
          time_dimension: Database["public"]["Enums"]["time_dimension"]
          update_frequency:
            | Database["public"]["Enums"]["question_update_frequency"]
            | null
          updated_at: string | null
          version: number | null
          view_count: number | null
        }
        Insert: {
          agent_optimization_notes?: string | null
          ai_retrieval_tags?: string[]
          answer_count?: number | null
          answer_type?: Database["public"]["Enums"]["answer_type"]
          created_at?: string | null
          created_by?: string | null
          cross_reference_domains?: string[] | null
          data_coverage_percent?: number | null
          data_quality?:
            | Database["public"]["Enums"]["data_quality_grade"]
            | null
          domain_code: string
          id?: string
          intent_layer?: Database["public"]["Enums"]["intent_layer"] | null
          is_answerable?: boolean | null
          is_published?: boolean | null
          last_answered_at?: string | null
          misinterpretation_risk?:
            | Database["public"]["Enums"]["misinterpretation_risk"]
            | null
          parent_question_id?: string | null
          primary_ai_agent?:
            | Database["public"]["Enums"]["ai_agent_class"]
            | null
          primary_source_types?: string[]
          question_en: string
          question_id: string
          question_sv: string
          question_variants?: string[] | null
          related_question_ids?: string[] | null
          scope?: Database["public"]["Enums"]["question_scope"]
          search_volume_estimate?: number | null
          secondary_ai_agents?:
            | Database["public"]["Enums"]["ai_agent_class"][]
            | null
          seo_priority?: number | null
          subdomain_code?: string | null
          time_dimension?: Database["public"]["Enums"]["time_dimension"]
          update_frequency?:
            | Database["public"]["Enums"]["question_update_frequency"]
            | null
          updated_at?: string | null
          version?: number | null
          view_count?: number | null
        }
        Update: {
          agent_optimization_notes?: string | null
          ai_retrieval_tags?: string[]
          answer_count?: number | null
          answer_type?: Database["public"]["Enums"]["answer_type"]
          created_at?: string | null
          created_by?: string | null
          cross_reference_domains?: string[] | null
          data_coverage_percent?: number | null
          data_quality?:
            | Database["public"]["Enums"]["data_quality_grade"]
            | null
          domain_code?: string
          id?: string
          intent_layer?: Database["public"]["Enums"]["intent_layer"] | null
          is_answerable?: boolean | null
          is_published?: boolean | null
          last_answered_at?: string | null
          misinterpretation_risk?:
            | Database["public"]["Enums"]["misinterpretation_risk"]
            | null
          parent_question_id?: string | null
          primary_ai_agent?:
            | Database["public"]["Enums"]["ai_agent_class"]
            | null
          primary_source_types?: string[]
          question_en?: string
          question_id?: string
          question_sv?: string
          question_variants?: string[] | null
          related_question_ids?: string[] | null
          scope?: Database["public"]["Enums"]["question_scope"]
          search_volume_estimate?: number | null
          secondary_ai_agents?:
            | Database["public"]["Enums"]["ai_agent_class"][]
            | null
          seo_priority?: number | null
          subdomain_code?: string | null
          time_dimension?: Database["public"]["Enums"]["time_dimension"]
          update_frequency?:
            | Database["public"]["Enums"]["question_update_frequency"]
            | null
          updated_at?: string | null
          version?: number | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "global_index_questions_domain_code_fkey"
            columns: ["domain_code"]
            isOneToOne: false
            referencedRelation: "global_question_domains"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "global_index_questions_parent_question_id_fkey"
            columns: ["parent_question_id"]
            isOneToOne: false
            referencedRelation: "global_index_questions"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "global_index_questions_subdomain_code_fkey"
            columns: ["subdomain_code"]
            isOneToOne: false
            referencedRelation: "global_question_subdomains"
            referencedColumns: ["code"]
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
      global_question_domains: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name_en: string
          name_sv: string
          parent_domain_code: string | null
          question_count: number | null
          sort_order: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_en: string
          name_sv: string
          parent_domain_code?: string | null
          question_count?: number | null
          sort_order?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_en?: string
          name_sv?: string
          parent_domain_code?: string | null
          question_count?: number | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "global_question_domains_parent_domain_code_fkey"
            columns: ["parent_domain_code"]
            isOneToOne: false
            referencedRelation: "global_question_domains"
            referencedColumns: ["code"]
          },
        ]
      }
      global_question_subdomains: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          domain_code: string
          id: string
          is_active: boolean | null
          name_en: string
          name_sv: string
          question_count: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          domain_code: string
          id?: string
          is_active?: boolean | null
          name_en: string
          name_sv: string
          question_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          domain_code?: string
          id?: string
          is_active?: boolean | null
          name_en?: string
          name_sv?: string
          question_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "global_question_subdomains_domain_code_fkey"
            columns: ["domain_code"]
            isOneToOne: false
            referencedRelation: "global_question_domains"
            referencedColumns: ["code"]
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
      gmi_weight_changes: {
        Row: {
          author: string
          country_code: string | null
          created_at: string
          dimension_id: string
          dimension_name: string
          id: string
          new_weight: number
          previous_weight: number
          reason: string
          version: string
        }
        Insert: {
          author?: string
          country_code?: string | null
          created_at?: string
          dimension_id: string
          dimension_name: string
          id?: string
          new_weight: number
          previous_weight: number
          reason: string
          version: string
        }
        Update: {
          author?: string
          country_code?: string | null
          created_at?: string
          dimension_id?: string
          dimension_name?: string
          id?: string
          new_weight?: number
          previous_weight?: number
          reason?: string
          version?: string
        }
        Relationships: []
      }
      governance_actions: {
        Row: {
          action_description: string
          action_scope: string
          action_type: string
          actor_id: string | null
          actor_role: Database["public"]["Enums"]["governance_role"]
          approval_reason: string | null
          created_at: string
          id: string
          trust_log_id: string | null
          was_approved: boolean | null
        }
        Insert: {
          action_description: string
          action_scope: string
          action_type: string
          actor_id?: string | null
          actor_role: Database["public"]["Enums"]["governance_role"]
          approval_reason?: string | null
          created_at?: string
          id?: string
          trust_log_id?: string | null
          was_approved?: boolean | null
        }
        Update: {
          action_description?: string
          action_scope?: string
          action_type?: string
          actor_id?: string | null
          actor_role?: Database["public"]["Enums"]["governance_role"]
          approval_reason?: string | null
          created_at?: string
          id?: string
          trust_log_id?: string | null
          was_approved?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "governance_actions_trust_log_id_fkey"
            columns: ["trust_log_id"]
            isOneToOne: false
            referencedRelation: "trust_log"
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
      health_indicators: {
        Row: {
          aggregation_method: string | null
          atc_codes: string[] | null
          category: string
          code: string
          created_at: string
          data_quality_notes: string | null
          definition_source: string | null
          description: string | null
          icd_codes: string[] | null
          id: string
          is_active: boolean | null
          is_inverted: boolean | null
          name: string
          name_local: Json | null
          normalization_method: string | null
          subcategory: string | null
          typical_lag_months: number | null
          unit: string
          updated_at: string
        }
        Insert: {
          aggregation_method?: string | null
          atc_codes?: string[] | null
          category: string
          code: string
          created_at?: string
          data_quality_notes?: string | null
          definition_source?: string | null
          description?: string | null
          icd_codes?: string[] | null
          id?: string
          is_active?: boolean | null
          is_inverted?: boolean | null
          name: string
          name_local?: Json | null
          normalization_method?: string | null
          subcategory?: string | null
          typical_lag_months?: number | null
          unit: string
          updated_at?: string
        }
        Update: {
          aggregation_method?: string | null
          atc_codes?: string[] | null
          category?: string
          code?: string
          created_at?: string
          data_quality_notes?: string | null
          definition_source?: string | null
          description?: string | null
          icd_codes?: string[] | null
          id?: string
          is_active?: boolean | null
          is_inverted?: boolean | null
          name?: string
          name_local?: Json | null
          normalization_method?: string | null
          subcategory?: string | null
          typical_lag_months?: number | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      health_policy_periods: {
        Row: {
          affected_indicators: string[] | null
          affected_substances: string[] | null
          category: string
          code: string
          country_code: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          key_changes: string[] | null
          name: string
          name_local: Json | null
          region_code: string | null
          source_documents: string[] | null
          source_urls: string[] | null
          start_date: string
          updated_at: string
        }
        Insert: {
          affected_indicators?: string[] | null
          affected_substances?: string[] | null
          category: string
          code: string
          country_code: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          key_changes?: string[] | null
          name: string
          name_local?: Json | null
          region_code?: string | null
          source_documents?: string[] | null
          source_urls?: string[] | null
          start_date: string
          updated_at?: string
        }
        Update: {
          affected_indicators?: string[] | null
          affected_substances?: string[] | null
          category?: string
          code?: string
          country_code?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          key_changes?: string[] | null
          name?: string
          name_local?: Json | null
          region_code?: string | null
          source_documents?: string[] | null
          source_urls?: string[] | null
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      health_scenario_analogues: {
        Row: {
          base_country_code: string
          base_period_end: string
          base_period_start: string
          category: string
          code: string
          created_at: string
          description: string | null
          id: string
          key_characteristics: Json | null
          name: string
          observed_outcomes: Json | null
          relevant_indicators: string[] | null
          relevant_substances: string[] | null
          uncertainty_factors: string[] | null
        }
        Insert: {
          base_country_code: string
          base_period_end: string
          base_period_start: string
          category: string
          code: string
          created_at?: string
          description?: string | null
          id?: string
          key_characteristics?: Json | null
          name: string
          observed_outcomes?: Json | null
          relevant_indicators?: string[] | null
          relevant_substances?: string[] | null
          uncertainty_factors?: string[] | null
        }
        Update: {
          base_country_code?: string
          base_period_end?: string
          base_period_start?: string
          category?: string
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          key_characteristics?: Json | null
          name?: string
          observed_outcomes?: Json | null
          relevant_indicators?: string[] | null
          relevant_substances?: string[] | null
          uncertainty_factors?: string[] | null
        }
        Relationships: []
      }
      health_values: {
        Row: {
          age_group: string | null
          confidence: number | null
          country_code: string
          created_at: string
          data_source_code: string
          estimation_method: string | null
          flags: string[] | null
          id: string
          indicator_id: string
          is_estimated: boolean | null
          period_end: string
          period_start: string
          region_code: string | null
          source_indicator_code: string | null
          source_url: string | null
          updated_at: string
          value: number
          value_female: number | null
          value_male: number | null
        }
        Insert: {
          age_group?: string | null
          confidence?: number | null
          country_code: string
          created_at?: string
          data_source_code: string
          estimation_method?: string | null
          flags?: string[] | null
          id?: string
          indicator_id: string
          is_estimated?: boolean | null
          period_end: string
          period_start: string
          region_code?: string | null
          source_indicator_code?: string | null
          source_url?: string | null
          updated_at?: string
          value: number
          value_female?: number | null
          value_male?: number | null
        }
        Update: {
          age_group?: string | null
          confidence?: number | null
          country_code?: string
          created_at?: string
          data_source_code?: string
          estimation_method?: string | null
          flags?: string[] | null
          id?: string
          indicator_id?: string
          is_estimated?: boolean | null
          period_end?: string
          period_start?: string
          region_code?: string | null
          source_indicator_code?: string | null
          source_url?: string | null
          updated_at?: string
          value?: number
          value_female?: number | null
          value_male?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "health_values_indicator_id_fkey"
            columns: ["indicator_id"]
            isOneToOne: false
            referencedRelation: "health_indicators"
            referencedColumns: ["id"]
          },
        ]
      }
      healthcare_capacity: {
        Row: {
          country_code: string
          created_at: string
          data_source_code: string
          health_expenditure_pct_gdp: number | null
          health_expenditure_per_capita_usd: number | null
          hospital_beds_per_10k: number | null
          id: string
          nurses_per_10k: number | null
          out_of_pocket_pct: number | null
          period_year: number
          physicians_per_10k: number | null
          psychiatric_beds_per_10k: number | null
          region_code: string | null
          source_url: string | null
          universal_coverage_index: number | null
        }
        Insert: {
          country_code: string
          created_at?: string
          data_source_code: string
          health_expenditure_pct_gdp?: number | null
          health_expenditure_per_capita_usd?: number | null
          hospital_beds_per_10k?: number | null
          id?: string
          nurses_per_10k?: number | null
          out_of_pocket_pct?: number | null
          period_year: number
          physicians_per_10k?: number | null
          psychiatric_beds_per_10k?: number | null
          region_code?: string | null
          source_url?: string | null
          universal_coverage_index?: number | null
        }
        Update: {
          country_code?: string
          created_at?: string
          data_source_code?: string
          health_expenditure_pct_gdp?: number | null
          health_expenditure_per_capita_usd?: number | null
          hospital_beds_per_10k?: number | null
          id?: string
          nurses_per_10k?: number | null
          out_of_pocket_pct?: number | null
          period_year?: number
          physicians_per_10k?: number | null
          psychiatric_beds_per_10k?: number | null
          region_code?: string | null
          source_url?: string | null
          universal_coverage_index?: number | null
        }
        Relationships: []
      }
      indicator_detection_log: {
        Row: {
          confidence_score: number
          detected_at: string
          detected_indicators: Json
          detection_method: string
          id: string
          matched_kpi_ids: string[] | null
          new_indicators_suggested: Json | null
          processed: boolean
          source_id: string
        }
        Insert: {
          confidence_score: number
          detected_at?: string
          detected_indicators: Json
          detection_method: string
          id?: string
          matched_kpi_ids?: string[] | null
          new_indicators_suggested?: Json | null
          processed?: boolean
          source_id: string
        }
        Update: {
          confidence_score?: number
          detected_at?: string
          detected_indicators?: Json
          detection_method?: string
          id?: string
          matched_kpi_ids?: string[] | null
          new_indicators_suggested?: Json | null
          processed?: boolean
          source_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "indicator_detection_log_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
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
      institutional_access_requests: {
        Row: {
          approved_subscription_id: string | null
          contact_email: string
          contact_name: string
          contact_phone: string | null
          countries_of_interest: string[] | null
          created_at: string
          custom_pricing_eur: number | null
          expected_users: number | null
          id: string
          organization_name: string
          organization_type: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          use_case_description: string
        }
        Insert: {
          approved_subscription_id?: string | null
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          countries_of_interest?: string[] | null
          created_at?: string
          custom_pricing_eur?: number | null
          expected_users?: number | null
          id?: string
          organization_name: string
          organization_type: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          use_case_description: string
        }
        Update: {
          approved_subscription_id?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          countries_of_interest?: string[] | null
          created_at?: string
          custom_pricing_eur?: number | null
          expected_users?: number | null
          id?: string
          organization_name?: string
          organization_type?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          use_case_description?: string
        }
        Relationships: [
          {
            foreignKeyName: "institutional_access_requests_approved_subscription_id_fkey"
            columns: ["approved_subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
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
      interpretation_boundaries: {
        Row: {
          boundary_code: string
          created_at: string | null
          id: string
          invalid_statements: string[] | null
          is_active: boolean | null
          never_allowed: string[]
          protected_aspect: string
          protection_type: string | null
          requires_context: string[] | null
          requires_disclosure: string[] | null
          valid_statements: string[] | null
        }
        Insert: {
          boundary_code: string
          created_at?: string | null
          id?: string
          invalid_statements?: string[] | null
          is_active?: boolean | null
          never_allowed: string[]
          protected_aspect: string
          protection_type?: string | null
          requires_context?: string[] | null
          requires_disclosure?: string[] | null
          valid_statements?: string[] | null
        }
        Update: {
          boundary_code?: string
          created_at?: string | null
          id?: string
          invalid_statements?: string[] | null
          is_active?: boolean | null
          never_allowed?: string[]
          protected_aspect?: string
          protection_type?: string | null
          requires_context?: string[] | null
          requires_disclosure?: string[] | null
          valid_statements?: string[] | null
        }
        Relationships: []
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
      kpi_thresholds: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          kpi_id: string
          threshold_type: string
          threshold_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          kpi_id: string
          threshold_type: string
          threshold_value: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          kpi_id?: string
          threshold_type?: string
          threshold_value?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kpi_thresholds_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
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
      legal_classifications: {
        Row: {
          compliance_notes: string | null
          created_at: string
          effective_date: string
          id: string
          is_active: boolean
          jurisdiction: string
          not_classified_as: string[]
          platform_classification: string
          regulatory_framework: string | null
          required_disclaimers: string[]
          review_date: string | null
        }
        Insert: {
          compliance_notes?: string | null
          created_at?: string
          effective_date?: string
          id?: string
          is_active?: boolean
          jurisdiction: string
          not_classified_as?: string[]
          platform_classification: string
          regulatory_framework?: string | null
          required_disclaimers?: string[]
          review_date?: string | null
        }
        Update: {
          compliance_notes?: string | null
          created_at?: string
          effective_date?: string
          id?: string
          is_active?: boolean
          jurisdiction?: string
          not_classified_as?: string[]
          platform_classification?: string
          regulatory_framework?: string | null
          required_disclaimers?: string[]
          review_date?: string | null
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
      life_expectancy: {
        Row: {
          country_code: string
          created_at: string
          data_source_code: string
          healthy_life_expectancy_female: number | null
          healthy_life_expectancy_male: number | null
          healthy_life_expectancy_total: number | null
          id: string
          infant_mortality_per_1k: number | null
          life_expectancy_female: number | null
          life_expectancy_male: number | null
          life_expectancy_total: number
          maternal_mortality_per_100k: number | null
          period_year: number
          region_code: string | null
          source_url: string | null
          under5_mortality_per_1k: number | null
        }
        Insert: {
          country_code: string
          created_at?: string
          data_source_code: string
          healthy_life_expectancy_female?: number | null
          healthy_life_expectancy_male?: number | null
          healthy_life_expectancy_total?: number | null
          id?: string
          infant_mortality_per_1k?: number | null
          life_expectancy_female?: number | null
          life_expectancy_male?: number | null
          life_expectancy_total: number
          maternal_mortality_per_100k?: number | null
          period_year: number
          region_code?: string | null
          source_url?: string | null
          under5_mortality_per_1k?: number | null
        }
        Update: {
          country_code?: string
          created_at?: string
          data_source_code?: string
          healthy_life_expectancy_female?: number | null
          healthy_life_expectancy_male?: number | null
          healthy_life_expectancy_total?: number | null
          id?: string
          infant_mortality_per_1k?: number | null
          life_expectancy_female?: number | null
          life_expectancy_male?: number | null
          life_expectancy_total?: number
          maternal_mortality_per_100k?: number | null
          period_year?: number
          region_code?: string | null
          source_url?: string | null
          under5_mortality_per_1k?: number | null
        }
        Relationships: []
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
      method_registry: {
        Row: {
          academic_references: string[] | null
          applicable_to: string[]
          assumptions: string[]
          created_at: string | null
          description: string
          id: string
          implementation_url: string | null
          is_active: boolean | null
          limitations: string[]
          mathematical_formula: string | null
          method_code: string
          name: string
          not_applicable_to: string[] | null
          pseudocode: string | null
          validated_by: string[] | null
          validation_date: string | null
          validation_notes: string | null
          version: string
        }
        Insert: {
          academic_references?: string[] | null
          applicable_to: string[]
          assumptions: string[]
          created_at?: string | null
          description: string
          id?: string
          implementation_url?: string | null
          is_active?: boolean | null
          limitations: string[]
          mathematical_formula?: string | null
          method_code: string
          name: string
          not_applicable_to?: string[] | null
          pseudocode?: string | null
          validated_by?: string[] | null
          validation_date?: string | null
          validation_notes?: string | null
          version: string
        }
        Update: {
          academic_references?: string[] | null
          applicable_to?: string[]
          assumptions?: string[]
          created_at?: string | null
          description?: string
          id?: string
          implementation_url?: string | null
          is_active?: boolean | null
          limitations?: string[]
          mathematical_formula?: string | null
          method_code?: string
          name?: string
          not_applicable_to?: string[] | null
          pseudocode?: string | null
          validated_by?: string[] | null
          validation_date?: string | null
          validation_notes?: string | null
          version?: string
        }
        Relationships: []
      }
      mission_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_read: boolean
          message: string
          mission_id: string
          read_at: string | null
          related_data: Json | null
          severity: string
          title: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          mission_id: string
          read_at?: string | null
          related_data?: Json | null
          severity?: string
          title: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          mission_id?: string
          read_at?: string | null
          related_data?: Json | null
          severity?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_alerts_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "user_missions"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_snapshots: {
        Row: {
          created_at: string
          direction: string
          direction_score: number | null
          id: string
          key_indicators: Json | null
          mission_id: string
          snapshot_date: string
          summary_text: string | null
        }
        Insert: {
          created_at?: string
          direction: string
          direction_score?: number | null
          id?: string
          key_indicators?: Json | null
          mission_id: string
          snapshot_date: string
          summary_text?: string | null
        }
        Update: {
          created_at?: string
          direction?: string
          direction_score?: number | null
          id?: string
          key_indicators?: Json | null
          mission_id?: string
          snapshot_date?: string
          summary_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mission_snapshots_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "user_missions"
            referencedColumns: ["id"]
          },
        ]
      }
      misuse_detection_log: {
        Row: {
          action_taken: string | null
          api_log_ids: string[]
          detected_at: string
          detection_type: string
          evidence_summary: string
          id: string
          resolution_notes: string | null
          resolved_at: string | null
          severity: string
        }
        Insert: {
          action_taken?: string | null
          api_log_ids?: string[]
          detected_at?: string
          detection_type: string
          evidence_summary: string
          id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          severity?: string
        }
        Update: {
          action_taken?: string | null
          api_log_ids?: string[]
          detected_at?: string
          detection_type?: string
          evidence_summary?: string
          id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          severity?: string
        }
        Relationships: []
      }
      misuse_flags: {
        Row: {
          flagged_at: string | null
          flagged_by: string | null
          flagged_content_id: string | null
          flagged_content_type: string
          flagged_text: string | null
          id: string
          reviewed_at: string | null
          reviewer_notes: string | null
          status: string | null
          violated_article: number | null
          violation_type: string
        }
        Insert: {
          flagged_at?: string | null
          flagged_by?: string | null
          flagged_content_id?: string | null
          flagged_content_type: string
          flagged_text?: string | null
          id?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: string | null
          violated_article?: number | null
          violation_type: string
        }
        Update: {
          flagged_at?: string | null
          flagged_by?: string | null
          flagged_content_id?: string | null
          flagged_content_type?: string
          flagged_text?: string | null
          id?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: string | null
          violated_article?: number | null
          violation_type?: string
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
      pattern_lifecycle: {
        Row: {
          confirmed_in_geos: string[] | null
          contradicting_evidence: number | null
          created_at: string | null
          failed_in_geos: string[] | null
          failed_replications: number | null
          first_observed_geo: string | null
          id: string
          pattern_code: string
          pattern_description: string
          replications: number | null
          stage: string
          stage_changed_at: string | null
          stage_history: Json | null
          supporting_evidence: number | null
          updated_at: string | null
        }
        Insert: {
          confirmed_in_geos?: string[] | null
          contradicting_evidence?: number | null
          created_at?: string | null
          failed_in_geos?: string[] | null
          failed_replications?: number | null
          first_observed_geo?: string | null
          id?: string
          pattern_code: string
          pattern_description: string
          replications?: number | null
          stage: string
          stage_changed_at?: string | null
          stage_history?: Json | null
          supporting_evidence?: number | null
          updated_at?: string | null
        }
        Update: {
          confirmed_in_geos?: string[] | null
          contradicting_evidence?: number | null
          created_at?: string | null
          failed_in_geos?: string[] | null
          failed_replications?: number | null
          first_observed_geo?: string | null
          id?: string
          pattern_code?: string
          pattern_description?: string
          replications?: number | null
          stage?: string
          stage_changed_at?: string | null
          stage_history?: Json | null
          supporting_evidence?: number | null
          updated_at?: string | null
        }
        Relationships: []
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
      public_experiments: {
        Row: {
          all_data_public: boolean | null
          analysis_method: string
          assumptions: string[]
          completed_at: string | null
          conclusion: string | null
          created_at: string | null
          data_sources: string[]
          experiment_code: string
          hypothesis: string
          id: string
          limitations: string[] | null
          methodology: string
          proposed_by: string | null
          replication_instructions: string | null
          result_data: Json | null
          result_summary: string | null
          reviewed_by: string[] | null
          started_at: string | null
          status: string | null
          title: string
        }
        Insert: {
          all_data_public?: boolean | null
          analysis_method: string
          assumptions: string[]
          completed_at?: string | null
          conclusion?: string | null
          created_at?: string | null
          data_sources: string[]
          experiment_code: string
          hypothesis: string
          id?: string
          limitations?: string[] | null
          methodology: string
          proposed_by?: string | null
          replication_instructions?: string | null
          result_data?: Json | null
          result_summary?: string | null
          reviewed_by?: string[] | null
          started_at?: string | null
          status?: string | null
          title: string
        }
        Update: {
          all_data_public?: boolean | null
          analysis_method?: string
          assumptions?: string[]
          completed_at?: string | null
          conclusion?: string | null
          created_at?: string | null
          data_sources?: string[]
          experiment_code?: string
          hypothesis?: string
          id?: string
          limitations?: string[] | null
          methodology?: string
          proposed_by?: string | null
          replication_instructions?: string | null
          result_data?: Json | null
          result_summary?: string | null
          reviewed_by?: string[] | null
          started_at?: string | null
          status?: string | null
          title?: string
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
      question_answer_templates: {
        Row: {
          blocked_response_template: string | null
          comparison_template: string | null
          created_at: string | null
          deep_links_template: string | null
          id: string
          intent_class: Database["public"]["Enums"]["question_intent_class"]
          is_active: boolean | null
          mechanism_template: string | null
          short_answer_template: string
          template_code: string
          template_name: string
          timeline_template: string | null
          translations: Json | null
          uncertainty_template: string | null
        }
        Insert: {
          blocked_response_template?: string | null
          comparison_template?: string | null
          created_at?: string | null
          deep_links_template?: string | null
          id?: string
          intent_class: Database["public"]["Enums"]["question_intent_class"]
          is_active?: boolean | null
          mechanism_template?: string | null
          short_answer_template: string
          template_code: string
          template_name: string
          timeline_template?: string | null
          translations?: Json | null
          uncertainty_template?: string | null
        }
        Update: {
          blocked_response_template?: string | null
          comparison_template?: string | null
          created_at?: string | null
          deep_links_template?: string | null
          id?: string
          intent_class?: Database["public"]["Enums"]["question_intent_class"]
          is_active?: boolean | null
          mechanism_template?: string | null
          short_answer_template?: string
          template_code?: string
          template_name?: string
          timeline_template?: string | null
          translations?: Json | null
          uncertainty_template?: string | null
        }
        Relationships: []
      }
      question_search_log: {
        Row: {
          block_reason:
            | Database["public"]["Enums"]["question_block_reason"]
            | null
          created_at: string | null
          detected_intent:
            | Database["public"]["Enums"]["question_intent_class"]
            | null
          geo_context: string | null
          id: string
          language_code: string | null
          matched_question_id: string | null
          normalized_query: string | null
          raw_query: string
          source_type: string | null
          was_blocked: boolean | null
        }
        Insert: {
          block_reason?:
            | Database["public"]["Enums"]["question_block_reason"]
            | null
          created_at?: string | null
          detected_intent?:
            | Database["public"]["Enums"]["question_intent_class"]
            | null
          geo_context?: string | null
          id?: string
          language_code?: string | null
          matched_question_id?: string | null
          normalized_query?: string | null
          raw_query: string
          source_type?: string | null
          was_blocked?: boolean | null
        }
        Update: {
          block_reason?:
            | Database["public"]["Enums"]["question_block_reason"]
            | null
          created_at?: string | null
          detected_intent?:
            | Database["public"]["Enums"]["question_intent_class"]
            | null
          geo_context?: string | null
          id?: string
          language_code?: string | null
          matched_question_id?: string | null
          normalized_query?: string | null
          raw_query?: string
          source_type?: string | null
          was_blocked?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "question_search_log_matched_question_id_fkey"
            columns: ["matched_question_id"]
            isOneToOne: false
            referencedRelation: "canonical_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      raw_data_ingest: {
        Row: {
          checksum: string
          id: string
          ingested_at: string
          payload_json: Json
          processed_at: string | null
          processing_error: string | null
          processing_status: string
          source_id: string
        }
        Insert: {
          checksum: string
          id?: string
          ingested_at?: string
          payload_json: Json
          processed_at?: string | null
          processing_error?: string | null
          processing_status?: string
          source_id: string
        }
        Update: {
          checksum?: string
          id?: string
          ingested_at?: string
          payload_json?: Json
          processed_at?: string | null
          processing_error?: string | null
          processing_status?: string
          source_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "raw_data_ingest_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      regional_country_data: {
        Row: {
          country_code: string
          country_name: string
          created_at: string
          data_source: string | null
          gdp_per_capita: number | null
          hdi: number | null
          id: string
          life_expectancy: number | null
          population_millions: number
          region_code: string
          year: number
        }
        Insert: {
          country_code: string
          country_name: string
          created_at?: string
          data_source?: string | null
          gdp_per_capita?: number | null
          hdi?: number | null
          id?: string
          life_expectancy?: number | null
          population_millions: number
          region_code: string
          year?: number
        }
        Update: {
          country_code?: string
          country_name?: string
          created_at?: string
          data_source?: string | null
          gdp_per_capita?: number | null
          hdi?: number | null
          id?: string
          life_expectancy?: number | null
          population_millions?: number
          region_code?: string
          year?: number
        }
        Relationships: []
      }
      regional_demographics: {
        Row: {
          age_group: string
          created_at: string
          data_source: string | null
          female_percent: number
          id: string
          male_percent: number
          region_code: string
          region_name: string
          year: number
        }
        Insert: {
          age_group: string
          created_at?: string
          data_source?: string | null
          female_percent: number
          id?: string
          male_percent: number
          region_code: string
          region_name: string
          year?: number
        }
        Update: {
          age_group?: string
          created_at?: string
          data_source?: string | null
          female_percent?: number
          id?: string
          male_percent?: number
          region_code?: string
          region_name?: string
          year?: number
        }
        Relationships: []
      }
      regional_life_expectancy: {
        Row: {
          created_at: string
          data_source: string | null
          healthy_life_years: number | null
          id: string
          life_expectancy_female: number | null
          life_expectancy_male: number | null
          life_expectancy_overall: number
          region_code: string
          region_name: string
          year: number
        }
        Insert: {
          created_at?: string
          data_source?: string | null
          healthy_life_years?: number | null
          id?: string
          life_expectancy_female?: number | null
          life_expectancy_male?: number | null
          life_expectancy_overall: number
          region_code: string
          region_name: string
          year: number
        }
        Update: {
          created_at?: string
          data_source?: string | null
          healthy_life_years?: number | null
          id?: string
          life_expectancy_female?: number | null
          life_expectancy_male?: number | null
          life_expectancy_overall?: number
          region_code?: string
          region_name?: string
          year?: number
        }
        Relationships: []
      }
      regional_population_history: {
        Row: {
          created_at: string
          data_source: string | null
          growth_rate_percent: number | null
          id: string
          median_age: number | null
          population_millions: number
          region_code: string
          region_name: string
          year: number
        }
        Insert: {
          created_at?: string
          data_source?: string | null
          growth_rate_percent?: number | null
          id?: string
          median_age?: number | null
          population_millions: number
          region_code: string
          region_name: string
          year: number
        }
        Update: {
          created_at?: string
          data_source?: string | null
          growth_rate_percent?: number | null
          id?: string
          median_age?: number | null
          population_millions?: number
          region_code?: string
          region_name?: string
          year?: number
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
      report_citations: {
        Row: {
          citation_order: number | null
          cited_date: string | null
          cited_value: string | null
          created_at: string | null
          data_type: string | null
          id: string
          indicator_code: string | null
          is_verified: boolean | null
          last_verified_at: string | null
          reliability_score: number | null
          report_id: string
          source_name: string
          source_organization: string | null
          source_url: string | null
        }
        Insert: {
          citation_order?: number | null
          cited_date?: string | null
          cited_value?: string | null
          created_at?: string | null
          data_type?: string | null
          id?: string
          indicator_code?: string | null
          is_verified?: boolean | null
          last_verified_at?: string | null
          reliability_score?: number | null
          report_id: string
          source_name: string
          source_organization?: string | null
          source_url?: string | null
        }
        Update: {
          citation_order?: number | null
          cited_date?: string | null
          cited_value?: string | null
          created_at?: string | null
          data_type?: string | null
          id?: string
          indicator_code?: string | null
          is_verified?: boolean | null
          last_verified_at?: string | null
          reliability_score?: number | null
          report_id?: string
          source_name?: string
          source_organization?: string | null
          source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_citations_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "analysis_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_generation_queue: {
        Row: {
          completed_at: string | null
          error_message: string | null
          geo_code: string | null
          id: string
          priority: number | null
          question_id: string | null
          queued_at: string | null
          report_id: string | null
          started_at: string | null
          status: string | null
          time_period: string | null
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          geo_code?: string | null
          id?: string
          priority?: number | null
          question_id?: string | null
          queued_at?: string | null
          report_id?: string | null
          started_at?: string | null
          status?: string | null
          time_period?: string | null
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          geo_code?: string | null
          id?: string
          priority?: number | null
          question_id?: string | null
          queued_at?: string | null
          report_id?: string | null
          started_at?: string | null
          status?: string | null
          time_period?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_generation_queue_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "report_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_generation_queue_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "analysis_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_questions: {
        Row: {
          category: Database["public"]["Enums"]["report_category"]
          created_at: string | null
          geo_code: string | null
          geo_level: string
          id: string
          is_active: boolean | null
          meta_description: string | null
          meta_title: string | null
          primary_indicator_codes: string[] | null
          priority_rank: number | null
          question_text: string
          question_text_en: string | null
          search_variants: string[] | null
          secondary_indicator_codes: string[] | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["report_category"]
          created_at?: string | null
          geo_code?: string | null
          geo_level?: string
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          primary_indicator_codes?: string[] | null
          priority_rank?: number | null
          question_text: string
          question_text_en?: string | null
          search_variants?: string[] | null
          secondary_indicator_codes?: string[] | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["report_category"]
          created_at?: string | null
          geo_code?: string | null
          geo_level?: string
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          primary_indicator_codes?: string[] | null
          priority_rank?: number | null
          question_text?: string
          question_text_en?: string | null
          search_variants?: string[] | null
          secondary_indicator_codes?: string[] | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reproducibility_records: {
        Row: {
          created_at: string | null
          deviation_if_any: number | null
          entity_id: string
          entity_type: string
          id: string
          is_publicly_reproducible: boolean | null
          last_reproduced_at: string | null
          last_reproduction_matched: boolean | null
          method_code: string
          method_parameters: Json
          method_version: string
          reproduction_count: number | null
          reproduction_endpoint: string | null
          reproduction_query: Json | null
          required_data_sources: string[]
          required_geo_scope: string[]
          required_time_range: unknown
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deviation_if_any?: number | null
          entity_id: string
          entity_type: string
          id?: string
          is_publicly_reproducible?: boolean | null
          last_reproduced_at?: string | null
          last_reproduction_matched?: boolean | null
          method_code: string
          method_parameters?: Json
          method_version: string
          reproduction_count?: number | null
          reproduction_endpoint?: string | null
          reproduction_query?: Json | null
          required_data_sources: string[]
          required_geo_scope: string[]
          required_time_range: unknown
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deviation_if_any?: number | null
          entity_id?: string
          entity_type?: string
          id?: string
          is_publicly_reproducible?: boolean | null
          last_reproduced_at?: string | null
          last_reproduction_matched?: boolean | null
          method_code?: string
          method_parameters?: Json
          method_version?: string
          reproduction_count?: number | null
          reproduction_endpoint?: string | null
          reproduction_query?: Json | null
          required_data_sources?: string[]
          required_geo_scope?: string[]
          required_time_range?: unknown
          updated_at?: string | null
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
      scope_declarations: {
        Row: {
          ai_blocked_actions: string[]
          ai_must_cite: boolean
          ai_required_disclaimers: string[]
          confidence_level: string
          confidence_rationale: string | null
          covers: string[]
          created_at: string
          does_not_cover: string[]
          entity_id: string
          entity_name: string
          entity_type: string
          geographic_scope: string[]
          id: string
          invalid_uses: string[]
          temporal_validity_end: string | null
          temporal_validity_start: string | null
          updated_at: string
          valid_comparisons: string[]
          version: number
        }
        Insert: {
          ai_blocked_actions?: string[]
          ai_must_cite?: boolean
          ai_required_disclaimers?: string[]
          confidence_level?: string
          confidence_rationale?: string | null
          covers?: string[]
          created_at?: string
          does_not_cover?: string[]
          entity_id: string
          entity_name: string
          entity_type: string
          geographic_scope?: string[]
          id?: string
          invalid_uses?: string[]
          temporal_validity_end?: string | null
          temporal_validity_start?: string | null
          updated_at?: string
          valid_comparisons?: string[]
          version?: number
        }
        Update: {
          ai_blocked_actions?: string[]
          ai_must_cite?: boolean
          ai_required_disclaimers?: string[]
          confidence_level?: string
          confidence_rationale?: string | null
          covers?: string[]
          created_at?: string
          does_not_cover?: string[]
          entity_id?: string
          entity_name?: string
          entity_type?: string
          geographic_scope?: string[]
          id?: string
          invalid_uses?: string[]
          temporal_validity_end?: string | null
          temporal_validity_start?: string | null
          updated_at?: string
          valid_comparisons?: string[]
          version?: number
        }
        Relationships: []
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
      source_discovery_queue: {
        Row: {
          created_source_id: string | null
          discovered_at: string
          geographic_scope_detected: string[] | null
          id: string
          license_detected: string | null
          processed_at: string | null
          schema_detected: Json | null
          source_type: string
          source_url: string
          temporal_scope_detected: Json | null
          validation_errors: Json | null
          validation_status: string
        }
        Insert: {
          created_source_id?: string | null
          discovered_at?: string
          geographic_scope_detected?: string[] | null
          id?: string
          license_detected?: string | null
          processed_at?: string | null
          schema_detected?: Json | null
          source_type: string
          source_url: string
          temporal_scope_detected?: Json | null
          validation_errors?: Json | null
          validation_status?: string
        }
        Update: {
          created_source_id?: string | null
          discovered_at?: string
          geographic_scope_detected?: string[] | null
          id?: string
          license_detected?: string | null
          processed_at?: string | null
          schema_detected?: Json | null
          source_type?: string
          source_url?: string
          temporal_scope_detected?: Json | null
          validation_errors?: Json | null
          validation_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_discovery_queue_created_source_id_fkey"
            columns: ["created_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      strim_diagnoses: {
        Row: {
          canonical_slug: string
          checksum: string | null
          common_comorbidities: string[] | null
          created_at: string
          definition: string
          diagnostic_criteria: Json | null
          dsm_5_code: string | null
          icd_10_code: string | null
          icd_11_code: string | null
          id: string
          name_en: string | null
          name_sv: string
          sources: Json
          status: Database["public"]["Enums"]["strim_entity_status"] | null
          treatment_principles: Json | null
          typical_onset_age: string | null
          typical_progression: string | null
          updated_at: string
          version: number | null
        }
        Insert: {
          canonical_slug: string
          checksum?: string | null
          common_comorbidities?: string[] | null
          created_at?: string
          definition: string
          diagnostic_criteria?: Json | null
          dsm_5_code?: string | null
          icd_10_code?: string | null
          icd_11_code?: string | null
          id?: string
          name_en?: string | null
          name_sv: string
          sources?: Json
          status?: Database["public"]["Enums"]["strim_entity_status"] | null
          treatment_principles?: Json | null
          typical_onset_age?: string | null
          typical_progression?: string | null
          updated_at?: string
          version?: number | null
        }
        Update: {
          canonical_slug?: string
          checksum?: string | null
          common_comorbidities?: string[] | null
          created_at?: string
          definition?: string
          diagnostic_criteria?: Json | null
          dsm_5_code?: string | null
          icd_10_code?: string | null
          icd_11_code?: string | null
          id?: string
          name_en?: string | null
          name_sv?: string
          sources?: Json
          status?: Database["public"]["Enums"]["strim_entity_status"] | null
          treatment_principles?: Json | null
          typical_onset_age?: string | null
          typical_progression?: string | null
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      strim_legal: {
        Row: {
          amendments: Json | null
          canonical_slug: string
          checksum: string | null
          created_at: string
          eu_reference: string | null
          id: string
          impact_on_care: string | null
          impact_on_society: string | null
          jurisdiction: string
          jurisdiction_level: string | null
          key_provisions: Json | null
          name_en: string | null
          name_sv: string
          sfs_number: string | null
          short_name: string | null
          sources: Json
          status: Database["public"]["Enums"]["strim_entity_status"] | null
          summary: string
          updated_at: string
          valid_from: string
          valid_to: string | null
          version: number | null
        }
        Insert: {
          amendments?: Json | null
          canonical_slug: string
          checksum?: string | null
          created_at?: string
          eu_reference?: string | null
          id?: string
          impact_on_care?: string | null
          impact_on_society?: string | null
          jurisdiction?: string
          jurisdiction_level?: string | null
          key_provisions?: Json | null
          name_en?: string | null
          name_sv: string
          sfs_number?: string | null
          short_name?: string | null
          sources?: Json
          status?: Database["public"]["Enums"]["strim_entity_status"] | null
          summary: string
          updated_at?: string
          valid_from: string
          valid_to?: string | null
          version?: number | null
        }
        Update: {
          amendments?: Json | null
          canonical_slug?: string
          checksum?: string | null
          created_at?: string
          eu_reference?: string | null
          id?: string
          impact_on_care?: string | null
          impact_on_society?: string | null
          jurisdiction?: string
          jurisdiction_level?: string | null
          key_provisions?: Json | null
          name_en?: string | null
          name_sv?: string
          sfs_number?: string | null
          short_name?: string | null
          sources?: Json
          status?: Database["public"]["Enums"]["strim_entity_status"] | null
          summary?: string
          updated_at?: string
          valid_from?: string
          valid_to?: string | null
          version?: number | null
        }
        Relationships: []
      }
      strim_legal_history: {
        Row: {
          created_at: string
          id: string
          jurisdiction: string
          legal_reference: string | null
          legal_status: Database["public"]["Enums"]["strim_legal_status"]
          notes: string | null
          substance_id: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          jurisdiction?: string
          legal_reference?: string | null
          legal_status: Database["public"]["Enums"]["strim_legal_status"]
          notes?: string | null
          substance_id: string
          valid_from: string
          valid_to?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          jurisdiction?: string
          legal_reference?: string | null
          legal_status?: Database["public"]["Enums"]["strim_legal_status"]
          notes?: string | null
          substance_id?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "strim_legal_history_substance_id_fkey"
            columns: ["substance_id"]
            isOneToOne: false
            referencedRelation: "strim_substances"
            referencedColumns: ["id"]
          },
        ]
      }
      strim_relations: {
        Row: {
          context: string | null
          created_at: string
          evidence_level:
            | Database["public"]["Enums"]["strim_evidence_level"]
            | null
          id: string
          relation_strength: number | null
          relation_type: Database["public"]["Enums"]["strim_relation_type"]
          source_id: string
          source_slug: string
          source_type: string
          sources: Json | null
          target_id: string
          target_slug: string
          target_type: string
        }
        Insert: {
          context?: string | null
          created_at?: string
          evidence_level?:
            | Database["public"]["Enums"]["strim_evidence_level"]
            | null
          id?: string
          relation_strength?: number | null
          relation_type: Database["public"]["Enums"]["strim_relation_type"]
          source_id: string
          source_slug: string
          source_type: string
          sources?: Json | null
          target_id: string
          target_slug: string
          target_type: string
        }
        Update: {
          context?: string | null
          created_at?: string
          evidence_level?:
            | Database["public"]["Enums"]["strim_evidence_level"]
            | null
          id?: string
          relation_strength?: number | null
          relation_type?: Database["public"]["Enums"]["strim_relation_type"]
          source_id?: string
          source_slug?: string
          source_type?: string
          sources?: Json | null
          target_id?: string
          target_slug?: string
          target_type?: string
        }
        Relationships: []
      }
      strim_statistics: {
        Row: {
          canonical_slug: string
          checksum: string | null
          confidence_interval: Json | null
          created_at: string
          data_source: string
          data_source_url: string | null
          first_available_year: number | null
          geography_codes: string[] | null
          geography_level: string | null
          id: string
          indicator_code: string | null
          indicator_name_en: string | null
          indicator_name_sv: string
          last_available_year: number | null
          measurement_type: string | null
          measures_diagnosis_slugs: string[] | null
          measures_substance_slugs: string[] | null
          sources: Json
          status: Database["public"]["Enums"]["strim_entity_status"] | null
          time_granularity: string | null
          trend_direction: string | null
          trend_period: string | null
          uncertainty_description: string | null
          unit: string
          updated_at: string
          version: number | null
        }
        Insert: {
          canonical_slug: string
          checksum?: string | null
          confidence_interval?: Json | null
          created_at?: string
          data_source: string
          data_source_url?: string | null
          first_available_year?: number | null
          geography_codes?: string[] | null
          geography_level?: string | null
          id?: string
          indicator_code?: string | null
          indicator_name_en?: string | null
          indicator_name_sv: string
          last_available_year?: number | null
          measurement_type?: string | null
          measures_diagnosis_slugs?: string[] | null
          measures_substance_slugs?: string[] | null
          sources?: Json
          status?: Database["public"]["Enums"]["strim_entity_status"] | null
          time_granularity?: string | null
          trend_direction?: string | null
          trend_period?: string | null
          uncertainty_description?: string | null
          unit: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          canonical_slug?: string
          checksum?: string | null
          confidence_interval?: Json | null
          created_at?: string
          data_source?: string
          data_source_url?: string | null
          first_available_year?: number | null
          geography_codes?: string[] | null
          geography_level?: string | null
          id?: string
          indicator_code?: string | null
          indicator_name_en?: string | null
          indicator_name_sv?: string
          last_available_year?: number | null
          measurement_type?: string | null
          measures_diagnosis_slugs?: string[] | null
          measures_substance_slugs?: string[] | null
          sources?: Json
          status?: Database["public"]["Enums"]["strim_entity_status"] | null
          time_granularity?: string | null
          trend_direction?: string | null
          trend_period?: string | null
          uncertainty_description?: string | null
          unit?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      strim_statistics_values: {
        Row: {
          confidence_lower: number | null
          confidence_upper: number | null
          created_at: string
          geography_code: string | null
          id: string
          is_preliminary: boolean | null
          period_month: number | null
          period_year: number
          revision_number: number | null
          statistic_id: string
          value: number
          value_per_100k: number | null
        }
        Insert: {
          confidence_lower?: number | null
          confidence_upper?: number | null
          created_at?: string
          geography_code?: string | null
          id?: string
          is_preliminary?: boolean | null
          period_month?: number | null
          period_year: number
          revision_number?: number | null
          statistic_id: string
          value: number
          value_per_100k?: number | null
        }
        Update: {
          confidence_lower?: number | null
          confidence_upper?: number | null
          created_at?: string
          geography_code?: string | null
          id?: string
          is_preliminary?: boolean | null
          period_month?: number | null
          period_year?: number
          revision_number?: number | null
          statistic_id?: string
          value?: number
          value_per_100k?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "strim_statistics_values_statistic_id_fkey"
            columns: ["statistic_id"]
            isOneToOne: false
            referencedRelation: "strim_statistics"
            referencedColumns: ["id"]
          },
        ]
      }
      strim_substances: {
        Row: {
          canonical_slug: string
          checksum: string | null
          classification_primary: string
          classification_secondary: string | null
          created_at: string
          current_legal_status:
            | Database["public"]["Enums"]["strim_legal_status"]
            | null
          dependence_potential:
            | Database["public"]["Enums"]["strim_risk_category"]
            | null
          first_documented_use: string | null
          historical_context: string | null
          id: string
          name_en: string | null
          name_sv: string
          names_alternative: string[] | null
          overdose_risk:
            | Database["public"]["Enums"]["strim_risk_category"]
            | null
          pharmacological_class: string | null
          pharmacology: Json | null
          risk_category:
            | Database["public"]["Enums"]["strim_risk_category"]
            | null
          sources: Json
          status: Database["public"]["Enums"]["strim_entity_status"] | null
          updated_at: string
          version: number | null
        }
        Insert: {
          canonical_slug: string
          checksum?: string | null
          classification_primary: string
          classification_secondary?: string | null
          created_at?: string
          current_legal_status?:
            | Database["public"]["Enums"]["strim_legal_status"]
            | null
          dependence_potential?:
            | Database["public"]["Enums"]["strim_risk_category"]
            | null
          first_documented_use?: string | null
          historical_context?: string | null
          id?: string
          name_en?: string | null
          name_sv: string
          names_alternative?: string[] | null
          overdose_risk?:
            | Database["public"]["Enums"]["strim_risk_category"]
            | null
          pharmacological_class?: string | null
          pharmacology?: Json | null
          risk_category?:
            | Database["public"]["Enums"]["strim_risk_category"]
            | null
          sources?: Json
          status?: Database["public"]["Enums"]["strim_entity_status"] | null
          updated_at?: string
          version?: number | null
        }
        Update: {
          canonical_slug?: string
          checksum?: string | null
          classification_primary?: string
          classification_secondary?: string | null
          created_at?: string
          current_legal_status?:
            | Database["public"]["Enums"]["strim_legal_status"]
            | null
          dependence_potential?:
            | Database["public"]["Enums"]["strim_risk_category"]
            | null
          first_documented_use?: string | null
          historical_context?: string | null
          id?: string
          name_en?: string | null
          name_sv?: string
          names_alternative?: string[] | null
          overdose_risk?:
            | Database["public"]["Enums"]["strim_risk_category"]
            | null
          pharmacological_class?: string | null
          pharmacology?: Json | null
          risk_category?:
            | Database["public"]["Enums"]["strim_risk_category"]
            | null
          sources?: Json
          status?: Database["public"]["Enums"]["strim_entity_status"] | null
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      strim_terms: {
        Row: {
          alternative_definitions: Json | null
          antonyms: string[] | null
          canonical_slug: string
          checksum: string | null
          created_at: string
          definition_en: string | null
          definition_sv: string
          historical_meaning: string | null
          id: string
          meaning_changed: boolean | null
          related_terms: string[] | null
          sources: Json
          status: Database["public"]["Enums"]["strim_entity_status"] | null
          synonyms: string[] | null
          term_en: string | null
          term_sv: string
          updated_at: string
          usage_context: string[] | null
          version: number | null
        }
        Insert: {
          alternative_definitions?: Json | null
          antonyms?: string[] | null
          canonical_slug: string
          checksum?: string | null
          created_at?: string
          definition_en?: string | null
          definition_sv: string
          historical_meaning?: string | null
          id?: string
          meaning_changed?: boolean | null
          related_terms?: string[] | null
          sources?: Json
          status?: Database["public"]["Enums"]["strim_entity_status"] | null
          synonyms?: string[] | null
          term_en?: string | null
          term_sv: string
          updated_at?: string
          usage_context?: string[] | null
          version?: number | null
        }
        Update: {
          alternative_definitions?: Json | null
          antonyms?: string[] | null
          canonical_slug?: string
          checksum?: string | null
          created_at?: string
          definition_en?: string | null
          definition_sv?: string
          historical_meaning?: string | null
          id?: string
          meaning_changed?: boolean | null
          related_terms?: string[] | null
          sources?: Json
          status?: Database["public"]["Enums"]["strim_entity_status"] | null
          synonyms?: string[] | null
          term_en?: string | null
          term_sv?: string
          updated_at?: string
          usage_context?: string[] | null
          version?: number | null
        }
        Relationships: []
      }
      strim_treatments: {
        Row: {
          acronym: string | null
          applicable_for: string[] | null
          canonical_slug: string
          checksum: string | null
          contraindications: string[] | null
          created_at: string
          development_history: string | null
          evidence_level:
            | Database["public"]["Enums"]["strim_evidence_level"]
            | null
          evidence_summary: string | null
          first_used: string | null
          id: string
          method_type: string
          name_en: string | null
          name_sv: string
          risks: Json | null
          sources: Json
          status: Database["public"]["Enums"]["strim_entity_status"] | null
          treatment_setting: string | null
          updated_at: string
          version: number | null
        }
        Insert: {
          acronym?: string | null
          applicable_for?: string[] | null
          canonical_slug: string
          checksum?: string | null
          contraindications?: string[] | null
          created_at?: string
          development_history?: string | null
          evidence_level?:
            | Database["public"]["Enums"]["strim_evidence_level"]
            | null
          evidence_summary?: string | null
          first_used?: string | null
          id?: string
          method_type: string
          name_en?: string | null
          name_sv: string
          risks?: Json | null
          sources?: Json
          status?: Database["public"]["Enums"]["strim_entity_status"] | null
          treatment_setting?: string | null
          updated_at?: string
          version?: number | null
        }
        Update: {
          acronym?: string | null
          applicable_for?: string[] | null
          canonical_slug?: string
          checksum?: string | null
          contraindications?: string[] | null
          created_at?: string
          development_history?: string | null
          evidence_level?:
            | Database["public"]["Enums"]["strim_evidence_level"]
            | null
          evidence_summary?: string | null
          first_used?: string | null
          id?: string
          method_type?: string
          name_en?: string | null
          name_sv?: string
          risks?: Json | null
          sources?: Json
          status?: Database["public"]["Enums"]["strim_entity_status"] | null
          treatment_setting?: string | null
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      subscription_audit_log: {
        Row: {
          action: string
          created_at: string
          from_tier: Database["public"]["Enums"]["subscription_tier"] | null
          id: string
          ip_address: unknown
          metadata: Json | null
          source: string
          stripe_event_id: string | null
          subscription_id: string | null
          to_tier: Database["public"]["Enums"]["subscription_tier"] | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          from_tier?: Database["public"]["Enums"]["subscription_tier"] | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          source?: string
          stripe_event_id?: string | null
          subscription_id?: string | null
          to_tier?: Database["public"]["Enums"]["subscription_tier"] | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          from_tier?: Database["public"]["Enums"]["subscription_tier"] | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          source?: string
          stripe_event_id?: string | null
          subscription_id?: string | null
          to_tier?: Database["public"]["Enums"]["subscription_tier"] | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_audit_log_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      substance_data: {
        Row: {
          age_group: string | null
          confidence: number | null
          country_code: string
          created_at: string
          data_source_code: string
          id: string
          is_estimated: boolean | null
          measure_type: string
          methodology_notes: string | null
          period_end: string
          period_start: string
          region_code: string | null
          source_url: string | null
          substance_id: string
          unit: string
          value: number
          value_female: number | null
          value_male: number | null
        }
        Insert: {
          age_group?: string | null
          confidence?: number | null
          country_code: string
          created_at?: string
          data_source_code: string
          id?: string
          is_estimated?: boolean | null
          measure_type: string
          methodology_notes?: string | null
          period_end: string
          period_start: string
          region_code?: string | null
          source_url?: string | null
          substance_id: string
          unit: string
          value: number
          value_female?: number | null
          value_male?: number | null
        }
        Update: {
          age_group?: string | null
          confidence?: number | null
          country_code?: string
          created_at?: string
          data_source_code?: string
          id?: string
          is_estimated?: boolean | null
          measure_type?: string
          methodology_notes?: string | null
          period_end?: string
          period_start?: string
          region_code?: string | null
          source_url?: string | null
          substance_id?: string
          unit?: string
          value?: number
          value_female?: number | null
          value_male?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "substance_data_substance_id_fkey"
            columns: ["substance_id"]
            isOneToOne: false
            referencedRelation: "substance_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      substance_legal_status: {
        Row: {
          country_code: string
          created_at: string
          effective_from: string
          effective_to: string | null
          id: string
          notes: string | null
          schedule: string | null
          source_document: string | null
          source_url: string | null
          status: string
          substance_id: string
        }
        Insert: {
          country_code: string
          created_at?: string
          effective_from: string
          effective_to?: string | null
          id?: string
          notes?: string | null
          schedule?: string | null
          source_document?: string | null
          source_url?: string | null
          status: string
          substance_id: string
        }
        Update: {
          country_code?: string
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          notes?: string | null
          schedule?: string | null
          source_document?: string | null
          source_url?: string | null
          status?: string
          substance_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "substance_legal_status_substance_id_fkey"
            columns: ["substance_id"]
            isOneToOne: false
            referencedRelation: "substance_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      substance_profiles: {
        Row: {
          chemical_class: string | null
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          name_local: Json | null
          pharmacological_category: string | null
          updated_at: string
          who_classification: string | null
        }
        Insert: {
          chemical_class?: string | null
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_local?: Json | null
          pharmacological_category?: string | null
          updated_at?: string
          who_classification?: string | null
        }
        Update: {
          chemical_class?: string | null
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_local?: Json | null
          pharmacological_category?: string | null
          updated_at?: string
          who_classification?: string | null
        }
        Relationships: []
      }
      suggested_questions: {
        Row: {
          created_at: string | null
          detected_intent:
            | Database["public"]["Enums"]["question_intent_class"]
            | null
          first_seen_at: string | null
          id: string
          last_seen_at: string | null
          promoted_to_question_id: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          search_frequency: number | null
          status: string | null
          suggested_text: string
        }
        Insert: {
          created_at?: string | null
          detected_intent?:
            | Database["public"]["Enums"]["question_intent_class"]
            | null
          first_seen_at?: string | null
          id?: string
          last_seen_at?: string | null
          promoted_to_question_id?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          search_frequency?: number | null
          status?: string | null
          suggested_text: string
        }
        Update: {
          created_at?: string | null
          detected_intent?:
            | Database["public"]["Enums"]["question_intent_class"]
            | null
          first_seen_at?: string | null
          id?: string
          last_seen_at?: string | null
          promoted_to_question_id?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          search_frequency?: number | null
          status?: string | null
          suggested_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggested_questions_promoted_to_question_id_fkey"
            columns: ["promoted_to_question_id"]
            isOneToOne: false
            referencedRelation: "canonical_questions"
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
      trust_log: {
        Row: {
          change_type: Database["public"]["Enums"]["trust_log_change_type"]
          content_impact: string | null
          created_at: string
          data_changed: boolean
          id: string
          initiated_by: string
          initiated_by_role:
            | Database["public"]["Enums"]["governance_role"]
            | null
          log_id: string
          method_changed: boolean
          reason: string
          review_status: Database["public"]["Enums"]["review_status"]
          reviewed_at: string | null
          reviewed_by_role:
            | Database["public"]["Enums"]["governance_role"]
            | null
          scope: string
        }
        Insert: {
          change_type: Database["public"]["Enums"]["trust_log_change_type"]
          content_impact?: string | null
          created_at?: string
          data_changed?: boolean
          id?: string
          initiated_by: string
          initiated_by_role?:
            | Database["public"]["Enums"]["governance_role"]
            | null
          log_id: string
          method_changed?: boolean
          reason: string
          review_status?: Database["public"]["Enums"]["review_status"]
          reviewed_at?: string | null
          reviewed_by_role?:
            | Database["public"]["Enums"]["governance_role"]
            | null
          scope: string
        }
        Update: {
          change_type?: Database["public"]["Enums"]["trust_log_change_type"]
          content_impact?: string | null
          created_at?: string
          data_changed?: boolean
          id?: string
          initiated_by?: string
          initiated_by_role?:
            | Database["public"]["Enums"]["governance_role"]
            | null
          log_id?: string
          method_changed?: boolean
          reason?: string
          review_status?: Database["public"]["Enums"]["review_status"]
          reviewed_at?: string | null
          reviewed_by_role?:
            | Database["public"]["Enums"]["governance_role"]
            | null
          scope?: string
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
      user_missions: {
        Row: {
          created_at: string
          description: string | null
          focus_id: string
          focus_name: string
          focus_type: string
          id: string
          is_active: boolean
          notification_frequency: string | null
          title: string | null
          tracked_question_ids: string[] | null
          tracking_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          focus_id: string
          focus_name: string
          focus_type: string
          id?: string
          is_active?: boolean
          notification_frequency?: string | null
          title?: string | null
          tracked_question_ids?: string[] | null
          tracking_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          focus_id?: string
          focus_name?: string
          focus_type?: string
          id?: string
          is_active?: boolean
          notification_frequency?: string | null
          title?: string | null
          tracked_question_ids?: string[] | null
          tracking_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      user_subscriptions: {
        Row: {
          cancel_at: string | null
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          data_usage_policy_accepted_at: string | null
          grace_period_ends_at: string | null
          id: string
          payment_failed_at: string | null
          payment_retry_count: number | null
          responsibility_accepted_at: string | null
          scenario_disclaimer_accepted_at: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          terms_accepted_at: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          data_usage_policy_accepted_at?: string | null
          grace_period_ends_at?: string | null
          id?: string
          payment_failed_at?: string | null
          payment_retry_count?: number | null
          responsibility_accepted_at?: string | null
          scenario_disclaimer_accepted_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          terms_accepted_at?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          data_usage_policy_accepted_at?: string | null
          grace_period_ends_at?: string | null
          id?: string
          payment_failed_at?: string | null
          payment_retry_count?: number | null
          responsibility_accepted_at?: string | null
          scenario_disclaimer_accepted_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          terms_accepted_at?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      calculate_question_importance: {
        Args: { p_country_code?: string; p_question_id: string }
        Returns: number
      }
      compute_checksum: { Args: { data: Json }; Returns: string }
      create_trust_log_entry: {
        Args: {
          p_change_type: Database["public"]["Enums"]["trust_log_change_type"]
          p_content_impact?: string
          p_data_changed?: boolean
          p_initiated_by?: string
          p_initiated_by_role?: Database["public"]["Enums"]["governance_role"]
          p_method_changed?: boolean
          p_reason: string
          p_scope: string
        }
        Returns: string
      }
      generate_fact_code: {
        Args: {
          p_geo_code: string
          p_indicator_code: string
          p_time_end: string
          p_time_start: string
        }
        Returns: string
      }
      generate_trust_log_id: { Args: never; Returns: string }
      get_gov_role: { Args: { _user_id: string }; Returns: string }
      get_report_with_citations: {
        Args: { p_slug: string }
        Returns: {
          citations: Json
          report: Json
        }[]
      }
      get_user_tier: {
        Args: { p_user_id: string }
        Returns: Database["public"]["Enums"]["subscription_tier"]
      }
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
      has_tier_access: {
        Args: {
          p_required_tier: Database["public"]["Enums"]["subscription_tier"]
          p_user_id: string
        }
        Returns: boolean
      }
      increment_node_view: { Args: { p_node_id: string }; Returns: undefined }
      increment_report_view: {
        Args: { p_report_id: string }
        Returns: undefined
      }
      is_in_grace_period: { Args: { p_user_id: string }; Returns: boolean }
      track_deeper_click: { Args: { p_node_id: string }; Returns: undefined }
      validate_data_contract: { Args: { p_data: Json }; Returns: Json }
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
      ai_agent_class:
        | "policy"
        | "journalism"
        | "finance"
        | "corporate"
        | "health"
        | "legal"
        | "general"
      analysis_method:
        | "trend_detection"
        | "change_point_detection"
        | "correlation_analysis"
        | "lag_analysis"
        | "regression"
        | "decomposition"
        | "anomaly_detection"
      analysis_status: "pending" | "in_progress" | "completed" | "verified"
      answer_type:
        | "statistic"
        | "index"
        | "comparison"
        | "ranking"
        | "trend"
        | "correlation"
        | "distribution"
        | "aggregate"
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
      data_quality_grade: "A" | "B" | "C" | "D" | "unverified"
      data_source_type: "api" | "file_feed" | "manual" | "calculated"
      delivery_method: "api" | "webhook" | "sse" | "kafka"
      feed_severity: "low" | "medium" | "high" | "critical"
      feed_tier: "open" | "plus" | "pro"
      governance_role:
        | "data_steward"
        | "method_reviewer"
        | "system_maintainer"
        | "public_observer"
      intent_layer:
        | "descriptive"
        | "comparative"
        | "trend"
        | "structural"
        | "allocation"
      kpi_category:
        | "demografi_halsa"
        | "arbete_produktivitet"
        | "ekonomisk_barkraft"
        | "social_stabilitet"
        | "karnsystem_funktion"
        | "infrastruktur"
        | "systemrisk_styrning"
      kpi_status: "positive" | "warning" | "critical" | "neutral"
      misinterpretation_risk: "low" | "medium" | "high"
      observation_type:
        | "trend_deviation"
        | "threshold_breach"
        | "correlation_detected"
        | "pattern_match"
        | "lag_signal"
        | "anomaly"
      priority_level: "critical" | "high" | "medium" | "low" | "monitor"
      question_block_reason:
        | "normative"
        | "political_directive"
        | "speculative"
        | "insufficient_data"
        | "out_of_scope"
      question_category:
        | "demography_work"
        | "economic_capacity"
        | "health_longevity"
        | "energy_resources"
        | "food_supply"
        | "institutional_resilience"
      question_intent_class:
        | "status"
        | "trend"
        | "cause"
        | "comparison"
        | "consequence"
        | "forecast"
      question_scope: "global" | "regional" | "national" | "municipal"
      question_update_frequency:
        | "realtime"
        | "daily"
        | "weekly"
        | "monthly"
        | "quarterly"
        | "yearly"
        | "event_based"
      report_category: "societal_state" | "comparison" | "trend"
      report_status:
        | "draft"
        | "generating"
        | "review"
        | "published"
        | "archived"
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
      review_status: "pending" | "verified" | "disputed" | "resolved"
      strim_entity_status: "active" | "historical" | "deprecated" | "draft"
      strim_evidence_level:
        | "level_1a"
        | "level_1b"
        | "level_2a"
        | "level_2b"
        | "level_3"
        | "level_4"
        | "level_5"
        | "unknown"
      strim_legal_status:
        | "legal"
        | "prescription"
        | "controlled_i"
        | "controlled_ii"
        | "controlled_iii"
        | "controlled_iv"
        | "controlled_v"
        | "prohibited"
        | "unscheduled"
      strim_relation_type:
        | "causes"
        | "treated_by"
        | "regulated_by"
        | "affects"
        | "measures"
        | "defines"
        | "related_to"
        | "replaced_by"
        | "part_of"
        | "contraindicates"
      strim_risk_category: "low" | "moderate" | "high" | "very_high" | "unknown"
      subscription_status:
        | "active"
        | "trialing"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "paused"
        | "incomplete"
      subscription_tier: "guest" | "observer" | "analyst" | "institutional"
      time_dimension:
        | "realtime"
        | "daily"
        | "weekly"
        | "monthly"
        | "quarterly"
        | "yearly"
        | "historical"
      trend_direction: "up" | "down" | "stable"
      trust_log_change_type:
        | "data_update"
        | "method_update"
        | "text_simplification"
        | "structure_change"
        | "bug_fix"
        | "deprecation"
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
      ai_agent_class: [
        "policy",
        "journalism",
        "finance",
        "corporate",
        "health",
        "legal",
        "general",
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
      answer_type: [
        "statistic",
        "index",
        "comparison",
        "ranking",
        "trend",
        "correlation",
        "distribution",
        "aggregate",
      ],
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
      data_quality_grade: ["A", "B", "C", "D", "unverified"],
      data_source_type: ["api", "file_feed", "manual", "calculated"],
      delivery_method: ["api", "webhook", "sse", "kafka"],
      feed_severity: ["low", "medium", "high", "critical"],
      feed_tier: ["open", "plus", "pro"],
      governance_role: [
        "data_steward",
        "method_reviewer",
        "system_maintainer",
        "public_observer",
      ],
      intent_layer: [
        "descriptive",
        "comparative",
        "trend",
        "structural",
        "allocation",
      ],
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
      misinterpretation_risk: ["low", "medium", "high"],
      observation_type: [
        "trend_deviation",
        "threshold_breach",
        "correlation_detected",
        "pattern_match",
        "lag_signal",
        "anomaly",
      ],
      priority_level: ["critical", "high", "medium", "low", "monitor"],
      question_block_reason: [
        "normative",
        "political_directive",
        "speculative",
        "insufficient_data",
        "out_of_scope",
      ],
      question_category: [
        "demography_work",
        "economic_capacity",
        "health_longevity",
        "energy_resources",
        "food_supply",
        "institutional_resilience",
      ],
      question_intent_class: [
        "status",
        "trend",
        "cause",
        "comparison",
        "consequence",
        "forecast",
      ],
      question_scope: ["global", "regional", "national", "municipal"],
      question_update_frequency: [
        "realtime",
        "daily",
        "weekly",
        "monthly",
        "quarterly",
        "yearly",
        "event_based",
      ],
      report_category: ["societal_state", "comparison", "trend"],
      report_status: ["draft", "generating", "review", "published", "archived"],
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
      review_status: ["pending", "verified", "disputed", "resolved"],
      strim_entity_status: ["active", "historical", "deprecated", "draft"],
      strim_evidence_level: [
        "level_1a",
        "level_1b",
        "level_2a",
        "level_2b",
        "level_3",
        "level_4",
        "level_5",
        "unknown",
      ],
      strim_legal_status: [
        "legal",
        "prescription",
        "controlled_i",
        "controlled_ii",
        "controlled_iii",
        "controlled_iv",
        "controlled_v",
        "prohibited",
        "unscheduled",
      ],
      strim_relation_type: [
        "causes",
        "treated_by",
        "regulated_by",
        "affects",
        "measures",
        "defines",
        "related_to",
        "replaced_by",
        "part_of",
        "contraindicates",
      ],
      strim_risk_category: ["low", "moderate", "high", "very_high", "unknown"],
      subscription_status: [
        "active",
        "trialing",
        "past_due",
        "canceled",
        "unpaid",
        "paused",
        "incomplete",
      ],
      subscription_tier: ["guest", "observer", "analyst", "institutional"],
      time_dimension: [
        "realtime",
        "daily",
        "weekly",
        "monthly",
        "quarterly",
        "yearly",
        "historical",
      ],
      trend_direction: ["up", "down", "stable"],
      trust_log_change_type: [
        "data_update",
        "method_update",
        "text_simplification",
        "structure_change",
        "bug_fix",
        "deprecation",
      ],
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
