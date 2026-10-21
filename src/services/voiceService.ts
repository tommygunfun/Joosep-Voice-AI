// Audio and Speech Service for Alex (Joosep Balõnski Voice Representative)

let audioContext: AudioContext | null = null;
let analyserNode: AnalyserNode | null = null;
let currentSource: AudioBufferSourceNode | null = null;

export function getAudioContext(): AudioContext {
  if (!audioContext || audioContext.state === 'closed') {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioCtxClass();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

export function getAnalyserNode(): AnalyserNode {
  const ctx = getAudioContext();
  if (!analyserNode) {
    analyserNode = ctx.createAnalyser();
    analyserNode.fftSize = 256;
    analyserNode.smoothingTimeConstant = 0.85;
  }
  return analyserNode;
}

export function stopCurrentPlayback() {
  if (currentSource) {
    try {
      currentSource.stop();
      currentSource.disconnect();
    } catch {
      // ignore
    }
    currentSource = null;
  }
}

export async function playWavBase64(base64Wav: string, onEnded?: () => void): Promise<void> {
  stopCurrentPlayback();
  const ctx = getAudioContext();
  const analyser = getAnalyserNode();

  // Decode base64 to Uint8Array
  const binaryString = atob(base64Wav);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Decode audio data to AudioBuffer
  const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));

  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(analyser);
  analyser.connect(ctx.destination);

  currentSource = source;

  return new Promise((resolve) => {
    source.onended = () => {
      currentSource = null;
      if (onEnded) onEnded();
      resolve();
    };
    source.start(0);
  });
}

// Convert Float32Array to 16-bit PCM ArrayBuffer
export function floatTo16BitPCM(input: Float32Array): ArrayBuffer {
  const output = new DataView(new ArrayBuffer(input.length * 2));
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return output.buffer;
}

// Synthesize text with Gemini 3.8 Flash Lite TTS
export async function synthesizeVoice(text: string, voiceName: string = 'Fenrir'): Promise<string> {
  const response = await fetch('/api/voice/speak', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voiceName }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Speech synthesis failed');
  }

  const data = await response.json();
  return data.audio;
}

// Send conversational turn to Gemini 3.8 Flash
export async function sendChatTurn(
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  languageHint?: 'en' | 'et' | 'auto'
): Promise<string> {
  const formattedHistory = history.map((item) => ({
    role: item.role === 'assistant' ? 'model' : 'user',
    text: item.content,
  }));

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history: formattedHistory,
      languageHint: languageHint === 'auto' ? undefined : languageHint,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate assistant response');
  }

  const data = await response.json();
  return data.reply;
}

// Transcribe microphone audio recording with Gemini 3.5 Transcribe
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const arrayBuffer = await audioBlob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64Audio = btoa(binary);

  const response = await fetch('/api/voice/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      audioData: base64Audio,
      mimeType: audioBlob.type || 'audio/webm',
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Speech transcription failed');
  }

  const data = await response.json();
  return data.transcript;
}
