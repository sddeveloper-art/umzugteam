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
      company_bids: {
        Row: {
          announcement_id: string
          company_email: string
          company_name: string
          company_phone: string | null
          created_at: string
          id: string
          notes: string | null
          price: number
          updated_at: string
        }
        Insert: {
          announcement_id: string
          company_email: string
          company_name: string
          company_phone?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          price: number
          updated_at?: string
        }
        Update: {
          announcement_id?: string
          company_email?: string
          company_name?: string
          company_phone?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_bids_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_bids_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "moving_announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      competitors: {
        Row: {
          base_price_multiplier: number
          created_at: string
          distance_price_multiplier: number
          floor_price_multiplier: number
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          base_price_multiplier?: number
          created_at?: string
          distance_price_multiplier?: number
          floor_price_multiplier?: number
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          base_price_multiplier?: number
          created_at?: string
          distance_price_multiplier?: number
          floor_price_multiplier?: number
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      moving_announcements: {
        Row: {
          apartment_size: string
          client_email: string
          client_name: string
          client_phone: string | null
          created_at: string
          description: string | null
          end_date: string
          floor: number
          from_city: string
          has_elevator: boolean
          id: string
          needs_assembly: boolean
          needs_packing: boolean
          notification_sent: boolean
          preferred_date: string | null
          start_date: string
          status: Database["public"]["Enums"]["announcement_status"]
          to_city: string
          updated_at: string
          volume: number
          winner_bid_id: string | null
        }
        Insert: {
          apartment_size: string
          client_email: string
          client_name: string
          client_phone?: string | null
          created_at?: string
          description?: string | null
          end_date: string
          floor?: number
          from_city: string
          has_elevator?: boolean
          id?: string
          needs_assembly?: boolean
          needs_packing?: boolean
          notification_sent?: boolean
          preferred_date?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["announcement_status"]
          to_city: string
          updated_at?: string
          volume?: number
          winner_bid_id?: string | null
        }
        Update: {
          apartment_size?: string
          client_email?: string
          client_name?: string
          client_phone?: string | null
          created_at?: string
          description?: string | null
          end_date?: string
          floor?: number
          from_city?: string
          has_elevator?: boolean
          id?: string
          needs_assembly?: boolean
          needs_packing?: boolean
          notification_sent?: boolean
          preferred_date?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["announcement_status"]
          to_city?: string
          updated_at?: string
          volume?: number
          winner_bid_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      announcements_public: {
        Row: {
          apartment_size: string | null
          created_at: string | null
          end_date: string | null
          floor: number | null
          from_city: string | null
          has_elevator: boolean | null
          id: string | null
          needs_assembly: boolean | null
          needs_packing: boolean | null
          preferred_date: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["announcement_status"] | null
          to_city: string | null
          volume: number | null
        }
        Insert: {
          apartment_size?: string | null
          created_at?: string | null
          end_date?: string | null
          floor?: number | null
          from_city?: string | null
          has_elevator?: boolean | null
          id?: string | null
          needs_assembly?: boolean | null
          needs_packing?: boolean | null
          preferred_date?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["announcement_status"] | null
          to_city?: string | null
          volume?: number | null
        }
        Update: {
          apartment_size?: string | null
          created_at?: string | null
          end_date?: string | null
          floor?: number | null
          from_city?: string | null
          has_elevator?: boolean | null
          id?: string | null
          needs_assembly?: boolean | null
          needs_packing?: boolean | null
          preferred_date?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["announcement_status"] | null
          to_city?: string | null
          volume?: number | null
        }
        Relationships: []
      }
      bids_summary: {
        Row: {
          announcement_id: string | null
          bid_count: number | null
          highest_price: number | null
          lowest_price: number | null
        }
        Relationships: [
          {
            foreignKeyName: "company_bids_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_bids_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "moving_announcements"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      announcement_status: "active" | "expired" | "completed"
      app_role: "admin" | "user"
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
      announcement_status: ["active", "expired", "completed"],
      app_role: ["admin", "user"],
    },
  },
} as const
