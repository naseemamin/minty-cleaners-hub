import { supabase } from "@/integrations/supabase/client";
import type { ApplicationStatus } from "@/types/applications";

export const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus,
  interviewDate?: string
) => {
  console.log("Updating application status:", { applicationId, status, interviewDate });
  
  const updateData = {
    status,
    ...(interviewDate && { interview_date: interviewDate }),
  };

  const { data, error } = await supabase
    .from("application_process")
    .update(updateData)
    .eq("id", applicationId)
    .select()
    .single();

  if (error) {
    console.error("Error updating application:", error);
    throw error;
  }

  return data;
};

export const updateGoogleMeetLink = async (applicationId: string, meetLink: string) => {
  console.log("Updating Google Meet link:", { applicationId, meetLink });
  
  const { data, error } = await supabase
    .from("application_process")
    .update({ google_meet_link: meetLink })
    .eq("id", applicationId)
    .select()
    .single();

  if (error) {
    console.error("Error updating Google Meet link:", error);
    throw error;
  }

  return data;
};