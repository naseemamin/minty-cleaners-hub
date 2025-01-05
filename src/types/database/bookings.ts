import type { Json } from './auth'

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string
          customer_id: string
          cleaner_id: string | null
          service_id: string | null
          booking_date: string
          status: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          cleaner_id?: string | null
          service_id?: string | null
          booking_date: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          cleaner_id?: string | null
          service_id?: string | null
          booking_date?: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cleaning_quotes: {
        Row: {
          id: string
          customer_id: string
          postcode: string
          bedrooms: number
          bathrooms: number
          ironing: boolean | null
          laundry: boolean | null
          inside_windows: boolean | null
          inside_fridge: boolean | null
          inside_oven: boolean | null
          duration: number
          bring_cleaning_products: boolean | null
          frequency: Database["public"]["Enums"]["cleaning_frequency"]
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          postcode: string
          bedrooms: number
          bathrooms: number
          ironing?: boolean | null
          laundry?: boolean | null
          inside_windows?: boolean | null
          inside_fridge?: boolean | null
          inside_oven?: boolean | null
          duration: number
          bring_cleaning_products?: boolean | null
          frequency: Database["public"]["Enums"]["cleaning_frequency"]
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          postcode?: string
          bedrooms?: number
          bathrooms?: number
          ironing?: boolean | null
          laundry?: boolean | null
          inside_windows?: boolean | null
          inside_fridge?: boolean | null
          inside_oven?: boolean | null
          duration?: number
          bring_cleaning_products?: boolean | null
          frequency?: Database["public"]["Enums"]["cleaning_frequency"]
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "completed" | "cancelled"
      cleaning_frequency: "more_than_weekly" | "weekly" | "biweekly" | "one_off"
    }
  }
}