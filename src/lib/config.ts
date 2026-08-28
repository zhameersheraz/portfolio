/**
 * Site config: single source of truth for personal info, links, projects.
 * Edit here, not in components.
 */

export const SITE = {
  name: "Zhameer Sheraz U. Tampugao",
  handle: "zhameer",
  role: "Computer Science Student",
  tagline:
    "I learn how systems break, then I write about it.",
  description:
    "Computer Science student. Open-source security tools, hardware research, and small things I have built while figuring out how computers actually work.",
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
    href: "https://facebook.com/ZhameerSherazTampugao",
    handle: "ZhameerSherazTampugao",
  },
  {
    label: "Email",
    href: "mailto:zhameersheraztampugao@gmail.com",
    handle: "zhameersheraztampugao@gmail.com",
  },
] as const;

export const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
] as const;

export const PROJECTS = [
  {
    slug: "esp32sec",
    title: "esp32sec - ESP32 Security Toolkit",
    repo: "zhameersheraz/esp32sec",
    href: "https://github.com/zhameersheraz/esp32sec",
    summary:
      "Open-source Python toolkit for ESP32/ESP8266 firmware analysis and hardware security research. Five focused tools: flash dump over UART, boot/runtime UART sniffer, firmware inspector, partition table parser, and secure boot/flash-crypto check.",
    tags: ["ESP32", "ESP8266", "Hardware Security", "Firmware Analysis", "IoT Security", "Python"],
    categories: ["Hardware Security", "IoT Security", "Firmware Analysis", "Open Source"],
    language: "Python",
    featured: true,
  },
  {
    slug: "tryhackme-writeups",
    title: "TryHackMe Writeups",
    repo: "zhameersheraz/TryHackMe-Writeups",
    href: "https://github.com/zhameersheraz/TryHackMe-Writeups",
    summary:
      "Walkthroughs and notes for TryHackMe rooms. Linux fundamentals, networking, OSINT, web, and reverse engineering tracks.",
    tags: ["TryHackMe", "CTF", "Writeups", "Linux"],
    categories: [
      "Cryptography",
      "Linux",
      "Networking",
      "OSINT",
      "Reverse Engineering",
      "Security Awareness",
      "Web",
    ],
    language: "Markdown",
    featured: true,
    hidden: true,
  },
  {
    slug: "cybertalents-writeups",
    title: "CyberTalents Writeups",
    repo: "zhameersheraz/CyberTalents-Writeups",
    href: "https://github.com/zhameersheraz/CyberTalents-Writeups",
    summary:
      "Writeups for CyberTalents challenges. Cryptography, digital forensics, mobile, web, and malware reverse engineering.",
    tags: ["CyberTalents", "CTF", "Writeups", "Forensics"],
    categories: [
      "Cryptography",
      "Digital Forensics",
      "General Information",
      "Malware Reverse Engineering",
      "Mobile Security",
      "Web Security",
    ],
    language: "Shell",
    featured: true,
    hidden: true,
  },
  {
    slug: "cloud-security",
    title: "Cloud Security",
    repo: "zhameersheraz/cloud-security",
    href: "https://github.com/zhameersheraz/cloud-security",
    summary:
      "Static cheatsheet for AWS, Azure, and GCP cloud security: misconfigurations, tools, and useful commands. Built while working through cloud cert prep and pentesting practice.",
    tags: ["Cloud Security", "AWS", "Azure", "GCP", "Cheatsheet", "Cybersecurity"],
    categories: ["Cloud Security", "Cybersecurity", "Cheatsheet"],
    language: "HTML",
    featured: true,
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
  repos: 27,
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
] as const;

export type Project = (typeof PROJECTS)[number];