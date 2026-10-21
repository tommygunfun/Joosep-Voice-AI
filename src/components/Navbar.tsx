import React from 'react';
import { Phone, PhoneOff, FileText } from 'lucide-react';

interface NavbarProps {
  isCallActive: boolean;
  onToggleCall: () => void;
  onOpenCvModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isCallActive,
  onToggleCall,
  onOpenCvModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-stone-200/70 transition-all">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#top"
          className="font-serif text-2xl font-bold tracking-tight text-stone-900 hover:text-stone-700 transition-colors whitespace-nowrap shrink-0"
        >
          Joosep Balõnski
        </a>

        {/* Zone 2: 4-5 Concise Navigation Links (whitespace-nowrap text links) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <a
            href="#voice-terminal"
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
          >
            Voice Assistant
          </a>
          <a
            href="#leadership"
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
          >
            Military Leadership
          </a>
          <a
            href="#ventures"
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
          >
            Ventures & Experience
          </a>
          <a
            href="#education"
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
          >
            EBS Education
          </a>
          <button
            onClick={onOpenCvModal}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-stone-500" />
            Verified CV
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleCall}
            className={`px-5 py-2.5 text-xs font-semibold tracking-wide rounded-md transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-2 ${
              isCallActive
                ? 'bg-red-700 text-white hover:bg-red-800 shadow-sm'
                : 'bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-sm'
            }`}
          >
            {isCallActive ? (
              <>
                <PhoneOff className="w-3.5 h-3.5" />
                End Call
              </>
            ) : (
              <>
                <Phone className="w-3.5 h-3.5" />
                Call Joosep
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
