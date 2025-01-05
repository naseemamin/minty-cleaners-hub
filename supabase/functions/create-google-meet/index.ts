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
    console.log('Starting calendar event creation process...')
    
    const { applicationId, interviewDate } = await req.json()
    console.log('Received request data:', { applicationId, interviewDate })

    // Get application details from database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Fetching application details...')
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

    if (applicationError) {
      console.error('Error fetching application:', applicationError)
      throw applicationError
    }

    console.log('Application details:', application)

    // Create access token using refresh token
    console.log('Getting Google Calendar access token...')
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

    const tokenData = await tokenResponse.json()
    console.log('Token response status:', tokenResponse.status)
    
    if (!tokenResponse.ok) {
      console.error('Token error:', tokenData)
      throw new Error(`Failed to get access token: ${tokenData.error}`)
    }

    const { access_token } = tokenData

    // Calculate end time (1 hour after start)
    const startTime = new Date(interviewDate)
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // Add 1 hour

    const adminEmail = Deno.env.get('GMAIL_EMAIL')!
    console.log('Admin email:', adminEmail)

    console.log('Creating calendar event with:', {
      adminEmail,
      applicantEmail: application.cleaner_profiles.email,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    })

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

    const calendarData = await calendarResponse.json()
    
    if (!calendarResponse.ok) {
      console.error('Calendar API error:', calendarData)
      throw new Error(`Failed to create calendar event: ${calendarData.error?.message || 'Unknown error'}`)
    }
    
    console.log('Calendar event created:', calendarData)

    // Update application with Google Meet link
    const { error: updateError } = await supabase
      .from('application_process')
      .update({
        google_meet_link: calendarData.hangoutLink
      })
      .eq('id', applicationId)

    if (updateError) {
      console.error('Error updating application:', updateError)
      throw updateError
    }

    return new Response(
      JSON.stringify({ meetLink: calendarData.hangoutLink }),
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
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
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