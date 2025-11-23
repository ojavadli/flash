import { NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_c2a36b61d8e63d3305d349c45078d1078f7845f644062a60";

// Also handle GET for testing
export async function GET() {
  return NextResponse.json({ 
    status: 'ready',
    message: 'Twilio webhook endpoint is active. Send POST request with Twilio call data.',
    timestamp: new Date().toISOString(),
    version: '1.1'
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

    // Get ElevenLabs agent signed URL
    const agentId = "agent_4401kant80mjf05rz880hfjk4rmp";
    
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
      console.error('❌ Failed to get ElevenLabs signed URL');
      // Fallback to Twilio voice - no whitespace
      const fallbackTwiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="Polly.Joanna">Hello, this is Snoonu support. How can I help you today?</Say><Gather input="speech" action="https://flash-production-3b0c.up.railway.app/api/twilio/process" method="POST" speechTimeout="auto"><Say voice="Polly.Joanna">Please tell me about your issue.</Say></Gather><Hangup/></Response>`;
      return new NextResponse(fallbackTwiml, {
        headers: { 'Content-Type': 'text/xml' }
      });
    }

    const { signed_url } = await signedUrlResponse.json();
    console.log('✅ Got ElevenLabs signed URL, connecting...');

    // Connect Twilio call to ElevenLabs agent via WebSocket Stream
    // Important: No extra whitespace or Twilio returns "Document parse failure"
    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Connect><Stream url="${signed_url}"/></Connect></Response>`;

    return new NextResponse(twiml, {
      headers: { 'Content-Type': 'text/xml' }
    });

  } catch (error: any) {
    console.error('❌ Twilio webhook error:', error);
    
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="Polly.Joanna">We apologize for the technical difficulty. Please try your call again in a moment.</Say><Hangup/></Response>`;

    return new NextResponse(errorTwiml, {
      headers: { 'Content-Type': 'text/xml' }
    });
  }
}
