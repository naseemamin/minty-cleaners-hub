import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { FrequencyType } from "@/types/quote";

interface FrequencySelectorProps {
  frequency: FrequencyType;
  onUpdate: (frequency: FrequencyType) => void;
}

export const FrequencySelector = ({ frequency, onUpdate }: FrequencySelectorProps) => {
  const frequencies = [
    { value: "more_than_weekly" as const, label: "More than weekly" },
    { value: "weekly" as const, label: "Every week" },
    { value: "biweekly" as const, label: "Every 2 weeks" },
    { value: "one_off" as const, label: "One-off" },
  ];

  return (
    <div>
      <Label>How often?</Label>
      <p className="text-sm text-muted-foreground mb-2">
        You can keep the same cleaner for recurring cleans. You can change or cancel any time.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {frequencies.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={frequency === option.value ? "default" : "outline"}
            onClick={() => onUpdate(option.value)}
            className="w-full"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};