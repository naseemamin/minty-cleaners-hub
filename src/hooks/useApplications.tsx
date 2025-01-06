import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Application, ApplicationStatus } from "@/types/applications";

interface ApplicationResponse {
  id: string;
  status: ApplicationStatus;
  interview_date: string | null;
  interview_notes: string | null;
  created_at: string;
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
}

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
      return data as unknown as ApplicationResponse[];
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
        console.log("Starting interview scheduling process...");
        
        // Update the application status and date
        const { error: updateError } = await supabase
          .from("application_process")
          .update({
            status: "scheduled_interview",
            interview_date: date.toISOString(),
          })
          .eq("id", applicationId);

        if (updateError) {
          console.error("Error updating application:", updateError);
          throw updateError;
        }

        console.log("Application status updated successfully");
        
        // Create the Google Meet event
        const { data: calendarData, error: calendarError } = await supabase.functions.invoke(
          "create-google-meet",
          {
            body: {
              applicationId,
              interviewDate: date.toISOString(),
            },
          }
        );

        if (calendarError || !calendarData.success) {
          console.error("Error creating calendar event:", calendarError || calendarData.error);
          
          // Revert the status if calendar creation fails
          await supabase
            .from("application_process")
            .update({
              status: "pending_review",
              interview_date: null,
            })
            .eq("id", applicationId);
            
          throw new Error(calendarData.error || "Failed to create calendar event");
        }

        console.log("Calendar event created successfully:", calendarData);

        // Update the application with the Google Meet link
        const { error: linkUpdateError } = await supabase
          .from("application_process")
          .update({
            google_meet_link: calendarData.meetLink,
          })
          .eq("id", applicationId);

        if (linkUpdateError) {
          console.error("Error updating meet link:", linkUpdateError);
          throw linkUpdateError;
        }

        // Force a refetch of the applications data
        await queryClient.invalidateQueries({ queryKey: ["applications"] });
        
        return { applicationId, date, meetLink: calendarData.meetLink };
      } catch (error) {
        console.error("Error in scheduleInterview:", error);
        throw error;
      }
    },
    onSuccess: () => {
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
      
      // Force a refetch of the applications data
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