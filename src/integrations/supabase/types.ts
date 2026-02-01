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
      kpi_values: {
        Row: {
          confidence: number
          created_at: string
          data_source_id: string | null
          granularity: string
          id: string
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
          confidence?: number
          created_at?: string
          data_source_id?: string | null
          granularity?: string
          id?: string
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
          confidence?: number
          created_at?: string
          data_source_id?: string | null
          granularity?: string
          id?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
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
