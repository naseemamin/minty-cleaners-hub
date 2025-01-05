import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface DurationSelectorProps {
  duration: number;
  onUpdate: (duration: number) => void;
}

export const DurationSelector = ({ duration, onUpdate }: DurationSelectorProps) => {
  const durations = [2.0, 2.5, 3.0, 3.5];

  return (
    <div>
      <Label>Duration</Label>
      <p className="text-sm text-muted-foreground mb-2">
        We recommend selecting 2.0 hours based on your bedrooms, bathrooms and extra tasks
      </p>
      <div className="flex gap-2">
        {durations.map((hours) => (
          <Button
            key={hours}
            type="button"
            variant={duration === hours ? "default" : "outline"}
            onClick={() => onUpdate(hours)}
          >
            {hours}h
          </Button>
        ))}
      </div>
    </div>
  );
};