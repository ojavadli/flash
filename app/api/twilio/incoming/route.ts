import { NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_c2a36b61d8e63d3305d349c45078d1078f7845f644062a60";

// Also handle GET for testing
export async function GET() {
  return NextResponse.json({ 
    status: 'ready',
    message: 'Twilio webhook endpoint is active. Send POST request with Twilio call data.' 
  });
}

export async function POST(req: Request) {
  try {
    // Parse Twilio form data
    const formData = await req.formData();
    const from = formData.get('From');
    const to = formData.get('To');
    const callSid = formData.get('CallSid');

    console.log(`📞 Incoming call from ${from} to ${to}, CallSid: ${callSid}`);

    // Simple TwiML response that connects to ElevenLabs
    // Using direct Say for now since Stream requires more setup
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Hello, this is Snoonu support. How can I help you today?</Say>
  <Gather input="speech" action="https://flash-production-3b0c.up.railway.app/api/twilio/process" method="POST" speechTimeout="auto">
    <Say voice="Polly.Joanna">Please tell me about your issue.</Say>
  </Gather>
  <Say voice="Polly.Joanna">I didn't catch that. Please try again.</Say>
  <Redirect>https://flash-production-3b0c.up.railway.app/api/twilio/incoming</Redirect>
</Response>`;

    return new NextResponse(twiml, {
      headers: { 'Content-Type': 'text/xml' }
    });

  } catch (error: any) {
    console.error('❌ Twilio webhook error:', error);
    
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">We apologize for the technical difficulty. Please try your call again in a moment.</Say>
  <Hangup/>
</Response>`;

    return new NextResponse(errorTwiml, {
      headers: { 'Content-Type': 'text/xml' }
    });
  }
}
