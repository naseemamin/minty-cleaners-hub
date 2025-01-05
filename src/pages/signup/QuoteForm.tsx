import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PropertyDetails } from "@/components/quote/PropertyDetails";
import { ExtraTasks } from "@/components/quote/ExtraTasks";
import { DurationSelector } from "@/components/quote/DurationSelector";
import { FrequencySelector } from "@/components/quote/FrequencySelector";
import { QuoteSummary } from "@/components/quote/QuoteSummary";
import type { QuoteFormData, FrequencyType } from "@/types/quote";

const calculateRecommendedDuration = (
  bedrooms: number,
  bathrooms: number,
  tasks: {
    ironing: boolean;
    laundry: boolean;
    insideWindows: boolean;
    insideFridge: boolean;
    insideOven: boolean;
  }
) => {
  // Base duration is 2 hours
  let duration = 2;

  // Add 0.5 hours for each additional bedroom beyond 1
  duration += Math.max(0, (bedrooms - 1) * 0.5);

  // Add 0.5 hours for each additional bathroom beyond 1
  duration += Math.max(0, (bathrooms - 1) * 0.5);

  // Add 0.5 hours for each selected extra task
  const selectedTasks = Object.values(tasks).filter(Boolean).length;
  duration += selectedTasks * 0.5;

  // Round to nearest 0.5
  return Math.min(3.5, Math.max(2, Math.round(duration * 2) / 2));
};

const QuoteForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<QuoteFormData>({
    postcode: "",
    bedrooms: 1,
    bathrooms: 1,
    ironing: false,
    laundry: false,
    insideWindows: false,
    insideFridge: false,
    insideOven: false,
    duration: 2.0,
    bringCleaningProducts: false,
    frequency: 'weekly' as FrequencyType,
    email: "",
  });

  const recommendedDuration = calculateRecommendedDuration(
    formData.bedrooms,
    formData.bathrooms,
    {
      ironing: formData.ironing,
      laundry: formData.laundry,
      insideWindows: formData.insideWindows,
      insideFridge: formData.insideFridge,
      insideOven: formData.insideOven,
    }
  );

  const handleUpdate = (field: keyof QuoteFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to submit a quote");
        navigate("/auth/login");
        return;
      }

      const { error } = await supabase.from("cleaning_quotes").insert({
        customer_id: user.id,
        postcode: formData.postcode,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        ironing: formData.ironing,
        laundry: formData.laundry,
        inside_windows: formData.insideWindows,
        inside_fridge: formData.insideFridge,
        inside_oven: formData.insideOven,
        duration: formData.duration,
        bring_cleaning_products: formData.bringCleaningProducts,
        frequency: formData.frequency,
        email: formData.email,
      });

      if (error) throw error;

      toast.success("Quote submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit quote. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Customise your clean
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <PropertyDetails
                bedrooms={formData.bedrooms}
                bathrooms={formData.bathrooms}
                postcode={formData.postcode}
                onUpdate={handleUpdate}
              />

              <ExtraTasks
                tasks={{
                  ironing: formData.ironing,
                  laundry: formData.laundry,
                  insideWindows: formData.insideWindows,
                  insideFridge: formData.insideFridge,
                  insideOven: formData.insideOven,
                }}
                onUpdate={handleUpdate}
              />

              <DurationSelector
                duration={formData.duration}
                recommendedDuration={recommendedDuration}
                onUpdate={(value) => handleUpdate("duration", value)}
              />

              <div>
                <Label>Cleaning products</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Includes sprays and cloths. Your Housekeeper cannot bring a vacuum, mop or bucket
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="products"
                      checked={formData.bringCleaningProducts}
                      onCheckedChange={(checked) => 
                        handleUpdate("bringCleaningProducts", checked)}
                    />
                    <Label htmlFor="products">Bring cleaning products (+£6.00)</Label>
                  </div>
                </div>
              </div>

              <FrequencySelector
                frequency={formData.frequency}
                onUpdate={(value) => handleUpdate("frequency", value)}
              />

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleUpdate("email", e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Quote
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="md:mt-[72px]">
          <QuoteSummary
            bedrooms={formData.bedrooms}
            bathrooms={formData.bathrooms}
            duration={formData.duration}
            tasks={{
              ironing: formData.ironing,
              laundry: formData.laundry,
              insideWindows: formData.insideWindows,
              insideFridge: formData.insideFridge,
              insideOven: formData.insideOven,
            }}
            frequency={formData.frequency}
            bringCleaningProducts={formData.bringCleaningProducts}
          />
        </div>
      </div>
    </div>
  );
};

export default QuoteForm;