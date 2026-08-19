export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          password_hash: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          password_hash: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          password_hash?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      job_events: {
        Row: {
          created_at: string
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          job_id: string
        }
        Insert: {
          created_at?: string
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          job_id: string
        }
        Update: {
          created_at?: string
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          job_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_events_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          application_deadline: string | null
          benefits: string | null
          category_id: string | null
          company_id: string | null
          contact_email: string | null
          country_id: string | null
          created_at: string
          description: string
          employment_type: Database["public"]["Enums"]["employment_type"]
          experience_max: number | null
          experience_min: number | null
          id: string
          location_id: string | null
          location_detail: string | null
          phone_number: string | null
          published_date: string
          qualifications: string | null
          reference: string
          requirements: string | null
          responsibilities: string | null
          salary_currency: string
          salary_is_visible: boolean
          salary_max: number | null
          salary_min: number | null
          slug: string
          status: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at: string
          views_count: number
          whatsapp_number: string | null
        }
        Insert: {
          application_deadline?: string | null
          benefits?: string | null
          category_id?: string | null
          company_id?: string | null
          contact_email?: string | null
          country_id?: string | null
          created_at?: string
          description: string
          employment_type?: Database["public"]["Enums"]["employment_type"]
          experience_max?: number | null
          experience_min?: number | null
          id?: string
          location_id?: string | null
          location_detail?: string | null
          phone_number?: string | null
          published_date?: string
          qualifications?: string | null
          reference: string
          requirements?: string | null
          responsibilities?: string | null
          salary_currency?: string
          salary_is_visible?: boolean
          salary_max?: number | null
          salary_min?: number | null
          slug: string
          status?: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at?: string
          views_count?: number
          whatsapp_number?: string | null
        }
        Update: {
          application_deadline?: string | null
          benefits?: string | null
          category_id?: string | null
          company_id?: string | null
          contact_email?: string | null
          country_id?: string | null
          created_at?: string
          description?: string
          employment_type?: Database["public"]["Enums"]["employment_type"]
          experience_max?: number | null
          experience_min?: number | null
          id?: string
          location_id?: string | null
          location_detail?: string | null
          phone_number?: string | null
          published_date?: string
          qualifications?: string | null
          reference?: string
          requirements?: string | null
          responsibilities?: string | null
          salary_currency?: string
          salary_is_visible?: boolean
          salary_max?: number | null
          salary_min?: number | null
          slug?: string
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
          updated_at?: string
          views_count?: number
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          country_id: string
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          country_id: string
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          country_id?: string
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      search_queries: {
        Row: {
          created_at: string
          id: string
          query: string
          results_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          query: string
          results_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          query?: string
          results_count?: number
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          ad_slots: Json
          contact_email: string
          id: number
          logo_url: string | null
          phone_number: string | null
          seo_description: string
          seo_title: string
          site_name: string
          social_links: Json
          tagline: string
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          ad_slots?: Json
          contact_email?: string
          id?: number
          logo_url?: string | null
          phone_number?: string | null
          seo_description?: string
          seo_title?: string
          site_name?: string
          social_links?: Json
          tagline?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          ad_slots?: Json
          contact_email?: string
          id?: number
          logo_url?: string | null
          phone_number?: string | null
          seo_description?: string
          seo_title?: string
          site_name?: string
          social_links?: Json
          tagline?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          password_hash: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          password_hash: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          password_hash?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_job_views: {
        Args: { job_id: string }
        Returns: undefined
      }
    }
    Enums: {
      employment_type:
        | "full_time"
        | "part_time"
        | "contract"
        | "temporary"
        | "internship"
      event_type:
        | "view"
        | "apply_click"
        | "whatsapp_click"
        | "email_click"
        | "call_click"
      job_status: "draft" | "published" | "expired"
      user_role: "jobseeker"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"]
export type Enums<T extends keyof DefaultSchema["Enums"]> =
  DefaultSchema["Enums"][T]
