export interface Database {
  public: {
    Tables: {
      cleaner_profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          mobile_number: string;
          email: string;
          gender: string | null;
          postcode: string;
          years_experience: string;
          cleaning_types: string[] | null;
          experience_description: string;
          desired_hours_per_week: number;
          available_days: string[];
          commitment_length: string;
          verified: boolean | null;
          background_check_date: string | null;
          rating: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          mobile_number: string;
          email: string;
          gender?: string | null;
          postcode: string;
          years_experience: string;
          cleaning_types?: string[] | null;
          experience_description: string;
          desired_hours_per_week: number;
          available_days: string[];
          commitment_length: string;
          verified?: boolean | null;
          background_check_date?: string | null;
          rating?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          mobile_number?: string;
          email?: string;
          gender?: string | null;
          postcode?: string;
          years_experience?: string;
          cleaning_types?: string[] | null;
          experience_description?: string;
          desired_hours_per_week?: number;
          available_days?: string[];
          commitment_length?: string;
          verified?: boolean | null;
          background_check_date?: string | null;
          rating?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      customer_profiles: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Enums: {};
  };
}