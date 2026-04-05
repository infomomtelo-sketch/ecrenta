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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          conversation_id: string | null
          created_at: string
          id: string
          listing_id: string
          notes: string | null
          status: Database["public"]["Enums"]["application_status"]
          tenant_name: string
          updated_at: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          listing_id: string
          notes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          tenant_name: string
          updated_at?: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          tenant_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_name: string
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string
          id: string
          meta_description: string | null
          meta_title: string | null
          published: boolean
          published_at: string | null
          slug: string
          tags: string[]
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          author_name?: string
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          published_at?: string | null
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          author_name?: string
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          published_at?: string | null
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          status: Database["public"]["Enums"]["conversation_status"]
          tenant_name: string
          unread: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          status?: Database["public"]["Enums"]["conversation_status"]
          tenant_name: string
          unread?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          status?: Database["public"]["Enums"]["conversation_status"]
          tenant_name?: string
          unread?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      inspections: {
        Row: {
          ai_report: Json | null
          created_at: string
          id: string
          inspection_type: string
          listing_id: string | null
          notes: string | null
          photos: string[]
          property_address: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_report?: Json | null
          created_at?: string
          id?: string
          inspection_type?: string
          listing_id?: string | null
          notes?: string | null
          photos?: string[]
          property_address: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_report?: Json | null
          created_at?: string
          id?: string
          inspection_type?: string
          listing_id?: string | null
          notes?: string | null
          photos?: string[]
          property_address?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspections_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          address: string
          available: boolean
          bathrooms: number
          bedrooms: number
          created_at: string
          description: string
          external_id: string | null
          id: string
          images: string[]
          landlord_name: string
          price: number
          source: string | null
          source_url: string | null
          sqft: number
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address: string
          available?: boolean
          bathrooms?: number
          bedrooms?: number
          created_at?: string
          description?: string
          external_id?: string | null
          id?: string
          images?: string[]
          landlord_name?: string
          price: number
          source?: string | null
          source_url?: string | null
          sqft?: number
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string
          available?: boolean
          bathrooms?: number
          bedrooms?: number
          created_at?: string
          description?: string
          external_id?: string | null
          id?: string
          images?: string[]
          landlord_name?: string
          price?: number
          source?: string | null
          source_url?: string | null
          sqft?: number
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      maintenance_requests: {
        Row: {
          ai_response: string | null
          ai_triage: Json | null
          assigned_to: string | null
          category: string
          created_at: string
          description: string
          id: string
          listing_id: string | null
          photos: string[]
          property_address: string
          reporter_email: string | null
          reporter_name: string
          reporter_phone: string | null
          reporter_role: string
          resolution_notes: string | null
          status: string
          title: string
          updated_at: string
          urgency: string
          user_id: string | null
        }
        Insert: {
          ai_response?: string | null
          ai_triage?: Json | null
          assigned_to?: string | null
          category?: string
          created_at?: string
          description: string
          id?: string
          listing_id?: string | null
          photos?: string[]
          property_address: string
          reporter_email?: string | null
          reporter_name: string
          reporter_phone?: string | null
          reporter_role?: string
          resolution_notes?: string | null
          status?: string
          title: string
          updated_at?: string
          urgency?: string
          user_id?: string | null
        }
        Update: {
          ai_response?: string | null
          ai_triage?: Json | null
          assigned_to?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          listing_id?: string | null
          photos?: string[]
          property_address?: string
          reporter_email?: string | null
          reporter_name?: string
          reporter_phone?: string | null
          reporter_role?: string
          resolution_notes?: string | null
          status?: string
          title?: string
          updated_at?: string
          urgency?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          sender_id: string
          text: string
          type: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          sender_id: string
          text: string
          type?: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          sender_id?: string
          text?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      p8_conversations: {
        Row: {
          created_at: string
          id: string
          messages: Json
          mode: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json
          mode?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          mode?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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
      app_role: "landlord" | "tenant" | "admin"
      application_status: "pending" | "approved" | "declined"
      conversation_status:
        | "inquiry"
        | "showing_scheduled"
        | "approved"
        | "declined"
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
      app_role: ["landlord", "tenant", "admin"],
      application_status: ["pending", "approved", "declined"],
      conversation_status: [
        "inquiry",
        "showing_scheduled",
        "approved",
        "declined",
      ],
    },
  },
} as const
