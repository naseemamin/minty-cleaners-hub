import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const SUPABASE_URL = "https://jkrxvukzdatthncbqgij.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprcnh2dWt6ZGF0dGhuY2JxZ2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MTg3MTAsImV4cCI6MjA1MTQ5NDcxMH0.G2K6xUnG_nR-s1rZV7C2oVYwUcoVjHppX3I8O-awl-A"

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)