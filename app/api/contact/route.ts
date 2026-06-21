import { getCloudflareContext } from "@opennextjs/cloudflare";
import { validateContact } from "@/components/sections/contact/validation";
import { formatContactEmail } from "@/components/sections/contact/email";

/** Env vars set as Worker secrets (and `.dev.vars` locally), not in source. */
type ContactEnv = CloudflareEnv & {
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
};

const asString = (value: unknown) => (typeof value === "string" ? value : "");

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, errors: { message: "Invalid request." } },
      { status: 400 },
    );
  }

  const data = body as Record<string, unknown>;

  // Honeypot: a hidden field real users never see. If it's filled, a bot did
  // it - return a success shape so the bot can't tell it was caught.
  if (asString(data?.website).trim() !== "") {
    return Response.json({ ok: true });
  }

  const submission = {
    name: asString(data?.name),
    email: asString(data?.email),
    company: asString(data?.company),
    message: asString(data?.message),
    budget: asString(data?.budget),
    services: Array.isArray(data?.services)
      ? data.services.filter((s): s is string => typeof s === "string")
      : [],
  };

  const result = validateContact(submission);
  if (!result.ok) {
    return Response.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  const { subject, text, html } = formatContactEmail(submission);

  // Resolve the Email Routing binding + addresses. Wrapped because
  // getCloudflareContext() is only available inside the Workers runtime.
  let env: ContactEnv | undefined;
  try {
    env = getCloudflareContext().env as ContactEnv;
  } catch {
    env = undefined;
  }

  const to = env?.CONTACT_TO_EMAIL;
  const from = env?.CONTACT_FROM_EMAIL;
  const mailer = env?.EMAIL;

  // Local dev (miniflare simulates the binding) or an unconfigured deploy:
  // log the submission so nothing is lost, and report success to the user.
  if (!mailer || !to || !from) {
    console.warn(
      "[contact] EMAIL binding or CONTACT_TO_EMAIL/CONTACT_FROM_EMAIL not configured - logging instead of sending.",
    );
    console.info(`[contact] submission:\n${text}`);
    return Response.json({ ok: true });
  }

  try {
    await mailer.send({
      from: { name: "Lumako Contact Form", email: from },
      to,
      replyTo: {
        name: submission.name.trim() || submission.email.trim(),
        email: submission.email.trim(),
      },
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("[contact] failed to send email:", error);
    return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
