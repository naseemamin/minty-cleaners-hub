import { supabase } from "@/integrations/supabase/client";

export const createGoogleMeetEvent = async (
  applicationId: string,
  interviewDate: string
) => {
  console.log("Creating Google Meet event:", { applicationId, interviewDate });

  const { data, error } = await supabase.functions.invoke("create-google-meet", {
    body: {
      applicationId,
      interviewDate,
    },
  });

  if (error || !data.success) {
    console.error("Error creating Google Meet event:", error || data.error);
    throw new Error(data.error || "Failed to create calendar event");
  }

  console.log("Google Meet event created:", data);
  return data;
};