"use client";

import React, { useState, useEffect } from "react";
import { 
  Phone, 
  PhoneOff, 
  Volume2, 
  User, 
  Zap, 
  CheckCircle, 
  PhoneCall, 
  Loader2,
  Bike,
  ShoppingBag,
  Store,
  Globe,
  Mic,
  Signal,
  Clock,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Database,
  Shield,
  Play
} from "lucide-react";

type CallState = "idle" | "ringing" | "active" | "processing" | "ended";
type Message = { role: "user" | "agent"; text: string; timestamp: Date; action?: string };

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "ur", name: "Urdu", native: "اردو" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
];

export default function SnoonuDemoPage() {
  const [callState, setCallState] = useState<CallState>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [detectedType, setDetectedType] = useState<string>("");
  const [actionsTaken, setActionsTaken] = useState<string[]>([]);
  const [selectedLang, setSelectedLang] = useState("en");
  
  const [showRealCallModal, setShowRealCallModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const agentId = "agent_4401kant80mjf05rz880hfjk4rmp"; // Hardcoded Flash agent
  const [isCallingReal, setIsCallingReal] = useState(false);
  const [realCallStatus, setRealCallStatus] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState === "active" || callState === "processing") {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const makeRealCall = async () => {
    if (!phoneNumber) {
      alert("Please enter a phone number");
      return;
    }

    setIsCallingReal(true);
    setRealCallStatus("Initiating call...");

    try {
      const response = await fetch('/api/elevenlabs/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          phoneNumber,
          message: "This is Flash. We're calling to assist you with your Snoonu delivery."
        })
      });

      const data = await response.json();

      if (data.success) {
        setRealCallStatus(`✓ Call initiated! Conversation ID: ${data.conversationId}`);
        setTimeout(() => {
          setShowRealCallModal(false);
          setIsCallingReal(false);
          setRealCallStatus("");
        }, 5000);
      } else {
        setRealCallStatus(`✗ Error: ${data.error}`);
        setIsCallingReal(false);
      }
    } catch (error: any) {
      setRealCallStatus(`✗ Error: ${error.message}`);
      setIsCallingReal(false);
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = selectedLang === 'ar' ? 'ar-QA' : selectedLang === 'ur' ? 'ur-PK' : selectedLang === 'hi' ? 'hi-IN' : 'en-US';
        
        recognitionInstance.onresult = async (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          addMessage("user", transcript);
          await getAIResponse(transcript);
        };
        
        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          // Auto-restart listening if call is still active
          if (callState === "active" && !isProcessing) {
            setTimeout(() => startListening(recognitionInstance), 1000);
          }
        };
        
        recognitionInstance.onend = () => {
          setIsListening(false);
          // Auto-restart listening if call is still active
          if (callState === "active" && !isProcessing) {
            setTimeout(() => startListening(recognitionInstance), 500);
          }
        };
        
        setRecognition(recognitionInstance);
      }
    }
  }, [selectedLang]);

  const startListening = (rec: any) => {
    if (rec && callState === "active" && !isProcessing) {
      try {
        rec.start();
        setIsListening(true);
      } catch (e) {
        // Already started
      }
    }
  };

  const getAIResponse = async (userMessage: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are Flash, an AI voice assistant for Snoonu delivery platform in Qatar. Keep responses brief (1-2 sentences). Help with order issues, delivery problems, and customer support. Be friendly and professional.' },
            ...messages.map(m => ({ role: m.role === 'agent' ? 'assistant' : 'user', content: m.text })),
            { role: 'user', content: userMessage }
          ]
        })
      });
      
      const data = await response.json();
      const aiResponse = data.response || "I apologize, I didn't catch that. Could you please repeat?";
      
      addMessage("agent", aiResponse);
      await playVoiceAsync(aiResponse);
      
      // Check for call ending phrases
      const endPhrases = ['goodbye', 'bye', 'thank you', 'thanks', 'that\'s all', 'nothing else'];
      if (endPhrases.some(phrase => userMessage.toLowerCase().includes(phrase))) {
        setTimeout(() => endCall(), 2000);
      } else {
        // Continue listening
        if (recognition) {
          setTimeout(() => startListening(recognition), 500);
        }
      }
    } catch (error) {
      console.error('AI response error:', error);
      const fallback = "I'm having trouble processing that. Could you repeat?";
      addMessage("agent", fallback);
      await playVoiceAsync(fallback);
      if (recognition) {
        setTimeout(() => startListening(recognition), 500);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const playVoiceAsync = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      fetch('/api/elevenlabs/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      }).then(async response => {
        if (response.ok) {
          const audioBlob = await response.blob();
          const audio = new Audio(URL.createObjectURL(audioBlob));
          audio.onended = () => resolve();
          audio.play();
        } else {
          resolve();
        }
      }).catch(() => resolve());
    });
  };

  const startCustomCall = async () => {
    setCallState("ringing");
    setDetectedType("Custom");
    setTimeout(async () => {
      setCallState("active");
      const greeting = "Hello, this is Flash support for Snoonu. How can I help you today?";
      addMessage("agent", greeting);
      await playVoiceAsync(greeting);
      // Start listening after greeting
      if (recognition) {
        startListening(recognition);
      }
    }, 1500);
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
      { role: "agent" as const, text: "Hello, this is Flash. How can I help you today?" },
      { role: "user" as const, text: "Hi, I'm at the restaurant but the customer's building number is not clear. Order SN-2024-001234" },
      { role: "agent" as const, text: "Let me check that order for you...", action: "🔍 Order lookup" },
      { role: "agent" as const, text: "I found it! Building 42, Al Sadd. Blue building next to Al Meera. Customer phone: +974-5555-1234.", action: "📍 Location sent" },
      { role: "user" as const, text: "Perfect, I see it now. Thank you!" },
      { role: "agent" as const, text: "Great! Anything else I can help with?", action: "✅ Resolved" },
      { role: "user" as const, text: "No, that's all" },
      { role: "agent" as const, text: "Thank you for delivering with Snoonu!", action: "📝 CRM logged" }
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < conversation.length) {
        const msg = conversation[index];
        addMessage(msg.role, msg.text, msg.action);
        if (msg.role === "agent") playVoice(msg.text);
        if (msg.action) setActionsTaken(prev => [...prev, msg.action!]);
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
      { role: "agent" as const, text: "Hello, this is Flash. How can I help?" },
      { role: "user" as const, text: "My order never arrived! Order SN-2024-001235" },
      { role: "agent" as const, text: "I'm very sorry. Let me check immediately...", action: "🔍 Order lookup" },
      { role: "agent" as const, text: "Driver Ali had a flat tire. He's 5 minutes away. Processing full refund + 50 QAR credit.", action: "💰 Refund: 65 QAR + 50 credit" },
      { role: "user" as const, text: "Thank you for handling that quickly" },
      { role: "agent" as const, text: "Refund in 3-5 days. Food arriving soon. Anything else?", action: "✅ Resolved" },
      { role: "user" as const, text: "No, thank you" },
      { role: "agent" as const, text: "Enjoy your meal!", action: "📝 CRM logged" }
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < conversation.length) {
        const msg = conversation[index];
        addMessage(msg.role, msg.text, msg.action);
        if (msg.role === "agent") playVoice(msg.text);
        if (msg.action) setActionsTaken(prev => [...prev, msg.action!]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 2800);
  };

  const simulateRestaurantCall = () => {
    setCallState("active");
    setDetectedType("Restaurant");
    
    const conversation = [
      { role: "agent" as const, text: "Hello, this is Flash. How can I help?" },
      { role: "user" as const, text: "Our tablet stopped working!" },
      { role: "agent" as const, text: "I'll help fix that. Can you see the home screen?", action: "🔧 Troubleshooting" },
      { role: "user" as const, text: "Yes, I can see it" },
      { role: "agent" as const, text: "Hold power for 10 seconds, then restart.", action: "📱 Restart guide" },
      { role: "user" as const, text: "It's working now! I see orders!" },
      { role: "agent" as const, text: "Perfect! If it happens again, same process.", action: "✅ Resolved" },
      { role: "user" as const, text: "Thank you!" },
      { role: "agent" as const, text: "Thank you for being a Snoonu partner!", action: "📝 CRM logged" }
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < conversation.length) {
        const msg = conversation[index];
        addMessage(msg.role, msg.text, msg.action);
        if (msg.role === "agent") playVoice(msg.text);
        if (msg.action) setActionsTaken(prev => [...prev, msg.action!]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 2500);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Ambient background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 right-20 w-80 h-80 bg-[#D92027]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#D92027]/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-white/50 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-[#D92027] flex items-center justify-center shadow-lg shadow-[#D92027]/40 glossy-card">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-[#D92027] tracking-widest uppercase">Flash</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                Intelligent <span className="text-gradient">Voice Agent</span>
              </h1>
              <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-md">
                AI-powered support for Snoonu. One agent. All languages. Every call.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Language pills */}
              <div className="glass glossy-card flex items-center gap-1.5 rounded-full px-4 py-2.5 shadow-lg">
                <Globe className="w-4 h-4 text-gray-500" />
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLang(lang.code)}
                    className={`lang-pill transition-all ${
                      selectedLang === lang.code
                        ? 'bg-[#D92027] text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {lang.native}
                  </button>
                ))}
              </div>

              {/* PROMINENT Real Call Button */}
              <button
                onClick={() => setShowRealCallModal(true)}
                className="cta-big rounded-full px-8 py-4 text-base font-semibold text-white flex items-center justify-center gap-3 group"
              >
                <div className="relative">
                  <PhoneCall className="w-5 h-5" />
                  <div className="absolute inset-0 animate-ping">
                    <PhoneCall className="w-5 h-5 opacity-40" />
                  </div>
                </div>
                <span>Make Real Call</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </header>

        {/* Stats bar */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Calls Handled", value: "100K+", icon: Phone },
            { label: "Languages", value: "4", icon: MessageCircle },
            { label: "Avg Response", value: "0.8s", icon: Clock },
            { label: "Resolution", value: "94%", icon: CheckCircle },
          ].map((stat, i) => (
            <div key={i} className="neu glossy-card rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="w-3.5 h-3.5 text-[#D92027]" />
                <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-medium">{stat.label}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-semibold text-gray-900">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* LARGE Start Custom Call Button - Only in idle state */}
        {callState === "idle" && (
          <div className="mb-8">
            <button
              onClick={startCustomCall}
              className="w-full cta-big rounded-3xl py-6 sm:py-8 text-xl sm:text-2xl font-semibold text-white flex items-center justify-center gap-4 group"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform border border-white/30">
                <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1" />
              </div>
              <span>Start Custom Call</span>
            </button>
          </div>
        )}

        {/* Scenario cards */}
        {callState === "idle" && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-[#D92027]" />
              <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Or Try Demo Scenarios</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { 
                  type: "Driver", 
                  icon: Bike, 
                  issue: "Location issue",
                  quote: "I cannot find the building...",
                  action: simulateDriverCall
                },
                { 
                  type: "Customer", 
                  icon: ShoppingBag, 
                  issue: "Missing order",
                  quote: "My order never arrived...",
                  action: simulateCustomerCall
                },
                { 
                  type: "Restaurant", 
                  icon: Store, 
                  issue: "Tablet issue",
                  quote: "Our tablet stopped working...",
                  action: simulateRestaurantCall
                },
              ].map((scenario, i) => (
                <button
                  key={i}
                  onClick={scenario.action}
                  className="glass glossy-card rounded-3xl p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#D92027]/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#D92027]/15 transition-all">
                    <scenario.icon className="w-5 h-5 text-[#D92027]" />
                  </div>
                  
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-0.5">{scenario.type}</h3>
                    <p className="text-xs text-gray-500">{scenario.issue}</p>
                  </div>
                  
                  <p className="text-sm text-gray-600 italic">"{scenario.quote}"</p>
                  
                  <div className="mt-4 flex items-center gap-2 text-[#D92027]/60 group-hover:text-[#D92027] transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Start simulation</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transcript panel */}
          <div className="lg:col-span-2 glass-strong glossy-card rounded-3xl overflow-hidden flex flex-col min-h-[500px] sm:min-h-[600px]">
            {/* Panel header */}
            <div className="px-6 py-4 border-b border-gray-100/50 flex items-center justify-between bg-white/30">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  callState === "active" || callState === "processing" 
                    ? "bg-[#D92027] animate-pulse shadow-lg shadow-[#D92027]/50" 
                    : callState === "ringing"
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-gray-300"
                }`} />
                <span className="text-sm font-medium text-gray-700">
                  {callState === "ringing" ? "Connecting..." : "Live Transcript"}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                {detectedType && (
                  <div className="bg-[#D92027]/10 border border-[#D92027]/20 rounded-full px-3 py-1 flex items-center gap-2">
                    <Signal className="w-3 h-3 text-[#D92027]" />
                    <span className="text-xs font-medium text-[#D92027]">{detectedType}</span>
                  </div>
                )}
                <div className="glass rounded-full px-3 py-1">
                  <span className="text-xs font-mono font-medium text-gray-600">
                    {callState === "active" || callState === "processing" 
                      ? formatDuration(callDuration) 
                      : "00:00"}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 rounded-full glass flex items-center justify-center mb-6 animate-float shadow-lg">
                    <Mic className="w-8 h-8 text-[#D92027]/40" />
                  </div>
                  <p className="text-gray-600 text-base font-medium mb-2">Ready to start</p>
                  <p className="text-gray-400 text-sm">Click "Start Custom Call" or select a demo scenario</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className="space-y-2">
                    <div className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                        msg.role === "agent" 
                          ? "bg-[#D92027]/10 border border-[#D92027]/20" 
                          : "bg-gray-100 border border-gray-200"
                      }`}>
                        {msg.role === "agent" ? (
                          <Volume2 className="w-4 h-4 text-[#D92027]" />
                        ) : (
                          <User className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <div className={`flex-1 max-w-[80%] ${msg.role === "user" ? "text-right" : ""}`}>
                        <div className={`inline-block px-4 py-3 rounded-2xl text-sm shadow-sm ${
                          msg.role === "agent" 
                            ? "glass text-gray-800 rounded-tl-sm" 
                            : "bg-[#D92027] text-white rounded-tr-sm shadow-lg shadow-[#D92027]/20"
                        }`}>
                          {msg.text}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 px-1">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    {msg.action && (
                      <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} px-12`}>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D92027]/10 border border-[#D92027]/20 shadow-sm">
                          <CheckCircle className="w-3 h-3 text-[#D92027]" />
                          <span className="text-[11px] font-medium text-[#D92027]">{msg.action}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Call controls */}
            {callState !== "idle" && callState !== "ended" && (
              <div className="px-6 py-4 border-t border-gray-100/50 bg-white/30">
                <button
                  onClick={endCall}
                  className="w-full py-4 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <PhoneOff className="w-5 h-5" />
                  End Call
                </button>
              </div>
            )}
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            {/* Actions panel */}
            <div className="neu glossy-card rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-4 h-4 text-[#D92027]" />
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Actions</span>
              </div>
              
              <div className="space-y-2 min-h-[120px]">
                {actionsTaken.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-8">
                    Actions appear here during calls
                  </p>
                ) : (
                  actionsTaken.map((action, i) => (
                    <div key={i} className="glass rounded-xl px-4 py-3 text-sm text-gray-700 font-medium shadow-sm">
                      {action}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Capabilities panel */}
            <div className="neu glossy-card rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-[#D92027]" />
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Capabilities</span>
              </div>
              
              <div className="space-y-3">
                {[
                  "Auto-detect caller type",
                  "Order lookup & verification",
                  "Process refunds instantly",
                  "Call drivers/customers",
                  "Escalate complex issues",
                  "Log to CRM automatically",
                ].map((cap, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D92027]" />
                    <span className="text-sm text-gray-600">{cap}</span>
                  </div>
                ))}
              </div>

              {/* Languages */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-3.5 h-3.5 text-[#D92027]/60" />
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Languages</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {languages.map((lang) => (
                    <span key={lang.code} className="text-xs px-2.5 py-1 rounded-full glass text-gray-600 font-medium shadow-sm">
                      {lang.native}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Call Modal */}
      {showRealCallModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-strong glossy-card rounded-3xl max-w-md w-full p-8 relative shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => {
                setShowRealCallModal(false);
                setRealCallStatus("");
                setIsCallingReal(false);
              }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors text-xl shadow-sm"
            >
              ×
            </button>

            <div className="mb-8">
              <div className="w-14 h-14 rounded-2xl bg-[#D92027]/10 flex items-center justify-center mb-4 shadow-lg">
                <PhoneCall className="w-6 h-6 text-[#D92027]" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">Make Real Call</h2>
              <p className="text-sm text-gray-500">The phone will actually ring</p>
            </div>
            
            <div className="space-y-5 mb-6">
              <div>
                <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+974-5555-1234"
                  className="w-full glass rounded-xl px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D92027]/50 text-lg shadow-sm"
                />
                <p className="mt-2 text-xs text-gray-400">Include country code (e.g., +1, +974)</p>
              </div>
            </div>

            {realCallStatus && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-medium shadow-sm ${
                realCallStatus.startsWith('✓') 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : realCallStatus.startsWith('✗')
                  ? 'bg-red-50 border border-red-200 text-red-700'
                  : 'bg-blue-50 border border-blue-200 text-blue-700'
              }`}>
                {realCallStatus}
              </div>
            )}

            <button
              onClick={makeRealCall}
              disabled={isCallingReal || !phoneNumber}
              className="w-full cta-big py-5 rounded-xl text-white font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
            >
              {isCallingReal ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Calling...
                </>
              ) : (
                <>
                  <Phone className="w-5 h-5" />
                  Call Now
                </>
              )}
            </button>

            <p className="mt-4 text-xs text-gray-400 text-center">
              Uses AI voice credits
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
