import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface InterviewCompleteProps {
  applicationId: string;
  onComplete: (applicationId: string, status: "verified" | "rejected", notes: string) => void;
}

export const InterviewComplete = ({
  applicationId,
  onComplete,
}: InterviewCompleteProps) => {
  const [notes, setNotes] = useState("");

  return (
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
            onClick={() => onComplete(applicationId, "verified", notes)}
          >
            Approve & Verify
          </Button>
          <Button
            variant="destructive"
            onClick={() => onComplete(applicationId, "rejected", notes)}
          >
            Reject
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};