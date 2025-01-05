import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GoogleCalendarEvent {
  summary: string
  description: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  attendees: {
    email: string
    responseStatus?: string
  }[]
  conferenceData: {
    createRequest: {
      requestId: string
      conferenceSolutionKey: {
        type: string
      }
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { applicationId, interviewDate } = await req.json()

    // Get application details from database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: application, error: applicationError } = await supabase
      .from('application_process')
      .select(`
        *,
        cleaner_profiles (
          first_name,
          last_name,
          email
        )
      `)
      .eq('id', applicationId)
      .single()

    if (applicationError) throw applicationError

    // Create access token using refresh token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: Deno.env.get('GOOGLE_CALENDAR_CLIENT_ID')!,
        client_secret: Deno.env.get('GOOGLE_CALENDAR_CLIENT_SECRET')!,
        refresh_token: Deno.env.get('GOOGLE_CALENDAR_REFRESH_TOKEN')!,
        grant_type: 'refresh_token',
      }),
    })

    const { access_token } = await tokenResponse.json()

    // Calculate end time (1 hour after start)
    const startTime = new Date(interviewDate)
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // Add 1 hour

    const adminEmail = Deno.env.get('GMAIL_EMAIL')!

    // Create calendar event with Google Meet
    const event: GoogleCalendarEvent = {
      summary: `Interview with ${application.cleaner_profiles.first_name} ${application.cleaner_profiles.last_name}`,
      description: 'Cleaner interview for Mint Cleaning Services',
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'UTC',
      },
      attendees: [
        { email: adminEmail },
        { email: application.cleaner_profiles.email }
      ],
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(),
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      }
    }

    console.log('Creating calendar event with:', {
      adminEmail,
      applicantEmail: application.cleaner_profiles.email,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    })

    const calendarResponse = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    )

    const calendarEvent = await calendarResponse.json()
    console.log('Calendar event created:', calendarEvent)

    // Update application with Google Meet link
    const { error: updateError } = await supabase
      .from('application_process')
      .update({
        google_meet_link: calendarEvent.hangoutLink
      })
      .eq('id', applicationId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ meetLink: calendarEvent.hangoutLink }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})