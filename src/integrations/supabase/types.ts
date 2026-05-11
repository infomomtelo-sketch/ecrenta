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
      capture_leads: {
        Row: {
          capture_page_id: string
          created_at: string
          email: string | null
          id: string
          message: string | null
          metadata: Json | null
          name: string
          phone: string | null
          source: string | null
        }
        Insert: {
          capture_page_id: string
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          name: string
          phone?: string | null
          source?: string | null
        }
        Update: {
          capture_page_id?: string
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          name?: string
          phone?: string | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "capture_leads_capture_page_id_fkey"
            columns: ["capture_page_id"]
            isOneToOne: false
            referencedRelation: "capture_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      capture_pages: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string | null
          form_fields: Json
          id: string
          lead_count: number
          listing_id: string | null
          page_type: string
          slug: string
          status: string
          title: string
          updated_at: string
          user_id: string
          view_count: number
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          form_fields?: Json
          id?: string
          lead_count?: number
          listing_id?: string | null
          page_type?: string
          slug: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
          view_count?: number
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          form_fields?: Json
          id?: string
          lead_count?: number
          listing_id?: string | null
          page_type?: string
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "capture_pages_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          landlord_user_id: string | null
          last_message_at: string | null
          last_message_text: string | null
          listing_id: string
          status: Database["public"]["Enums"]["conversation_status"]
          tenant_name: string
          tenant_user_id: string | null
          unread: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          landlord_user_id?: string | null
          last_message_at?: string | null
          last_message_text?: string | null
          listing_id: string
          status?: Database["public"]["Enums"]["conversation_status"]
          tenant_name: string
          tenant_user_id?: string | null
          unread?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          landlord_user_id?: string | null
          last_message_at?: string | null
          last_message_text?: string | null
          listing_id?: string
          status?: Database["public"]["Enums"]["conversation_status"]
          tenant_name?: string
          tenant_user_id?: string | null
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
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      inspection_schedules: {
        Row: {
          created_at: string
          id: string
          interval_months: number
          last_completed_id: string | null
          listing_id: string | null
          next_due: string
          notes: string | null
          notify_email: string | null
          property_address: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interval_months?: number
          last_completed_id?: string | null
          listing_id?: string | null
          next_due: string
          notes?: string | null
          notify_email?: string | null
          property_address: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interval_months?: number
          last_completed_id?: string | null
          listing_id?: string | null
          next_due?: string
          notes?: string | null
          notify_email?: string | null
          property_address?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_schedules_last_completed_id_fkey"
            columns: ["last_completed_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_schedules_listing_id_fkey"
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
          checklist_data: Json
          comparison_id: string | null
          created_at: string
          id: string
          inspection_type: string
          listing_id: string | null
          notes: string | null
          photos: string[]
          property_address: string
          share_token: string | null
          status: string
          template_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_report?: Json | null
          checklist_data?: Json
          comparison_id?: string | null
          created_at?: string
          id?: string
          inspection_type?: string
          listing_id?: string | null
          notes?: string | null
          photos?: string[]
          property_address: string
          share_token?: string | null
          status?: string
          template_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_report?: Json | null
          checklist_data?: Json
          comparison_id?: string | null
          created_at?: string
          id?: string
          inspection_type?: string
          listing_id?: string | null
          notes?: string | null
          photos?: string[]
          property_address?: string
          share_token?: string | null
          status?: string
          template_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspections_comparison_id_fkey"
            columns: ["comparison_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          due_date: string
          id: string
          invoice_number: string
          line_items: Json
          notes: string | null
          paid_at: string | null
          sent_at: string | null
          status: string
          tenant_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          invoice_number: string
          line_items?: Json
          notes?: string | null
          paid_at?: string | null
          sent_at?: string | null
          status?: string
          tenant_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          line_items?: Json
          notes?: string | null
          paid_at?: string | null
          sent_at?: string | null
          status?: string
          tenant_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
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
          read_at: string | null
          sender_id: string
          sender_user_id: string | null
          text: string
          type: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
          sender_user_id?: string | null
          text: string
          type?: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
          sender_user_id?: string | null
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
      property_owner_leads: {
        Row: {
          created_at: string
          email: string | null
          follow_up_date: string | null
          id: string
          notes: string | null
          owner_name: string
          phone: string | null
          property_address: string | null
          source: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          owner_name: string
          phone?: string | null
          property_address?: string | null
          source?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          owner_name?: string
          phone?: string | null
          property_address?: string | null
          source?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rental_forms: {
        Row: {
          content: Json
          created_at: string
          form_type: string
          id: string
          recipient_email: string | null
          sent_at: string | null
          sign_token: string | null
          signature_data: string | null
          signed_at: string | null
          signer_ip: string | null
          signer_name: string | null
          status: string
          tenant_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json
          created_at?: string
          form_type?: string
          id?: string
          recipient_email?: string | null
          sent_at?: string | null
          sign_token?: string | null
          signature_data?: string | null
          signed_at?: string | null
          signer_ip?: string | null
          signer_name?: string | null
          status?: string
          tenant_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          form_type?: string
          id?: string
          recipient_email?: string | null
          sent_at?: string | null
          sign_token?: string | null
          signature_data?: string | null
          signed_at?: string | null
          signer_ip?: string | null
          signer_name?: string | null
          status?: string
          tenant_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rental_forms_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      tenants: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          lease_end: string | null
          lease_start: string | null
          notes: string | null
          phone: string | null
          rent_amount: number | null
          unit_address: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          lease_end?: string | null
          lease_start?: string | null
          notes?: string | null
          phone?: string | null
          rent_amount?: number | null
          unit_address?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          lease_end?: string | null
          lease_start?: string | null
          notes?: string | null
          phone?: string | null
          rent_amount?: number | null
          unit_address?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_activity_log: {
        Row: {
          action_type: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json | null
          summary: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          summary: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          summary?: string
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
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
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
