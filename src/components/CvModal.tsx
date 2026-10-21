import React, { useEffect } from 'react';
import { X, FileDown, ExternalLink } from 'lucide-react';
import { joosepCV } from '../data/joosepData.ts';

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CvModal: React.FC<CvModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[90vh] bg-white rounded-2xl border border-stone-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900 leading-none">
              Curriculum Vitae · Joosep Balõnski
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Verified Attachment Document (EBS, Kaitsevägi Javelin, Baldurax OÜ)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={joosepCV.pdfUrl}
              download="Joosep_Balonski_CV.pdf"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              Download PDF
            </a>
            <a
              href={joosepCV.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open New Tab
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded PDF iframe */}
        <div className="flex-1 bg-stone-100 w-full h-full relative">
          <iframe
            src={`${joosepCV.pdfUrl}#toolbar=0&navpanes=0`}
            className="w-full h-full border-none"
            title="Joosep Balõnski Curriculum Vitae"
          />
        </div>
      </div>
    </div>
  );
};
