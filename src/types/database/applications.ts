export interface Database {
  public: {
    Tables: {
      application_process: {
        Row: {
          id: string;
          cleaner_id: string;
          status: Database["public"]["Enums"]["application_status"];
          interview_date: string | null;
          interview_notes: string | null;
          google_meet_link: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cleaner_id: string;
          status?: Database["public"]["Enums"]["application_status"];
          interview_date?: string | null;
          interview_notes?: string | null;
          google_meet_link?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cleaner_id?: string;
          status?: Database["public"]["Enums"]["application_status"];
          interview_date?: string | null;
          interview_notes?: string | null;
          google_meet_link?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Enums: {
      application_status:
        | "pending_review"
        | "scheduled_interview"
        | "interview_completed"
        | "verified"
        | "rejected";
    };
  };
}