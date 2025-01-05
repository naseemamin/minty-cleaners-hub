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
  };
  status: ApplicationStatus;
  interview_date: string | null;
  interview_notes: string | null;
  created_at: string;
}