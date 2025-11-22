"use client";

import React, { useState, useRef } from "react";
import { Phone, PhoneOff, Volume2, User, Package, Truck, Store } from "lucide-react";
import { lookupOrder } from "@/lib/snoonu-api";
import { logCall } from "@/lib/crm";

type CallState = "idle" | "ringing" | "qualification" | "driver-support" | "customer-support" | "merchant-support" | "ended";
type Message = { role: "user" | "agent"; text: string; timestamp: Date };
type CallerType = "driver" | "customer" | "merchant" | null;

export default function SnoonuDemoPage() {
  const [callState, setCallState] = useState<CallState>("idle");
  const [callerType, setCallerType] = useState<CallerType>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [orderId, setOrderId] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCall = () => {
    setCallState("ringing");
    setTimeout(() => {
      setCallState("qualification");
      const greeting = "Hello, thank you for calling Snoonu support. Are you calling as a driver, customer, or restaurant partner?";
      addMessage("agent", greeting);
      playElevenLabsVoice(greeting);
      
      // Start call timer
      intervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }, 2000);
  };

  const endCall = () => {
    setCallState("ended");
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // Log to CRM
    if (callerType) {
      logCall({
        callSid: `CALL-${Date.now()}`,
        callerPhone: "+974-5555-XXXX",
        callerType,
        orderId: orderId || undefined,
        duration: callDuration,
        transcript: messages.map(m => `${m.role}: ${m.text}`).join('\n'),
        summary: `${callerType} support call`,
        outcome: "resolved",
        actionsTaken: ["Provided support", "Documented in system"],
        agentUsed: `${callerType}-support`,
        sentiment: "positive"
      });
    }
    
    setTimeout(() => {
      setCallState("idle");
      setMessages([]);
      setCallDuration(0);
      setCallerType(null);
      setOrderId("");
    }, 3000);
  };

  const addMessage = (role: "user" | "agent", text: string) => {
    setMessages(prev => [...prev, { role, text, timestamp: new Date() }]);
  };

  const playElevenLabsVoice = async (text: string) => {
    try {
      const response = await fetch('/api/elevenlabs/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: "21m00Tcm4TlvDq8ikWAM" })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
        }
      }
    } catch (error) {
      console.error("Failed to play ElevenLabs voice:", error);
    }
  };

  const selectCallerType = (type: CallerType) => {
    setCallerType(type);
    
    let response = "";
    let newState: CallState = "driver-support";
    
    if (type === "driver") {
      response = "I understand you're a driver. I can help with pickup issues, customer locations, or delivery problems. What's your order number?";
      newState = "driver-support";
    } else if (type === "customer") {
      response = "I'm here to help with your order. I can assist with missing items, refunds, or delivery issues. May I have your order number please?";
      newState = "customer-support";
    } else if (type === "merchant") {
      response = "I can help with tablet issues, order questions, or technical problems. What's the name of your restaurant?";
      newState = "merchant-support";
    }
    
    setCallState(newState);
    addMessage("user", `I'm a ${type}`);
    addMessage("agent", response);
    playElevenLabsVoice(response);
  };

  const handleOrderLookup = async () => {
    if (!orderId) return;
    
    addMessage("user", `My order number is ${orderId}`);
    addMessage("agent", "Let me look that up for you...");
    
    const order = await lookupOrder(orderId);
    
    if (order) {
      let response = "";
      if (callerType === "driver") {
        response = `I found your order. Customer: ${order.customerName}, Address: ${order.customerAddress}. Status: ${order.status}. ${order.notes ? `Note: ${order.notes}` : ''}`;
      } else if (callerType === "customer") {
        response = `I found your order from ${order.restaurantName}. Status: ${order.status}. Your driver ${order.driverName} is ${order.status === 'in_transit' ? 'on the way' : 'preparing to pick up'}. How can I help?`;
      }
      addMessage("agent", response);
      playElevenLabsVoice(response);
    } else {
      const response = "I couldn't find that order number. Could you please verify and try again?";
      addMessage("agent", response);
      playElevenLabsVoice(response);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <audio ref={audioRef} className="hidden" />
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Snoonu AI IVR - Live Demo</h1>
          <p className="text-white/60">Handling 100,000+ driver, customer, and merchant calls</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Phone Interface */}
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-center">
              {/* Status */}
              <div className="mb-6">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  callState === "idle" ? "bg-white/5" :
                  callState === "ringing" ? "bg-yellow-500/20 text-yellow-400" :
                  callState === "ended" ? "bg-red-500/20 text-red-400" :
                  "bg-green-500/20 text-green-400"
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    callState !== "idle" && callState !== "ended" ? "bg-green-500 animate-pulse" : "bg-white/40"
                  }`} />
                  <span className="text-sm font-medium">
                    {callState === "idle" && "Ready"}
                    {callState === "ringing" && "Connecting..."}
                    {callState === "qualification" && "Routing Call"}
                    {callState === "driver-support" && "Driver Support"}
                    {callState === "customer-support" && "Customer Support"}
                    {callState === "merchant-support" && "Merchant Support"}
                    {callState === "ended" && "Call Ended"}
                  </span>
                </div>
              </div>

              {/* Phone Visual */}
              <div className="mb-8">
                <div className={`w-48 h-48 mx-auto rounded-full flex items-center justify-center transition-all ${
                  callState === "ringing" ? "bg-yellow-500/20 border-4 border-yellow-500 animate-pulse" :
                  callState !== "idle" && callState !== "ended" ? "bg-green-500/20 border-4 border-green-500 animate-pulse" :
                  "bg-white/5 border-2 border-white/10"
                }`}>
                  {callState === "idle" && <Phone className="w-24 h-24 text-white/40" />}
                  {callState === "ringing" && <Phone className="w-24 h-24 text-yellow-500 animate-bounce" />}
                  {(callState !== "idle" && callState !== "ringing" && callState !== "ended") && <Volume2 className="w-24 h-24 text-green-500" />}
                  {callState === "ended" && <PhoneOff className="w-24 h-24 text-red-500" />}
                </div>
              </div>

              {/* Caller Type Selection */}
              {callState === "qualification" && !callerType && (
                <div className="mb-6 space-y-3">
                  <p className="text-white/60 mb-4">Select caller type:</p>
                  <button onClick={() => selectCallerType("driver")} className="w-full flex items-center gap-3 p-4 rounded-lg bg-purple-600/20 border border-purple-500/40 hover:bg-purple-600/30 transition-colors">
                    <Truck className="w-6 h-6 text-purple-400" />
                    <div className="text-left">
                      <div className="font-semibold text-white">I'm a Driver</div>
                      <div className="text-xs text-white/60">Pickup, delivery, location issues</div>
                    </div>
                  </button>
                  <button onClick={() => selectCallerType("customer")} className="w-full flex items-center gap-3 p-4 rounded-lg bg-pink-600/20 border border-pink-500/40 hover:bg-pink-600/30 transition-colors">
                    <User className="w-6 h-6 text-pink-400" />
                    <div className="text-left">
                      <div className="font-semibold text-white">I'm a Customer</div>
                      <div className="text-xs text-white/60">Order issues, refunds, complaints</div>
                    </div>
                  </button>
                  <button onClick={() => selectCallerType("merchant")} className="w-full flex items-center gap-3 p-4 rounded-lg bg-orange-600/20 border border-orange-500/40 hover:bg-orange-600/30 transition-colors">
                    <Store className="w-6 h-6 text-orange-400" />
                    <div className="text-left">
                      <div className="font-semibold text-white">I'm a Restaurant</div>
                      <div className="text-xs text-white/60">Tablet, orders, technical help</div>
                    </div>
                  </button>
                </div>
              )}

              {/* Order Lookup */}
              {callerType && callState !== "ended" && callState !== "idle" && (
                <div className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="Enter order number (e.g., SN-2024-001234)"
                      className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white text-sm"
                    />
                    <button 
                      onClick={handleOrderLookup}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Package className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                {callState === "idle" && (
                  <button
                    onClick={startCall}
                    className="w-20 h-20 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-green-600/50"
                  >
                    <Phone className="w-10 h-10 text-white" />
                  </button>
                )}

                {callState !== "idle" && callState !== "ended" && (
                  <button
                    onClick={endCall}
                    className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-red-600/50"
                  >
                    <PhoneOff className="w-10 h-10 text-white" />
                  </button>
                )}
              </div>

              {callState === "idle" && (
                <p className="mt-6 text-white/60 text-sm">
                  Simulate a Snoonu support call
                </p>
              )}
            </div>
          </div>

          {/* Conversation Transcript */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Live Transcript</h3>
              {callerType && (
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  callerType === "driver" ? "bg-purple-500/20 text-purple-400" :
                  callerType === "customer" ? "bg-pink-500/20 text-pink-400" :
                  "bg-orange-500/20 text-orange-400"
                }`}>
                  {callerType.toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[400px]">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  Start a call to see the conversation
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
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
                      <div className="text-white text-sm">{msg.text}</div>
                      <div className="text-white/40 text-xs mt-2">
                        {msg.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="text-center p-3 rounded-lg bg-black/20">
                <div className="text-xs text-white/40 mb-1">Duration</div>
                <div className="text-lg font-bold text-white">{formatDuration(callDuration)}</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-black/20">
                <div className="text-xs text-white/40 mb-1">Messages</div>
                <div className="text-lg font-bold text-white">{messages.length}</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-black/20">
                <div className="text-xs text-white/40 mb-1">Voice</div>
                <div className="text-sm font-bold text-green-400">ElevenLabs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
          <h3 className="text-xl font-bold text-white mb-4">✓ Using ElevenLabs Professional Voice</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Natural human-like voice quality
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Real-time speech synthesis
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Multi-language support ready
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
