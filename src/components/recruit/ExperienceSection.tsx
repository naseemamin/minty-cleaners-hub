import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

interface ExperienceSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const formSchema = z.object({
  years_experience: z.string().min(1, "Please select your experience level"),
  cleaning_types: z.array(z.string()).min(1, "Please select at least one type of cleaning"),
  experience_description: z.string().min(20, "Please provide more detail about your experience"),
});

const cleaningTypes = [
  "Residential",
  "Commercial",
  "Deep Cleaning",
  "Move In/Out",
  "Post Construction",
];

export const ExperienceSection = ({ form }: ExperienceSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold pt-4">Your Experience</h2>

      <FormField
        control={form.control}
        name="years_experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How much experience do you have in professional home cleaning?</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="0-1">Less than 1 year</SelectItem>
                <SelectItem value="1-2">1-2 years</SelectItem>
                <SelectItem value="2-5">2-5 years</SelectItem>
                <SelectItem value="5+">More than 5 years</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cleaning_types"
        render={() => (
          <FormItem>
            <FormLabel>What type of cleaning experience do you have?</FormLabel>
            <div className="grid grid-cols-2 gap-4">
              {cleaningTypes.map((type) => (
                <FormField
                  key={type}
                  control={form.control}
                  name="cleaning_types"
                  render={({ field }) => (
                    <FormItem
                      key={type}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(type)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, type])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== type
                                  )
                                )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {type}
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
        name="experience_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Please describe your home cleaning experience</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g. I cleaned houses through an agency for 2 years."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};