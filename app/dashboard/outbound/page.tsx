"use client";

import React, { useState } from "react";
import { Phone, PhoneCall, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function OutboundCallPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callStatus, setCallStatus] = useState<"idle" | "calling" | "success" | "error">("idle");
  const [callDetails, setCallDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const makeCall = async () => {
    if (!phoneNumber) {
      alert("Please enter a phone number");
      return;
    }

    setCallStatus("calling");
    setErrorMessage("");
    setCallDetails(null);

    try {
      const response = await fetch('/api/twilio/make-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          message: "This is Snoonu support calling."
        })
      });

      const data = await response.json();

      if (data.success) {
        setCallStatus("success");
        setCallDetails(data);
      } else {
        setCallStatus("error");
        setErrorMessage(data.error || "Failed to make call");
      }
    } catch (error: any) {
      setCallStatus("error");
      setErrorMessage(error.message);
    }
  };

  const quickCall = (number: string) => {
    setPhoneNumber(number);
    setTimeout(() => makeCall(), 100);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Outbound Calling</h1>
          <p className="text-white/60">Call drivers, customers, or merchants with AI agent (Sarah's voice from ElevenLabs)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Call Interface */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-6">Make Call</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+16173083474 or +974-5555-1234"
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white text-lg"
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
                    Call with Sarah's Voice
                  </>
                )}
              </button>
            </div>

            {/* Status Messages */}
            {callStatus === "success" && callDetails && (
              <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 text-green-400 font-medium mb-3">
                  <CheckCircle className="w-5 h-5" />
                  Call Initiated Successfully!
                </div>
                <div className="space-y-2 text-sm text-white/80">
                  <div>CallSid: <span className="font-mono text-green-400">{callDetails.callSid}</span></div>
                  <div>To: <span className="font-mono">{callDetails.to}</span></div>
                  <div>From: <span className="font-mono">{callDetails.from}</span></div>
                  <div className="text-white/60 mt-3">The phone is ringing with Sarah from ElevenLabs!</div>
                </div>
              </div>
            )}

            {callStatus === "error" && (
              <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 text-red-400 font-medium mb-2">
                  <XCircle className="w-5 h-5" />
                  Call Failed
                </div>
                <div className="text-sm text-red-400">{errorMessage}</div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Test Numbers</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => quickCall("+16173083474")}
                  className="w-full p-4 rounded-lg bg-purple-600/10 border border-purple-500/20 hover:bg-purple-600/20 transition-all text-left"
                >
                  <div className="font-medium text-white mb-1">Test Your Phone</div>
                  <div className="text-sm text-white/60">+1 617 308 3474</div>
                </button>

                <button
                  onClick={() => quickCall("+18774126670")}
                  className="w-full p-4 rounded-lg bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 transition-all text-left"
                >
                  <div className="font-medium text-white mb-1">Test Twilio Number</div>
                  <div className="text-sm text-white/60">+1 877 412 6670</div>
                </button>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
              <h3 className="text-lg font-semibold text-white mb-3">How It Works</h3>
              <div className="space-y-3 text-sm text-white/80">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-green-400 font-bold text-xs">1</span>
                  </div>
                  <div>Flash initiates call via Twilio API</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-green-400 font-bold text-xs">2</span>
                  </div>
                  <div>Twilio connects to ElevenLabs agent</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-green-400 font-bold text-xs">3</span>
                  </div>
                  <div>Sarah's voice speaks when answered</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-green-400 font-bold text-xs">4</span>
                  </div>
                  <div>Full conversation with intelligent agent</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Info */}
        <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Voice Configuration</h3>
            <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
              ✓ Sarah from ElevenLabs
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-black/20">
              <div className="text-white/40 mb-1">Inbound Calls</div>
              <div className="text-white font-medium">✓ Using Sarah</div>
            </div>
            <div className="p-3 rounded-lg bg-black/20">
              <div className="text-white/40 mb-1">Outbound Calls</div>
              <div className="text-white font-medium">✓ Using Sarah</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
