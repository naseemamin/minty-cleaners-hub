import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ExtraTasksProps {
  tasks: {
    ironing: boolean;
    laundry: boolean;
    insideWindows: boolean;
    insideFridge: boolean;
    insideOven: boolean;
  };
  onUpdate: (field: string, value: boolean) => void;
}

export const ExtraTasks = ({ tasks, onUpdate }: ExtraTasksProps) => {
  const tasksList = [
    { id: "ironing", label: "Ironing" },
    { id: "laundry", label: "Laundry" },
    { id: "insideWindows", label: "Inside windows" },
    { id: "insideFridge", label: "Inside fridge" },
    { id: "insideOven", label: "Inside oven" },
  ];

  return (
    <div className="space-y-4">
      <Label>Extra tasks (optional)</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasksList.map(({ id, label }) => (
          <div key={id} className="flex items-center space-x-2">
            <Checkbox
              id={id}
              checked={tasks[id as keyof typeof tasks]}
              onCheckedChange={(checked) => onUpdate(id, checked as boolean)}
            />
            <Label htmlFor={id}>{label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};