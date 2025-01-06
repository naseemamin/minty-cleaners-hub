import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [selectedTime, setSelectedTime] = useState<string>();

  // Generate time slots from 9 AM to 5 PM
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minutes = (i % 2) * 30;
    const time = `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    return time;
  });

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const dateWithTime = new Date(selectedDate);
      dateWithTime.setHours(hours, minutes);
      
      console.log("Scheduling interview for:", {
        applicationId,
        date: dateWithTime
      });
      
      onSchedule(applicationId, dateWithTime);
      onOpenChange(false); // Close the dialog after scheduling
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Time</label>
            <Select onValueChange={setSelectedTime} value={selectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSchedule}
            disabled={!selectedDate || !selectedTime}
            className="w-full"
          >
            Confirm Schedule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};