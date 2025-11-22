import { NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = "sk_c2a36b61d8e63d3305d349c45078d1078f7845f644062a60";

export async function POST(req: Request) {
  try {
    const { agentId, phoneNumber, message } = await req.json();

    // Make outbound call using ElevenLabs Conversational AI
    const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversation`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agent_id: agentId,
        phone_number: phoneNumber,
        initial_message: message || undefined
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ 
        error: data.error || 'Failed to initiate call',
        details: data
      }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      conversationId: data.conversation_id,
      message: 'Call initiated successfully'
    });

  } catch (error: any) {
    console.error('Outbound call error:', error);
    return NextResponse.json({ 
      error: 'Failed to make call',
      details: error.message 
    }, { status: 500 });
  }
}

