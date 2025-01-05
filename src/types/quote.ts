import type { Database } from "@/integrations/supabase/types";

export type FrequencyType = Database['public']['Enums']['cleaning_frequency'];

export interface QuoteFormData {
  postcode: string;
  bedrooms: number;
  bathrooms: number;
  ironing: boolean;
  laundry: boolean;
  insideWindows: boolean;
  insideFridge: boolean;
  insideOven: boolean;
  duration: number;
  bringCleaningProducts: boolean;
  frequency: FrequencyType;
  email: string;
}