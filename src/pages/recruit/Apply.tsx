import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { PersonalInfoSection } from "@/components/recruit/PersonalInfoSection";
import { ExperienceSection } from "@/components/recruit/ExperienceSection";
import { AvailabilitySection } from "@/components/recruit/AvailabilitySection";

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
      console.log('Submitting application with values:', values);
      
      // First, insert the data
      const { error: insertError } = await supabase
        .from('cleaner_profiles')
        .insert({
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
        });

      if (insertError) {
        console.error('Error submitting application:', insertError);
        toast.error(`Failed to submit application: ${insertError.message}`);
        return;
      }

      console.log('Application submitted successfully');
      toast.success("Application submitted successfully! We'll be in touch soon.");
      navigate("/");
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Apply as a Professional Cleaner</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <PersonalInfoSection form={form} />
              <ExperienceSection form={form} />
              <AvailabilitySection form={form} />

              <Button 
                type="submit" 
                className="w-full bg-mint-500 hover:bg-mint-600"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Apply;