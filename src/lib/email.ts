/**
 * Email service — uses Resend if RESEND_API_KEY is set,
 * otherwise logs to stdout so the form is testable in dev.
 */

type ContactPayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

export async function sendContactEmail(payload: ContactPayload): Promise<{
  ok: boolean;
  id?: string;
  error?: string;
}> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL ?? "portfolio@localhost";
  const to = process.env.CONTACT_TO_EMAIL ?? "owner@localhost";

  if (!apiKey) {
    console.log("[contact] no RESEND_API_KEY — logging instead:");
    console.log({
      from,
      to,
      subject: payload.subject || "New message from portfolio",
      ...payload,
    });
    return { ok: true, id: "dev-noop" };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const html = renderContactHtml(payload);
    const text = renderContactText(payload);

    const result = await resend.emails.send({
      from,
      to,
      replyTo: payload.email,
      subject: payload.subject?.trim()
        ? `${payload.subject} — from ${payload.name}`
        : `New message from ${payload.name}`,
      html,
      text,
    });

    if (result.error) {
      return { ok: false, error: result.error.message };
    }
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