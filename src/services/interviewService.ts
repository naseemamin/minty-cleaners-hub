import { supabase } from "@/integrations/supabase/client";
import type { ApplicationStatus } from "@/types/applications";

export const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus,
  interviewDate?: string
) => {
  console.log("Updating application status:", { applicationId, status, interviewDate });
  
  // First check if the application exists
  const { data: existingApp, error: checkError } = await supabase
    .from("application_process")
    .select("id")
    .eq("id", applicationId)
    .maybeSingle();

  if (checkError) {
    console.error("Error checking application:", checkError);
    throw checkError;
  }

  if (!existingApp) {
    throw new Error(`Application with ID ${applicationId} not found`);
  }

  // Proceed with update only if application exists
  const updateData = {
    status,
    ...(interviewDate && { interview_date: interviewDate }),
  };

  const { data, error } = await supabase
    .from("application_process")
    .update(updateData)
    .eq("id", applicationId)
    .select(`
      id,
      status,
      interview_date,
      interview_notes,
      created_at,
      cleaner_profile:cleaner_profiles(
        first_name,
        last_name,
        email,
        mobile_number,
        gender,
        postcode,
        years_experience,
        cleaning_types,
        experience_description,
        desired_hours_per_week,
        available_days,
        commitment_length
      )
    `)
    .maybeSingle();

  if (error) {
    console.error("Error updating application:", error);
    throw error;
  }

  if (!data) {
    throw new Error(`Failed to update application with ID ${applicationId}`);
  }

  const defaultProfile = {
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    gender: "",
    postcode: "",
    years_experience: "",
    cleaning_types: [],
    experience_description: "",
    desired_hours_per_week: 0,
    available_days: [],
    commitment_length: ""
  };

  // Transform the response to match the expected format
  return {
    ...data,
    cleaner_profile: Array.isArray(data.cleaner_profile) && data.cleaner_profile.length > 0
      ? data.cleaner_profile[0]
      : defaultProfile
  };
};

export const updateGoogleMeetLink = async (applicationId: string, meetLink: string) => {
  console.log("Updating Google Meet link:", { applicationId, meetLink });
  
  // First check if the application exists
  const { data: existingApp, error: checkError } = await supabase
    .from("application_process")
    .select("id")
    .eq("id", applicationId)
    .maybeSingle();

  if (checkError) {
    console.error("Error checking application:", checkError);
    throw checkError;
  }

  if (!existingApp) {
    throw new Error(`Application with ID ${applicationId} not found`);
  }

  // Proceed with update only if application exists
  const { data, error } = await supabase
    .from("application_process")
    .update({ google_meet_link: meetLink })
    .eq("id", applicationId)
    .select(`
      id,
      google_meet_link,
      cleaner_profile:cleaner_profiles(id)
    `)
    .maybeSingle();

  if (error) {
    console.error("Error updating Google Meet link:", error);
    throw error;
  }

  if (!data) {
    throw new Error(`Failed to update Google Meet link for application ${applicationId}`);
  }

  return data;
};