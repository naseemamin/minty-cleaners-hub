import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { google } from "https://deno.land/x/google_sheets_api@0.2.0/mod.ts";

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
  const GMAIL_EMAIL = Deno.env.get('GMAIL_EMAIL');
  const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD');

  if (!GMAIL_EMAIL || !GMAIL_APP_PASSWORD) {
    throw new Error('Email credentials not configured');
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

  const emailData = {
    from: GMAIL_EMAIL,
    to: GMAIL_EMAIL, // Sending to the same email address
    subject: `New Cleaner Application: ${application.first_name} ${application.last_name}`,
    text: emailBody,
  };

  const response = await fetch('https://api.smtp2go.com/v3/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(`apikey:${GMAIL_APP_PASSWORD}`)}`,
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    throw new Error(`Failed to send email: ${await response.text()}`);
  }

  return true;
}

async function updateGoogleSheet(application: CleanerApplication) {
  const SHEET_ID = Deno.env.get('GOOGLE_SHEET_ID');
  if (!SHEET_ID) {
    throw new Error('Google Sheet ID not configured');
  }

  // Format the data to match the sheet columns
  const rowData = [
    application.id,
    application.first_name,
    application.last_name,
    application.mobile_number,
    application.email,
    '', // gender (empty as it's not in the application)
    '', // postcode (empty as it's not in the application)
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
    application.created_at, // updated_at same as created_at for new entries
  ];

  try {
    const sheets = google.sheets({ version: 'v4' });
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A:R', // Columns A through R for all our fields
      valueInputOption: 'RAW',
      requestBody: {
        values: [rowData],
      },
    });

    return true;
  } catch (error) {
    console.error('Error updating Google Sheet:', error);
    throw new Error('Failed to update Google Sheet');
  }
}