"use client";

import React, { useState } from 'react';
import { Send, Bot, User, Settings as SettingsIcon } from 'lucide-react';
import { useAgent } from '@/context/AgentContext';

export default function ConversationsPage() {
  const { systemPrompt, apiKey, setApiKey } = useAgent();
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Hello! I am your Flash AI agent. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      if (apiKey) {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            systemPrompt,
            apiKey
          })
        });
        
        const data = await response.json();
        
        if (data.error) {
          setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }]);
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
        }
      } else {
        // Simulation mode
        setTimeout(() => {
          const responses = [
            "I can help you with that. Could you provide more details?",
            "Let me check that information for you.",
            "Based on your workflow configuration, I'll assist with this request.",
          ];
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: responses[Math.floor(Math.random() * responses.length)] + " (Add API Key for real AI)"
          }]);
        }, 1000);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen p-6 flex gap-6">
      <div className="flex-1 flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-white font-medium">Live Agent</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
            <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
              {apiKey ? 'GPT-4 Active' : 'Demo Mode'}
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="p-4 bg-white/5 border-b border-white/10">
            <div className="max-w-md">
              <label className="block text-sm text-white/60 mb-2">OpenAI API Key</label>
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-white/40 mt-2">
                Add your OpenAI API key to enable real AI responses
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'assistant' ? 'bg-blue-600' : 'bg-purple-600'
              }`}>
                {msg.role === 'assistant' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
              </div>
              <div className={`p-4 rounded-2xl max-w-[70%] ${
                msg.role === 'assistant' 
                  ? 'bg-white/10 text-white rounded-tl-none' 
                  : 'bg-blue-600 text-white rounded-tr-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="p-4 rounded-2xl bg-white/10 text-white rounded-tl-none flex gap-2 items-center">
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white/5 border-t border-white/10">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="w-full bg-black/20 border border-white/10 rounded-full pl-6 pr-14 py-4 text-white focus:outline-none focus:border-blue-500 placeholder:text-white/30"
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
