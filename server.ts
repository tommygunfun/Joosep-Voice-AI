import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// Shared GenAI client with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const JOOSEP_PERSONA_PROMPT = `
You are Joosep Balõnski speaking directly in the first person ("I", "my", "me"). You are an AI voice persona representing yourself.

Identity & Demeanor:
- Name: Joosep Balõnski (call me Joosep).
- Voice & Tone: Deep, calm, articulate, confident, and professional male presence.
- Accents & Languages: You speak in clear English with an American accent, or in fluent Estonian with a native Estonian accent.
- Automatic Language Switching: Seamlessly identify if the user speaks or writes in Estonian or English. Respond in the exact language used. If spoken to in Estonian, speak in fluent, native-level Estonian. If in English, speak in clear, sophisticated English with an American accent.
- Spoken Cadence: Keep vocal answers concise, engaging, and conversational (typically 2 to 4 sentences per response) so listening feels natural and lively. Avoid robotic formatting, bullet points, asterisks, brackets, or emojis in your text because it will be converted directly into speech.

Complete Verified Background on Joosep Balõnski:
- Core Profile: 22-year-old student, entrepreneur, and military veteran based in Kesklinn, Tallinn, Estonia.
- Contact: Phone +372 55510932, Email: joosep.balonski@gmail.com.
- Personality: Proactive, high initiative, problem-solving mindset, natural leader and communicator, disciplined, determined, team-oriented, never leaves jobs unfinished. Well-traveled with broad cultural exposure.
- Current Education:
  - Estonian Business School (EBS) (2024 - present): Studying Entrepreneurship & Business Administration (Ettevõtlus ja ärijuhtimine). Learning leadership theory and applying it directly into real-world ventures; building deep strategic and commercial understanding.
- Military Service (Kaitseväeteenistus, 2023 - 2024):
  - Served in Jõhvi Jalaväepataljon (Jõhvi Infantry Battalion) in the elite Javelin anti-tank missile unit.
  - Developed hands-on tactical leadership, team cohesion, high-stakes communication, and rapid decision-making in demanding conditions.
- Previous Education:
  - Tallinna Tehnikagümnaasium (2020 - 2023): Real- ja tehnoloogia kallak (Science & Technology focus).
  - Peetri-lasteaed põhikool (2011 - 2020).
  - International experience: Ardingly College (UK, 1 month summer program) and International School of Sofia.
- Professional Experience & Ventures:
  - Founder & Tech Director at Baldurax OÜ (September 2024 - present): Leading business integration of modern AI systems, process automation, and software-driven operational tools.
  - Surf Instructor (June 2021 - September 2021): Teaching wind and water sports, safety protocols, coaching diverse age groups, patience, and student empowerment.
  - Executive Job Shadows (Töövarjupäevad): Shadowed top executives and leadership teams across leading tech and business enterprises: Telia, Green IT (shadowed the CEO / tegevjuht), Ergo, Bolt, Devin Eesti, and Uusmaa.
- Languages:
  - Estonian: Native language (emakeel).
  - English: C2 Proficient (fluent, bilingual capability).
- Skills: Deep AI knowledge, leadership & team management, public speaking & presentation, quick learner, initiative taker.

Roleplay Guidelines:
- You speak directly as Joosep Balõnski with warmth, executive polish, and unwavering accuracy.
- When asked about military service, share the discipline, leadership, and camaraderie gained in Jõhvi with the Javelin system.
- When asked about EBS and entrepreneurship, explain your passion for building scalable tech-enabled businesses like Baldurax OÜ.
- When asked how to get in touch, provide your email (joosep.balonski@gmail.com) and phone (+372 55510932), offering to connect for career, venture, or project discussions.
`;

// 1. Text & Conversational Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], languageHint } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const contents = [
      ...history.map((h: { role: string; text: string }) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
      {
        role: 'user',
        parts: [
          {
            text: `${languageHint ? `[Preferred Language: ${languageHint}] ` : ''}${message}`,
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: JOOSEP_PERSONA_PROMPT,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "Hello, I'm Joosep Balõnski. How can I help you today?";
    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: 'Failed to process chat response.',
      details: error?.message || String(error),
    });
  }
});

// 2. High-fidelity Speech Synthesis Endpoint (TTS)
app.post('/api/voice/speak', async (req, res) => {
  try {
    const { text, voiceName = 'Fenrir' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for speech synthesis.' });
    }

    // Clean markdown symbols to make speech fluid
    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: 'Deep, calm, resonant, confident male executive delivery with articulate pacing',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Fenrir' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio generated by Gemini TTS model.' });
    }

    return res.json({
      audio: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('Error in /api/voice/speak:', error);
    return res.status(500).json({
      error: 'Speech generation failed.',
      details: error?.message || String(error),
    });
  }
});

// 3. Audio Transcription (STT) for recorded mic input
app.post('/api/voice/transcribe', async (req, res) => {
  try {
    const { audioData, mimeType = 'audio/webm' } = req.body;
    if (!audioData) {
      return res.status(400).json({ error: 'Audio data is required.' });
    }

    const audioPart = {
      inlineData: {
        mimeType: mimeType,
        data: audioData,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          {
            text: 'Transcribe this spoken speech accurately. If the speech is in Estonian, transcribe in Estonian. If in English, transcribe in English. Output only the verbatim transcript with no meta commentary.',
          },
        ],
      },
    });

    const transcript = response.text ? response.text.trim() : '';
    return res.json({ transcript });
  } catch (error: any) {
    console.error('Error in /api/voice/transcribe:', error);
    return res.status(500).json({
      error: 'Transcription failed.',
      details: error?.message || String(error),
    });
  }
});

// 4. WebSocket Server for real-time live interaction
const wss = new WebSocketServer({ server, path: '/live' });

wss.on('connection', (clientWs: WebSocket) => {
  console.log('Client connected to Live Voice WebSocket');
  let liveSession: any = null;

  const initLive = async () => {
    try {
      liveSession = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } },
          },
          systemInstruction: JOOSEP_PERSONA_PROMPT,
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ audio: audioData }));
            }
            if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
          onclose: () => {
            console.log('Live session closed');
          },
          onerror: (err) => {
            console.error('Live session error:', err);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ error: err?.message || 'Live session error' }));
            }
          },
        },
      });
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ status: 'connected' }));
      }
    } catch (err: any) {
      console.error('Failed to connect to Gemini Live:', err);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ error: 'Live API unavailable, using standard speech mode' }));
      }
    }
  };

  initLive();

  clientWs.on('message', async (data: Buffer | string) => {
    try {
      const parsed = JSON.parse(data.toString());
      if (parsed.audio && liveSession) {
        liveSession.sendRealtimeInput({
          audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
        });
      }
    } catch (err) {
      console.error('Error handling WS message:', err);
    }
  });

  clientWs.on('close', () => {
    if (liveSession) {
      try {
        liveSession.close();
      } catch (e) {
        // ignore
      }
    }
  });
});

// Setup Vite or static serving
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(port, () => {
    console.log(`Joosep Voice Assistant Server running on http://localhost:${port}`);
  });
}

startServer();
