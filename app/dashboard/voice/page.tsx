"use client";

import React, { useState, useRef } from "react";
import { Mic, MicOff, Phone, PhoneOff, Volume2, Settings } from "lucide-react";

export default function VoicePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(prev => [...prev, `User: ${transcriptText}`]);
      };

      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleCall = () => {
    if (isCallActive) {
      stopRecording();
      setIsCallActive(false);
    } else {
      setIsCallActive(true);
      startRecording();
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Voice AI Experience</h1>
        <p className="text-white/60">Natural voice conversations with emotion detection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voice Interface */}
        <div className="p-8 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="text-center">
            <div className="mb-8">
              <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all ${
                isCallActive ? 'bg-green-500/20 border-4 border-green-500 animate-pulse' : 'bg-white/5 border-2 border-white/10'
              }`}>
                {isCallActive ? (
                  <Volume2 className="w-16 h-16 text-green-500" />
                ) : (
                  <Phone className="w-16 h-16 text-white/40" />
                )}
              </div>
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">
              {isCallActive ? 'Call In Progress' : 'Ready to Connect'}
            </h3>
            <p className="text-white/60 mb-8">
              {isCallActive ? 'Listening...' : 'Start a voice conversation with your AI agent'}
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={toggleCall}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  isCallActive 
                    ? 'bg-red-600 hover:bg-red-500' 
                    : 'bg-green-600 hover:bg-green-500'
                }`}
              >
                {isCallActive ? (
                  <PhoneOff className="w-8 h-8 text-white" />
                ) : (
                  <Phone className="w-8 h-8 text-white" />
                )}
              </button>

              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!isCallActive}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-red-600 hover:bg-red-500' 
                    : 'bg-white/10 hover:bg-white/20'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isRecording ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Transcript */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Live Transcript</h3>
            <button className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {transcript.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                Start a call to see the transcript
              </div>
            ) : (
              transcript.map((text, i) => (
                <div key={i} className="p-3 rounded-lg bg-black/20 text-white text-sm">
                  {text}
                </div>
              ))
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-black/20 border border-white/10 text-center">
              <div className="text-xs text-white/40 mb-1">Sentiment</div>
              <div className="text-sm font-medium text-green-400">Positive</div>
            </div>
            <div className="p-3 rounded-lg bg-black/20 border border-white/10 text-center">
              <div className="text-xs text-white/40 mb-1">Confidence</div>
              <div className="text-sm font-medium text-blue-400">94%</div>
            </div>
            <div className="p-3 rounded-lg bg-black/20 border border-white/10 text-center">
              <div className="text-xs text-white/40 mb-1">Language</div>
              <div className="text-sm font-medium text-white">EN-US</div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Settings */}
      <div className="mt-6 p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4">Voice Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm text-white/60 mb-2">Voice Model</label>
            <select className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white text-sm">
              <option>Neural TTS (Default)</option>
              <option>Standard TTS</option>
              <option>Premium Voice</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Language</label>
            <select className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white text-sm">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Speaking Rate</label>
            <input 
              type="range" 
              min="0.5" 
              max="2" 
              step="0.1" 
              defaultValue="1"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


















