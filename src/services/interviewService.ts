import { supabase } from "@/integrations/supabase/client";

export const updateApplicationStatus = async (
  applicationId: string,
  status: "scheduled_interview" | "verified" | "rejected",
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
    console.error("Error updating application status:", error);
    throw error;
  }

  console.log("Application status updated:", data);
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

  console.log("Google Meet link updated:", data);
  return data;
};