import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CleanerApplication {
  id: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  email: string;
  years_experience: string;
  cleaning_types: string[];
  experience_description: string;
  desired_hours_per_week: number;
  available_days: string[];
  commitment_length: string;
  created_at: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const application: CleanerApplication = await req.json();
    console.log('Received application:', application);

    // Send email notification
    const emailSent = await sendEmailNotification(application);
    console.log('Email notification sent:', emailSent);

    // Update Google Sheet
    const sheetUpdated = await updateGoogleSheet(application);
    console.log('Google Sheet updated:', sheetUpdated);

    return new Response(
      JSON.stringify({ success: true, emailSent, sheetUpdated }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error processing application:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

async function sendEmailNotification(application: CleanerApplication) {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  if (!RESEND_API_KEY) {
    throw new Error('Resend API key not configured');
  }

  const emailBody = `
    New Cleaner Application Received

    Applicant Details:
    - Name: ${application.first_name} ${application.last_name}
    - Email: ${application.email}
    - Mobile: ${application.mobile_number}
    - Years of Experience: ${application.years_experience}
    - Cleaning Types: ${application.cleaning_types.join(', ')}
    - Experience Description: ${application.experience_description}
    - Desired Hours per Week: ${application.desired_hours_per_week}
    - Available Days: ${application.available_days.join(', ')}
    - Commitment Length: ${application.commitment_length}
    - Application Date: ${new Date(application.created_at).toLocaleString()}

    View all applications in Google Sheets:
    https://docs.google.com/spreadsheets/d/${Deno.env.get('GOOGLE_SHEET_ID')}
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Cleaning Service <onboarding@resend.dev>',
        to: ['admin@yourcompany.com'], // Replace with your admin email
        subject: `New Cleaner Application: ${application.first_name} ${application.last_name}`,
        html: emailBody.replace(/\n/g, '<br>').replace(/\s{2,}/g, ' '),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send email: ${await response.text()}`);
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

async function updateGoogleSheet(application: CleanerApplication) {
  const SHEET_ID = Deno.env.get('GOOGLE_SHEET_ID');
  if (!SHEET_ID) {
    throw new Error('Google Sheet ID not configured');
  }

  // Format the data as a row
  const row = [
    application.id,
    application.first_name,
    application.last_name,
    application.mobile_number,
    application.email,
    '', // gender
    '', // postcode
    application.years_experience,
    application.cleaning_types.join(', '),
    application.experience_description,
    application.desired_hours_per_week,
    application.available_days.join(', '),
    application.commitment_length,
    false, // verified
    '', // background_check_date
    null, // rating
    application.created_at,
    application.created_at, // updated_at
  ];

  try {
    // Use Google Sheets API v4
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A1:R1:append?valueInputOption=RAW`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('GOOGLE_SHEETS_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [row],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update sheet: ${await response.text()}`);
    }

    return true;
  } catch (error) {
    console.error('Error updating sheet:', error);
    return false;
  }
}
