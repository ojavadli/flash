import { NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_c2a36b61d8e63d3305d349c45078d1078f7845f644062a60";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const from = formData.get('From');
    const to = formData.get('To');
    const callSid = formData.get('CallSid');

    console.log(`Incoming call from ${from} to ${to}, CallSid: ${callSid}`);

    // Get the agent's signed URL from ElevenLabs
    const agentId = "agent_4401kant80mjf05rz880hfjk4rmp"; // Your agent ID
    
    const signedUrlResponse = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY
        }
      }
    );

    if (!signedUrlResponse.ok) {
      console.error('Failed to get signed URL');
      // Fallback TwiML response
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say voice="alice">Hello, this is Snoonu support. We are experiencing technical difficulties. Please try again later.</Say>
          <Hangup/>
        </Response>`,
        {
          headers: { 'Content-Type': 'text/xml' }
        }
      );
    }

    const { signed_url } = await signedUrlResponse.json();

    // Connect Twilio call to ElevenLabs agent via WebSocket
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Connect>
        <Stream url="${signed_url}" />
      </Connect>
    </Response>`;

    return new NextResponse(twiml, {
      headers: { 'Content-Type': 'text/xml' }
    });

  } catch (error: any) {
    console.error('Twilio webhook error:', error);
    
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say voice="alice">We apologize for the inconvenience. Please try your call again.</Say>
        <Hangup/>
      </Response>`,
      {
        headers: { 'Content-Type': 'text/xml' }
      }
    );
  }
}

