"use client";

import React, { useState } from "react";
import { Phone, PhoneCall, Loader2 } from "lucide-react";

export default function OutboundCallPage() {
  const [agentId, setAgentId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callStatus, setCallStatus] = useState<"idle" | "calling" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const makeCall = async () => {
    if (!agentId || !phoneNumber) {
      alert("Please enter both Agent ID and phone number");
      return;
    }

    setCallStatus("calling");
    setErrorMessage("");

    try {
      const response = await fetch('/api/elevenlabs/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          phoneNumber,
          message: "This is Snoonu support calling regarding your order."
        })
      });

      const data = await response.json();

      if (data.success) {
        setCallStatus("success");
      } else {
        setCallStatus("error");
        setErrorMessage(data.error || "Failed to make call");
      }
    } catch (error: any) {
      setCallStatus("error");
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Outbound Calling</h1>
        <p className="text-white/60 mb-8">Make calls to drivers, customers, or merchants</p>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-6">
          <div>
            <label className="block text-sm text-white/60 mb-2">ElevenLabs Agent ID</label>
            <input
              type="text"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              placeholder="agent_4401kant80mjf05rz880hfjk4rmp"
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white"
            />
            <p className="text-xs text-white/40 mt-1">
              Get this from your ElevenLabs dashboard after saving your workflow
            </p>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+974-5555-1234"
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white"
            />
          </div>

          <button
            onClick={makeCall}
            disabled={callStatus === "calling"}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {callStatus === "calling" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Calling...
              </>
            ) : (
              <>
                <PhoneCall className="w-5 h-5" />
                Make Call
              </>
            )}
          </button>

          {callStatus === "success" && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              ✓ Call initiated successfully! The agent is now calling the number.
            </div>
          )}

          {callStatus === "error" && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              ✗ Error: {errorMessage}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <h3 className="text-lg font-bold text-white mb-4">How to Get Your Agent ID:</h3>
          <ol className="space-y-2 text-sm text-white/80">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>In your ElevenLabs dashboard, click <strong>"Save"</strong> at the bottom</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>After saving, look at the URL - it will contain your agent ID</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              <span>Copy the agent ID (looks like: agent_4401kant80mjf05rz880hfjk4rmp)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">4.</span>
              <span>Paste it above and enter a phone number to test</span>
            </li>
          </ol>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <button
            onClick={() => setPhoneNumber("+974-5555-1234")}
            className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left"
          >
            <div className="text-xs text-white/40 mb-1">Test Driver</div>
            <div className="text-sm text-white font-medium">+974-5555-1234</div>
          </button>
          <button
            onClick={() => setPhoneNumber("+974-5555-5678")}
            className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left"
          >
            <div className="text-xs text-white/40 mb-1">Test Customer</div>
            <div className="text-sm text-white font-medium">+974-5555-5678</div>
          </button>
          <button
            onClick={() => setPhoneNumber("+974-5555-9999")}
            className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left"
          >
            <div className="text-xs text-white/40 mb-1">Test Restaurant</div>
            <div className="text-sm text-white font-medium">+974-5555-9999</div>
          </button>
        </div>
      </div>
    </div>
  );
}


