import { Github, Linkedin, Facebook, Mail } from "lucide-react";

type Chip = {
  label: string;
  href: string;
  bg: string;
  fg?: string;
  Icon: React.ComponentType<{ className?: string }>;
};

// Each chip is a pill with a brand background. Same height, same icon size,
// just different colors so the row reads like a "where to find me" strip.
const CHIPS: Chip[] = [
  {
    label: "GitHub",
    href: "https://github.com/zhameersheraz",
    bg: "#181717",
    Icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/zhameersheraz",
    bg: "#0A66C2",
    Icon: Linkedin,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/zhameersheraz",
    bg: "#1877F2",
    Icon: Facebook,
  },
  {
    label: "Email",
    href: "mailto:zhameersheraztampugao@gmail.com",
    bg: "#EA4335",
    Icon: Mail,
  },
];

export function SocialChips() {
  return (
    <ul className="flex flex-wrap items-center gap-2">
      {CHIPS.map(({ label, href, bg, fg = "#ffffff", Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-8 items-center gap-1.5 rounded-full px-3 font-mono text-[11px] font-medium uppercase tracking-wider shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ backgroundColor: bg, color: fg }}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
