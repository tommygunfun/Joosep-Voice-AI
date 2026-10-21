export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  audioBase64?: string;
  language?: 'et' | 'en';
}

export interface PromptChip {
  id: string;
  label: string;
  category: string;
  query: string;
  lang: 'en' | 'et';
}

export interface CVData {
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  pdfUrl: string;
  languages: Array<{ name: string; level: string }>;
  skills: string[];
  education: Array<{
    institution: string;
    period: string;
    degree: string;
    details: string[];
  }>;
  military: {
    unit: string;
    period: string;
    role: string;
    takeaways: string[];
  };
  experiences: Array<{
    role: string;
    period: string;
    company: string;
    description: string;
  }>;
  shadowDays: string[];
}
