import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Volume2, Copy, Check, MessageSquare } from 'lucide-react';
import { Message } from '../types.ts';

interface TranscriptDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onReplayAudio: (message: Message) => void;
  isProcessing: boolean;
}

export const TranscriptDrawer: React.FC<TranscriptDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  onReplayAudio,
  isProcessing,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-xl h-full bg-[#FBF9F5] border-l border-stone-200 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-stone-200/80 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4 text-stone-700" />
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900 leading-none">
                Conversation Transcript
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Real-time bilingual stream with audio replay
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close transcript"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-stone-500 space-y-2">
              <MessageSquare className="w-8 h-8 text-stone-400 stroke-1" />
              <p className="text-sm font-medium text-stone-700">No dialogue yet</p>
              <p className="text-xs max-w-xs text-stone-500">
                Start a voice call or submit a prompt below to see your conversation transcribed in real time.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5 text-[11px] text-stone-500 font-mono">
                  <span>{msg.role === 'user' ? 'You' : 'Joosep Balõnski'}</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-stone-900 text-white rounded-br-xs'
                      : 'bg-white text-stone-900 border border-stone-200/70 shadow-xs rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Actions for assistant messages */}
                  {msg.role === 'assistant' && (
                    <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <button
                        onClick={() => onReplayAudio(msg)}
                        className="inline-flex items-center gap-1 hover:text-stone-900 transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        Listen Again
                      </button>

                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="inline-flex items-center gap-1 hover:text-stone-900 transition-colors cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {isProcessing && (
            <div className="flex items-center gap-2 text-xs text-stone-500 italic p-2">
              <div className="w-2 h-2 rounded-full bg-stone-400 animate-ping" />
              Joosep is formulating a vocal response...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar for Text Mode */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-stone-200/80 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a question in English or Estonian..."
            className="flex-1 px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-stone-400 focus:bg-white transition-all"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className="p-2.5 bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
