import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const speechResult = formData.get('SpeechResult');
    const callSid = formData.get('CallSid');

    console.log(`🎤 Speech: "${speechResult}"`);

    // Simple response for now
    let response = "I understand. Let me help you with that. Can you provide your order number?";

    // Basic detection
    if (speechResult && typeof speechResult === 'string') {
      const speech = speechResult.toLowerCase();
      
      if (speech.includes('driver') || speech.includes('delivery') || speech.includes('find customer')) {
        response = "I can help you with delivery. What's your order number so I can look up the customer details?";
      } else if (speech.includes('customer') || speech.includes('order') || speech.includes('missing') || speech.includes('refund')) {
        response = "I'm here to help with your order. May I have your order number please?";
      } else if (speech.includes('restaurant') || speech.includes('tablet') || speech.includes('merchant')) {
        response = "I can help with restaurant support. What's the issue you're experiencing?";
      }
    }

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">${response}</Say>
  <Gather input="speech" action="https://flash-production-3b0c.up.railway.app/api/twilio/process" method="POST" speechTimeout="auto">
    <Say voice="Polly.Joanna">I'm listening.</Say>
  </Gather>
  <Say voice="Polly.Joanna">Thank you for calling Snoonu. Goodbye.</Say>
  <Hangup/>
</Response>`;

    return new NextResponse(twiml, {
      headers: { 'Content-Type': 'text/xml' }
    });

  } catch (error: any) {
    console.error('❌ Process error:', error);
    
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">I apologize, but I encountered an error. Please try again.</Say>
  <Hangup/>
</Response>`;

    return new NextResponse(errorTwiml, {
      headers: { 'Content-Type': 'text/xml' }
    });
  }
}

