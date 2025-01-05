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
  const CREDENTIALS = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');

  if (!SHEET_ID || !CREDENTIALS) {
    console.error('Missing required environment variables');
    throw new Error('Missing required environment variables');
  }

  console.log('Starting Google Sheets update with sheet ID:', SHEET_ID);

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
    // Parse the service account credentials
    let credentials;
    try {
      credentials = JSON.parse(CREDENTIALS);
    } catch (e) {
      console.error('Error parsing credentials:', e);
      throw new Error('Invalid service account credentials format');
    }

    if (!credentials.client_email || !credentials.private_key) {
      console.error('Missing required credential fields');
      throw new Error('Invalid service account credentials: missing required fields');
    }
    
    // Create JWT client
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
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