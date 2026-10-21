import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { VoiceTerminal } from './components/VoiceTerminal.tsx';
import { TranscriptDrawer } from './components/TranscriptDrawer.tsx';
import { ExecutiveDossier } from './components/ExecutiveDossier.tsx';
import { CvModal } from './components/CvModal.tsx';
import { Message, PromptChip } from './types.ts';
import {
  sendChatTurn,
  synthesizeVoice,
  playWavBase64,
  stopCurrentPlayback,
  transcribeAudio,
  getAudioContext,
} from './services/voiceService.ts';

export default function App() {
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-0',
      role: 'assistant',
      content:
        "Hello, I am Joosep Balõnski. I'm currently studying Entrepreneurship & Business Administration at EBS, having previously served in the Estonian Defence Forces in the Javelin anti-tank unit. How can I assist you today? You can speak with me in English or Estonian.",
      timestamp: 'Just now',
    },
  ]);
  const [currentVoice, setCurrentVoice] = useState<string>('Fenrir');
  const [activeLanguage, setActiveLanguage] = useState<'auto' | 'en' | 'et'>('auto');
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState<boolean>(false);
  const [isCvModalOpen, setIsCvModalOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // References for audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const isCallActiveRef = useRef(isCallActive);
  isCallActiveRef.current = isCallActive;

  // Process a conversational query through Joosep's AI persona and speak back
  const processQuery = useCallback(
    async (queryText: string) => {
      if (!queryText.trim() || isProcessing) return;

      setIsProcessing(true);
      setStatus('processing');

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Add user message
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: queryText,
        timestamp: timeStr,
      };

      setMessages((prev) => [...prev, userMsg]);

      try {
        // 1. Get LLM response
        const historySnapshot = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));
        historySnapshot.push({ role: 'user', content: queryText });

        const replyText = await sendChatTurn(
          queryText,
          historySnapshot,
          activeLanguage
        );

        // 2. Synthesize deep male voice
        let audioBase64: string | undefined;
        try {
          audioBase64 = await synthesizeVoice(replyText, currentVoice);
        } catch (synthErr) {
          console.warn('Gemini TTS synthesis failed, will display text only:', synthErr);
        }

        const assistantMsg: Message = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          audioBase64,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setIsProcessing(false);

        // 3. Play audio if generated
        if (audioBase64) {
          setStatus('speaking');
          await playWavBase64(audioBase64, () => {
            if (isCallActiveRef.current) {
              setStatus('listening');
            } else {
              setStatus('idle');
            }
          });
        } else {
          setStatus(isCallActiveRef.current ? 'listening' : 'idle');
        }
      } catch (err: any) {
        console.error('Error during query processing:', err);
        const errorMsg: Message = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content:
            "I apologize, but I encountered a momentary connection interruption. Please try speaking again or click any featured topic.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
        setIsProcessing(false);
        setStatus(isCallActiveRef.current ? 'listening' : 'idle');
      }
    },
    [messages, activeLanguage, currentVoice, isProcessing]
  );

  // Setup Browser Speech Recognition if supported for immediate speech-to-text
  useEffect(() => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang =
        activeLanguage === 'et'
          ? 'et-EE'
          : activeLanguage === 'en'
          ? 'en-US'
          : 'en-US';

      recognition.onresult = (event: any) => {
        const lastIndex = event.results.length - 1;
        const transcript = event.results[lastIndex][0].transcript.trim();
        if (transcript && isCallActiveRef.current && status !== 'speaking' && !isProcessing) {
          processQuery(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.log('Speech recognition event:', event.error);
      };

      recognitionRef.current = recognition;
    }
  }, [activeLanguage, processQuery, status, isProcessing]);

  // Start Call Handler
  const handleStartCall = async () => {
    // Resume audio context on user gesture
    getAudioContext();
    setIsCallActive(true);
    setStatus('listening');

    // If initial welcome hasn't been vocalized, synthesize and greet
    if (messages.length === 1 && !messages[0].audioBase64) {
      setStatus('speaking');
      try {
        const welcomeAudio = await synthesizeVoice(messages[0].content, currentVoice);
        setMessages((prev) => [
          {
            ...prev[0],
            audioBase64: welcomeAudio,
          },
        ]);
        await playWavBase64(welcomeAudio, () => {
          if (isCallActiveRef.current) {
            setStatus('listening');
            startMicCapture();
          }
        });
        return;
      } catch (e) {
        console.warn('Welcome audio synthesis skipped:', e);
      }
    }

    startMicCapture();
  };

  const startMicCapture = async () => {
    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          // already started
        }
      } else {
        // Fallback to MediaRecorder
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          if (audioBlob.size > 2000 && isCallActiveRef.current) {
            try {
              const transcribed = await transcribeAudio(audioBlob);
              if (transcribed) {
                processQuery(transcribed);
              }
            } catch (err) {
              console.error('Transcription error:', err);
            }
          }
        };

        mediaRecorder.start(3000);
      }
    } catch (err) {
      console.warn('Microphone permission not granted or device unavailable:', err);
    }
  };

  // End Call Handler
  const handleEndCall = () => {
    setIsCallActive(false);
    setStatus('idle');
    stopCurrentPlayback();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      } catch {
        // ignore
      }
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    setIsMicMuted((prev) => !prev);
    if (!isMicMuted) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    } else {
      if (recognitionRef.current && isCallActive) {
        try {
          recognitionRef.current.start();
        } catch {
          // ignore
        }
      }
    }
  };

  // Prompt Chip selection
  const handleSelectPrompt = (chip: PromptChip) => {
    // If not in a call, start call to respond with voice
    if (!isCallActive) {
      setIsCallActive(true);
    }
    processQuery(chip.query);
  };

  // Replay audio from transcript
  const handleReplayAudio = async (msg: Message) => {
    if (msg.audioBase64) {
      setStatus('speaking');
      await playWavBase64(msg.audioBase64, () => {
        setStatus(isCallActiveRef.current ? 'listening' : 'idle');
      });
    } else {
      try {
        setStatus('processing');
        const audio = await synthesizeVoice(msg.content, currentVoice);
        msg.audioBase64 = audio;
        setStatus('speaking');
        await playWavBase64(audio, () => {
          setStatus(isCallActiveRef.current ? 'listening' : 'idle');
        });
      } catch (err) {
        console.error('Failed to replay voice:', err);
        setStatus(isCallActiveRef.current ? 'listening' : 'idle');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 selection:bg-stone-200">
      {/* 3-Zone Top Navigation */}
      <Navbar
        isCallActive={isCallActive}
        onToggleCall={() => (isCallActive ? handleEndCall() : handleStartCall())}
        onOpenCvModal={() => setIsCvModalOpen(true)}
      />

      {/* Main Content Area */}
      <main id="top">
        {/* Voice Terminal Hero Centerpiece */}
        <VoiceTerminal
          isCallActive={isCallActive}
          status={status}
          onStartCall={handleStartCall}
          onEndCall={handleEndCall}
          onSelectPrompt={handleSelectPrompt}
          onToggleTranscript={() => setIsTranscriptOpen(true)}
          transcriptCount={messages.length}
          currentVoice={currentVoice}
          onChangeVoice={setCurrentVoice}
          isMicMuted={isMicMuted}
          onToggleMute={handleToggleMute}
          onStartListening={startMicCapture}
          onStopListening={() => {}}
          activeLanguage={activeLanguage}
          onSelectLanguage={setActiveLanguage}
        />

        {/* Detailed Executive Dossier Sections */}
        <ExecutiveDossier
          onOpenCvModal={() => setIsCvModalOpen(true)}
          onAskAboutTopic={(topic) => {
            if (!isCallActive) setIsCallActive(true);
            processQuery(topic);
          }}
        />
      </main>

      {/* Expandable Real-Time Transcript Drawer */}
      <TranscriptDrawer
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
        messages={messages}
        onSendMessage={(txt) => {
          if (!isCallActive) setIsCallActive(true);
          processQuery(txt);
        }}
        onReplayAudio={handleReplayAudio}
        isProcessing={isProcessing}
      />

      {/* Verified CV PDF Modal */}
      <CvModal
        isOpen={isCvModalOpen}
        onClose={() => setIsCvModalOpen(false)}
      />
    </div>
  );
}
