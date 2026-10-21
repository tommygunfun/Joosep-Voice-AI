import React from 'react';
import {
  Shield,
  Briefcase,
  GraduationCap,
  FileDown,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { joosepCV } from '../data/joosepData.ts';

interface ExecutiveDossierProps {
  onOpenCvModal: () => void;
  onAskAboutTopic: (query: string) => void;
}

export const ExecutiveDossier: React.FC<ExecutiveDossierProps> = ({
  onOpenCvModal,
  onAskAboutTopic,
}) => {
  return (
    <div className="space-y-24 py-16 border-t border-stone-200/80">
      {/* 1. Military Leadership Section */}
      <section id="leadership" className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-stone-500">
              01. Military Leadership
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 tracking-tight">
              Kaitsevägi & Javelin Unit
            </h2>
            <div className="text-xs text-stone-500 font-mono">
              2023 – 2024 · Jõhvi Jalaväepataljon
            </div>
            <p className="text-sm text-stone-600 leading-relaxed pt-2">
              Served in the elite Javelin anti-tank missile unit in northeastern Estonia. Practical command experience, high-pressure communication, and fast decisive execution under demanding physical and tactical conditions.
            </p>
            <div className="pt-2">
              <button
                onClick={() =>
                  onAskAboutTopic(
                    'What core leadership principles did you carry over from the Javelin unit into entrepreneurship?'
                  )
                }
                className="text-xs font-medium text-stone-900 hover:text-stone-700 underline underline-offset-4 cursor-pointer"
              >
                Ask Joosep about this experience →
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200/80 p-8 shadow-xs">
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-stone-700" />
              Tactical & Operational Takeaways
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {joosepCV.military.takeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                  <p className="text-sm text-stone-700 leading-relaxed">
                    {takeaway}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Ventures & Experience Section */}
      <section id="ventures" className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-stone-500">
              02. Ventures & Enterprise
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 tracking-tight">
              Baldurax & Executive Shadows
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Applying modern AI workflows to business problem-solving, coupled with first-hand insights from shadowing chief executives at top Baltic tech firms.
            </p>
            <div className="pt-2">
              <button
                onClick={() =>
                  onAskAboutTopic(
                    'Tell me about your tech ventures at Baldurax OÜ and what you learned shadowing at Bolt and Green IT.'
                  )
                }
                className="text-xs font-medium text-stone-900 hover:text-stone-700 underline underline-offset-4 cursor-pointer"
              >
                Ask Joosep about Baldurax →
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {joosepCV.experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
                    <span>{exp.period}</span>
                    <Briefcase className="w-4 h-4 text-stone-400" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    {exp.role}
                  </h3>
                  <div className="text-xs font-medium text-stone-600">
                    {exp.company}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Executive Job Shadowing Strip */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200/80 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-stone-500">
                  Executive Job Shadows (Töövarjupäevad)
                </h4>
                <span className="text-xs text-stone-500">
                  Direct CEO & Executive Observation
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-stone-800">
                {joosepCV.shadowDays.map((org, i) => (
                  <React.Fragment key={org}>
                    <span className="font-medium">{org}</span>
                    {i < joosepCV.shadowDays.length - 1 && (
                      <span aria-hidden="true" className="text-stone-300">
                        ·
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EBS & Education Section */}
      <section id="education" className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-stone-500">
              03. Academic Foundations
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 tracking-tight">
              EBS & International Studies
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Studying Entrepreneurship & Business Administration at Estonian Business School (EBS), merging leadership theory with practical venture building.
            </p>
            <div className="pt-2">
              <button
                onClick={() =>
                  onAskAboutTopic(
                    'What subjects and projects are you most passionate about at Estonian Business School?'
                  )
                }
                className="text-xs font-medium text-stone-900 hover:text-stone-700 underline underline-offset-4 cursor-pointer"
              >
                Ask Joosep about EBS studies →
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200/80 p-8 shadow-xs space-y-8">
            <div className="flex items-start gap-4">
              <GraduationCap className="w-6 h-6 text-stone-800 shrink-0 mt-1" />
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Estonian Business School (EBS)
                  </h3>
                  <span className="text-xs font-mono text-stone-500">
                    2024 – Present
                  </span>
                </div>
                <div className="text-sm font-medium text-stone-700">
                  Ettevõtlus ja ärijuhtimine (Entrepreneurship & Business Administration)
                </div>
                <ul className="space-y-2 text-xs text-stone-600 pt-2">
                  {joosepCV.education[0].details.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-stone-400 font-bold">―</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-stone-100 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-stone-600">
              <div>
                <span className="font-mono uppercase text-stone-500 block mb-1">
                  Secondary Education
                </span>
                <span className="font-medium text-stone-900 block text-sm">
                  Tallinna Tehnikagümnaasium
                </span>
                <span className="text-stone-500">2020 – 2023 · Reaal ja tehnoloogia kallak</span>
              </div>
              <div>
                <span className="font-mono uppercase text-stone-500 block mb-1">
                  Global Exposure
                </span>
                <span className="font-medium text-stone-900 block text-sm">
                  Ardingly College (UK) & Sofia
                </span>
                <span className="text-stone-500">International language and cultural exchange</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Verified CV & Direct Contact Dossier */}
      <section id="contact" className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs font-mono uppercase tracking-widest text-stone-400">
                04. Direct Contact & Verification
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
                Connect Directly with Joosep Balõnski.
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-lg">
                Available for entrepreneurial ventures, high-impact leadership roles, and collaborative projects. Inspect the complete verified CV document or get in touch directly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <a
                  href={`mailto:${joosepCV.email}`}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-800/80 hover:bg-stone-800 transition-colors border border-stone-700/60"
                >
                  <Mail className="w-4 h-4 text-stone-300 shrink-0" />
                  <span className="truncate">{joosepCV.email}</span>
                </a>
                <a
                  href={`tel:${joosepCV.phone}`}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-800/80 hover:bg-stone-800 transition-colors border border-stone-700/60"
                >
                  <Phone className="w-4 h-4 text-stone-300 shrink-0" />
                  <span>{joosepCV.phone}</span>
                </a>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-800/80 border border-stone-700/60">
                  <MapPin className="w-4 h-4 text-stone-300 shrink-0" />
                  <span>{joosepCV.location}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center space-y-4">
              <div className="bg-stone-800/70 border border-stone-700 p-6 rounded-2xl w-full max-w-sm space-y-4">
                <div className="text-xs font-mono uppercase text-stone-400">
                  Official Attachment
                </div>
                <div className="font-serif text-lg font-bold text-white">
                  Curriculum Vitae v2
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Verified document including military recommendation takeaways, EBS matriculation, and venture leadership history.
                </p>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={onOpenCvModal}
                    className="w-full py-2.5 px-4 text-xs font-medium text-stone-900 bg-white hover:bg-stone-100 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Inspect CV in Modal
                  </button>
                  <a
                    href={joosepCV.pdfUrl}
                    download="Joosep_Balonski_CV.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-4 text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-700/50 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    Download Original PDF
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-12 border-t border-stone-200 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-serif text-sm font-semibold text-stone-800">
          Joosep Balõnski · 2026
        </div>
        <div className="flex items-center gap-4 text-stone-500">
          <span>Tallinn, Estonia</span>
          <span>·</span>
          <span>EBS Entrepreneurship</span>
          <span>·</span>
          <span>AI Voice Assistant Joosep</span>
        </div>
      </footer>
    </div>
  );
};
