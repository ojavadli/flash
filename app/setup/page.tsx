"use client";

import React, { useState } from "react";
import { Phone, Key, Settings, CheckCircle, XCircle } from "lucide-react";

export default function SetupPage() {
  const [twilioSid, setTwilioSid] = useState("");
  const [twilioToken, setTwilioToken] = useState("");
  const [twilioPhone, setTwilioPhone] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");

  const testConnection = async () => {
    setTestStatus("testing");
    
    try {
      const response = await fetch('/api/setup/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          twilioSid,
          twilioToken,
          twilioPhone,
          openaiKey
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setTestStatus("success");
      } else {
        setTestStatus("error");
      }
    } catch (error) {
      setTestStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Flash IVR Setup</h1>
          <p className="text-white/60">Configure your AI-powered phone system</p>
        </div>

        {/* Twilio Configuration */}
        <div className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Phone className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Twilio Configuration</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Account SID</label>
              <input
                type="text"
                value={twilioSid}
                onChange={(e) => setTwilioSid(e.target.value)}
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Auth Token</label>
              <input
                type="password"
                value={twilioToken}
                onChange={(e) => setTwilioToken(e.target.value)}
                placeholder="Your Twilio Auth Token"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Phone Number</label>
              <input
                type="tel"
                value={twilioPhone}
                onChange={(e) => setTwilioPhone(e.target.value)}
                placeholder="+1234567890"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white"
              />
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-blue-400">
              <strong>Don't have Twilio?</strong> Sign up at <a href="https://www.twilio.com/try-twilio" target="_blank" className="underline">twilio.com</a> and get a free trial phone number.
            </p>
          </div>
        </div>

        {/* OpenAI Configuration */}
        <div className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Key className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">OpenAI Configuration</h2>
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-2">API Key</label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white"
            />
          </div>

          <div className="mt-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <p className="text-sm text-purple-400">
              <strong>Need an API key?</strong> Get one at <a href="https://platform.openai.com/api-keys" target="_blank" className="underline">platform.openai.com</a>
            </p>
          </div>
        </div>

        {/* Test Connection */}
        <div className="flex items-center gap-4">
          <button
            onClick={testConnection}
            disabled={testStatus === "testing"}
            className="px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testStatus === "testing" ? "Testing..." : "Test Connection"}
          </button>

          {testStatus === "success" && (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Connection successful!</span>
            </div>
          )}

          {testStatus === "error" && (
            <div className="flex items-center gap-2 text-red-400">
              <XCircle className="w-5 h-5" />
              <span>Connection failed. Check your credentials.</span>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-12 p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-6 h-6 text-white/60" />
            <h3 className="text-xl font-bold text-white">Setup Instructions</h3>
          </div>
          
          <ol className="space-y-3 text-white/60">
            <li className="flex gap-3">
              <span className="font-bold text-white">1.</span>
              <span>Get your Twilio credentials from the Twilio Console</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-white">2.</span>
              <span>Configure your Twilio phone number webhook to point to: <code className="px-2 py-1 rounded bg-black/40 text-blue-400">https://your-domain.com/api/voice/incoming</code></span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-white">3.</span>
              <span>Get your OpenAI API key from the OpenAI platform</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-white">4.</span>
              <span>Test the connection to verify everything works</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-white">5.</span>
              <span>Call your Twilio number to test the IVR system</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}


