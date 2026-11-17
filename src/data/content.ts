import type { ImageSlot, ZoneWaypoint } from '../types/portfolio';

export const PROFILE = {
  fullName: 'Ogbologu David Chuwueloka',
  preferredName: 'Johan',
  initials: 'ODC',
  studioTitle: 'The Dockyard Studio',
  location: 'Lagos, Nigeria',
  phone: '07077348537',
  email: 'liebertj070@gmail.com',
  pitch: 'I design it in Figma, I build it in code, and I tell its story in video.',
  roles: [
    'UI/UX Designer',
    'Front-end Builder',
    'Video Editor',
    'AI Content Creator',
    'Graphic Designer',
  ],
  bio: "I'm a computer science student and creative technologist in Lagos. I design interfaces in Figma and build what I design: I took a transport booking platform from user flows and desktop and mobile screens all the way to a deployed Next.js website that real people can sign up and log in to. Alongside that, I edit video, make AI-assisted content, and design posters and flyers. I'm currently an intern at Naval Dockyard Limited, where I produce documentary-style video and branded event materials.",
  education: {
    university: {
      degree: 'B.Sc. Computer Science',
      institution: 'Augustine University, Ilara-Epe, Lagos',
      status: 'Currently 300 level, expected graduation 2027',
      coursework: [
        'UI/UX',
        'Frontend Development',
        'Database Design',
        'Computer Architecture',
        'Computer Security',
      ],
    },
    secondary: {
      qualification: 'SSCE',
      institution: 'Maryland Comprehensive Secondary School, Maryland, Lagos',
      period: '2018 to 2024',
    },
  },
  // [PLACEHOLDER: Supply your Formspree / Web3Forms / custom form endpoint URL here]
  contactFormEndpoint: '',
  cvFiles: {
    uiux: {
      label: 'Download UI/UX CV (PDF)',
      href: '/assets/aistudio/Ogbologu_David_Chuwueloka_CV_UIUX_d073118a.pdf',
      filename: 'Ogbologu-David-Chuwueloka-UIUX-CV.pdf',
    },
    videoContent: {
      label: 'Download Video & Graphics CV (PDF)',
      href: '/assets/aistudio/OGBOLOGU_DAVID_CHUKWUELOKA_video_editing_graphics_design_and_video_editing_CV_4072baa1.pdf',
      filename: 'Ogbologu-David-Chukwueloka-Video-Graphics-CV.pdf',
    },
  },
} as const;

export const IMAGE_SLOTS: Record<string, ImageSlot> = {
  'IMG-01': {
    slotId: 'IMG-01',
    label: 'Portrait / Profile Photo',
    aspect: '3:4',
    src: '/assets/optimized/IMG-20260531-WA0006_ca27c583.webp',
    caption: 'Ogbologu David Chuwueloka (Johan) — Hologram Workbench Frame',
  },
  'IMG-02': {
    slotId: 'IMG-02',
    label: 'Kelvjessia — Landing Screen',
    aspect: '16:10',
    src: '/assets/optimized/IMG-20260926-WA0028_1__73d04754.webp',
    caption: 'Kelvjessia transport platform landing & route search',
  },
  'IMG-03': {
    slotId: 'IMG-03',
    label: 'Kelvjessia — Seat Selection',
    aspect: '16:10',
    src: '/assets/optimized/05___Book_a_Seat___Desktop_094278b7.webp',
    caption: 'Unified Available / Selected / Taken seat map',
  },
  'IMG-04': {
    slotId: 'IMG-04',
    label: 'Kelvjessia — Payment Flow',
    aspect: '16:10',
    src: '/assets/optimized/08___Payment___Desktop_78737071.webp',
    caption: 'Order summary & payment checkout screen',
  },
  'IMG-05': {
    slotId: 'IMG-05',
    label: 'Kelvjessia — Live Route Tracking',
    aspect: '16:10',
    src: '/assets/optimized/Delivery___Desktop_eac69299.webp',
    caption: 'Live route tracking, ETA & trip status timeline',
  },
  'IMG-06': {
    slotId: 'IMG-06',
    label: 'Kelvjessia — Booking Confirmation',
    aspect: '16:10',
    src: '/assets/optimized/09___Booking_Confirmation___Desktop_6a5b46be.webp',
    caption: 'Boarding ticket & seat booking confirmation screen',
  },
  'IMG-07': {
    slotId: 'IMG-07',
    label: 'Food Delivery App — Discovery & Trending Meals',
    aspect: '9:16',
    src: '/assets/optimized/Screenshot_2026-11-16_193427_46577d95.webp',
    caption: 'Search bar, meal categories, filters & trending meals',
  },
  'IMG-08': {
    slotId: 'IMG-08',
    label: 'Food Delivery App — Food Details & Toppings',
    aspect: '9:16',
    src: '/assets/optimized/Screenshot_2026-11-16_193500_282bd0b9.webp',
    caption: 'Grilled Chicken & Quinoa Bowl customization & Add to Cart',
  },
  'IMG-09': {
    slotId: 'IMG-09',
    label: 'Food Delivery App — Your Cart & Order Summary',
    aspect: '9:16',
    src: '/assets/optimized/Screenshot_2026-11-16_193525_1e0487ea.webp',
    caption: 'Cart items, transparent discount/total breakdown & Checkout CTA',
  },
  'IMG-10': {
    slotId: 'IMG-10',
    label: 'Food Delivery App — Checkout & Confirmation',
    aspect: '9:16',
    src: null,
    caption: 'Optional additional checkout screen',
  },
  'IMG-11': {
    slotId: 'IMG-11',
    label: 'Naval Dockyard Documentary Still',
    aspect: '16:9',
    src: '/assets/optimized/Screenshot_2026-11-16_203021_1b5ea4a6.webp',
    caption: 'Naval Dockyard Limited — Documentary-style video still',
  },
  'IMG-12': {
    slotId: 'IMG-12',
    label: 'AI Influencer — Matcha Lifestyle Video',
    aspect: '9:16',
    src: '/assets/optimized/Screenshot_2026-11-16_210054_92f517bf.webp',
    caption: 'AI-generated visual direction + ElevenLabs / DaVinci Resolve edit',
  },
  'IMG-13': {
    slotId: 'IMG-13',
    label: 'AI Influencer — Wig-Selling Video',
    aspect: '9:16',
    src: '/assets/optimized/Screenshot_2026-11-16_210412_c6819745.webp',
    caption: 'Commercial social AI video production',
  },
  'IMG-14': {
    slotId: 'IMG-14',
    label: 'First Man on the Sun — Nigerian Comedy Story',
    aspect: '9:16',
    src: '/assets/optimized/124999036_1792519105267599_00583184.webp',
    caption: 'Funny entertainment video about a man who wants to land on the sun',
  },
  'IMG-15': {
    slotId: 'IMG-15',
    label: "Megan's Bakery — TikTok Series",
    aspect: '9:16',
    src: '/assets/optimized/file_00000000666c82468f808d7adc82c067_143f5b16.webp',
    caption: "Megan's Bakery creative AI series on TikTok",
  },
  'IMG-16': {
    slotId: 'IMG-16',
    label: 'Naval Dockyard — Karaoke Night Flyer',
    aspect: '3:4',
    src: '/assets/optimized/NDL_karaoke_night_OGBOLOGU_CHUKWUELOKA_DAVID_ffde4b8c.webp',
    caption: 'Every Saturday Karaoke Night promotional flyer for Docker’s Bar, Naval Dockyard Ltd',
  },
  'IMG-17': {
    slotId: 'IMG-17',
    label: 'Naval Dockyard — Wining In & First Quarter Party',
    aspect: '3:4',
    src: '/assets/optimized/NDL_first_quarter_party_OGBOLOGU_CHUKWUELOKA_DAVID_d81f6789.webp',
    caption: 'Wining In & First Quarter Party event poster for Naval Dockyard Limited',
  },
  'IMG-18': {
    slotId: 'IMG-18',
    label: 'Naval Dockyard — Easter Family Celebration',
    aspect: '3:4',
    src: '/assets/optimized/NDL_Easter_party__OGBOLOGU_CHUKWUELOKA_DAVID_6752dfa6.webp',
    caption: 'Happy Easter NDL Family dockside celebration invitation poster',
  },
  'IMG-19': {
    slotId: 'IMG-19',
    label: 'Naval Dockyard — Easter Wine & Dine',
    aspect: '3:4',
    src: '/assets/optimized/NDL_Easter_festivities_1e253188.webp',
    caption: 'Easter Wine & Dine invitation flyer for Docker’s Bar, Naval Dockyard Limited',
  },
  'IMG-20': {
    slotId: 'IMG-20',
    label: 'Naval Dockyard — Xmas Party Flyer',
    aspect: '3:4',
    src: '/assets/optimized/NDL_Christmas_party_celebration_738d6ef2.webp',
    caption: 'Naval Dockyard Ltd Christmas Party celebration poster',
  },
  'IMG-21': {
    slotId: 'IMG-21',
    label: 'Branded Event Material 06',
    aspect: '3:4',
    src: null,
  },
};

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location?: string;
  period: string;
  bullets: string[];
  accentColor: string;
  nodePosition: [number, number, number];
}

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'naval-dockyard',
    role: 'Intern',
    organization: 'Naval Dockyard Limited',
    location: 'Lagos, Nigeria',
    period: '31 July 2026 to present',
    bullets: [
      'Produced and edited a documentary-style video covering personnel, workshops, engineering activities and the working environment at the Dockyard.',
      'Planned the visual flow, selected footage and structured clips into a coherent story, editing in CapCut and DaVinci Resolve (timing, transitions, text, effects).',
      'Designed branded posters, flyers and promotional materials for events in Canva and Adobe Photoshop.',
      'Applied supervisor feedback across iterations to improve structure, presentation and clarity.',
    ],
    accentColor: '#FF6A1A',
    nodePosition: [-3.2, 0, -51],
  },
  {
    id: 'ai-content-creation',
    role: 'AI Content Creation',
    organization: 'Self-directed',
    period: 'Ongoing',
    bullets: [
      'Develop concepts and detailed prompts for AI-generated video, specifying characters, environments, camera perspective, movement, atmosphere and lighting.',
      'Combine AI-generated visuals, AI voiceovers (ElevenLabs, AI33Pro) and conventional editing (DaVinci Resolve: sequencing, timing, captions, transitions, pacing) into finished cinematic and social-media-style content.',
      'Made AI-assisted video projects using ChatGPT for concepts and visual assets, then Veo and YouTube AI tools for video.',
      'Content types produced: AI influencer videos (a matcha lifestyle video, a wig-selling video), and a funny Nigerian AI entertainment story ("First Man on the Sun") about a man who wants to land on the sun.',
      'Produce an ongoing AI content series called "Megan\'s Bakery" on TikTok (@megans.bakery7).',
    ],
    accentColor: '#4DE1FF',
    nodePosition: [3.2, 0, -56],
  },
];

export interface CaseStudyProject {
  id: 'kelvjessia' | 'food-delivery';
  badge: string;
  title: string;
  subtitle: string;
  stack: string[];
  summary: string;
  highlights: string[];
  links: { label: string; url: string; primary?: boolean }[];
  imageSlots: string[];
  sections?: {
    problem: string;
    users: string;
    journeyFlows: string;
    designDecisions: string;
    screens: string;
    buildAndTech: string;
    whatNext: string;
  };
  panelPosition: [number, number, number];
  panelRotation: [number, number, number];
}

export const DESIGN_PROJECTS: CaseStudyProject[] = [
  {
    id: 'kelvjessia',
    badge: 'Flagship · UI/UX + Frontend Build',
    title: 'Kelvjessia Transport Booking Platform',
    subtitle: 'Ilara-Epe to eight Lagos destinations',
    stack: ['Figma', 'Next.js', 'Tailwind', 'Supabase'],
    summary:
      'A booking platform for seats and parcels between Ilara-Epe and eight Lagos destinations.',
    highlights: [
      'Designed desktop and mobile screens in Figma for booking seats and sending parcels, with clickable prototypes for both.',
      'Mapped the full user journey (sign up, route selection, seat selection, payment, live tracking, trip history, admin and dispatcher views) and documented it in a sitemap, user flows and a build spec.',
      'Simplified the experience through design decisions: removed guest checkout and student-ID requirements, and unified the seat map across desktop and mobile with clear Available / Selected / Taken states.',
      'Built and deployed it as a working website with email authentication, Paystack payments (test mode), Mapbox route tracking, optional live location sharing, and database-level seat locking to prevent double bookings.',
    ],
    links: [
      { label: 'Open Live Site', url: 'https://kelvjessia2.vercel.app/', primary: true },
      {
        label: 'Figma Design File',
        url: 'https://www.figma.com/design/kLmUqdMDjB4tSUPsYL5byr/Kelvjessia-%E2%80%94-Transport-Website-UI-UX',
      },
      {
        label: 'Desktop Prototype',
        url: 'https://www.figma.com/proto/kLmUqdMDjB4tSUPsYL5byr/Kelvjessia-%E2%80%94-Transport-Website-UI-UX?page-id=1%3A2&node-id=4-2&p=f&viewport=237%2C67%2C0.08&t=iI88o8FVjWRFLidf-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=4%3A2',
      },
      {
        label: 'Mobile Prototype',
        url: 'https://www.figma.com/proto/kLmUqdMDjB4tSUPsYL5byr/Kelvjessia-%E2%80%94-Transport-Website-UI-UX?page-id=1%3A3&node-id=12-2&p=f&viewport=87%2C293%2C0.21&t=LYgcsGt7Vkeui4pn-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=12%3A2',
      },
    ],
    imageSlots: ['IMG-02', 'IMG-03', 'IMG-04', 'IMG-05', 'IMG-06'],
    sections: {
      problem:
        'Passengers and parcel senders travelling between Ilara-Epe and eight Lagos destinations needed a reliable digital booking flow without seat double-bookings or fragmented offline coordination.',
      users:
        'Commuters, university travellers in Ilara-Epe, parcel senders, vehicle dispatchers, and platform administrators.',
      journeyFlows:
        'Mapped end-to-end flows across sign up, route selection, seat selection, Paystack payment, Mapbox live tracking, trip history, plus dedicated admin and dispatcher operational views, documented in a sitemap, user flows, and build spec.',
      designDecisions:
        'Removed guest checkout and student-ID requirements to eliminate friction while keeping bookings accountable, and unified the interactive seat map across desktop and mobile with unmistakable Available / Selected / Taken states.',
      screens:
        'Designed complete desktop and mobile screen sets in Figma with clickable prototypes covering both seat booking and parcel dispatch. [PLACEHOLDER: Screenshots IMG-02 to IMG-06 ready to attach]',
      buildAndTech:
        'Built and deployed on Next.js, Tailwind CSS, and Supabase with email authentication, Paystack test-mode checkout, Mapbox route tracking, optional live location sharing, and database-level seat locking to prevent double bookings.',
      whatNext:
        'Attach production screenshots (IMG-02 to IMG-06) and continue iterating with real commuter and dispatcher feedback.',
    },
    panelPosition: [-3.3, 2.35, -1.5],
    panelRotation: [0, 0.24, 0],
  },
  {
    id: 'food-delivery',
    badge: 'UI/UX Design · Mobile Ordering Flow',
    title: 'Food Delivery App',
    subtitle: 'Competitive research to interactive Figma prototype',
    stack: ['Figma'],
    summary:
      'A mobile food ordering experience grounded in competitor analysis of Glovo, Chowdeck, and DoorDash.',
    highlights: [
      'Researched Glovo, Chowdeck and DoorDash to compare restaurant discovery, menu browsing, cart and checkout, and used the findings to shape the design.',
      'Mapped the ordering journey (Home/Search, Restaurant, Menu, Food Details, Cart, Checkout, Confirmation) and designed the screens with a clickable prototype of the core ordering flow.',
      'Prioritised clear calls to action, simple navigation, transparent pricing and consistent components over decoration.',
    ],
    links: [
      {
        label: 'Interactive Prototype',
        url: 'https://www.figma.com/proto/bv5T7tVttqZllaVkTSywVR/Untitled?page-id=0%3A1&node-id=2-2&p=f&viewport=674%2C171%2C0.36&t=1FjrqBbcY6PPL0JG-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=2%3A2',
        primary: true,
      },
      {
        label: 'Figma Design File',
        url: 'https://www.figma.com/design/bv5T7tVttqZllaVkTSywVR/Untitled?node-id=0-1&t=zAqh0lV5qCV67Jmv-1',
      },
    ],
    imageSlots: ['IMG-07', 'IMG-08', 'IMG-09'],
    sections: {
      problem:
        'Mobile ordering apps frequently bury pricing fees or overload menu browsing with visual noise before checkout.',
      users:
        'Mobile food delivery customers comparing nearby restaurants, browsing menus, and checking out quickly.',
      journeyFlows:
        'Mapped the complete 7-step ordering journey: Home/Search, Restaurant, Menu, Food Details, Cart, Checkout, and Confirmation.',
      designDecisions:
        'Benchmarked Glovo, Chowdeck, and DoorDash, then prioritised clear calls to action, simple navigation, transparent pricing, and consistent reusable components over decoration.',
      screens:
        'Designed mobile UI screens in Figma (Discovery, Food Details & Toppings, and Cart Order Summary) linked into an interactive clickable prototype for the core ordering flow.',
      buildAndTech: 'Designed end-to-end in Figma with component tokens and prototype flows.',
      whatNext:
        'Run usability tests on the checkout transparency step and expand the interactive prototype with post-checkout tracking.',
    },
    panelPosition: [3.3, 2.2, -3.5],
    panelRotation: [0, -0.26, 0],
  },
];

export const JUTIMA_PROJECT = {
  id: 'jutima',
  title: 'JUTIMA — Retail Store Management System',
  context: 'University Project',
  stack: ['MySQL', 'Node.js / Express', 'HTML / CSS / JS'],
  summary:
    'Database design project with a minimal frontend. Produced lo-fi wireframes ahead of a supervisor demo, then built the full-stack system.',
};

export interface CreateMediaItem {
  id: string;
  category: 'Documentary' | 'AI Video' | 'Series' | 'Graphic Design';
  title: string;
  tools: string[];
  description: string;
  slotIds: string[];
  videoUrl?: string;
  links?: { label: string; url: string }[];
  externalUrl?: string;
  externalLabel?: string;
  placeholderNote?: string;
  monitorPosition: [number, number, number];
  monitorRotation: [number, number, number];
}

export const CREATE_MEDIA_ITEMS: CreateMediaItem[] = [
  {
    id: 'dockyard-doc',
    category: 'Documentary',
    title: 'Naval Dockyard Documentary-Style Video',
    tools: ['CapCut', 'DaVinci Resolve'],
    description:
      'Documentary-style video covering personnel, workshops, engineering activities, and the working environment at Naval Dockyard Limited. Structured visual flow, transitions, text, and pacing refined across supervisor reviews.',
    slotIds: ['IMG-11'],
    videoUrl: 'https://drive.google.com/file/d/15R7NAicNGcz1Lh9szo-oyDx8jn1Yy9ck/view?usp=drive_link',
    monitorPosition: [-4.2, 2.55, -36.8],
    monitorRotation: [0, 0.28, 0],
  },
  {
    id: 'ai-influencer',
    category: 'AI Video',
    title: 'AI Influencer Videos (Matcha & Wigs)',
    tools: ['ChatGPT', 'Veo', 'ElevenLabs', 'AI33Pro', 'DaVinci Resolve'],
    description:
      'Commercial and lifestyle social-media AI productions—including a matcha lifestyle video and a wig-selling video—combining detailed camera/lighting prompts, AI voiceovers, captions, and rhythmic DaVinci Resolve editing.',
    slotIds: ['IMG-12', 'IMG-13'],
    externalUrl: 'https://drive.google.com/drive/folders/1NVqYAf43lBKVZsaiLXjW9Eq9JHo9LJZG?usp=drive_link',
    externalLabel: 'Open AI Video Folder (Google Drive)',
    monitorPosition: [-1.45, 2.95, -38.4],
    monitorRotation: [0, 0.1, 0],
  },
  {
    id: 'first-man-on-the-sun',
    category: 'AI Video',
    title: 'First Man on the Sun — Nigerian Comedy Story',
    tools: ['ChatGPT', 'Veo', 'YouTube AI Tools', 'DaVinci Resolve'],
    description:
      'Funny Nigerian entertainment story about a man determined to land on the sun—built from prompt-engineered character, comedy pacing, and visual direction.',
    slotIds: ['IMG-14'],
    externalUrl: 'https://drive.google.com/drive/folders/1NVqYAf43lBKVZsaiLXjW9Eq9JHo9LJZG?usp=drive_link',
    externalLabel: 'Watch in Google Drive Video Folder',
    monitorPosition: [1.45, 2.95, -38.4],
    monitorRotation: [0, -0.1, 0],
  },
  {
    id: 'megans-bakery',
    category: 'Series',
    title: "Megan's Bakery",
    tools: ['AI Video Generation', 'ElevenLabs', 'DaVinci Resolve'],
    description:
      "Ongoing creative AI video series following a day at Megan's Bakery, produced for TikTok with warm visual storytelling, voiceover, and rhythmic editing.",
    slotIds: ['IMG-15'],
    externalUrl: 'https://www.tiktok.com/@megans.bakery7',
    externalLabel: "Watch Megan's Bakery on TikTok",
    monitorPosition: [4.2, 2.55, -36.8],
    monitorRotation: [0, -0.28, 0],
  },
  {
    id: 'graphics-portfolio',
    category: 'Graphic Design',
    title: 'Posters, Flyers & Branded Event Materials',
    tools: ['Adobe Photoshop', 'Canva'],
    description:
      'Branded promotional posters, event flyers, and visual communications materials designed during my Naval Dockyard Limited internship and independent creative work.',
    slotIds: ['IMG-16', 'IMG-17', 'IMG-18', 'IMG-19', 'IMG-20'],
    externalUrl: 'https://drive.google.com/drive/folders/1shUa_fQ1Mb3TxiI0WmvBqsdi-2w3CeBX',
    externalLabel: 'Open Graphic Design Portfolio Folder',
    monitorPosition: [0, 1.35, -39.2],
    monitorRotation: [-0.08, 0, 0],
  },
];

export interface SkillGroup {
  category: string;
  accent: string;
  items: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'UI/UX',
    accent: '#FF6A1A',
    items: [
      'Figma',
      'Wireframing',
      'Interactive Prototyping',
      'User Flows',
      'Information Architecture',
      'Competitor Analysis',
      'Visual Hierarchy',
      'Responsive Design (Desktop and Mobile)',
      'Design-to-Code Implementation',
    ],
  },
  {
    category: 'Frontend and Data',
    accent: '#4DE1FF',
    items: ['HTML/CSS', 'Next.js', 'Tailwind CSS', 'Supabase', 'MySQL', 'Python', 'Git/GitHub'],
  },
  {
    category: 'Video and Motion',
    accent: '#FF6A1A',
    items: [
      'CapCut',
      'DaVinci Resolve',
      'Video Editing',
      'Transitions and Effects',
      'Pacing',
      'Text Animation',
    ],
  },
  {
    category: 'AI and Content',
    accent: '#4DE1FF',
    items: [
      'AI Video Generation',
      'Prompt Engineering',
      'Generative AI',
      'Visual Storytelling',
      'AI-Assisted Scripting',
    ],
  },
  {
    category: 'Graphic Design',
    accent: '#FF6A1A',
    items: [
      'Canva',
      'Adobe Photoshop',
      'Posters',
      'Flyers',
      'Branded Promotional Materials',
    ],
  },
];

export const ZONE_WAYPOINTS: ZoneWaypoint[] = [
  {
    id: 'hero',
    label: '01 · Hangar Entry',
    shortLabel: 'Studio',
    scrollProgress: 0.0,
    cameraPos: [0, 2.3, 25.5],
    lookAt: [0, 2.1, 14],
  },
  {
    id: 'about',
    label: '02 · Workbench & Profile',
    shortLabel: 'About',
    scrollProgress: 0.15,
    cameraPos: [-1.4, 2.2, 12.2],
    lookAt: [1.5, 1.75, 6.2],
  },
  {
    id: 'design',
    label: '03 · Zone 1: Design',
    shortLabel: 'Design',
    scrollProgress: 0.31,
    cameraPos: [0, 2.4, 4.5],
    lookAt: [0, 2.1, -3.0],
  },
  {
    id: 'build',
    label: '04 · Zone 2: Build',
    shortLabel: 'Build',
    scrollProgress: 0.49,
    cameraPos: [0.6, 2.45, -13.5],
    lookAt: [-0.2, 2.0, -21.5],
  },
  {
    id: 'create',
    label: '05 · Zone 3: Create',
    shortLabel: 'Create',
    scrollProgress: 0.67,
    cameraPos: [0, 2.35, -30.5],
    lookAt: [0, 2.25, -38.5],
  },
  {
    id: 'experience',
    label: '06 · Floor-Rail Timeline',
    shortLabel: 'Experience',
    scrollProgress: 0.84,
    cameraPos: [0, 2.55, -46.5],
    lookAt: [0, 1.35, -55.0],
  },
  {
    id: 'contact',
    label: '07 · Control Room Finale',
    shortLabel: 'Contact',
    scrollProgress: 1.0,
    cameraPos: [0, 8.75, -70.4],
    lookAt: [0, 3.55, -72.4],
  },
];
