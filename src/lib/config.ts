/**
 * Site config: single source of truth for personal info, links, projects.
 * Edit here, not in components.
 */

export const SITE = {
  name: "Zhameer Sheraz U. Tampugao",
  // Navbar and footer brand. This is the handle, not the legal name: the hero
  // already sets the full name at display size about 300px below the navbar,
  // and repeating it in small type read as a stutter. The footer's copyright
  // line still carries SITE.name, so the full name is on every page.
  navName: "zham",
  handle: "zhameer",
  role: "Computer Science Student",
  tagline:
    "I learn how systems break, then I write about it.",
  description:
    "Computer Science student. CTF writeups, pentesting notes, and small things I have built while figuring out how computers actually work.",
  location: "Philippines",
  email: "zhameersheraztampugao@gmail.com",
  url: "https://zhameersheraz-portfolio.vercel.app",
} as const;

export const SOCIAL = [
  {
    label: "GitHub",
    href: "https://github.com/zhameersheraz",
    handle: "zhameersheraz",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/zhameersheraz",
    handle: "zhameersheraz",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/zhameersheraz",
    handle: "zhameersheraz",
  },
  {
    label: "Email",
    href: "mailto:zhameersheraztampugao@gmail.com",
    handle: "zhameersheraztampugao@gmail.com",
  },
] as const;

// Home is deliberately absent. The </> mark in the navbar is the home link,
// so a fourth item next to it would be a second door to the same room.
// Certifications is an anchor into the About page rather than its own route,
// because the certificates already live in that page's grid.
export const NAV = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Certifications", href: "/about#certifications" },
  { label: "Contact", href: "/contact" },
] as const;

export const PROJECTS = [
  {
    slug: "ubimap",
    title: "UbiMap - NASA-guided ube rotation planning",
    repo: "zhameersheraz/ubimap",
    href: "https://github.com/zhameersheraz/ubimap",
    demo: "https://ubimap.pages.dev",
    demoLabel: "Live App",
    summary:
      "National ube output has fallen 43% and the area planted has halved, so farmers have no planting material left and no data on which crop to rotate into. NASA MODIS imagery over their own field, scored for suitability cell by cell, then three rotation strategies compared against the one they already use. Answers in Bisaya, Filipino or English.",
    tags: [
      "NASA",
      "Geospatial",
      "React",
      "Vite",
      "Space Apps",
      "Agriculture",
    ],
    categories: [
      "NASA Space Apps",
      "Geospatial",
      "Data Visualisation",
      "Full-stack",
      "Agriculture",
    ],
    language: "JavaScript",
    featured: true,
    art: "/art/ubimap.jpg",
  },
  {
    slug: "esp32sec",
    title: "esp32sec - ESP32 Security Toolkit",
    repo: "zhameersheraz/esp32sec",
    href: "https://github.com/zhameersheraz/esp32sec",
    summary:
      "Small hardware vendors ship connected devices with no security review, and unpatched firmware is behind 60% of IoT breaches. A Python toolkit for firmware analysis on the hardware itself: flash dumping over UART, a boot and runtime UART sniffer, a partition table parser, a firmware inspector, and a secure boot and flash encryption check.",
    tags: ["ESP32", "ESP8266", "Hardware Security", "Firmware Analysis", "IoT Security", "Python"],
    categories: ["Hardware Security", "IoT Security", "Firmware Analysis", "Open Source"],
    language: "Python",
    featured: true,
    art: "/art/esp32sec.jpg",
  },
  {
    slug: "cfg-visualizer",
    title: "CFG Visualizer",
    repo: "zhameersheraz/cfg-visualizer",
    href: "https://github.com/zhameersheraz/cfg-visualizer",
    demo: "https://cfg-visualizer-eight.vercel.app",
    demoLabel: "Live Demo",
    summary:
      "Reverse engineers lose time reconstructing control flow by hand. Drop in any ELF, PE or Mach-O binary and a radare2 backend extracts the per-function CFG, which the frontend lays out in a seeded 3D force simulation you can orbit. Click a node to read its disassembly.",
    tags: [
      "Reverse Engineering",
      "radare2",
      "Three.js",
      "WebGL",
      "Python",
      "FastAPI",
    ],
    categories: [
      "Reverse Engineering",
      "Binary Analysis",
      "3D Graphics",
      "WebGL",
      "Full-stack",
    ],
    language: "Python",
    featured: true,
    art: "/art/cfg-visualizer.jpg",
  },
  {
    slug: "aquascout-site",
    title: "AQUASCOUT - Fire and smoke detection for Android",
    repo: "zhameersheraz/aquascout-site",
    href: "https://github.com/zhameersheraz/aquascout-site",
    demo: "https://aquascout.vercel.app",
    demoLabel: "Live Site",
    summary:
      "A working smoke alarm in a burning room still does not tell anyone where you are. A 3.3 MB YOLOv8 model runs on the phone's own camera, texts your emergency contact with a GPS pin the moment smoke or flame appears, uploads nothing, and still works with no signal.",
    tags: [
      "Android",
      "YOLOv8",
      "On-device AI",
      "Edge ML",
      "Static Site",
      "Marketing",
    ],
    categories: [
      "On-device AI",
      "Edge ML",
      "Android",
      "Static Site",
      "Marketing",
    ],
    language: "HTML",
    featured: true,
    art: "/art/aquascout-site.jpg",
  },
  {
    slug: "trash-sorter",
    title: "Trash Sorter - AI waste classifier",
    repo: "zhameersheraz/trash-sorter",
    href: "https://github.com/zhameersheraz/trash-sorter",
    demo: "https://trash-sorter.enjeanearz.workers.dev/",
    demoLabel: "Live Demo",
    summary:
      "Landfills cost local governments P17 to P46 million a day and most households do not segregate at source. A Teachable Machine classifier sorts a piece of waste into recycling, compost or general from the camera, with a confidence score for every class. Runs on the device, no server, no account.",
    tags: [
      "TensorFlow.js",
      "Teachable Machine",
      "Computer Vision",
      "Edge ML",
      "Static Site",
    ],
    categories: [
      "Edge ML",
      "Computer Vision",
      "Static Site",
      "Group Project",
    ],
    language: "JavaScript",
    featured: true,
    art: "/art/trash-sorter.jpg",
  },
  {
    slug: "noctis",
    title: "Noctis GP: Lunar Night Grand Prix",
    repo: "zhameersheraz/Noctis-GP",
    href: "https://github.com/zhameersheraz/Noctis-GP",
    demo: "https://zhameersheraz.github.io/Noctis-GP/",
    summary:
      "A physics driven racing game set on the Moon, built to prove that a physics harness can catch regressions headlessly. Procedural terrain, vehicle handling, AI opponents, and a Python verification suite that runs without a browser.",
    tags: ["TypeScript", "Three.js", "Game Dev", "Testing"],
    categories: [
      "Game Development",
      "3D Graphics",
      "WebGL",
      "TypeScript",
      "Automated Testing",
    ],
    language: "TypeScript",
    featured: true,
    art: "/art/noctis.jpg",
  },
  {
    slug: "cloud-security",
    title: "Cloud Security",
    repo: "zhameersheraz/cloud-security",
    href: "https://github.com/zhameersheraz/cloud-security",
    summary:
      "A working reference for the misconfigurations that actually get found in AWS, Azure and GCP, written while working through cloud cert prep and pentest practice. Cheatsheet format, so it is usable during an engagement rather than read afterwards.",
    tags: ["Cloud Security", "AWS", "Azure", "GCP", "Cheatsheet", "Cybersecurity"],
    categories: ["Cloud Security", "Cybersecurity", "Cheatsheet"],
    language: "HTML",
    featured: true,
    art: "/art/cloud-security.jpg",
  },
  {
    slug: "kds-app",
    title: "KDS - Kitchen Display System",
    repo: "zhameersheraz/kds-app",
    href: "https://github.com/zhameersheraz/kds-app",
    demo: "https://kds-app-5d6v.onrender.com",
    demoLabel: "Live Demo",
    summary:
      "Order accuracy sits at 85 to 89% and one wrong order costs P18 to P30 in thrown food, remake labour and refunds. Orders move from counter to kitchen to table over a live socket, with server, kitchen and admin roles, thermal ticket printing, and migrations that repair themselves.",
    tags: ["JavaScript", "React", "Express", "Socket.IO", "SQLite", "Real-time", "RBAC"],
    categories: [
      "Full-stack",
      "Real-time Systems",
      "Web App",
      "Authentication",
      "SQLite",
    ],
    language: "JavaScript",
    featured: true,
    art: "/art/kds.jpg",
  },
] as const;

export const SKILLS = [
  {
    category: "Languages",
    items: ["Python", "JavaScript", "TypeScript", "HTML", "CSS", "Bash"],
  },
  {
    category: "Security",
    items: [
      "Penetration Testing",
      "Network Security",
      "Web Exploitation",
      "Reverse Engineering",
      "Cryptography",
      "OSINT",
      "Digital Forensics",
    ],
  },
  {
    category: "Tools",
    items: ["Linux", "Kali", "Git", "VSCode", "Burp Suite", "Wireshark", "Nmap"],
  },
  {
    category: "Currently learning",
    items: ["Active Directory", "Cloud Security", "Malware Analysis"],
  },
] as const;

export const STATS = {
  repos: 30,
  githubHandle: "zhameersheraz",
} as const;

export type Cert = {
  id: string;
  title: string;
  issuer: string;
  issued: string;
  image: string;
  link?: string;
  aspect?: number;
  /** Short qualifier printed on the card, e.g. the no-AI note. */
  note?: string;
};

export const CERTS: Cert[] = [
  {
    id: "cisco-intro-cybersecurity",
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    issued: "Jul 2026",
    image: "/certs/cisco-intro-cybersecurity.png",
    aspect: 1.477,
  },
  {
    id: "cisco-ethical-hacker",
    title: "Ethical Hacker",
    issuer: "Cisco Networking Academy",
    issued: "Jul 2026",
    image: "/certs/cisco-ethical-hacker.png",
    aspect: 1.477,
  },
  {
    id: "cisco-intro-modern-ai",
    title: "Introduction to Modern AI",
    issuer: "Cisco Networking Academy",
    issued: "Aug 2026",
    image: "/certs/cisco-intro-modern-ai.png",
    aspect: 1.477,
  },
  {
    id: "ibm-ai-fundamentals",
    title: "AI Fundamentals: Foundations for Understanding AI",
    issuer: "IBM SkillsBuild",
    issued: "Aug 2026",
    image: "/certs/ibm-ai-fundamentals.png",
  },
  {
    id: "hackerrank-software-engineer",
    title: "Software Engineer (Role)",
    issuer: "HackerRank",
    issued: "Jul 2026",
    image: "/certs/hackerrank-software-engineer.png",
  },
  {
    id: "hackerrank-problem-solving-basic",
    title: "Problem Solving (Basic)",
    issuer: "HackerRank",
    issued: "Jul 2026",
    image: "/certs/hackerrank-problem-solving-basic.png",
  },
  {
    id: "hackerrank-problem-solving-intermediate",
    title: "Problem Solving (Intermediate)",
    issuer: "HackerRank",
    issued: "Jul 2026",
    image: "/certs/hackerrank-problem-solving-intermediate.png",
  },
  {
    id: "hackerrank-nodejs-intermediate",
    title: "Node.js (Intermediate)",
    issuer: "HackerRank",
    issued: "Aug 2026",
    image: "/certs/hackerrank-nodejs-intermediate.png",
  },
  {
    id: "hackerrank-frontend-react",
    title: "Frontend Developer (React)",
    issuer: "HackerRank",
    issued: "Aug 2026",
    image: "/certs/hackerrank-frontend-react.png",
  },
  {
    id: "freecodecamp-python",
    title: "Python (Developer Certification)",
    issuer: "freeCodeCamp",
    issued: "Aug 2026",
    image: "/certs/freecodecamp-python.png",
    link: "https://freecodecamp.org/certification/zshrc/python-v9",
    aspect: 1.472,
  },
  {
    id: "coursera-bigquery",
    title: "Working with BigQuery",
    issuer: "Coursera",
    issued: "Aug 2026",
    image: "/certs/coursera-bigquery.png",
    link: "https://coursera.org/verify/FLIEFU5568QO",
    aspect: 1.294,
  },
  {
    id: "coursera-azure-cv",
    title: "Build a computer vision app with Azure Cognitive Services",
    issuer: "Microsoft (via Coursera)",
    issued: "Aug 2026",
    image: "/certs/coursera-azure-cv.png",
    link: "https://coursera.org/verify/XA1UDID7MTWQ",
    aspect: 1.294,
  },
  {
    id: "coursera-aws-s3",
    title: "AWS S3 Basics",
    issuer: "Coursera",
    issued: "Sep 2026",
    image: "/certs/coursera-aws-s3.png",
    link: "https://coursera.org/verify/AMLVF1YQ170K",
    aspect: 1.294,
  },
  {
    id: "coursera-google-ads",
    title: "Google Ads for Beginners",
    issuer: "Coursera",
    issued: "Sep 2026",
    image: "/certs/coursera-google-ads.png",
    link: "https://coursera.org/verify/QZQ1EOI99ZPQ",
    aspect: 1.294,
  },
  {
    id: "coursera-chatfuel-chatbot",
    title: "Create a Lead Generation Messenger Chatbot using Chatfuel",
    issuer: "Coursera",
    issued: "Oct 2026",
    image: "/certs/coursera-chatfuel.png",
    link: "https://coursera.org/verify/UP6TILEDFOEG",
    aspect: 1.294,
  },
  {
    id: "coursera-wix-adi",
    title: "Build an Automated Landing page using AI from Wix ADI",
    issuer: "Coursera",
    issued: "Oct 2026",
    image: "/certs/coursera-wix-adi.png",
    link: "https://coursera.org/verify/ONYXSYUU5X9J",
    aspect: 1.294,
  },
  {
    id: "coursera-wave-accessibility",
    title: "Test Accessibility of Your Design with WAVE",
    issuer: "Coursera",
    issued: "Oct 2026",
    image: "/certs/coursera-wave-accessibility.png",
    link: "https://coursera.org/verify/CNTSYOHMAVPO",
    aspect: 1.294,
  },
  {
    id: "redreaper-2026",
    title: "RedReaper Qualification 2026 - Rank 182 of 369 globally",
    issuer: "Zeraxis",
    issued: "Nov 2026",
    image: "/certs/redreaper-2026.jpg",
    aspect: 1.414,
    note: "No AI used in solving",
  },
  {
    id: "poctf-2026",
    title: "Pointer Overflow CTF 2026 - Participant and Solver",
    issuer: "University of Wisconsin - Stevens Point",
    issued: "Nov 2026",
    image: "/certs/poctf-2026-participant.png",
    // The serial on the certificate resolves to the organiser's own
    // verification page, so the card links there rather than to the image.
    link: "https://pointeroverflowctf.com/verify/POCTF-2026-02781",
    aspect: 1.294,
    note: "No AI used in solving",
  },
] as const;

export type Competition = {
  id: string;
  event: string;
  placement: string;
  role: string;
  org: string;
  date: string;
  photos: { src: string; href: string }[];
  /** Printed on the card. Used for the no-AI statement. */
  note?: string;
};

export const COMPETITIONS: Competition[] = [
  {
    id: "syborg-ctf",
    event: "Syborg CTF 2026",
    placement: "Champion",
    role: "Top Scorer",
    org: "Team Digital Abyss, Syborg CTF",
    date: "Mar 29, 2026",
    note: "No AI used in solving",
    photos: [
      { src: "/awards/syborg.jpg", href: "https://www.facebook.com/share/p/1CF76HX7K5/" },
      {
        src: "/awards/syborg-3.jpg",
        href: "https://www.facebook.com/SyBorgSCC/posts/pfbid0gYpek1toLABcBG3cVKy2PxLCfMo3EJ8X9yYEo58btzHA6N2JUR9q2tgL3r9a2k7nl",
      },
    ],
  },
  {
    id: "provincial-cyberhunt",
    event: "Provincial Cyberhunt League 2026",
    placement: "Champion",
    role: "Top Scorer",
    org: "Team KELZploit, DICT HackForGov",
    date: "Sep 16, 2026",
    note: "No AI used in solving",
    photos: [
      { src: "/awards/provincial.jpg", href: "https://www.facebook.com/share/p/1DheMcbjRJ/" },
      { src: "/awards/provincial-2.jpg", href: "https://www.facebook.com/share/p/18NthGi1Vr/" },
    ],
  },
];

export type Project = (typeof PROJECTS)[number];
export type ProjectEntry = Project & { hidden?: boolean };

/**
 * The cost of each problem, in the customer's money.
 *
 * A recruiter or a shop owner does not care that something is built in
 * Python. They care what it is worth. Every figure below is from a published
 * source and the link is on the card, because a number with no citation is
 * just a claim with a font.
 *
 * These are the economics of the problems the projects address, not money
 * earned. Nothing here has been sold to a customer yet, and the section
 * says so rather than implying otherwise.
 */
export type ValueCase = {
  id: string;
  stat: string;
  statNote: string;
  title: string;
  problem: string;
  build: string;
  who: string;
  repo: string;
  href: string;
  demo?: string;
  source: { label: string; href: string };
};

export const VALUE: ValueCase[] = [
  {
    id: "agriculture",
    stat: "43%",
    statNote: "of Philippine ube production lost since 2010",
    title: "UbiMap",
    problem:
      "National ube output fell from 21,906 MT to 12,483 MT and the area planted halved to 2,367 hectares, while farmgate prices rose from under P50 to P80 to P250 per kilo. High prices pushed farmers to sell every tuber, so nothing was left to replant and the next season starts smaller.",
    build:
      "NASA MODIS imagery over the farmer's own field, scored for ube suitability cell by cell, then at least three rotation strategies compared against the one already in use. Answers in Bisaya, Filipino or English.",
    who: "Smallholder farmers in Zamboanga del Sur, and the people who buy from them.",
    repo: "zhameersheraz/ubimap",
    href: "https://github.com/zhameersheraz/ubimap",
    demo: "https://ubimap.pages.dev",
    source: {
      label: "CPBRD / PSA",
      href: "https://bworldonline.com/economy/2026/11/03/791093/congress-think-tank-backs-investments-in-infra-to-revive-shrinking-ube-industry/",
    },
  },
  {
    id: "fire",
    stat: "P13.8B",
    statNote: "in fire damage across the Philippines in 2024",
    title: "AQUASCOUT",
    problem:
      "18,217 fire incidents were recorded in 2024, up 11.2% on the year, and 7,561 of them were residential. Broken smoke detectors are a listed cause, and a working alarm in a burning room still does not tell anyone where you are.",
    build:
      "A 3.3 MB YOLOv8 model running on the phone's own camera. It texts your emergency contact with a GPS pin the moment smoke or flame appears, uploads nothing, and still works with no signal.",
    who: "Households and small shops that cannot afford a monitored alarm system.",
    repo: "zhameersheraz/aquascout-site",
    href: "https://github.com/zhameersheraz/aquascout-site",
    demo: "https://aquascout.vercel.app",
    source: {
      label: "Bureau of Fire Protection",
      href: "https://tribune.net.ph/2024/12/30/fire-incidents-up-by-112-percent-in-2024",
    },
  },
  {
    id: "waste",
    stat: "61,000 t",
    statNote: "of solid waste produced by the Philippines every day",
    title: "Trash Sorter",
    problem:
      "Local government units have accumulated P47.997 billion for solid waste programmes, yet only a fraction of households segregate at source and landfills cost P17 to P46 million a day. Uncollected recyclables are paid for twice, once by the household and once by the city.",
    build:
      "A Teachable Machine classifier that sorts a piece of waste into recycling, compost or general from the camera, with a confidence score for every class. Runs entirely on the device, no server, no account.",
    who: "Households that pay for a garbage service they do not get value out of.",
    repo: "zhameersheraz/trash-sorter",
    href: "https://github.com/zhameersheraz/trash-sorter",
    demo: "https://trash-sorter.enjeanearz.workers.dev/",
    source: {
      label: "World Bank / COA",
      href: "https://www.coa.gov.ph/download/5699/solid-waste-management-program/74286/solid-waste-management-program-pao-2023-01.pdf",
    },
  },
  {
    id: "restaurant",
    stat: "1 in 8",
    statNote: "restaurant orders goes out with a mistake",
    title: "Kitchen Display System",
    problem:
      "Order accuracy sits at 85 to 89% even at chains that audit it. A single wrong order costs P18 to P30 in thrown food, remake labour and refunds, which is roughly P9,000 a month for a 20 table kitchen running a 5% error rate.",
    build:
      "Orders move from counter to kitchen to table over a live socket, with server, kitchen and admin roles, thermal ticket printing, and migrations that repair themselves. Nobody has to read a handwritten note out loud.",
    who: "Independent restaurants and canteens running on paper tickets.",
    repo: "zhameersheraz/kds-app",
    href: "https://github.com/zhameersheraz/kds-app",
    demo: "https://kds-app-5d6v.onrender.com",
    source: {
      label: "QSR Magazine drive-thru data",
      href: "https://www.novatab.com/blog/how-to-minimize-order-errors-in-restaurants",
    },
  },
  {
    id: "iot",
    stat: "$330k",
    statNote: "average cost of one IoT security incident",
    title: "esp32sec",
    problem:
      "Unpatched firmware is behind 60% of IoT breaches and over half of deployed devices carry a critical exploitable vulnerability. In the UK it is now a legal matter, with penalties of up to GBP 10 million or 4% of worldwide revenue.",
    build:
      "An open source toolkit for firmware analysis on the hardware itself: flash dumping over UART, a boot and runtime UART sniffer, a partition table parser, a firmware inspector and a secure boot and flash encryption check.",
    who: "Small hardware vendors shipping connected devices with no security review.",
    repo: "zhameersheraz/esp32sec",
    href: "https://github.com/zhameersheraz/esp32sec",
    source: {
      label: "NIST / IoT Security Foundation",
      href: "https://www.micromindercs.com/blog/iot-security",
    },
  },
];