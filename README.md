# Flash AI IVR System

A fully functional AI-powered Interactive Voice Response (IVR) system built with Next.js, Twilio, and OpenAI.

## Features

- **Real Phone Call Handling**: Accept and process actual phone calls via Twilio
- **AI-Powered Conversations**: Uses OpenAI GPT-4 for intelligent responses
- **Speech Recognition**: Converts caller speech to text in real-time
- **Text-to-Speech**: Responds to callers with natural-sounding voice
- **Call Analytics**: Track and analyze all conversations
- **Visual Workflow Builder**: Design call flows with drag-and-drop interface
- **Real-time Monitoring**: See active calls and transcripts live

## Setup

### Prerequisites

1. **Twilio Account**: Sign up at [twilio.com](https://www.twilio.com/try-twilio)
   - Get a phone number
   - Note your Account SID and Auth Token

2. **OpenAI API Key**: Get one at [platform.openai.com](https://platform.openai.com/api-keys)

### Installation

```bash
npm install
```

### Configuration

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Fill in your credentials in `.env.local`

3. Configure Twilio webhook:
   - In Twilio Console, go to your phone number settings
   - Set "A Call Comes In" webhook to: `https://your-domain.com/api/voice/incoming`
   - Method: HTTP POST

### Running

```bash
npm run dev
```

Visit `http://localhost:5555/setup` to configure your system.

## How It Works

1. **Incoming Call**: Twilio receives a call and sends webhook to `/api/voice/incoming`
2. **Speech Recognition**: Caller's speech is converted to text
3. **AI Processing**: Text is sent to OpenAI GPT-4 for intelligent response
4. **Text-to-Speech**: AI response is converted back to speech
5. **Response**: Caller hears the AI's response
6. **Loop**: Process continues until call ends

## API Endpoints

- `POST /api/voice/incoming` - Handles incoming calls
- `POST /api/voice/process` - Processes speech and generates AI responses
- `WS /api/voice/stream` - WebSocket for real-time audio streaming
- `POST /api/setup/test` - Tests API credentials

## Tech Stack

- **Next.js 16** - React framework
- **Twilio** - Phone system and voice API
- **OpenAI GPT-4** - AI conversation engine
- **TypeScript** - Type-safe development
- **WebSockets** - Real-time audio streaming

## License

MIT
