import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const speechResult = formData.get('SpeechResult');
    const callSid = formData.get('CallSid');
    const confidence = formData.get('Confidence');

    console.log(`Speech recognized: "${speechResult}" (confidence: ${confidence})`);

    // Process with OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a helpful customer service AI assistant. Provide concise, clear responses suitable for phone conversations. Keep responses under 50 words."
        },
        {
          role: "user",
          content: speechResult as string
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    // Create TwiML response
    const twiml = new VoiceResponse();
    
    twiml.say({
      voice: 'alice',
      language: 'en-US'
    }, aiResponse || 'I understand. Let me help you with that.');

    // Continue conversation
    const gather = twiml.gather({
      input: ['speech'],
      action: '/api/voice/process',
      method: 'POST',
      speechTimeout: 'auto',
      speechModel: 'phone_call'
    });

    gather.say('Is there anything else I can help you with?');

    // Option to end call
    twiml.say('Thank you for calling Flash AI. Goodbye.');
    twiml.hangup();

    // Log conversation to database (implement later)
    await logConversation(callSid as string, speechResult as string, aiResponse || '');

    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });

  } catch (error) {
    console.error('Voice processing error:', error);
    const twiml = new VoiceResponse();
    twiml.say('I apologize, but I encountered an error. Please try again.');
    twiml.redirect('/api/voice/incoming');
    
    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}

async function logConversation(callSid: string, userInput: string, aiResponse: string) {
  // TODO: Implement database logging
  console.log('Conversation logged:', { callSid, userInput, aiResponse });
}


















