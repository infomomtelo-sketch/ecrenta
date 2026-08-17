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
      ai_usage: {
        Row: {
          call_count: number
          created_at: string
          feature: string
          id: string
          period_month: string
          updated_at: string
          user_id: string
        }
        Insert: {
          call_count?: number
          created_at?: string
          feature: string
          id?: string
          period_month?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          call_count?: number
          created_at?: string
          feature?: string
          id?: string
          period_month?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
      commissions: {
        Row: {
          amount_cents: number
          base_amount_cents: number
          created_at: string
          id: string
          paid_at: string | null
          partner_id: string
          payout_reference: string | null
          period_month: string
          referral_id: string
          status: Database["public"]["Enums"]["commission_status"]
          updated_at: string
        }
        Insert: {
          amount_cents?: number
          base_amount_cents?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          partner_id: string
          payout_reference?: string | null
          period_month: string
          referral_id: string
          status?: Database["public"]["Enums"]["commission_status"]
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          base_amount_cents?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          partner_id?: string
          payout_reference?: string | null
          period_month?: string
          referral_id?: string
          status?: Database["public"]["Enums"]["commission_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
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
      harvest_sources: {
        Row: {
          active: boolean
          auto_send_claim_links: boolean
          city: string | null
          created_at: string
          id: string
          interval_hours: number
          last_run_at: string | null
          last_status: string | null
          limit_per_run: number
          updated_at: string
          url: string
        }
        Insert: {
          active?: boolean
          auto_send_claim_links?: boolean
          city?: string | null
          created_at?: string
          id?: string
          interval_hours?: number
          last_run_at?: string | null
          last_status?: string | null
          limit_per_run?: number
          updated_at?: string
          url: string
        }
        Update: {
          active?: boolean
          auto_send_claim_links?: boolean
          city?: string | null
          created_at?: string
          id?: string
          interval_hours?: number
          last_run_at?: string | null
          last_status?: string | null
          limit_per_run?: number
          updated_at?: string
          url?: string
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
      landlord_verifications: {
        Row: {
          attestation_accepted: boolean
          attested_at: string | null
          business_address: string
          business_name: string | null
          created_at: string
          document_paths: string[]
          entity_type: Database["public"]["Enums"]["legal_entity_type"]
          id: string
          legal_name: string
          phone: string
          proof_type: string
          property_addresses: string[]
          registration_number: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          status: Database["public"]["Enums"]["verification_status"]
          submitted_at: string | null
          tax_id_last4: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attestation_accepted?: boolean
          attested_at?: string | null
          business_address: string
          business_name?: string | null
          created_at?: string
          document_paths?: string[]
          entity_type?: Database["public"]["Enums"]["legal_entity_type"]
          id?: string
          legal_name: string
          phone: string
          proof_type?: string
          property_addresses?: string[]
          registration_number?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: Database["public"]["Enums"]["verification_status"]
          submitted_at?: string | null
          tax_id_last4?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attestation_accepted?: boolean
          attested_at?: string | null
          business_address?: string
          business_name?: string | null
          created_at?: string
          document_paths?: string[]
          entity_type?: Database["public"]["Enums"]["legal_entity_type"]
          id?: string
          legal_name?: string
          phone?: string
          proof_type?: string
          property_addresses?: string[]
          registration_number?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: Database["public"]["Enums"]["verification_status"]
          submitted_at?: string | null
          tax_id_last4?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lead_contacts: {
        Row: {
          city: string | null
          contact_type: string
          created_at: string
          email: string | null
          id: string
          last_contacted_at: string | null
          listing_id: string | null
          name: string | null
          notes: string | null
          phone: string | null
          source: string | null
          source_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          city?: string | null
          contact_type?: string
          created_at?: string
          email?: string | null
          id?: string
          last_contacted_at?: string | null
          listing_id?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          source_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          city?: string | null
          contact_type?: string
          created_at?: string
          email?: string | null
          id?: string
          last_contacted_at?: string | null
          listing_id?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          source_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_contacts_listing_id_fkey"
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
          claim_token: string | null
          claimed_at: string | null
          classified_reason: string | null
          contact_email: string | null
          contact_phone: string | null
          contact_type: string
          created_at: string
          description: string
          external_id: string | null
          harvested_at: string | null
          id: string
          images: string[]
          is_claimable: boolean
          landlord_name: string
          latitude: number | null
          longitude: number | null
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
          claim_token?: string | null
          claimed_at?: string | null
          classified_reason?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_type?: string
          created_at?: string
          description?: string
          external_id?: string | null
          harvested_at?: string | null
          id?: string
          images?: string[]
          is_claimable?: boolean
          landlord_name?: string
          latitude?: number | null
          longitude?: number | null
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
          claim_token?: string | null
          claimed_at?: string | null
          classified_reason?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_type?: string
          created_at?: string
          description?: string
          external_id?: string | null
          harvested_at?: string | null
          id?: string
          images?: string[]
          is_claimable?: boolean
          landlord_name?: string
          latitude?: number | null
          longitude?: number | null
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
      partners: {
        Row: {
          approved_at: string | null
          bio: string | null
          code: string
          commission_rate: number
          contact_email: string | null
          created_at: string
          display_name: string
          id: string
          organization: string | null
          partner_type: Database["public"]["Enums"]["partner_type"]
          payout_handle: string | null
          payout_method: string
          status: Database["public"]["Enums"]["partner_status"]
          student_discount_pct: number
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          approved_at?: string | null
          bio?: string | null
          code: string
          commission_rate?: number
          contact_email?: string | null
          created_at?: string
          display_name: string
          id?: string
          organization?: string | null
          partner_type?: Database["public"]["Enums"]["partner_type"]
          payout_handle?: string | null
          payout_method?: string
          status?: Database["public"]["Enums"]["partner_status"]
          student_discount_pct?: number
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          approved_at?: string | null
          bio?: string | null
          code?: string
          commission_rate?: number
          contact_email?: string | null
          created_at?: string
          display_name?: string
          id?: string
          organization?: string | null
          partner_type?: Database["public"]["Enums"]["partner_type"]
          payout_handle?: string | null
          payout_method?: string
          status?: Database["public"]["Enums"]["partner_status"]
          student_discount_pct?: number
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          access_granted: boolean
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_granted?: boolean
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_granted?: boolean
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
      referrals: {
        Row: {
          converted_at: string | null
          created_at: string
          id: string
          landing_path: string | null
          monthly_amount_cents: number
          partner_id: string
          plan_name: string | null
          referred_email: string | null
          referred_user_id: string | null
          status: Database["public"]["Enums"]["referral_status"]
          updated_at: string
        }
        Insert: {
          converted_at?: string | null
          created_at?: string
          id?: string
          landing_path?: string | null
          monthly_amount_cents?: number
          partner_id: string
          plan_name?: string | null
          referred_email?: string | null
          referred_user_id?: string | null
          status?: Database["public"]["Enums"]["referral_status"]
          updated_at?: string
        }
        Update: {
          converted_at?: string | null
          created_at?: string
          id?: string
          landing_path?: string | null
          monthly_amount_cents?: number
          partner_id?: string
          plan_name?: string | null
          referred_email?: string | null
          referred_user_id?: string | null
          status?: Database["public"]["Enums"]["referral_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      rent_payment_requests: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          paid_at: string | null
          status: string
          stripe_payment_link_id: string | null
          stripe_payment_link_url: string | null
          stripe_session_id: string | null
          tenant_email: string | null
          tenant_id: string | null
          tenant_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          paid_at?: string | null
          status?: string
          stripe_payment_link_id?: string | null
          stripe_payment_link_url?: string | null
          stripe_session_id?: string | null
          tenant_email?: string | null
          tenant_id?: string | null
          tenant_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          paid_at?: string | null
          status?: string
          stripe_payment_link_id?: string | null
          stripe_payment_link_url?: string | null
          stripe_session_id?: string | null
          tenant_email?: string | null
          tenant_id?: string | null
          tenant_name?: string
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
      stripe_connect_accounts: {
        Row: {
          charges_enabled: boolean
          country: string | null
          created_at: string
          details_submitted: boolean
          email: string | null
          id: string
          payouts_enabled: boolean
          stripe_account_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          charges_enabled?: boolean
          country?: string | null
          created_at?: string
          details_submitted?: boolean
          email?: string | null
          id?: string
          payouts_enabled?: boolean
          stripe_account_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          charges_enabled?: boolean
          country?: string | null
          created_at?: string
          details_submitted?: boolean
          email?: string | null
          id?: string
          payouts_enabled?: boolean
          stripe_account_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          accepted_at: string | null
          auth_user_id: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          invite_token: string | null
          invited_at: string | null
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
          accepted_at?: string | null
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          invite_token?: string | null
          invited_at?: string | null
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
          accepted_at?: string | null
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          invite_token?: string | null
          invited_at?: string | null
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
      accept_tenant_invite: {
        Args: { _token: string }
        Returns: {
          accepted_at: string | null
          auth_user_id: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          invite_token: string | null
          invited_at: string | null
          lease_end: string | null
          lease_start: string | null
          notes: string | null
          phone: string | null
          rent_amount: number | null
          unit_address: string | null
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "tenants"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      attach_referral: {
        Args: { _code: string; _landing_path?: string }
        Returns: boolean
      }
      claim_listing: { Args: { _token: string }; Returns: string }
      consume_ai_call: {
        Args: { _feature: string; _user_id: string }
        Returns: {
          allowed: boolean
          quota: number
          used: number
        }[]
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_ai_quota: { Args: { _user_id: string }; Returns: number }
      get_claimable_listing: {
        Args: { _token: string }
        Returns: {
          address: string
          bathrooms: number
          bedrooms: number
          description: string
          id: string
          images: string[]
          landlord_name: string
          price: number
          source: string
          source_url: string
          sqft: number
          title: string
        }[]
      }
      get_form_by_token: {
        Args: { _token: string }
        Returns: {
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
        }[]
        SetofOptions: {
          from: "*"
          to: "rental_forms"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_my_tenant_id: { Args: never; Returns: string }
      get_partner_by_code: {
        Args: { _code: string }
        Returns: {
          code: string
          display_name: string
          organization: string
          partner_type: Database["public"]["Enums"]["partner_type"]
          student_discount_pct: number
        }[]
      }
      get_shared_inspection: {
        Args: { _token: string }
        Returns: {
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
        }[]
        SetofOptions: {
          from: "*"
          to: "inspections"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_tenant_by_invite: {
        Args: { _token: string }
        Returns: {
          email: string
          full_name: string
          id: string
          unit_address: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_landlord_verified: { Args: { _user_id: string }; Returns: boolean }
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
      record_referral_commission: {
        Args: {
          _monthly_amount_cents: number
          _plan_name: string
          _user_id: string
        }
        Returns: undefined
      }
      sign_form_by_token: {
        Args: {
          _signature_data: string
          _signer_email: string
          _signer_ip: string
          _signer_name: string
          _token: string
        }
        Returns: {
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
        SetofOptions: {
          from: "*"
          to: "rental_forms"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      app_role: "landlord" | "tenant" | "admin"
      application_status: "pending" | "approved" | "declined"
      commission_status: "pending" | "approved" | "paid" | "void"
      conversation_status:
        | "inquiry"
        | "showing_scheduled"
        | "approved"
        | "declined"
      legal_entity_type:
        | "individual"
        | "sole_proprietor"
        | "llc"
        | "corporation"
        | "partnership"
        | "trust"
      partner_status: "pending" | "active" | "suspended" | "rejected"
      partner_type: "trainer" | "affiliate" | "student_ambassador"
      referral_status: "signed_up" | "trialing" | "converted" | "churned"
      verification_status: "draft" | "pending" | "verified" | "rejected"
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
      commission_status: ["pending", "approved", "paid", "void"],
      conversation_status: [
        "inquiry",
        "showing_scheduled",
        "approved",
        "declined",
      ],
      legal_entity_type: [
        "individual",
        "sole_proprietor",
        "llc",
        "corporation",
        "partnership",
        "trust",
      ],
      partner_status: ["pending", "active", "suspended", "rejected"],
      partner_type: ["trainer", "affiliate", "student_ambassador"],
      referral_status: ["signed_up", "trialing", "converted", "churned"],
      verification_status: ["draft", "pending", "verified", "rejected"],
    },
  },
} as const
