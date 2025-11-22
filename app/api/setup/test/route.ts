import { NextResponse } from 'next/server';
import twilio from 'twilio';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { twilioSid, twilioToken, twilioPhone, openaiKey } = await req.json();

    const results = {
      twilio: false,
      openai: false,
      errors: [] as string[]
    };

    // Test Twilio
    try {
      const client = twilio(twilioSid, twilioToken);
      await client.api.accounts(twilioSid).fetch();
      results.twilio = true;
    } catch (error: any) {
      results.errors.push(`Twilio: ${error.message}`);
    }

    // Test OpenAI
    try {
      const openai = new OpenAI({ apiKey: openaiKey });
      await openai.models.list();
      results.openai = true;
    } catch (error: any) {
      results.errors.push(`OpenAI: ${error.message}`);
    }

    const success = results.twilio && results.openai;

    return NextResponse.json({
      success,
      results,
      message: success 
        ? 'All services connected successfully!' 
        : 'Some services failed to connect. Check your credentials.'
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

