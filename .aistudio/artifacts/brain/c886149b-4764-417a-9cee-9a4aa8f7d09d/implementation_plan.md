# Joosep — Voice Assistant Representing Joosep Balõnski

A minimalist, sophisticated web application and voice assistant named **Joosep** representing **Joosep Balõnski**—Estonian Business School (EBS) entrepreneurship student, Estonian Defence Forces veteran (Jõhvi Infantry Battalion, Javelin operator & leader), and founder of Baldurax OÜ. Joosep converses in both English and Estonian with a deep male timbre, automatically detecting language and articulating his authentic journey, skills, and vision directly.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following design decisions are incorporated:

- **Confirmed Assistant Name**: Updated from Alex to **Joosep**—speaking authentically as Joosep Balõnski in the first person.
- **Confirmed Layout & Presentation**: Real-time interactive voice call interface complete with a live organic audio waveform visualizer and an expandable transcript toggle.
- **Confirmed Language Switching**: Automatic language detection based on speech or text input (effortlessly switching between English with an American accent and Estonian with a native Estonian accent).
- **Confirmed Conversation Starters**: Prominent contextual inquiry chips highlighting Military Leadership (Jõhvi & Javelin), EBS Entrepreneurship & Business Administration, AI Expertise & Ventures (Baldurax OÜ), and Contact & Collaboration.

---

## 1. Overview & Core Concept

- **What It Does**: Visitors can initiate a natural voice call with Joosep to ask anything about his background, education, military leadership experience, technical skills, and entrepreneurial projects. The assistant speaks back with low-latency audio in a deep male voice (Fenrir/Charon), displays live voice wave dynamics, transcribes conversations in real time, and allows users to browse or preview Joosep's verified CV.
- **Target Audience / Persona**: Recruiters, venture partners, academic colleagues, and prospective collaborators seeking an immediate, personal, and authentic introduction to Joosep Balõnski.
- **Voice Persona Details**:
  - **Name**: Joosep (Joosep Balõnski)
  - **Identity**: Speaking directly as Joosep Balõnski (22-year-old student at EBS, military veteran, founder, and aspiring entrepreneur).
  - **Vocal Quality**: Deep, resonant, calm, confident male tone.
  - **Accents**: Natural American accent in English; native Estonian cadence and accent in Estonian.
  - **Tone & Demeanor**: Articulate, humble yet proactive, solution-oriented, driven by leadership and teamwork principles cultivated during military service and business school.

---

## 2. User Experience & Visual Design

Following the **Universal Frontend Design Constitution** and **Portfolio & Editorial Guidelines**:

- **Visual Identity & Atmosphere**:
  - *Color Palette (60-30-10 Rule)*:
    - 60% Canvas: Warm editorial cream paper (`#FBF9F5` / `#F7F4EE`) providing an intimate, tactile, gallery-like reading ambiance.
    - 30% Structural Surfaces: Off-white tinted cards (`#FFFFFF` with warm undertone), delicate hairline borders (`rgba(30, 25, 20, 0.08)`), deep charcoal typography (`#1C1917` / stone-900), and muted editorial gray (`#78716C` / stone-500).
    - 10% Accent: Refined warm bronze/amber accent (`#9A6B3A` / `#78350F`) for active call pulses, focus states, and primary actions.
  - *Typography*:
    - Display Headings: Sophisticated editorial serif (`Playfair Display` or `Cormorant Garamond`) with balanced proportions and tight tracking.
    - Body Copy & Controls: Highly legible modern geometric sans (`Plus Jakarta Sans`) at 15–16px.
    - Data & Metrics: Monospace tabular numerals (`font-mono tabular-nums`).
  - *Zero-Pill Discipline*: All metadata (dates, locations, categories) rendered as unboxed typography separated by `·` or `/`, strictly eradicating generic pill badges.
  - *Top Bar Contract*: 3 clean zones (`Joosep Balõnski` display wordmark — Nav links `[About, Experience, Military, Education, Contact]` — 1 Primary action `[Start Voice Call]`).
- **Key User Flows**:
  1. **Hero Stage**: Visitors land on a balanced split-screen presentation. Left column: Joosep's executive positioning, key themes, and quick-prompt inquiry chips. Right column: The voice terminal centerpiece featuring an animated deep-gold soundwave resonator, call status, mic toggle, and live speaker visualization.
  2. **Active Voice Call**: Clicking the call trigger activates real-time mic streaming or one-tap audio Q&A. The waveform reacts dynamically to user speech and assistant playback. Transcripts stream live into the conversation pane.
  3. **Contextual Inquiries**: Clicking any contextual chip (e.g., *"Tell me about your time in the Javelin anti-tank unit"* or *"Mis on Baldurax OÜ ja sinu AI taust?"*) instantly directs Joosep to answer with vocal narration.
  4. **Executive Dossier / CV Access**: An elegant slide-out sheet or inline section allows visitors to inspect Joosep's full CV (`/public/assets/aistudio/CV_-_Joosep_Bal_nski_v2_216d03d4.pdf`), verified timeline, work shadows (Telia, Bolt, Green IT, Ergo), and direct contact information.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Audio Streaming & Voice Generation Architecture**:
  - *Chosen Approach*: Server-side Gemini speech synthesis (`gemini-3.8-flash-lite-tts` with prebuilt deep voice `Fenrir`, plus fallback to `Charon` and Gemini Live API `gemini-3.8-live` WebSocket bridge). The frontend streams audio chunks through the Web Audio API with zero-jitter scheduling.
  - *Why*: Provides crystal-clear audio quality in both English and Estonian without relying on robotic browser Web Speech synthesis, preserving the requested deep male acoustic profile.
  - *Alternatives Considered*: Pure browser `window.speechSynthesis` was rejected because Estonian speech synthesis in standard browser engines is robotic and lacks the requested deep male tone.
- **Decision 2: Seamless Dual-Modal Interface (Voice + Text Transcript)**:
  - *Chosen Approach*: First-class voice interaction paired with a collapsible real-time transcript drawer and text input fallback.
  - *Why*: Accommodates users who prefer listening, users in quiet environments (offices/libraries) who prefer reading or typing, and guarantees accessibility compliance.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Vite React SPA)                       │
│                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │ Top Navigation        │  │ Audio Engine (Web Audio API)          │  │
│  │ 3-Zone Contract       │  │ • 16kHz Mic capture (PCM/Base64)      │  │
│  └───────────────────────┘  │ • 24kHz Unary & Stream Playback Queue │  │
│                             │ • Real-time Web Audio AnalyserNode    │  │
│  ┌───────────────────────┐  └───────────────────────────────────────┘  │
│  │ Voice Terminal Center │                                             │
│  │ • Resonant Waveform   │  ┌───────────────────────────────────────┐  │
│  │ • Call Controls & Mics│  │ Conversation & Transcript Drawer      │  │
│  │ • Contextual Chips    │  │ • Live bilingual transcript stream    │  │
│  └───────────────────────┘  │ • Text input alternative & copy       │  │
│                             └───────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Joosep Balõnski Executive Dossier & Verified CV Reader           │  │
│  │ • Kaitsevägi / Jõhvi Jalaväepataljon • EBS • Baldurax OÜ • Shadow│  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ HTTPS / WebSocket (/api/*)
┌────────────────────────────────────▼───────────────────────────────────┐
│                      EXPRESS SERVER (server.ts)                        │
│                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │ /api/chat             │  │ /api/voice/speak                      │  │
│  │ Gemini 3.8 Flash with │  │ Gemini 3.8 Flash Lite TTS             │  │
│  │ Joosep CV Persona &   │  │ Voice: 'Fenrir' (Deep Male Tone)      │  │
│  │ Language Detection    │  │ Return: audio/wav base64              │  │
│  └───────────────────────┘  └───────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ WebSocket Live Bridge (/live) - Gemini 3.8 Live API              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

- **Data Sources & Grounding Knowledge**:
  - Full CV grounding embedded in system prompt: Joosep Balõnski, 22 years old, Tallinn, EBS Entrepreneurship student (2024-...), Jõhvi Jalaväepataljon Javelin anti-tank platoon leader/commander, founder of Baldurax OÜ, shadow days at Telia, Green IT, Bolt, Ergo, Devin, surf instructor, high tech affinity, English C2, Estonian native.
  - Accurate bilingual system prompt instructing Joosep to speak naturally in the first person in a deep, confident, articulate manner.
- **Verification Plan**:
  - Server compilation & dev server startup (`npm run build` / `compile_applet`).
  - Verify audio capture, synthesis pipeline, responsive cream aesthetic, serif typography, and zero-pill layout.
