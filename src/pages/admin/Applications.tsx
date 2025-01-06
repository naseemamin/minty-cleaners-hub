import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";
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

const AdminApplications = () => {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(
    null
  );
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("application_process")
        .select(
          `
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
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

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
        // First, update the database
        const { error: dbError } = await supabase
          .from("application_process")
          .update({
            status: "scheduled_interview",
            interview_date: date.toISOString(),
          })
          .eq("id", applicationId);

        if (dbError) throw dbError;

        // Then, create the calendar event
        console.log("Invoking create-google-meet function...");
        const { data: functionData, error: functionError } = await supabase.functions.invoke(
          "create-google-meet",
          {
            body: {
              applicationId,
              interviewDate: date.toISOString(),
            },
          }
        );

        if (functionError) {
          console.error("Error creating calendar event:", functionError);
          throw new Error("Failed to create calendar event");
        }

        console.log("Calendar event created:", functionData);

        // Immediately refetch the applications to update the UI
        await queryClient.invalidateQueries({ queryKey: ["applications"] });
        
        return { applicationId, date, functionData };
      } catch (error) {
        console.error("Error in scheduleInterview:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Interview scheduled successfully");
      setSelectedApplication(null);
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

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Cleaner Applications</h1>
      <ApplicationsTable
        applications={applications || []}
        selectedApplication={selectedApplication}
        onApplicationSelect={setSelectedApplication}
        onScheduleInterview={(applicationId, date) =>
          scheduleInterview.mutate({ applicationId, date })
        }
        onCompleteInterview={(applicationId, status, notes) =>
          updateStatus.mutate({ applicationId, status, notes })
        }
      />
    </div>
  );
};

export default AdminApplications;