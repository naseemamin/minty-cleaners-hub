import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type ApplicationStatus =
  | "pending_review"
  | "scheduled_interview"
  | "interview_completed"
  | "verified"
  | "rejected";

interface Application {
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

const AdminApplications = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedApplication, setSelectedApplication] = useState<string | null>(
    null
  );
  const [notes, setNotes] = useState("");
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
          cleaner_profile:cleaner_profiles!inner (
            first_name,
            last_name,
            email,
            mobile_number
          )
        `
        )
        .order("created_at", { ascending: false })
        .single();

      if (error) throw error;
      
      // Transform the data to match the Application interface
      const transformedData = data ? [{
        ...data,
        cleaner_profile: {
          first_name: data.cleaner_profile.first_name,
          last_name: data.cleaner_profile.last_name,
          email: data.cleaner_profile.email,
          mobile_number: data.cleaner_profile.mobile_number
        }
      }] : [];

      return transformedData as Application[];
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
      setSelectedDate(undefined);
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
      status: ApplicationStatus;
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
      setNotes("");
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Interview Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications?.map((application) => (
            <TableRow key={application.id}>
              <TableCell>
                {application.cleaner_profile.first_name}{" "}
                {application.cleaner_profile.last_name}
              </TableCell>
              <TableCell>{application.cleaner_profile.email}</TableCell>
              <TableCell>{application.cleaner_profile.mobile_number}</TableCell>
              <TableCell>{application.status}</TableCell>
              <TableCell>
                {application.interview_date
                  ? format(new Date(application.interview_date), "PPp")
                  : "Not scheduled"}
              </TableCell>
              <TableCell className="space-x-2">
                {application.status === "pending_review" && (
                  <Dialog
                    open={selectedApplication === application.id}
                    onOpenChange={(open) =>
                      setSelectedApplication(open ? application.id : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline">Schedule Interview</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Schedule Interview</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          className="rounded-md border"
                        />
                      </div>
                      <Button
                        onClick={() => {
                          if (selectedDate) {
                            scheduleInterview.mutate({
                              applicationId: application.id,
                              date: selectedDate,
                            });
                          }
                        }}
                        disabled={!selectedDate}
                      >
                        Confirm Schedule
                      </Button>
                    </DialogContent>
                  </Dialog>
                )}

                {application.status === "scheduled_interview" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Complete Interview</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Interview Notes</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Enter interview notes..."
                          className="min-h-[100px]"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="default"
                          onClick={() =>
                            updateStatus.mutate({
                              applicationId: application.id,
                              status: "verified",
                              notes,
                            })
                          }
                        >
                          Approve & Verify
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            updateStatus.mutate({
                              applicationId: application.id,
                              status: "rejected",
                              notes,
                            })
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminApplications;
