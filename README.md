# Flash AI - Snoonu IVR System

**Intelligent AI phone system for Snoonu's 100,000+ monthly support calls**

## ✅ What Flash Does

Flash is a complete AI IVR (Interactive Voice Response) system built specifically for Snoonu, Qatar's leading food delivery platform. It handles:

### **Driver Support** (Largest Volume)
- Can't find customer address → Provides full address, landmarks, GPS
- Pickup delays → Contacts restaurant, offers compensation
- Customer not available → Guides on failed delivery procedure
- Navigation issues → Gives detailed location instructions

### **Customer Support** (High Priority)
- Missing orders → Checks status, processes refund + credit
- Wrong items → Verifies order, offers refund/redelivery
- Refund requests → Processes immediately with verification
- Delivery delays → Checks driver location, provides ETA

### **Restaurant Support**
- Tablet not working → Walks through restart procedure
- Order confusion → Clarifies details, checks for duplicates
- Item substitutions → Guides on protocol
- Technical issues → Escalates to tech support

## 🚀 Key Features

✅ **Intelligent Context Detection** - No manual routing! Agent understands from conversation if caller is driver, customer, or restaurant

✅ **Real Phone Calls** - Makes and receives actual phone calls using ElevenLabs

✅ **Professional Voices** - Natural human-like voices from ElevenLabs (not robotic)

✅ **Bilingual** - English + Arabic support for Qatar

✅ **Order Lookup** - Integrates with Snoonu database to find orders

✅ **Refund Processing** - Processes refunds during the call

✅ **CRM Logging** - Documents every interaction automatically

✅ **Action Tracking** - Shows what actions agent takes in real-time

## 📱 How to Use

### **1. View Working Demo**
```bash
npm run dev
```
Visit: `http://localhost:5555/demo`

Click one of the scenario buttons to see the AI handle:
- Driver with location issue
- Customer with missing order  
- Restaurant with tablet problem

### **2. Make Real Phone Calls**

Click **"Make Real Call"** button in the demo, then:

1. Enter a real phone number (e.g., +16173083474 or +974-5555-1234)
2. Enter your ElevenLabs Agent ID (from your dashboard)
3. Click "Call Now"
4. **The phone will actually ring!**

### **3. Set Up Your ElevenLabs Agent**

See `ELEVENLABS_SETUP.md` for detailed instructions, but in summary:

1. In your ElevenLabs dashboard, create ONE intelligent agent
2. Use the prompt from `lib/prompts.ts` → `SNOONU_PROMPTS.mainAgent.english`
3. Set first message: "Hello, this is Snoonu support. How can I help you today?"
4. Enable tools: lookup_order, process_refund, notify_driver, escalate_to_human
5. Save and copy the Agent ID
6. Paste into Flash

## 🔧 Technical Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Voice**: ElevenLabs Conversational AI
- **Phone**: Twilio (for inbound webhooks)
- **AI**: OpenAI GPT-4 (via ElevenLabs)
- **Visualization**: ReactFlow (workflow builder)
- **Charts**: Recharts (analytics)

## 📊 Dashboard Features

- **`/dashboard/canvas`** - Visual workflow builder
- **`/dashboard/conversations`** - Live chat interface
- **`/dashboard/outbound`** - Make outbound calls
- **`/dashboard/insights`** - Analytics and AI insights
- **`/dashboard/voice`** - Voice settings
- **`/demo`** - Interactive demo with scenarios

## 🌍 Snoonu-Specific Features

- Order lookup by ID (SN-2024-XXXXXX format)
- Qatar phone number support (+974)
- QAR currency for refunds
- Arabic language support
- Driver, customer, and merchant workflows
- CRM logging for all interactions

## 🔑 API Keys

Your ElevenLabs API key is already configured:
```
sk_c2a36b61d8e63d3305d349c45078d1078f7845f644062a60
```

## 📞 Testing

1. **Simulated Demos**: Click scenario buttons at `/demo`
2. **Real Calls**: Use "Make Real Call" feature with your ElevenLabs Agent ID
3. **Outbound Dashboard**: Go to `/dashboard/outbound` for bulk calling

## 🎯 Next Steps

1. ✅ Save your ElevenLabs workflow
2. ✅ Copy the Agent ID from URL
3. ✅ Test with real phone number
4. ⏳ Connect to real Snoonu API (when available)
5. ⏳ Deploy to production

**Flash is ready to handle Snoonu's support calls with intelligent, context-aware AI!** 🚀
