"use client";

import { useAgent } from "@/context/AgentContext";

export default function SettingsPage() {
  const { agentName, setAgentName, apiKey, setApiKey, systemPrompt, setSystemPrompt } = useAgent();

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>

      <div className="space-y-6">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Agent Configuration</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Agent Name</label>
              <input 
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">System Prompt</label>
              <textarea 
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={4}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white resize-none"
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4">API Configuration</h3>
          
          <div>
            <label className="block text-sm text-white/60 mb-2">OpenAI API Key</label>
            <input 
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white"
            />
            <p className="text-xs text-white/40 mt-2">
              Your API key is stored locally and never sent to our servers
            </p>
          </div>
        </div>

        <button className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
