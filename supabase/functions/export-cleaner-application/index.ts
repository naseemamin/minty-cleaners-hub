import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { google } from "npm:googleapis@128.0.0";

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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const application: CleanerApplication = await req.json();
    console.log('Received application:', application);

    const sheetUpdated = await updateGoogleSheet(application);
    console.log('Google Sheet updated:', sheetUpdated);

    return new Response(
      JSON.stringify({ success: true, sheetUpdated }),
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

async function updateGoogleSheet(application: CleanerApplication) {
  const SHEET_ID = Deno.env.get('GOOGLE_SHEET_ID');
  const EMAIL = Deno.env.get('GMAIL_EMAIL');
  const APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD');

  if (!SHEET_ID || !EMAIL || !APP_PASSWORD) {
    console.error('Missing required environment variables');
    throw new Error('Missing required environment variables');
  }

  console.log('Starting Google Sheets update with credentials:', {
    email: EMAIL,
    sheetId: SHEET_ID,
  });

  const row = [
    application.id,
    application.first_name,
    application.last_name,
    application.mobile_number,
    application.email,
    application.years_experience,
    application.cleaning_types.join(', '),
    application.experience_description,
    application.desired_hours_per_week,
    application.available_days.join(', '),
    application.commitment_length,
    new Date(application.created_at).toLocaleString()
  ];

  try {
    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      null, // No client ID needed
      null, // No client secret needed
      'https://developers.google.com/oauthplayground'
    );

    // Set credentials directly
    oauth2Client.setCredentials({
      access_token: APP_PASSWORD, // Using APP_PASSWORD as access token
      refresh_token: APP_PASSWORD // Using APP_PASSWORD as refresh token
    });

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
    console.log('Attempting to append row to sheet:', SHEET_ID);

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A:L',
      valueInputOption: 'RAW',
      requestBody: {
        values: [row]
      }
    });

    console.log('Sheet update response:', response.data);
    return true;
  } catch (error) {
    console.error('Error updating sheet:', error);
    throw error;
  }
}