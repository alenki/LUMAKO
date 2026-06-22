/**
 * Pure, side-effect-free formatting of a contact submission into the email
 * that lands in the studio inbox. Kept separate from the route so it can be
 * unit-tested without the Cloudflare runtime, mirroring `validation.ts`.
 */

export type ContactSubmission = {
  name: string;
  email: string;
  company?: string;
  message: string;
  budget?: string;
  services?: string[];
};

export type FormattedEmail = {
  subject: string;
  text: string;
  html: string;
};

/** Defensive caps so an oversized or abusive payload can't bloat the email. */
const LIMITS = {
  name: 120,
  email: 254,
  company: 160,
  budget: 60,
  service: 40,
  services: 12,
  message: 5000,
} as const;

const cap = (value: string, max: number) =>
  value.length > max ? value.slice(0, max) : value;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatContactEmail(data: ContactSubmission): FormattedEmail {
  const name = cap((data.name ?? "").trim(), LIMITS.name);
  const email = cap((data.email ?? "").trim(), LIMITS.email);
  const company = cap((data.company ?? "").trim(), LIMITS.company);
  const budget = cap((data.budget ?? "").trim(), LIMITS.budget);
  const services = (data.services ?? [])
    .map((s) => cap((s ?? "").trim(), LIMITS.service))
    .filter(Boolean)
    .slice(0, LIMITS.services);
  const message = cap((data.message ?? "").trim(), LIMITS.message);

  const subject = name
    ? `Новая заявка - ${name}`
    : "Новая заявка";

  const rows: [string, string][] = [
    ["Имя", name || "-"],
    ["Email", email || "-"],
    ["Компания", company || "-"],
    ["Бюджет", budget || "-"],
    ["Услуги", services.length ? services.join(", ") : "-"],
  ];

  const text = [
    "Новая заявка с сайта - lumako.ru",
    "",
    ...rows.map(([key, value]) => `${key}: ${value}`),
    "",
    "Сообщение:",
    message || "-",
    "",
    `Ответьте на это письмо, чтобы написать напрямую: ${name || email}.`,
  ].join("\n");

  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;line-height:1.6;max-width:560px;">
  <p style="margin:0 0 18px;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:#9a9a9a;">Новая заявка с сайта &middot; lumako.ru</p>
  <table style="border-collapse:collapse;font-size:14px;">
    ${rows
      .map(
        ([key, value]) =>
          `<tr><td style="padding:4px 18px 4px 0;color:#8a8a8a;vertical-align:top;white-space:nowrap;">${escapeHtml(
            key,
          )}</td><td style="padding:4px 0;color:#1a1a1a;">${escapeHtml(value)}</td></tr>`,
      )
      .join("\n    ")}
  </table>
  <p style="margin:22px 0 4px;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:#8a8a8a;">Сообщение</p>
  <div style="white-space:pre-wrap;font-size:15px;color:#1a1a1a;">${escapeHtml(
    message || "-",
  )}</div>
  <p style="margin:26px 0 0;font-size:13px;color:#9a9a9a;">Ответьте на это письмо, чтобы написать напрямую: ${escapeHtml(
    name || email,
  )}.</p>
</div>`.trim();

  return { subject, text, html };
}
