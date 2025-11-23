import { NextResponse } from 'next/server';
import { processRefund } from '@/lib/snoonu-api';

export async function POST(req: Request) {
  try {
    const { order_number, amount, reason } = await req.json();

    console.log('Refund request:', { order_number, amount, reason });

    if (!order_number || !amount) {
      return NextResponse.json({
        error: 'Order number and amount are required'
      }, { status: 400 });
    }

    const success = await processRefund(order_number, amount, reason);

    if (success) {
      return NextResponse.json({
        success: true,
        message: `Refund of ${amount} QAR processed for order ${order_number}`,
        refund_amount: amount,
        currency: 'QAR',
        processing_time: '3-5 business days',
        confirmation_number: `REF-${Date.now()}`
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to process refund'
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Refund processing error:', error);
    return NextResponse.json({
      error: 'Failed to process refund',
      details: error.message
    }, { status: 500 });
  }
}


