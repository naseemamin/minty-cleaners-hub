import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

interface AvailabilitySectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const formSchema = z.object({
  desired_hours_per_week: z.number().min(1, "Please enter desired hours"),
  available_days: z.array(z.string()).min(1, "Please select at least one day"),
  commitment_length: z.string().min(1, "Please select your preferred commitment length"),
});

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const AvailabilitySection = ({ form }: AvailabilitySectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold pt-4">Your Availability</h2>

      <FormField
        control={form.control}
        name="desired_hours_per_week"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How many hours of cleaning work do you want per week?</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="available_days"
        render={() => (
          <FormItem>
            <FormLabel>Which days do you want to work?</FormLabel>
            <div className="grid grid-cols-2 gap-4">
              {daysOfWeek.map((day) => (
                <FormField
                  key={day}
                  control={form.control}
                  name="available_days"
                  render={({ field }) => (
                    <FormItem
                      key={day}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(day)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, day])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== day
                                  )
                                )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {day}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="commitment_length"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How long would you like to work with mint?</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select commitment length" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="3-6">3-6 months</SelectItem>
                <SelectItem value="6-12">6-12 months</SelectItem>
                <SelectItem value="1+">More than 1 year</SelectItem>
                <SelectItem value="undecided">Not sure yet</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};