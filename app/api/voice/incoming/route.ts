import { NextResponse } from 'next/server';
import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const from = formData.get('From');
    const to = formData.get('To');
    const callSid = formData.get('CallSid');

    console.log(`Incoming call from ${from} to ${to}, CallSid: ${callSid}`);

    const twiml = new VoiceResponse();
    
    // Greeting
    twiml.say({
      voice: 'alice',
      language: 'en-US'
    }, 'Welcome to Flash AI. Please hold while we connect you to our intelligent assistant.');

    // Start recording and streaming
    twiml.start().stream({
      url: `wss://${req.headers.get('host')}/api/voice/stream`,
      track: 'both_tracks'
    });

    // Gather speech input
    const gather = twiml.gather({
      input: ['speech'],
      action: '/api/voice/process',
      method: 'POST',
      speechTimeout: 'auto',
      speechModel: 'phone_call'
    });

    gather.say('How can I help you today?');

    // If no input, repeat
    twiml.say('I didn\'t catch that. Please try again.');
    twiml.redirect('/api/voice/incoming');

    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });

  } catch (error) {
    console.error('Voice incoming error:', error);
    const twiml = new VoiceResponse();
    twiml.say('We are experiencing technical difficulties. Please try again later.');
    twiml.hangup();
    
    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}


