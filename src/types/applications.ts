export type ApplicationStatus =
  | "pending_review"
  | "scheduled_interview"
  | "interview_completed"
  | "verified"
  | "rejected";

export interface Application {
  id: string;
  cleaner_profile: {
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: string;
    gender: string | null;
    postcode: string;
    years_experience: string;
    cleaning_types: string[] | null;
    experience_description: string;
    desired_hours_per_week: number;
    available_days: string[];
    commitment_length: string;
  };
  status: ApplicationStatus;
  interview_date: string | null;
  interview_notes: string | null;
  created_at: string;
}