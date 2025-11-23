import { NextResponse } from 'next/server';
import twilio from 'twilio';

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "+18774126670";

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export async function POST(req: Request) {
  try {
    const { phoneNumber, message } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ 
        error: 'Phone number is required' 
      }, { status: 400 });
    }

    console.log(`📞 Initiating outbound call to ${phoneNumber}`);

    // Make outbound call using Twilio
    // The call will connect to our webhook which connects to ElevenLabs
    const call = await client.calls.create({
      to: phoneNumber,
      from: TWILIO_PHONE_NUMBER,
      url: 'https://flash-production-3b0c.up.railway.app/api/twilio/outbound',
      method: 'POST',
      statusCallback: 'https://flash-production-3b0c.up.railway.app/api/twilio/status',
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST'
    });

    console.log(`✅ Call initiated! CallSid: ${call.sid}`);

    return NextResponse.json({
      success: true,
      callSid: call.sid,
      status: call.status,
      to: phoneNumber,
      from: TWILIO_PHONE_NUMBER,
      message: 'Outbound call initiated with ElevenLabs voice!'
    });

  } catch (error: any) {
    console.error('❌ Outbound call error:', error);
    return NextResponse.json({
      error: 'Failed to initiate outbound call',
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
}

