import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InterviewScheduler } from "./InterviewScheduler";
import { InterviewComplete } from "./InterviewComplete";
import type { Application } from "@/types/applications";

interface ApplicationsTableProps {
  applications: Application[];
  selectedApplication: string | null;
  onApplicationSelect: (id: string | null) => void;
  onScheduleInterview: (applicationId: string, date: Date) => void;
  onCompleteInterview: (
    applicationId: string,
    status: "verified" | "rejected",
    notes: string
  ) => void;
}

export const ApplicationsTable = ({
  applications,
  selectedApplication,
  onApplicationSelect,
  onScheduleInterview,
  onCompleteInterview,
}: ApplicationsTableProps) => {
  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No applications found
      </div>
    );
  }

  return (
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
        {applications.map((application) => (
          <TableRow key={application.id}>
            <TableCell>
              {application.cleaner_profile?.first_name}{" "}
              {application.cleaner_profile?.last_name}
            </TableCell>
            <TableCell>{application.cleaner_profile?.email}</TableCell>
            <TableCell>{application.cleaner_profile?.mobile_number}</TableCell>
            <TableCell>{application.status}</TableCell>
            <TableCell>
              {application.interview_date
                ? format(new Date(application.interview_date), "PPp")
                : "Not scheduled"}
            </TableCell>
            <TableCell className="space-x-2">
              {application.status === "pending_review" && (
                <InterviewScheduler
                  applicationId={application.id}
                  onSchedule={onScheduleInterview}
                  isOpen={selectedApplication === application.id}
                  onOpenChange={(open) =>
                    onApplicationSelect(open ? application.id : null)
                  }
                />
              )}

              {application.status === "scheduled_interview" && (
                <InterviewComplete
                  applicationId={application.id}
                  onComplete={onCompleteInterview}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};