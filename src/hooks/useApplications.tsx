import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Application } from "@/types/applications";
import { updateApplicationStatus, updateGoogleMeetLink } from "@/services/interviewService";
import { createGoogleMeetEvent } from "@/services/googleCalendarService";

export const useApplications = () => {
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      console.log("Fetching applications...");
      const { data, error } = await supabase
        .from("application_process")
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
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
        throw error;
      }

      console.log("Fetched applications:", data);
      return data;
    },
  });

  const scheduleInterview = useMutation({
    mutationFn: async ({
      applicationId,
      date,
    }: {
      applicationId: string;
      date: Date;
    }) => {
      try {
        // Step 1: Update application status and interview date
        const updatedApp = await updateApplicationStatus(
          applicationId,
          "scheduled_interview",
          date.toISOString()
        );

        // Step 2: Create Google Meet event
        const calendarData = await createGoogleMeetEvent(
          applicationId,
          date.toISOString()
        );

        // Step 3: Update application with Google Meet link
        await updateGoogleMeetLink(applicationId, calendarData.meetLink);

        return { applicationId, date, meetLink: calendarData.meetLink };
      } catch (error) {
        // Revert status if any step fails
        await updateApplicationStatus(applicationId, "pending_review");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Interview scheduled successfully");
    },
    onError: (error) => {
      console.error("Error scheduling interview:", error);
      toast.error("Failed to schedule interview");
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({
      applicationId,
      status,
      notes,
    }: {
      applicationId: string;
      status: Application["status"];
      notes?: string;
    }) => {
      const { error } = await supabase
        .from("application_process")
        .update({
          status,
          interview_notes: notes,
        })
        .eq("id", applicationId);

      if (error) throw error;
      
      await queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application status updated");
    },
    onError: (error) => {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    },
  });

  return {
    applications,
    isLoading,
    scheduleInterview,
    updateStatus,
  };
};