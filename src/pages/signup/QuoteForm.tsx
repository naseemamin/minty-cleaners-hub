import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const QuoteForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
    frequency: "weekly",
    email: "",
  });

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
      navigate("/dashboard"); // We'll create this route later
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit quote. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Customise your clean
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="postcode">Your postcode</Label>
                <Input
                  id="postcode"
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>How many bedrooms need cleaning?</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, bedrooms: Math.max(1, formData.bedrooms - 1) })}
                  >
                    -
                  </Button>
                  <span>{formData.bedrooms} bedroom{formData.bedrooms !== 1 ? 's' : ''}</span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, bedrooms: formData.bedrooms + 1 })}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div>
                <Label>How many bathrooms need cleaning?</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, bathrooms: Math.max(1, formData.bathrooms - 1) })}
                  >
                    -
                  </Button>
                  <span>{formData.bathrooms} bathroom{formData.bathrooms !== 1 ? 's' : ''}</span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, bathrooms: formData.bathrooms + 1 })}
                  >
                    +
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Your cleaner will also clean your kitchen, lounge and common areas.
              </p>

              <div className="space-y-4">
                <Label>Extra tasks (optional)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ironing"
                      checked={formData.ironing}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, ironing: checked as boolean })}
                    />
                    <Label htmlFor="ironing">Ironing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="laundry"
                      checked={formData.laundry}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, laundry: checked as boolean })}
                    />
                    <Label htmlFor="laundry">Laundry</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="windows"
                      checked={formData.insideWindows}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, insideWindows: checked as boolean })}
                    />
                    <Label htmlFor="windows">Inside windows</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fridge"
                      checked={formData.insideFridge}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, insideFridge: checked as boolean })}
                    />
                    <Label htmlFor="fridge">Inside fridge</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="oven"
                      checked={formData.insideOven}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, insideOven: checked as boolean })}
                    />
                    <Label htmlFor="oven">Inside oven</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label>Duration</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  We recommend selecting 2.0 hours based on your bedrooms, bathrooms and extra tasks
                </p>
                <div className="flex gap-2">
                  {[2.0, 2.5, 3.0, 3.5].map((hours) => (
                    <Button
                      key={hours}
                      type="button"
                      variant={formData.duration === hours ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, duration: hours })}
                    >
                      {hours}h
                    </Button>
                  ))}
                </div>
              </div>

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
                        setFormData({ ...formData, bringCleaningProducts: checked as boolean })}
                    />
                    <Label htmlFor="products">Bring cleaning products (+£6.00)</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label>How often?</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  You can keep the same cleaner for recurring cleans. You can change or cancel any time.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { value: "more_than_weekly", label: "More than weekly" },
                    { value: "weekly", label: "Every week" },
                    { value: "biweekly", label: "Every 2 weeks" },
                    { value: "one_off", label: "One-off" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={formData.frequency === option.value ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, frequency: option.value })}
                      className="w-full"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Submit Quote
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteForm;