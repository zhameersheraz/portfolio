import Link from "next/link";
import { SITE } from "@/lib/config";
import { SocialChips } from "@/components/social-chips";

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
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Find me
            </p>
            <SocialChips />
          </div>
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