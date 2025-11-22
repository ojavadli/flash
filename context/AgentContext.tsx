"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AgentContextType = {
  agentName: string;
  setAgentName: (name: string) => void;
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
};

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agentName, setAgentName] = useState("Customer Support Agent");
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful AI customer support agent.");
  const [apiKey, setApiKey] = useState("");

  return (
    <AgentContext.Provider value={{ 
      agentName, setAgentName,
      systemPrompt, setSystemPrompt,
      apiKey, setApiKey
    }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
}
