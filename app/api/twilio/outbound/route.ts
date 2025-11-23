import { NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_c2a36b61d8e63d3305d349c45078d1078f7845f644062a60";
const AGENT_ID = "agent_4401kant80mjf05rz880hfjk4rmp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const to = formData.get('To');
    const from = formData.get('From');
    const callSid = formData.get('CallSid');

    console.log(`📞 Outbound call connecting - From: ${from}, To: ${to}, CallSid: ${callSid}`);

    // Get ElevenLabs agent signed URL
    const signedUrlResponse = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${AGENT_ID}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY
        }
      }
    );

    if (!signedUrlResponse.ok) {
      console.error('❌ Failed to get ElevenLabs signed URL for outbound call');
      const fallbackTwiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="Polly.Joanna">Hello, this is Snoonu support calling. How can we help you?</Say><Pause length="2"/><Hangup/></Response>`;
      return new NextResponse(fallbackTwiml, {
        headers: { 'Content-Type': 'text/xml' }
      });
    }

    const { signed_url } = await signedUrlResponse.json();
    console.log('✅ Got ElevenLabs signed URL for outbound call, connecting...');

    // Connect to ElevenLabs with Sarah's voice
    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Connect><Stream url="${signed_url}"/></Connect></Response>`;

    return new NextResponse(twiml, {
      headers: { 'Content-Type': 'text/xml' }
    });

  } catch (error: any) {
    console.error('❌ Outbound webhook error:', error);
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="Polly.Joanna">We apologize for the technical difficulty.</Say><Hangup/></Response>`;
    return new NextResponse(errorTwiml, {
      headers: { 'Content-Type': 'text/xml' }
    });
  }
}

