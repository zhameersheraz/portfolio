/**
 * Contact form delivery.
 *
 * Two providers, picked by environment:
 *
 *   FORMSPREE_FORM_ID   Formspree. Default. Free, no domain of your own
 *                       required, no card. Deliveries land in the inbox you
 *                       link on Formspree. Free tier is 50 submissions/month.
 *
 *   RESEND_API_KEY      Resend. Used automatically once set. Needs a domain
 *                       you own verified in Resend, because the default
 *                       onboarding@resend.dev sender is only allowed to
 *                       deliver to the Resend account owner. Keep this as the
 *                       upgrade path rather than the default.
 *
 * History, because this bit twice: the first version logged to stdout and
 * returned { ok: true } whenever RESEND_API_KEY was unset, which the docs
 * listed as optional. The route mapped that to HTTP 200 with
 * { id: "dev-noop" }, so every visitor saw "Sent." and nothing was ever
 * delivered. Unconfigured is now a hard failure in production. Only a local
 * dev server keeps the stdout shortcut.
 */

type ContactPayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

type Result = { ok: boolean; id?: string; error?: string };

const NOT_CONFIGURED =
  "Contact form is not configured. Set FORMSPREE_FORM_ID (free) or RESEND_API_KEY.";

export async function sendContactEmail(payload: ContactPayload): Promise<Result> {
  if (process.env.FORMSPREE_FORM_ID) return sendViaFormspree(payload);
  if (process.env.RESEND_API_KEY) return sendViaResend(payload);

  if (process.env.NODE_ENV === "production") {
    console.error("[contact] " + NOT_CONFIGURED);
    return { ok: false, error: NOT_CONFIGURED };
  }

  console.log("[contact] no provider configured, logging instead:");
  console.log({
    to: process.env.CONTACT_TO_EMAIL ?? "owner@localhost",
    subject: subjectLine(payload),
    ...payload,
  });
  return { ok: true, id: "dev-noop" };
}

function subjectLine(p: ContactPayload): string {
  return p.subject?.trim()
    ? `${p.subject} from ${p.name}`
    : `New message from ${p.name}`;
}

/**
 * Formspree takes JSON at https://formspree.io/f/<id> and answers with its own
 * JSON body. It does not accept the from/address shape Resend does, so the
 * payload is mapped explicitly rather than shared.
 */
async function sendViaFormspree(p: ContactPayload): Promise<Result> {
  const id = process.env.FORMSPREE_FORM_ID as string;
  try {
    const res = await fetch(`https://formspree.io/f/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: p.name,
        email: p.email,
        subject: subjectLine(p),
        message: p.message,
        _subject: subjectLine(p),
      }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      errors?: Array<{ message?: string } | string>;
    };

    if (!res.ok) {
      const first = data.errors?.[0];
      const msg =
        typeof first === "string" ? first : first?.message ?? `Formspree ${res.status}`;
      return { ok: false, error: msg };
    }
    return { ok: true, id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown Formspree error",
    };
  }
}

async function sendViaResend(p: ContactPayload): Promise<Result> {
  const apiKey = process.env.RESEND_API_KEY as string;
  const from = process.env.CONTACT_FROM_EMAIL ?? "portfolio@localhost";
  const to = process.env.CONTACT_TO_EMAIL ?? "owner@localhost";

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
      from,
      to,
      replyTo: p.email,
      subject: subjectLine(p),
      html: renderContactHtml(p),
      text: renderContactText(p),
    });

    if (result.error) return { ok: false, error: result.error.message };
    return { ok: true, id: result.data?.id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown email error",
    };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderContactHtml(p: ContactPayload): string {
  return `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; max-width: 560px; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
      <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; margin: 0 0 16px;">Portfolio contact form</p>
      <h2 style="margin: 0 0 24px; font-size: 20px; color: #111;">Message from ${escapeHtml(p.name)}</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 8px 0; color: #6b7280; width: 96px;">From</td><td style="padding: 8px 0; color: #111;">${escapeHtml(p.name)} &lt;${escapeHtml(p.email)}&gt;</td></tr>
        ${p.subject ? `<tr><td style="padding: 8px 0; color: #6b7280;">Subject</td><td style="padding: 8px 0; color: #111;">${escapeHtml(p.subject)}</td></tr>` : ""}
      </table>
      <div style="margin-top: 24px; padding: 16px; background: #f9fafb; border-radius: 8px; white-space: pre-wrap; font-size: 14px; color: #111; line-height: 1.6;">${escapeHtml(p.message)}</div>
    </div>
  `;
}

function renderContactText(p: ContactPayload): string {
  return [
    `From: ${p.name} <${p.email}>`,
    p.subject ? `Subject: ${p.subject}` : "",
    "",
    p.message,
  ]
    .filter(Boolean)
    .join("\n");
}