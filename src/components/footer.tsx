import Link from "next/link";
import { Github, Linkedin, Facebook, Mail } from "lucide-react";
import { SITE, SOCIAL } from "@/lib/config";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Facebook: Facebook,
  Email: Mail,
};

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border">
      <div className="container-wide py-12">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="font-display text-base font-bold tracking-tight">
                <span className="text-accent">Z</span>S<span className="text-muted-foreground">.</span>
              </span>
            </Link>
            <p className="mt-3 max-w-md text-sm text-muted-foreground text-pretty">
              {SITE.description}
            </p>
          </div>
          <ul className="grid gap-2 text-sm">
            {SOCIAL.map((s) => {
              const Icon = ICONS[s.label];
              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 text-muted-foreground hover:text-foreground"
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span className="font-mono text-xs uppercase tracking-wider">
                      {s.label}
                    </span>
                    <span className="text-foreground/80">{s.handle}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p className="font-mono uppercase tracking-wider">
            © {year} {SITE.name}
          </p>
          <p className="font-mono uppercase tracking-wider">
            Built with Next.js · Hosted on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}