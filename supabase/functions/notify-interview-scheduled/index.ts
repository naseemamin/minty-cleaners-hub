import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get the application data from the request
    const { record } = await req.json();

    // Get the cleaner's email
    const { data: cleanerProfile, error: profileError } = await supabaseClient
      .from('cleaner_profiles')
      .select('email, first_name')
      .eq('id', record.cleaner_profile_id)
      .single();

    if (profileError) throw profileError;

    // Format the interview date
    const interviewDate = new Date(record.interview_date);
    const formattedDate = interviewDate.toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    // Send email notification
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from: 'Mint Cleaning <notifications@mint-cleaning.com>',
        to: [cleanerProfile.email],
        subject: 'Your Interview Has Been Scheduled',
        html: `
          <h1>Hello ${cleanerProfile.first_name},</h1>
          <p>Your interview has been scheduled for ${formattedDate}.</p>
          <p>Please make sure you're available at the scheduled time. We'll send you a video call link closer to the date.</p>
          <p>Best regards,<br>The Mint Cleaning Team</p>
        `,
      }),
    });

    if (!emailRes.ok) {
      throw new Error('Failed to send email notification');
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in notify-interview-scheduled function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});