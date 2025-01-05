import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface InterviewSchedulerProps {
  applicationId: string;
  onSchedule: (applicationId: string, date: Date) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InterviewScheduler = ({
  applicationId,
  onSchedule,
  isOpen,
  onOpenChange,
}: InterviewSchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              onSchedule(applicationId, selectedDate);
            }
          }}
          disabled={!selectedDate}
        >
          Confirm Schedule
        </Button>
      </DialogContent>
    </Dialog>
  );
};