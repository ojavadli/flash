"use client";

import React, { useState, useEffect } from "react";
import { Phone, PhoneOff, Volume2, User, Zap, CheckCircle } from "lucide-react";
import { lookupOrder } from "@/lib/snoonu-api";

type CallState = "idle" | "ringing" | "active" | "processing" | "ended";
type Message = { role: "user" | "agent"; text: string; timestamp: Date; action?: string };

export default function SnoonuDemoPage() {
  const [callState, setCallState] = useState<CallState>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [detectedType, setDetectedType] = useState<string>("");
  const [actionsTaken, setActionsTaken] = useState<string[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState === "active" || callState === "processing") {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const startCall = () => {
    setCallState("ringing");
    setTimeout(() => {
      setCallState("active");
      const greeting = "Hello, this is Snoonu support. How can I help you today?";
      addMessage("agent", greeting);
      playVoice(greeting);
    }, 2000);
  };

  const endCall = () => {
    setCallState("ended");
    setTimeout(() => {
      setCallState("idle");
      setMessages([]);
      setCallDuration(0);
      setDetectedType("");
      setActionsTaken([]);
    }, 3000);
  };

  const addMessage = (role: "user" | "agent", text: string, action?: string) => {
    setMessages(prev => [...prev, { role, text, timestamp: new Date(), action }]);
  };

  const playVoice = (text: string) => {
    // Call ElevenLabs TTS
    fetch('/api/elevenlabs/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    }).then(async response => {
      if (response.ok) {
        const audioBlob = await response.blob();
        const audio = new Audio(URL.createObjectURL(audioBlob));
        audio.play();
      }
    }).catch(console.error);
  };

  const simulateDriverCall = () => {
    setCallState("active");
    setDetectedType("Driver");
    
    const conversation = [
      { role: "agent" as const, text: "Hello, this is Snoonu support. How can I help you today?" },
      { role: "user" as const, text: "Hi, I'm at the restaurant but the customer's building number is not clear. Order SN-2024-001234" },
      { role: "agent" as const, text: "Let me check that order for you...", action: "🔍 Looking up order SN-2024-001234" },
      { role: "agent" as const, text: "I found it! The customer is Ahmed Al-Mansoori at Building 42, Al Sadd. It's the tall blue building next to Al Meera supermarket. Customer phone is +974-5555-1234. The note says to ring doorbell twice.", action: "📍 Provided full address details" },
      { role: "user" as const, text: "Perfect, I see it now. Thank you!" },
      { role: "agent" as const, text: "Great! Is there anything else I can help you with?", action: "✅ Issue resolved" },
      { role: "user" as const, text: "No, that's all" },
      { role: "agent" as const, text: "Thank you for delivering with Snoonu. Have a great day!", action: "📝 Logged to CRM: Driver location assistance" }
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < conversation.length) {
        const msg = conversation[index];
        addMessage(msg.role, msg.text, msg.action);
        if (msg.role === "agent") {
          playVoice(msg.text);
        }
        if (msg.action) {
          setActionsTaken(prev => [...prev, msg.action!]);
        }
        index++;
      } else {
        clearInterval(interval);
      }
    }, 2500);
  };

  const simulateCustomerCall = () => {
    setCallState("active");
    setDetectedType("Customer");
    
    const conversation = [
      { role: "agent" as const, text: "Hello, this is Snoonu support. How can I help you today?" },
      { role: "user" as const, text: "My order never arrived and it's been over an hour! Order number SN-2024-001235" },
      { role: "agent" as const, text: "I'm very sorry to hear that. Let me check your order immediately...", action: "🔍 Looking up order SN-2024-001235" },
      { role: "agent" as const, text: "I see your order from Pizza Roma. The driver Ali Rahman is showing as 'in transit' but it's delayed. Let me call the driver right now to get an update.", action: "📞 Calling driver +974-5555-4321" },
      { role: "agent" as const, text: "I've reached the driver. He had a flat tire but is now 5 minutes away from you. For the inconvenience, I'm processing a full refund of 65 QAR plus 50 QAR credit to your account.", action: "💰 Processing refund: 65 QAR + 50 QAR credit" },
      { role: "user" as const, text: "Oh okay, thank you for handling that so quickly" },
      { role: "agent" as const, text: "You're welcome! The refund will appear in 3-5 business days. Your food should arrive in 5 minutes. Is there anything else?", action: "✅ Issue resolved with compensation" },
      { role: "user" as const, text: "No, thank you" },
      { role: "agent" as const, text: "Thank you for your patience. Enjoy your meal!", action: "📝 Logged to CRM: Late delivery - refund + credit issued" }
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < conversation.length) {
        const msg = conversation[index];
        addMessage(msg.role, msg.text, msg.action);
        if (msg.role === "agent") {
          playVoice(msg.text);
        }
        if (msg.action) {
          setActionsTaken(prev => [...prev, msg.action!]);
        }
        index++;
      } else {
        clearInterval(interval);
      }
    }, 3000);
  };

  const simulateRestaurantCall = () => {
    setCallState("active");
    setDetectedType("Restaurant");
    
    const conversation = [
      { role: "agent" as const, text: "Hello, this is Snoonu support. How can I help you today?" },
      { role: "user" as const, text: "Our tablet stopped working, we can't see any orders!" },
      { role: "agent" as const, text: "I understand, let me help you fix that right away. Can you see the home screen on the tablet?", action: "🔧 Starting tablet troubleshooting" },
      { role: "user" as const, text: "Yes, I can see the home screen" },
      { role: "agent" as const, text: "Good. Please hold the power button for 10 seconds until it turns off, then turn it back on. This will refresh the connection.", action: "📱 Guided tablet restart procedure" },
      { role: "user" as const, text: "Okay, it's restarting... Yes! I can see orders now!" },
      { role: "agent" as const, text: "Excellent! The orders should be loading. Do you see them all now?", action: "✅ Tablet issue resolved" },
      { role: "user" as const, text: "Yes, all good now. Thank you!" },
      { role: "agent" as const, text: "Perfect! If it happens again, just do the same restart. Is there anything else I can help with?", action: "📝 Logged to CRM: Tablet restart - resolved" },
      { role: "user" as const, text: "No, that's all" },
      { role: "agent" as const, text: "Great! Thank you for being a Snoonu partner. Have a good day!" }
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < conversation.length) {
        const msg = conversation[index];
        addMessage(msg.role, msg.text, msg.action);
        if (msg.role === "agent") {
          playVoice(msg.text);
        }
        if (msg.action) {
          setActionsTaken(prev => [...prev, msg.action!]);
        }
        index++;
      } else {
        clearInterval(interval);
      }
    }, 3000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Snoonu AI - Intelligent Agent Demo</h1>
            <p className="text-white/60">One agent handles all call types automatically</p>
          </div>
          <div className="px-4 py-2 rounded-full bg-green-500/20 border border-green-500/40 flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400 font-medium">
              Context-Aware AI • No Manual Routing
            </span>
          </div>
        </div>

        {/* Quick Test Scenarios */}
        {callState === "idle" && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={simulateDriverCall}
              className="p-6 rounded-xl bg-purple-600/10 border-2 border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-600/20 transition-all text-left group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="font-bold text-white text-lg">Driver Call</div>
                  <div className="text-sm text-white/60">Location issue</div>
                </div>
              </div>
              <p className="text-sm text-white/70">"I can't find the customer's building..."</p>
            </button>

            <button
              onClick={simulateCustomerCall}
              className="p-6 rounded-xl bg-pink-600/10 border-2 border-pink-500/30 hover:border-pink-500/60 hover:bg-pink-600/20 transition-all text-left group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-pink-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <div className="font-bold text-white text-lg">Customer Call</div>
                  <div className="text-sm text-white/60">Missing order</div>
                </div>
              </div>
              <p className="text-sm text-white/70">"My order never arrived..."</p>
            </button>

            <button
              onClick={simulateRestaurantCall}
              className="p-6 rounded-xl bg-orange-600/10 border-2 border-orange-500/30 hover:border-orange-500/60 hover:bg-orange-600/20 transition-all text-left group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-orange-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <div className="font-bold text-white text-lg">Restaurant Call</div>
                  <div className="text-sm text-white/60">Tablet issue</div>
                </div>
              </div>
              <p className="text-sm text-white/70">"Our tablet stopped working..."</p>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversation Transcript */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Live Transcript</h3>
              <div className="flex items-center gap-3">
                {detectedType && (
                  <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                    Detected: {detectedType}
                  </div>
                )}
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  callState === "active" || callState === "processing" ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/40"
                }`}>
                  {callState === "active" || callState === "processing" ? `${formatDuration(callDuration)}` : "—"}
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[500px]">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-white/40 mb-6">Choose a scenario above to see the intelligent agent in action</div>
                  {callState === "idle" && (
                    <button
                      onClick={startCall}
                      className="px-8 py-4 rounded-full bg-green-600 hover:bg-green-500 text-white font-semibold transition-all inline-flex items-center gap-2"
                    >
                      <Phone className="w-5 h-5" />
                      Start Custom Call
                    </button>
                  )}
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i}>
                    <div className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === "agent" ? "bg-blue-600" : "bg-purple-600"
                      }`}>
                        {msg.role === "agent" ? (
                          <Volume2 className="w-5 h-5 text-white" />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className={`flex-1 p-4 rounded-2xl ${
                        msg.role === "agent" 
                          ? "bg-white/10 rounded-tl-none" 
                          : "bg-blue-600 rounded-tr-none"
                      }`}>
                        <div className="text-white text-sm leading-relaxed">{msg.text}</div>
                        <div className="text-white/40 text-xs mt-2">
                          {msg.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    {msg.action && (
                      <div className="ml-16 mt-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium inline-flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        {msg.action}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {callState !== "idle" && callState !== "ended" && (
              <button
                onClick={endCall}
                className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <PhoneOff className="w-5 h-5" />
                End Call
              </button>
            )}
          </div>

          {/* Actions Panel */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-4">Actions Taken</h3>
            
            <div className="space-y-3 mb-6">
              {actionsTaken.length === 0 ? (
                <div className="text-center py-8 text-white/40 text-sm">
                  Actions will appear here as the agent works
                </div>
              ) : (
                actionsTaken.map((action, i) => (
                  <div key={i} className="p-3 rounded-lg bg-black/20 border border-white/10 text-sm text-white/80">
                    {action}
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-white/10">
              <h4 className="text-sm font-semibold text-white/60 mb-3">Agent Capabilities</h4>
              <div className="space-y-2 text-xs text-white/60">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Auto-detect caller type
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Order lookup & verification
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Process refunds instantly
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Call drivers/customers
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Escalate complex issues
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Log everything to CRM
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  English + Arabic support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
