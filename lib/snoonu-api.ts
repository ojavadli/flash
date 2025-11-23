// Mock Snoonu Order System (replace with real API later)

export type OrderStatus = "preparing" | "picked_up" | "in_transit" | "delivered" | "cancelled";
export type UserType = "customer" | "driver" | "merchant";

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  restaurantName: string;
  restaurantAddress: string;
  driverName: string;
  driverPhone: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  estimatedDelivery: Date;
  notes: string;
}

// Mock database
const mockOrders: Order[] = [
  {
    id: "SN-2024-001234",
    customerName: "Ahmed Al-Mansoori",
    customerPhone: "+974-5555-1234",
    customerAddress: "Building 42, Al Sadd, Doha",
    restaurantName: "Shawarma Palace",
    restaurantAddress: "Souq Waqif, Doha",
    driverName: "Mohammed Hassan",
    driverPhone: "+974-5555-9876",
    items: [
      { name: "Chicken Shawarma", quantity: 2, price: 25 },
      { name: "Fries", quantity: 1, price: 10 }
    ],
    total: 60,
    status: "in_transit",
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    estimatedDelivery: new Date(Date.now() + 10 * 60 * 1000),
    notes: "Customer requested extra garlic sauce"
  },
  {
    id: "SN-2024-001235",
    customerName: "Fatima Al-Thani",
    customerPhone: "+974-5555-5678",
    customerAddress: "Tower 3, West Bay, Doha",
    restaurantName: "Pizza Roma",
    restaurantAddress: "Pearl Qatar, Doha",
    driverName: "Ali Rahman",
    driverPhone: "+974-5555-4321",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 45 },
      { name: "Caesar Salad", quantity: 1, price: 20 }
    ],
    total: 65,
    status: "preparing",
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    estimatedDelivery: new Date(Date.now() + 25 * 60 * 1000),
    notes: "Ring doorbell twice"
  }
];

export async function lookupOrder(orderId: string): Promise<Order | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const order = mockOrders.find(o => o.id === orderId);
  return order || null;
}

export async function processRefund(orderId: string, amount: number, reason: string): Promise<boolean> {
  // Simulate refund processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`Refund processed: Order ${orderId}, Amount: ${amount} QAR, Reason: ${reason}`);
  return true;
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const order = mockOrders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    return true;
  }
  return false;
}

export async function notifyDriver(driverPhone: string, message: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  console.log(`SMS sent to ${driverPhone}: ${message}`);
  return true;
}

export async function escalateToHuman(orderId: string, issue: string, priority: "low" | "medium" | "high"): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const ticketId = `TICKET-${Date.now()}`;
  console.log(`Escalation created: ${ticketId} for order ${orderId} - ${issue} (Priority: ${priority})`);
  return ticketId;
}


