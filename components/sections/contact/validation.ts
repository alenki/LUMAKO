export type ContactData = {
  name: string;
  email: string;
  message: string;
};

export type ContactErrors = {
  name?: string;
  email?: string;
  message?: string;
};

export type ContactValidation = {
  ok: boolean;
  errors: ContactErrors;
};

/** Basic, permissive email shape check - not RFC-exhaustive, just sane. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MESSAGE_MIN = 10;

/**
 * Pure, side-effect-free validation shared by the form and the API route.
 * Returns `ok: true` only when there are no field errors.
 */
export function validateContact(data: ContactData): ContactValidation {
  const errors: ContactErrors = {};

  if (!data.name.trim()) {
    errors.name = "Tell us who you are.";
  }

  const email = data.email.trim();
  if (!email) {
    errors.email = "We need an email to reply.";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "That email doesn't look right.";
  }

  const message = data.message.trim();
  if (!message) {
    errors.message = "A few words about the project, please.";
  } else if (message.length < MESSAGE_MIN) {
    errors.message = "A little more detail would help.";
  }

  return { ok: Object.keys(errors).length === 0, errors };
}
