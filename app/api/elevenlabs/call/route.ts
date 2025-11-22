import { NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_c2a36b61d8e63d3305d349c45078d1078f7845f644062a60";

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

    // ElevenLabs Conversational AI - Signed URL method
    const signedUrlResponse = await fetch(`https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`, {
      method: 'GET',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });

    const responseText = await signedUrlResponse.text();
    console.log('ElevenLabs response:', signedUrlResponse.status, responseText);

    if (!signedUrlResponse.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }
      
      console.error('Signed URL error:', errorData);
      return NextResponse.json({ 
        error: 'Failed to get agent URL. Check your Agent ID.',
        details: errorData,
        hint: 'Make sure you saved your agent in ElevenLabs and copied the correct Agent ID from the URL'
      }, { status: signedUrlResponse.status });
    }

    const data = JSON.parse(responseText);
    
    return NextResponse.json({
      success: true,
      signed_url: data.signed_url,
      message: 'Agent URL generated. Note: Outbound calling requires ElevenLabs enterprise plan or Twilio integration.',
      hint: 'For production: Set up Twilio → ElevenLabs webhook integration for full outbound calling'
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
