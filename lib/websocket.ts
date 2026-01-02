import { WebSocketServer } from 'ws';
import { Server } from 'http';

let wss: WebSocketServer | null = null;

export function initializeWebSocket(server: Server) {
  if (wss) return wss;

  wss = new WebSocketServer({ 
    server,
    path: '/api/voice/stream'
  });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection for voice streaming');

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.event === 'start') {
          console.log('Stream started:', data.start);
        }

        if (data.event === 'media') {
          // Process audio chunks here
          // This is where you'd send to Google Speech-to-Text or similar
          const audioChunk = Buffer.from(data.media.payload, 'base64');
          
          // TODO: Process with speech recognition
          // const transcript = await processAudio(audioChunk);
        }

        if (data.event === 'stop') {
          console.log('Stream stopped');
        }

      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return wss;
}


















