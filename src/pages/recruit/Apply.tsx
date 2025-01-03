import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  mobile_number: z.string().min(10, "Please enter a valid UK mobile number"),
  email: z.string().email("Please enter a valid email address"),
  email_confirm: z.string().email("Please enter a valid email address"),
  gender: z.string().optional(),
  postcode: z.string().min(5, "Please enter a valid UK postcode"),
  years_experience: z.string().min(1, "Please select your experience level"),
  cleaning_types: z.array(z.string()).min(1, "Please select at least one type of cleaning"),
  experience_description: z.string().min(20, "Please provide more detail about your experience"),
  desired_hours_per_week: z.number().min(1, "Please enter desired hours"),
  available_days: z.array(z.string()).min(1, "Please select at least one day"),
  commitment_length: z.string().min(1, "Please select your preferred commitment length"),
}).refine((data) => data.email === data.email_confirm, {
  message: "Emails do not match",
  path: ["email_confirm"],
});

const Apply = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cleaning_types: [],
      available_days: [],
      desired_hours_per_week: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // First, try to insert directly into cleaner_profiles
      const { data: profileData, error: profileError } = await supabase
        .from('cleaner_profiles')
        .insert([{
          first_name: values.first_name,
          last_name: values.last_name,
          mobile_number: values.mobile_number,
          email: values.email,
          gender: values.gender,
          postcode: values.postcode,
          years_experience: values.years_experience,
          cleaning_types: values.cleaning_types,
          experience_description: values.experience_description,
          desired_hours_per_week: values.desired_hours_per_week,
          available_days: values.available_days,
          commitment_length: values.commitment_length,
        }])
        .select();

      if (profileError) {
        console.error('Error submitting application:', profileError);
        toast.error("Failed to submit application. Please try again.");
        return;
      }

      console.log('Application submitted successfully:', profileData);
      toast.success("Application submitted successfully!");
      navigate("/");
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const cleaningTypes = [
    "Residential",
    "Commercial",
    "Deep Cleaning",
    "Move In/Out",
    "Post Construction",
  ];

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Apply as a Professional Cleaner</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">About You</h2>
                
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name(s)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UK Mobile Number</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email_confirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UK Home Postcode</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                            render={({ field }) => {
                              return (
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
                              )
                            }}
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
                            render={({ field }) => {
                              return (
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
                              )
                            }}
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

                <Button 
                  type="submit" 
                  className="w-full bg-mint-500 hover:bg-mint-600"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Apply;
