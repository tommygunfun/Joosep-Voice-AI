import { CVData, PromptChip } from '../types.ts';

export const joosepCV: CVData = {
  name: 'Joosep Balõnski',
  title: 'EBS-i tudeng · Ettevõtlus ja ärijuhtimine',
  location: 'Kesklinn, Tallinn, Estonia',
  phone: '+372 55510932',
  email: 'joosep.balonski@gmail.com',
  pdfUrl: '/public/assets/aistudio/CV_-_Joosep_Bal_nski_v2_216d03d4.pdf',
  languages: [
    { name: 'Eesti keel', level: 'Emakeel' },
    { name: 'Inglise keel', level: 'C2 Proficient' },
  ],
  skills: [
    'Hea suhtlemisoskus',
    'Meeldib võtta initsiatiivi',
    'Probleemi lahendamise oskus',
    'Hea juhtimisoskus',
    'AI põhjalik teadmine',
    'Hea esitusoskus',
    'Meeskonnatöö',
    'Kiire õppimisoskus',
  ],
  education: [
    {
      institution: 'Estonian Business School (EBS)',
      period: '2024 – ...',
      degree: 'Ettevõtlus ja ärijuhtimine (Entrepreneurship & Business Administration)',
      details: [
        'Kogun juhtimisalast teadmisi ja rakendan teooriaid praktikas.',
        'Õpin tiimitöö ja suhtluse printsiipe reaalsetes äristsenaariumides.',
        'Arendan laiapõhjalist strateegilist arusaama ettevõtluse valdkonnas.',
      ],
    },
    {
      institution: 'Tallinna Tehnikagümnaasium',
      period: '2020 – 2023',
      degree: 'Gümnaasiumiharidus (Reaal ja tehnoloogia kallak)',
      details: [
        'Tugev reaalainete, analüütilise mõtlemise ja tehnoloogia süvendatud programm.',
      ],
    },
    {
      institution: 'Peetri Lasteaed-Põhikool',
      period: '2011 – 2020',
      degree: 'Põhiharidus',
      details: ['Tugev akadeemiline alus ja aktiivne spordi- ning ühiskondlik tegevus.'],
    },
    {
      institution: 'Välismaa koolid & rahvusvaheline kogemus',
      period: 'Erinevad perioodid',
      degree: 'Rahvusvaheline õpe',
      details: [
        'Ardingly College (UK, 1 kuu)',
        'International School of Sofia',
      ],
    },
  ],
  military: {
    unit: 'Jõhvi Jalaväepataljon (Javelin meeskond)',
    period: '2023 – 2024',
    role: 'Kaitseväeteenistus · Jalavägi & Javelin relvasüsteem',
    takeaways: [
      'Sain juhtimisalast praktilist ja otsustavat kogemust.',
      'Tiimitöö arendamine ekstreemsetes ning vastutusrikastes oludes.',
      'Suhtlusoskuse arendamine ja selge käsustiku edastamine.',
      'Kiire otsustamine kriitilistes situatsioonides ja täielik vastutuse võtmine.',
    ],
  },
  experiences: [
    {
      role: 'Asutaja & Tehnoloogiajuht',
      period: '09.2024 – ...',
      company: 'Baldurax OÜ',
      description:
        'AI ja kaasaegsete tehnoloogiliste lahenduste rakendamine äritegevustes, protsesside automatiseerimine ning uute toodete arendus.',
    },
    {
      role: 'Surfi instruktor',
      period: '06.2021 – 09.2021',
      company: 'Veemootor- ja lohesurfikoolitus',
      description:
        'Koolitasin eri vanuses õpilasi, vastutasin mereohutuse, metoodilise õpetuse ja osalejate enesekindluse tõstmise eest.',
    },
  ],
  shadowDays: [
    'Telia',
    'Green IT (tegevjuhi töövari)',
    'Ergo',
    'Bolt',
    'Devin Eesti',
    'Uusmaa',
  ],
};

export const promptChips: PromptChip[] = [
  {
    id: 'military',
    label: 'Military Leadership & Javelin',
    category: 'Leadership',
    query: 'Tell me about your military service in Jõhvi and your experience leading with the Javelin missile system.',
    lang: 'en',
  },
  {
    id: 'ebs',
    label: 'EBS Entrepreneurship Studies',
    category: 'Education',
    query: 'What are you studying at Estonian Business School and what are your business and entrepreneurial goals?',
    lang: 'en',
  },
  {
    id: 'ai-baldurax',
    label: 'AI & Baldurax OÜ',
    category: 'Venture',
    query: 'Tell me about Baldurax OÜ and how you leverage modern AI tools to solve real business problems.',
    lang: 'en',
  },
  {
    id: 'shadow-days',
    label: 'Executive Shadows (Bolt, Telia)',
    category: 'Experience',
    query: 'What insights did you gain from shadowing CEOs and leadership teams at Green IT, Telia, and Bolt?',
    lang: 'en',
  },
  {
    id: 'est-military',
    label: 'Kaitsevägi ja Javelin (eesti k.)',
    category: 'Juhtimine',
    query: 'Räägi oma ajateenistusest Jõhvi jalaväepataljonis ja kogemustest Javelin meeskonnas.',
    lang: 'et',
  },
  {
    id: 'contact',
    label: 'Contact & Collaboration',
    category: 'Contact',
    query: 'How can we connect or collaborate directly on future projects?',
    lang: 'en',
  },
];
