import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  MessageSquare,
  Sparkles,
  Volume2,
  Sliders,
  Globe2,
} from 'lucide-react';
import { WaveformVisualizer } from './WaveformVisualizer.tsx';
import { promptChips } from '../data/joosepData.ts';
import { PromptChip } from '../types.ts';

interface VoiceTerminalProps {
  isCallActive: boolean;
  status: 'idle' | 'listening' | 'processing' | 'speaking';
  onStartCall: () => void;
  onEndCall: () => void;
  onSelectPrompt: (prompt: PromptChip) => void;
  onToggleTranscript: () => void;
  transcriptCount: number;
  currentVoice: string;
  onChangeVoice: (voice: string) => void;
  isMicMuted: boolean;
  onToggleMute: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  activeLanguage: 'en' | 'et' | 'auto';
  onSelectLanguage: (lang: 'en' | 'et' | 'auto') => void;
}

export const VoiceTerminal: React.FC<VoiceTerminalProps> = ({
  isCallActive,
  status,
  onStartCall,
  onEndCall,
  onSelectPrompt,
  onToggleTranscript,
  transcriptCount,
  currentVoice,
  onChangeVoice,
  isMicMuted,
  onToggleMute,
  onStartListening,
  onStopListening,
  activeLanguage,
  onSelectLanguage,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <section id="voice-terminal" className="pt-8 pb-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Typographic Hierarchy & Positioning */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-widest text-stone-500">
                Representative Voice Assistant
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 tracking-tight leading-[1.08] text-balance">
                Hello, I am Joosep Balõnski.
              </h1>
              <p className="text-lg text-stone-600 font-normal leading-relaxed max-w-xl">
                EBS entrepreneurship student, military veteran of the Javelin anti-tank unit in Jõhvi, and founder of Baldurax OÜ. Speak with me in English or Estonian to explore my background, leadership philosophy, and upcoming ventures.
              </p>
            </div>

            {/* Language & Voice Mode Indicators (Unboxed Typography) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-stone-600 pt-2 border-t border-stone-200">
              <span className="font-medium text-stone-900">Bilingual Engine:</span>
              <span>English (American accent)</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>Eesti keel (emakeel)</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>Deep Male Timbre ({currentVoice})</span>
            </div>

            {/* Contextual Inquiry Chips */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-stone-700" />
                Featured Conversation Topics
              </div>
              <div className="flex flex-wrap gap-2">
                {promptChips.map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => onSelectPrompt(chip)}
                    className="group text-left px-3.5 py-2 text-xs font-medium text-stone-800 bg-stone-100/90 hover:bg-stone-200/90 active:bg-stone-300 rounded-lg border border-stone-200/60 transition-all duration-150 cursor-pointer"
                  >
                    <span className="text-stone-500 text-[10px] mr-1.5 font-mono uppercase">
                      {chip.category}:
                    </span>
                    <span className="group-hover:text-stone-900">{chip.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Voice Terminal Centerpiece */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-sm transition-all relative overflow-hidden">
              {/* Header inside terminal */}
              <div className="flex items-center justify-between pb-6 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-stone-800" />
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-stone-900 leading-none">
                      Joosep · Live Audio Channel
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">
                      {isCallActive
                        ? 'Connected · Natural Conversational Turn'
                        : 'Standby · Ready to initiate voice call'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                    title="Audio Configuration"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onToggleTranscript}
                    className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Transcript
                    {transcriptCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 font-mono text-[11px] bg-stone-300 text-stone-800 rounded">
                        {transcriptCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Optional Voice Configuration Bar */}
              {showSettings && (
                <div className="my-4 p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-stone-700 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5" />
                      Gemini Voice Timbre:
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onChangeVoice('Fenrir')}
                        className={`px-2.5 py-1 rounded cursor-pointer ${
                          currentVoice === 'Fenrir'
                            ? 'bg-stone-900 text-white font-medium'
                            : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        Fenrir (Deep & Resonant)
                      </button>
                      <button
                        onClick={() => onChangeVoice('Charon')}
                        className={`px-2.5 py-1 rounded cursor-pointer ${
                          currentVoice === 'Charon'
                            ? 'bg-stone-900 text-white font-medium'
                            : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        Charon (Deep & Direct)
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
                    <span className="font-medium text-stone-700 flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5" />
                      Language Routing:
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onSelectLanguage('auto')}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          activeLanguage === 'auto'
                            ? 'bg-stone-900 text-white'
                            : 'bg-white text-stone-700 border border-stone-200'
                        }`}
                      >
                        Auto Detect
                      </button>
                      <button
                        onClick={() => onSelectLanguage('en')}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          activeLanguage === 'en'
                            ? 'bg-stone-900 text-white'
                            : 'bg-white text-stone-700 border border-stone-200'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => onSelectLanguage('et')}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          activeLanguage === 'et'
                            ? 'bg-stone-900 text-white'
                            : 'bg-white text-stone-700 border border-stone-200'
                        }`}
                      >
                        Eesti
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Waveform Resonator */}
              <div className="my-6">
                <WaveformVisualizer status={status} isMuted={isMicMuted} />
              </div>

              {/* Central Audio Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-100">
                <div className="text-xs text-stone-600 text-center sm:text-left">
                  {status === 'speaking' ? (
                    <span className="font-medium text-amber-900">
                      Speaking · Listening for your response
                    </span>
                  ) : status === 'listening' ? (
                    <span className="font-medium text-emerald-800">
                      Listening to your voice · Speak naturally
                    </span>
                  ) : status === 'processing' ? (
                    <span className="text-stone-500">
                      Synthesizing Joosep’s perspective...
                    </span>
                  ) : (
                    <span className="text-stone-500">
                      Press call to speak or select a topic
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Push-to-Talk or Mute */}
                  {isCallActive ? (
                    <>
                      <button
                        onClick={onToggleMute}
                        className={`p-3 rounded-full border transition-all cursor-pointer ${
                          isMicMuted
                            ? 'bg-stone-200 text-stone-600 border-stone-300'
                            : 'bg-stone-100 text-stone-900 border-stone-200 hover:bg-stone-200'
                        }`}
                        title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                      >
                        {isMicMuted ? (
                          <MicOff className="w-5 h-5" />
                        ) : (
                          <Mic className="w-5 h-5" />
                        )}
                      </button>

                      <button
                        onClick={onEndCall}
                        className="px-5 py-3 text-sm font-medium text-white bg-red-700 hover:bg-red-800 rounded-full transition-all shadow-sm cursor-pointer inline-flex items-center gap-2"
                      >
                        <PhoneOff className="w-4 h-4" />
                        End Call
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={onStartCall}
                      className="px-6 py-3.5 text-sm font-semibold tracking-wide text-white bg-stone-900 hover:bg-stone-800 active:bg-black rounded-full transition-all shadow-md cursor-pointer inline-flex items-center gap-2.5"
                    >
                      <Phone className="w-4 h-4" />
                      Start Voice Call
                    </button>
                  )}
                </div>
              </div>

              {/* Sub-instruction bar */}
              <div className="mt-4 text-[11px] text-stone-500 text-center sm:text-left">
                Microphone audio streams directly to Joosep’s speech synthesis engine.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
