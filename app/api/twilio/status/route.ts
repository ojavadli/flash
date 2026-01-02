import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const callSid = formData.get('CallSid');
    const callStatus = formData.get('CallStatus');
    const to = formData.get('To');
    const from = formData.get('From');

    console.log(`📊 Call status update - CallSid: ${callSid}, Status: ${callStatus}, To: ${to}`);

    // Log to database or CRM here
    // For now, just log to console

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('❌ Status callback error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

















