"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Check, AlertCircle, Loader2 } from "lucide-react";
import { SectionHeader } from "@/components/about";
import { SOCIAL, SITE } from "@/lib/config";

const schema = z.object({
  name: z.string().min(2, "Too short").max(80),
  email: z.string().email("That doesn't look like an email"),
  subject: z.string().max(120).optional().or(z.literal("")),
  message: z.string().min(10, "A bit more detail please").max(4000),
  // honeypot
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

export function Contact() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { name: "", email: "", subject: "", message: "", website: "" },
  });

  async function onSubmit(values: FormValues) {
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }
      setStatus({ kind: "ok" });
      reset();
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Something broke.",
      });
    }
  }

  return (
    <section id="contact" className="container-wide py-24">
      <SectionHeader
        index="05"
        label="Contact"
        title="Get in touch"
        description="Bug bounty invites, collab, writeup suggestions, or just a hello."
      />

      <div className="mt-10 grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="rounded-lg border border-border bg-card p-6 md:p-8"
        >
          {/* Honeypot — keep bots busy */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            {...register("website")}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Name"
              error={errors.name?.message}
              input={
                <input
                  type="text"
                  autoComplete="name"
                  className="form-input"
                  placeholder="Jane Doe"
                  {...register("name")}
                />
              }
            />
            <Field
              label="Email"
              error={errors.email?.message}
              input={
                <input
                  type="email"
                  autoComplete="email"
                  className="form-input"
                  placeholder="jane@example.com"
                  {...register("email")}
                />
              }
            />
          </div>
          <div className="mt-4">
            <Field
              label="Subject (optional)"
              error={errors.subject?.message}
              input={
                <input
                  type="text"
                  className="form-input"
                  placeholder="CTF collab"
                  {...register("subject")}
                />
              }
            />
          </div>
          <div className="mt-4">
            <Field
              label="Message"
              error={errors.message?.message}
              input={
                <textarea
                  rows={6}
                  className="form-input resize-y"
                  placeholder="Tell me what you're working on…"
                  {...register("message")}
                />
              }
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Replies usually within 24–48h.
            </p>
            <button
              type="submit"
              disabled={!isValid || isSubmitting || status.kind === "sending"}
              className="group inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {status.kind === "sending" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  Send message
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>

          {status.kind === "ok" && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent">
              <Check className="h-4 w-4" />
              Sent — I&apos;ll get back to you soon.
            </div>
          )}
          {status.kind === "error" && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {status.message}
            </div>
          )}
        </form>

        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-mono text-muted-foreground">Direct</p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-2 block break-all font-mono text-sm hover:text-accent"
            >
              {SITE.email}
            </a>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-mono mb-3 text-muted-foreground">Elsewhere</p>
            <ul className="space-y-2">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-sm"
                  >
                    <span className="text-mono text-xs uppercase tracking-wider text-muted-foreground">
                      {s.label} →
                    </span>
                    <span className="ml-2 text-foreground">{s.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <style jsx>{`
        :global(.form-input) {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          color: hsl(var(--foreground));
          outline: none;
          transition: border-color 0.15s;
        }
        :global(.form-input:focus) {
          border-color: hsl(var(--foreground) / 0.5);
        }
        :global(.form-input::placeholder) {
          color: hsl(var(--muted-foreground) / 0.7);
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  error,
  input,
}: {
  label: string;
  error?: string;
  input: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 inline-block text-mono text-muted-foreground">
        {label}
      </span>
      {input}
      {error && (
        <span className="mt-1 block text-xs text-destructive">{error}</span>
      )}
    </label>
  );
}