import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";
import type { Application } from "@/types/applications";

interface ApplicationResponse {
  id: string;
  status: string;
  interview_date: string | null;
  interview_notes: string | null;
  created_at: string;
  cleaner_profiles: {
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: string;
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
          cleaner_profiles (
            first_name,
            last_name,
            email,
            mobile_number
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data as ApplicationResponse[]).map((item) => ({
        ...item,
        cleaner_profile: item.cleaner_profiles,
      })) as Application[];
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
      const { error } = await supabase
        .from("application_process")
        .update({
          status: "scheduled_interview",
          interview_date: date.toISOString(),
        })
        .eq("id", applicationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
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