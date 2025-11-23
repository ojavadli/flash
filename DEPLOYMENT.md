# Flash AI - Complete Setup Guide

## 🎯 Your Deployment

**Railway URL**: https://flash-production-3b0c.up.railway.app
**Demo**: https://flash-production-3b0c.up.railway.app/demo
**Agent ID**: agent_4401kant80mjf05rz880hfjk4rmp

## 📞 How to Enable Real Phone Calls

### Option 1: Using Twilio (Recommended for Production)

**Step 1: Get Twilio Account**
1. Sign up at https://www.twilio.com/try-twilio
2. Get a phone number (free trial gives you one)
3. Note your Account SID and Auth Token

**Step 2: Configure Twilio Webhook**
1. In Twilio Console, go to Phone Numbers → Manage → Active Numbers
2. Click your phone number
3. Under "Voice Configuration":
   - **A Call Comes In**: Webhook
   - **URL**: `https://flash-production-3b0c.up.railway.app/api/twilio/incoming`
   - **Method**: HTTP POST
4. Save

**Step 3: Test**
- Call your Twilio number
- Flash AI agent will answer with ElevenLabs voice!

### Option 2: Using ElevenLabs Widget (Web-Based)

**For web-based testing without phone:**
1. In ElevenLabs dashboard, go to "Widget" tab
2. Get the embed code
3. Test the agent directly in browser

## 🔧 ElevenLabs Tools Configuration

You've already added `lookup_order` tool. Now add these:

### Tool 2: process_refund
- **Name**: `process_refund`
- **URL**: `https://flash-production-3b0c.up.railway.app/api/snoonu/process-refund`
- **Method**: POST
- **Properties**:
  - `order_number` (String, Required)
  - `amount` (Number, Required)
  - `reason` (String, Optional)

### Tool 3: notify_driver (Optional)
- **Name**: `notify_driver`
- **URL**: `https://flash-production-3b0c.up.railway.app/api/snoonu/notify-driver`
- **Method**: POST
- **Properties**:
  - `driver_phone` (String, Required)
  - `message` (String, Required)

## ✅ What Works Right Now

1. **Live Demo**: https://flash-production-3b0c.up.railway.app/demo
   - Click scenario buttons to see AI in action
   - See order lookup, refunds, and actions in real-time

2. **Webhook Tools**: Your ElevenLabs agent can now call Flash APIs to:
   - Look up Snoonu orders
   - Process refunds
   - Get customer/driver details

3. **Ready for Twilio**: Once you add a Twilio number, real phone calls will work!

## 🚀 Next Steps

1. ✅ Add remaining tools in ElevenLabs (process_refund)
2. ✅ Save your agent
3. ⏳ Get Twilio number (optional - for real phone calls)
4. ⏳ Configure Twilio webhook to Flash
5. ⏳ Test by calling the Twilio number

**Your Flash AI IVR is deployed and ready!** 🎉


