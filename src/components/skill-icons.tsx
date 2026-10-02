import type { SVGProps } from "react";

/**
 * Custom icon set for the skills chips.
 *
 * Deliberately NOT brand logos. Official marks are wildly different shapes,
 * weights and colours, and dropping 23 of them into one chip row turns the
 * section into a sticker sheet. These are drawn as one family instead:
 * 24x24, 1.6 stroke, round caps and joins, currentColor so they inherit
 * whatever the theme is doing. They stay legible at the 14px the chip uses.
 */

type P = SVGProps<SVGSVGElement>;

const S = ({ children, ...rest }: P) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    focusable="false"
    {...rest}
  >
    {children}
  </svg>
);

const Dot = ({ cx, cy, r = 0.9 }: { cx: number; cy: number; r?: number }) => (
  <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />
);

/* ---------------------------------------------------------------- languages */

// two interlocking hooks, one opening right and one opening left
const Python = (p: P) => (
  <S {...p}>
    <path d="M7 5.5h2.8a3.9 3.9 0 0 1 3.9 3.9v.8" />
    <path d="M17 18.5h-2.8a3.9 3.9 0 0 1-3.9-3.9v-.8" />
    <Dot cx={8.6} cy={5.5} />
    <Dot cx={15.4} cy={18.5} />
  </S>
);

const JavaScript = (p: P) => (
  <S {...p}>
    <path d="M10 3.5H9a2 2 0 0 0-2 2V9a2 2 0 0 1-2 2 2 2 0 0 1 2 2v3.5a2 2 0 0 0 2 2h1" />
    <path d="M14 3.5h1a2 2 0 0 1 2 2V9a2 2 0 0 0 2 2 2 2 0 0 0-2 2v3.5a2 2 0 0 1-2 2h-1" />
  </S>
);

const TypeScript = (p: P) => (
  <S {...p}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M8.5 9.5h7M12 9.5v6.5" />
  </S>
);

const Html = (p: P) => (
  <S {...p}>
    <path d="M12 2.5 20 5.5v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6l8-3Z" />
    <path d="M8 10.5 12 7.5l4 3" />
  </S>
);

const Css = (p: P) => (
  <S {...p}>
    <rect x="4" y="3" width="16" height="18" rx="3" />
    <path d="M8 8.5h8M8 12h8M8 15.5h4" />
  </S>
);

const Bash = (p: P) => (
  <S {...p}>
    <path d="M5 7l4.5 5L5 17" />
    <path d="M12.5 17H19" />
  </S>
);

/* ----------------------------------------------------------------- security */

const Pentest = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="7.5" strokeDasharray="2.6 2.6" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M12 1.75v3M12 19.25v3M1.75 12h3M19.25 12h3" />
  </S>
);

// three nodes, three edges. A five node mesh turns to mush at 14px.
const NetworkSecurity = (p: P) => (
  <S {...p}>
    <path d="M10.5 6.7 6.4 16M13.5 6.7 17.6 16M7.3 17.8h9.4" />
    <circle cx="12" cy="4.8" r="2.3" />
    <circle cx="5" cy="17.8" r="2.3" />
    <circle cx="19" cy="17.8" r="2.3" />
  </S>
);

const WebExploitation = (p: P) => (
  <S {...p}>
    <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
    <path d="M3 9h18" />
    <Dot cx={6.2} cy={6.75} />
    <Dot cx={8.7} cy={6.75} />
    <Dot cx={11.2} cy={6.75} />
    <path d="M13 12.5l-2.2 3.4h3.2L12 19.5" />
  </S>
);

const ReverseEngineering = (p: P) => (
  <S {...p}>
    <path d="M20.25 12a8.25 8.25 0 1 1-2.7-6.1" />
    <path d="M20.25 3.5v4.75h-4.75" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="1.2" />
  </S>
);

const Cryptography = (p: P) => (
  <S {...p}>
    <rect x="4.5" y="10" width="15" height="10.5" rx="2.5" />
    <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    <path d="M12 13.75v2.75" />
  </S>
);

const Osint = (p: P) => (
  <S {...p}>
    <path d="M2.5 12S6 5.75 12 5.75 21.5 12 21.5 12 18 18.25 12 18.25 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </S>
);

const DigitalForensics = (p: P) => (
  <S {...p}>
    <path d="M14 3.5H7.5A2.5 2.5 0 0 0 5 6v9.5A2.5 2.5 0 0 0 7.5 18H10" />
    <path d="M8.5 8h3M8.5 11.5h3" />
    <circle cx="15.5" cy="15.5" r="4.25" />
    <path d="M18.7 18.7 21.5 21.5" />
  </S>
);

/* -------------------------------------------------------------------- tools */

const Linux = (p: P) => (
  <S {...p}>
    <path d="M12 2.8c2.6 0 4.3 2 4.3 4.6 0 1.5-.5 2.3-.5 3.2 0 1.3 1 1.8 1 3.2 0 3-2.1 5.2-4.8 5.2s-4.8-2.2-4.8-5.2c0-1.4 1-1.9 1-3.2 0-.9-.5-1.7-.5-3.2 0-2.6 1.7-4.6 4.3-4.6Z" />
    <path d="M9.6 19.4 8 21.6M14.4 19.4 16 21.6" />
    <Dot cx={10.3} cy={7.6} />
    <Dot cx={13.7} cy={7.6} />
  </S>
);

const Kali = (p: P) => (
  <S {...p}>
    <path d="M12 21.2a9.2 9.2 0 1 1 9.2-9.2c0 3.1-2.1 5.2-4.6 5.2-2.1 0-3.7-1.6-3.7-3.6 0-1.8 1.5-3.2 3.4-3.2 1.4 0 2.5 1 2.5 2.2" />
    <Dot cx={16.6} cy={9.8} />
  </S>
);

const Git = (p: P) => (
  <S {...p}>
    <circle cx="6.5" cy="5.5" r="2.5" />
    <circle cx="6.5" cy="18.5" r="2.5" />
    <circle cx="17.5" cy="9" r="2.5" />
    <path d="M6.5 8v8" />
    <path d="M17.5 11.5c0 3.4-3.1 3.9-8 4.4" />
  </S>
);

const VsCode = (p: P) => (
  <S {...p}>
    <path d="M16.5 3.5 7.5 12l9 8.5" />
    <path d="M16.5 3.5 21 6.2v11.6l-4.5 2.7" />
    <path d="M13.2 9.8 16.8 12l-3.6 2.2" />
  </S>
);

const BurpSuite = (p: P) => (
  <S {...p}>
    <path d="M3 9.5h5M5.5 7 3 9.5 5.5 12" />
    <path d="M21 14.5h-5M18.5 12l2.5 2.5-2.5 2.5" />
    <path d="M12 3.5v17" strokeDasharray="2.4 2.4" />
  </S>
);

const Wireshark = (p: P) => (
  <S {...p}>
    <path d="M6 14.5 12 4.5l6 10" />
    <path d="M2.5 18c1.7 0 2.4-1.3 4.2-1.3S8.4 18 10.2 18s2.3-1.3 4.1-1.3S16.8 18 18.6 18s2.4-1.3 2.9-1.3" />
  </S>
);

const Nmap = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.75" />
    <circle cx="12" cy="12" r="4.75" />
    <path d="M12 12l6.5-4.5" />
    <Dot cx={16.2} cy={9} r={1.1} />
  </S>
);

/* ------------------------------------------------------- currently learning */

const ActiveDirectory = (p: P) => (
  <S {...p}>
    <rect x="9" y="2.5" width="6" height="4.5" rx="1.3" />
    <rect x="2.5" y="16.5" width="6" height="4.5" rx="1.3" />
    <rect x="15.5" y="16.5" width="6" height="4.5" rx="1.3" />
    <path d="M12 7v4.5" />
    <path d="M5.5 16.5V14a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v2.5" />
  </S>
);

const CloudSecurity = (p: P) => (
  <S {...p}>
    <path d="M7.25 18.5a4.1 4.1 0 0 1-.45-8.17 5.55 5.55 0 0 1 10.62-1.1 3.9 3.9 0 0 1 .08 9.27Z" />
    <rect x="10" y="12.6" width="4.6" height="4.1" rx="1.2" />
    <path d="M11 12.6v-1.1a1.3 1.3 0 0 1 2.6 0v1.1" />
  </S>
);

const MalwareAnalysis = (p: P) => (
  <S {...p}>
    <ellipse cx="12" cy="12" rx="3.9" ry="5.4" />
    <path d="M12 6.6v10.8" />
    <path d="M8.3 9 5.2 7M15.7 9l3.1-2M8.3 15l-3.1 2M15.7 15l3.1 2" />
    <path d="M9.6 6.9h4.8" />
  </S>
);

/* ------------------------------------------------------------------------- */

export const SKILL_ICONS: Record<string, (p: P) => React.ReactElement> = {
  Python,
  JavaScript,
  TypeScript,
  HTML: Html,
  CSS: Css,
  Bash,
  "Penetration Testing": Pentest,
  "Network Security": NetworkSecurity,
  "Web Exploitation": WebExploitation,
  "Reverse Engineering": ReverseEngineering,
  Cryptography,
  OSINT: Osint,
  "Digital Forensics": DigitalForensics,
  Linux,
  Kali,
  Git,
  VSCode: VsCode,
  "Burp Suite": BurpSuite,
  Wireshark,
  Nmap,
  "Active Directory": ActiveDirectory,
  "Cloud Security": CloudSecurity,
  "Malware Analysis": MalwareAnalysis,
};
