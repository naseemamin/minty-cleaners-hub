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
      console.log("Fetching applications...");
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
        
        // First, check if an application process entry exists
        const { data: existingApplication, error: checkError } = await supabase
          .from("application_process")
          .select()
          .eq("id", applicationId)
          .maybeSingle();

        if (checkError) {
          console.error("Error checking application:", checkError);
          throw checkError;
        }

        let updatedApplication;
        
        if (!existingApplication) {
          // If no entry exists, create one first
          const { data: insertedApp, error: insertError } = await supabase
            .from("application_process")
            .insert({
              id: applicationId,
              status: "scheduled_interview",
              interview_date: date.toISOString(),
            })
            .select()
            .maybeSingle();

          if (insertError) {
            console.error("Error inserting application:", insertError);
            throw insertError;
          }
          
          updatedApplication = insertedApp;
        } else {
          // If entry exists, update it
          const { data: updatedApp, error: updateError } = await supabase
            .from("application_process")
            .update({
              status: "scheduled_interview",
              interview_date: date.toISOString(),
            })
            .eq("id", applicationId)
            .select()
            .maybeSingle();

          if (updateError) {
            console.error("Error updating application:", updateError);
            throw updateError;
          }
          
          updatedApplication = updatedApp;
        }

        if (!updatedApplication) {
          throw new Error("Failed to update application process");
        }

        console.log("Database updated successfully:", updatedApplication);

        // Then, create the calendar event
        console.log("Creating Google Meet event...");
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

        console.log("Calendar event created successfully:", functionData);

        // Immediately invalidate and refetch the applications query
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