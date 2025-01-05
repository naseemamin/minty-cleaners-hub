import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DurationSelectorProps {
  duration: number;
  recommendedDuration: number;
  onUpdate: (duration: number) => void;
}

export const DurationSelector = ({ duration, recommendedDuration, onUpdate }: DurationSelectorProps) => {
  // Generate array of durations from 2 to 8 with 0.5 increments
  const durations = Array.from({ length: 13 }, (_, i) => 2 + i * 0.5);

  return (
    <div>
      <Label>Duration</Label>
      <p className="text-sm text-muted-foreground mb-2">
        We recommend selecting {recommendedDuration} hours based on your bedrooms, bathrooms and extra tasks
      </p>
      <ScrollArea className="h-[70px] w-full rounded-md">
        <div className="flex flex-wrap gap-2 p-1">
          {durations.map((hours) => (
            <Button
              key={hours}
              type="button"
              variant={duration === hours ? "default" : "outline"}
              onClick={() => onUpdate(hours)}
              className="flex-shrink-0"
            >
              {hours}h
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};