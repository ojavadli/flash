import { NextResponse } from 'next/server';
import { lookupOrder } from '@/lib/snoonu-api';

export async function POST(req: Request) {
  try {
    const { order_number } = await req.json();

    console.log('Order lookup request:', order_number);

    if (!order_number) {
      return NextResponse.json({
        error: 'Order number is required'
      }, { status: 400 });
    }

    const order = await lookupOrder(order_number);

    if (!order) {
      return NextResponse.json({
        found: false,
        message: `Order ${order_number} not found in system`
      });
    }

    // Return order details in a format the AI agent can understand
    return NextResponse.json({
      found: true,
      order_number: order.id,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_address: order.customerAddress,
      restaurant_name: order.restaurantName,
      restaurant_address: order.restaurantAddress,
      driver_name: order.driverName,
      driver_phone: order.driverPhone,
      items: order.items.map(item => `${item.quantity}x ${item.name}`).join(', '),
      total: `${order.total} QAR`,
      status: order.status,
      notes: order.notes,
      estimated_delivery: order.estimatedDelivery.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    });

  } catch (error: any) {
    console.error('Order lookup error:', error);
    return NextResponse.json({
      error: 'Failed to lookup order',
      details: error.message
    }, { status: 500 });
  }
}


