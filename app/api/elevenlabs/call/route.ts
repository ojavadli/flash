import { NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = "sk_c2a36b61d8e63d3305d349c45078d1078f7845f644062a60";

export async function POST(req: Request) {
  try {
    const { agentId, phoneNumber, message } = await req.json();

    console.log('Attempting call with:', { agentId, phoneNumber });

    if (!agentId) {
      return NextResponse.json({ 
        error: 'Agent ID is required. Please enter your ElevenLabs agent ID from the dashboard.',
        details: 'Missing agentId parameter'
      }, { status: 400 });
    }

    // Try the correct ElevenLabs Conversational AI endpoint
    // Documentation: https://elevenlabs.io/docs/conversational-ai/api-reference
    const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversations`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agent_id: agentId,
        phone_number: phoneNumber
      })
    });

    const responseText = await response.text();
    console.log('ElevenLabs response:', response.status, responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json({ 
        error: 'Invalid response from ElevenLabs',
        details: responseText
      }, { status: 500 });
    }

    if (!response.ok) {
      return NextResponse.json({ 
        error: data.detail?.message || data.error || 'Failed to initiate call',
        details: data,
        hint: 'Make sure your Agent ID is correct and your ElevenLabs account has calling enabled'
      }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      conversationId: data.conversation_id,
      message: 'Call initiated successfully! The phone should ring shortly.'
    });

  } catch (error: any) {
    console.error('Outbound call error:', error);
    return NextResponse.json({ 
      error: 'Failed to make call',
      details: error.message,
      hint: 'Check server logs for more details'
    }, { status: 500 });
  }
}

