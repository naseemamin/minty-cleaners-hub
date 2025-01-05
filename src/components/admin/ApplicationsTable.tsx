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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact Details</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Availability</TableHead>
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
              <TableCell>
                <div>Email: {application.cleaner_profile?.email}</div>
                <div>Phone: {application.cleaner_profile?.mobile_number}</div>
                <div>Gender: {application.cleaner_profile?.gender || "Not specified"}</div>
              </TableCell>
              <TableCell>
                {application.cleaner_profile?.postcode}
              </TableCell>
              <TableCell>
                <div>Years: {application.cleaner_profile?.years_experience}</div>
                <div className="mt-1">
                  <strong>Types:</strong>{" "}
                  {application.cleaner_profile?.cleaning_types?.join(", ") || "None specified"}
                </div>
                <div className="mt-1">
                  <strong>Description:</strong>{" "}
                  <div className="text-sm text-gray-600">
                    {application.cleaner_profile?.experience_description}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <strong>Hours/week:</strong>{" "}
                  {application.cleaner_profile?.desired_hours_per_week}
                </div>
                <div className="mt-1">
                  <strong>Days:</strong>{" "}
                  {application.cleaner_profile?.available_days?.join(", ") || "None specified"}
                </div>
                <div className="mt-1">
                  <strong>Commitment:</strong>{" "}
                  {application.cleaner_profile?.commitment_length}
                </div>
              </TableCell>
              <TableCell>{application.status}</TableCell>
              <TableCell>
                {application.interview_date
                  ? format(new Date(application.interview_date), "PPp")
                  : "Not scheduled"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {application.status === "pending_review" && (
                      <DropdownMenuItem
                        onClick={() => onApplicationSelect(application.id)}
                      >
                        Schedule Interview
                      </DropdownMenuItem>
                    )}
                    {application.status === "scheduled_interview" && (
                      <>
                        <DropdownMenuItem
                          onClick={() =>
                            onCompleteInterview(application.id, "verified", "")
                          }
                        >
                          Approve & Verify
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() =>
                            onCompleteInterview(application.id, "rejected", "")
                          }
                        >
                          Reject
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                {selectedApplication === application.id && (
                  <InterviewScheduler
                    applicationId={application.id}
                    onSchedule={onScheduleInterview}
                    isOpen={true}
                    onOpenChange={(open) =>
                      onApplicationSelect(open ? application.id : null)
                    }
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};