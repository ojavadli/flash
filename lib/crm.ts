// CRM Logging System for Snoonu

export type CallType = "driver" | "customer" | "merchant";
export type CallOutcome = "resolved" | "escalated" | "dropped" | "transferred";

export interface CallLog {
  id: string;
  callSid: string;
  callerPhone: string;
  callerType: CallType;
  orderId?: string;
  duration: number;
  transcript: string;
  summary: string;
  outcome: CallOutcome;
  actionsTaken: string[];
  agentUsed: string;
  timestamp: Date;
  sentiment: "positive" | "neutral" | "negative";
}

// Mock CRM database
const callLogs: CallLog[] = [];

export async function logCall(log: Omit<CallLog, 'id' | 'timestamp'>): Promise<string> {
  const callLog: CallLog = {
    ...log,
    id: `LOG-${Date.now()}`,
    timestamp: new Date()
  };
  
  callLogs.push(callLog);
  
  // In production, this would save to database
  console.log('Call logged to CRM:', callLog);
  
  return callLog.id;
}

export async function getCallLogs(filters?: {
  callerType?: CallType;
  outcome?: CallOutcome;
  startDate?: Date;
  endDate?: Date;
}): Promise<CallLog[]> {
  let filtered = [...callLogs];
  
  if (filters?.callerType) {
    filtered = filtered.filter(log => log.callerType === filters.callerType);
  }
  
  if (filters?.outcome) {
    filtered = filtered.filter(log => log.outcome === filters.outcome);
  }
  
  if (filters?.startDate) {
    filtered = filtered.filter(log => log.timestamp >= filters.startDate!);
  }
  
  if (filters?.endDate) {
    filtered = filtered.filter(log => log.timestamp <= filters.endDate!);
  }
  
  return filtered;
}

export async function getCallAnalytics() {
  const total = callLogs.length;
  const byType = {
    driver: callLogs.filter(l => l.callerType === 'driver').length,
    customer: callLogs.filter(l => l.callerType === 'customer').length,
    merchant: callLogs.filter(l => l.callerType === 'merchant').length,
  };
  const byOutcome = {
    resolved: callLogs.filter(l => l.outcome === 'resolved').length,
    escalated: callLogs.filter(l => l.outcome === 'escalated').length,
    dropped: callLogs.filter(l => l.outcome === 'dropped').length,
    transferred: callLogs.filter(l => l.outcome === 'transferred').length,
  };
  const avgDuration = callLogs.length > 0 
    ? callLogs.reduce((sum, log) => sum + log.duration, 0) / callLogs.length 
    : 0;

  return {
    total,
    byType,
    byOutcome,
    avgDuration,
    resolutionRate: total > 0 ? (byOutcome.resolved / total) * 100 : 0
  };
}


