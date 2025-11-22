"use client";

import React, { useState, useEffect } from "react";
import { Phone, Mic, MicOff, PhoneOff, Volume2, User } from "lucide-react";

type CallState = "idle" | "ringing" | "active" | "ended";
type Message = { role: "user" | "agent"; text: string; timestamp: Date };

export default function LiveDemoPage() {
  const [callState, setCallState] = useState<CallState>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState === "active") {
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
      setMessages([{
        role: "agent",
        text: "Hello! Thank you for calling Flash AI. I'm your intelligent assistant. How can I help you today?",
        timestamp: new Date()
      }]);
      // Simulate agent speaking
      speakText("Hello! Thank you for calling Flash AI. I'm your intelligent assistant. How can I help you today?");
    }, 2000);
  };

  const endCall = () => {
    setCallState("ended");
    setIsListening(false);
    setTimeout(() => {
      setCallState("idle");
      setMessages([]);
      setCallDuration(0);
      setCurrentTranscript("");
    }, 3000);
  };

  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate speech recognition
      simulateSpeechRecognition();
    } else {
      setIsListening(false);
    }
  };

  const simulateSpeechRecognition = () => {
    const userPhrases = [
      "I need help with my account",
      "What are your business hours?",
      "I want to speak to a supervisor",
      "Can you help me reset my password?",
      "I have a question about billing"
    ];
    
    const phrase = userPhrases[Math.floor(Math.random() * userPhrases.length)];
    
    // Simulate typing effect
    let currentText = "";
    const words = phrase.split(" ");
    let wordIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += (wordIndex > 0 ? " " : "") + words[wordIndex];
        setCurrentTranscript(currentText);
        wordIndex++;
      } else {
        clearInterval(typeInterval);
        // Add to messages
        setMessages(prev => [...prev, {
          role: "user",
          text: phrase,
          timestamp: new Date()
        }]);
        setCurrentTranscript("");
        setIsListening(false);
        
        // Generate AI response
        setTimeout(() => generateAIResponse(phrase), 1000);
      }
    }, 200);
  };

  const generateAIResponse = (userInput: string) => {
    const responses: Record<string, string> = {
      "account": "I'd be happy to help you with your account. I can see your account is active. What specific information do you need?",
      "hours": "We're available 24/7! Our AI system is always here to help you, and human agents are available Monday through Friday, 9 AM to 6 PM Eastern Time.",
      "supervisor": "I understand you'd like to speak with a supervisor. Let me transfer you to our escalation team. Please hold for just a moment.",
      "password": "I can help you reset your password right away. For security, I'll send a verification code to your registered email. Can you confirm your email address?",
      "billing": "I can assist with billing questions. Could you tell me more about what you'd like to know? I can explain charges, update payment methods, or provide invoice copies.",
      "default": "I understand your concern. Let me help you with that. Could you provide me with a bit more detail so I can assist you better?"
    };

    let response = responses.default;
    for (const [key, value] of Object.entries(responses)) {
      if (userInput.toLowerCase().includes(key)) {
        response = value;
        break;
      }
    }

    setMessages(prev => [...prev, {
      role: "agent",
      text: response,
      timestamp: new Date()
    }]);

    speakText(response);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Flash AI - Live Demo</h1>
          <p className="text-white/60">Experience our AI phone system in action</p>
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
                  callState === "active" ? "bg-green-500/20 text-green-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    callState === "active" ? "bg-green-500 animate-pulse" : "bg-white/40"
                  }`} />
                  <span className="text-sm font-medium">
                    {callState === "idle" && "Ready to Call"}
                    {callState === "ringing" && "Connecting..."}
                    {callState === "active" && `Call Active - ${formatDuration(callDuration)}`}
                    {callState === "ended" && "Call Ended"}
                  </span>
                </div>
              </div>

              {/* Phone Visual */}
              <div className="mb-8">
                <div className={`w-48 h-48 mx-auto rounded-full flex items-center justify-center transition-all ${
                  callState === "active" ? "bg-green-500/20 border-4 border-green-500 animate-pulse" :
                  callState === "ringing" ? "bg-yellow-500/20 border-4 border-yellow-500 animate-pulse" :
                  "bg-white/5 border-2 border-white/10"
                }`}>
                  {callState === "idle" && <Phone className="w-24 h-24 text-white/40" />}
                  {callState === "ringing" && <Phone className="w-24 h-24 text-yellow-500 animate-bounce" />}
                  {callState === "active" && <Volume2 className="w-24 h-24 text-green-500" />}
                  {callState === "ended" && <PhoneOff className="w-24 h-24 text-red-500" />}
                </div>
              </div>

              {/* Current Transcript */}
              {currentTranscript && (
                <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="text-sm text-blue-400 mb-1">Listening...</div>
                  <div className="text-white">{currentTranscript}</div>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                {callState === "idle" && (
                  <button
                    onClick={startCall}
                    className="w-20 h-20 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center transition-all hover:scale-110"
                  >
                    <Phone className="w-10 h-10 text-white" />
                  </button>
                )}

                {callState === "active" && (
                  <>
                    <button
                      onClick={toggleListening}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                        isListening 
                          ? "bg-red-600 hover:bg-red-500 animate-pulse" 
                          : "bg-blue-600 hover:bg-blue-500"
                      }`}
                    >
                      {isListening ? (
                        <MicOff className="w-8 h-8 text-white" />
                      ) : (
                        <Mic className="w-8 h-8 text-white" />
                      )}
                    </button>

                    <button
                      onClick={endCall}
                      className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-all hover:scale-110"
                    >
                      <PhoneOff className="w-10 h-10 text-white" />
                    </button>
                  </>
                )}
              </div>

              {callState === "idle" && (
                <p className="mt-6 text-white/60 text-sm">
                  Click the phone button to start a demo call
                </p>
              )}
              {callState === "active" && (
                <p className="mt-6 text-white/60 text-sm">
                  Click the microphone to speak
                </p>
              )}
            </div>
          </div>

          {/* Conversation Transcript */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4">Live Transcript</h3>
            
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
                <div className="text-xs text-white/40 mb-1">Status</div>
                <div className="text-lg font-bold text-green-400">
                  {callState === "active" ? "Live" : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">What You're Seeing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-black/20">
              <div className="text-green-400 font-semibold mb-2">✓ Speech Recognition</div>
              <div className="text-sm text-white/60">Real-time voice-to-text conversion</div>
            </div>
            <div className="p-4 rounded-lg bg-black/20">
              <div className="text-green-400 font-semibold mb-2">✓ AI Processing</div>
              <div className="text-sm text-white/60">Intelligent context-aware responses</div>
            </div>
            <div className="p-4 rounded-lg bg-black/20">
              <div className="text-green-400 font-semibold mb-2">✓ Text-to-Speech</div>
              <div className="text-sm text-white/60">Natural voice synthesis</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

