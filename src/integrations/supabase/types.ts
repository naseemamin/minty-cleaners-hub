export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string
          cleaner_id: string | null
          created_at: string
          customer_id: string | null
          id: string
          notes: string | null
          service_id: string | null
          status: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          updated_at: string
        }
        Insert: {
          booking_date: string
          cleaner_id?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          notes?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          updated_at?: string
        }
        Update: {
          booking_date?: string
          cleaner_id?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          notes?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_cleaner_id_fkey"
            columns: ["cleaner_id"]
            isOneToOne: false
            referencedRelation: "cleaner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      cleaner_profiles: {
        Row: {
          available_days: string[]
          background_check_date: string | null
          cleaning_types: string[] | null
          commitment_length: string
          created_at: string
          desired_hours_per_week: number
          email: string
          experience_description: string
          first_name: string
          gender: string | null
          id: string
          last_name: string
          mobile_number: string
          postcode: string
          rating: number | null
          updated_at: string
          verified: boolean | null
          years_experience: string
        }
        Insert: {
          available_days: string[]
          background_check_date?: string | null
          cleaning_types?: string[] | null
          commitment_length: string
          created_at?: string
          desired_hours_per_week: number
          email: string
          experience_description: string
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          mobile_number: string
          postcode: string
          rating?: number | null
          updated_at?: string
          verified?: boolean | null
          years_experience: string
        }
        Update: {
          available_days?: string[]
          background_check_date?: string | null
          cleaning_types?: string[] | null
          commitment_length?: string
          created_at?: string
          desired_hours_per_week?: number
          email?: string
          experience_description?: string
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          mobile_number?: string
          postcode?: string
          rating?: number | null
          updated_at?: string
          verified?: boolean | null
          years_experience?: string
        }
        Relationships: []
      }
      cleaning_quotes: {
        Row: {
          bathrooms: number
          bedrooms: number
          bring_cleaning_products: boolean | null
          created_at: string
          customer_id: string
          duration: number
          email: string
          frequency: Database["public"]["Enums"]["cleaning_frequency"]
          id: string
          inside_fridge: boolean | null
          inside_oven: boolean | null
          inside_windows: boolean | null
          ironing: boolean | null
          laundry: boolean | null
          postcode: string
          updated_at: string
        }
        Insert: {
          bathrooms: number
          bedrooms: number
          bring_cleaning_products?: boolean | null
          created_at?: string
          customer_id: string
          duration: number
          email: string
          frequency: Database["public"]["Enums"]["cleaning_frequency"]
          id?: string
          inside_fridge?: boolean | null
          inside_oven?: boolean | null
          inside_windows?: boolean | null
          ironing?: boolean | null
          laundry?: boolean | null
          postcode: string
          updated_at?: string
        }
        Update: {
          bathrooms?: number
          bedrooms?: number
          bring_cleaning_products?: boolean | null
          created_at?: string
          customer_id?: string
          duration?: number
          email?: string
          frequency?: Database["public"]["Enums"]["cleaning_frequency"]
          id?: string
          inside_fridge?: boolean | null
          inside_oven?: boolean | null
          inside_windows?: boolean | null
          ironing?: boolean | null
          laundry?: boolean | null
          postcode?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cleaning_quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          base_price: number
          created_at: string
          description: string | null
          id: string
          name: string
          service_type: Database["public"]["Enums"]["service_type"]
          updated_at: string
        }
        Insert: {
          base_price: number
          created_at?: string
          description?: string | null
          id?: string
          name: string
          service_type: Database["public"]["Enums"]["service_type"]
          updated_at?: string
        }
        Update: {
          base_price?: number
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          service_type?: Database["public"]["Enums"]["service_type"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "completed" | "cancelled"
      cleaning_frequency: "more_than_weekly" | "weekly" | "biweekly" | "one_off"
      service_type:
        | "regular"
        | "deep_clean"
        | "move_in_out"
        | "post_construction"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
