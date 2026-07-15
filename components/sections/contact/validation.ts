export type ContactData = {
  name: string;
  email: string;
  message: string;
};

export type ContactErrors = {
  name?: string;
  email?: string;
  message?: string;
  // Legal consent (152-ФЗ) is a client-side submit gate, not part of the shared
  // data validation - the form sets this, `validateContact` never does.
  consent?: string;
};

export type ContactValidation = {
  ok: boolean;
  errors: ContactErrors;
};

/** Basic, permissive email shape check - not RFC-exhaustive, just sane. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NAME_MAX = 120;
const EMAIL_MAX = 254;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 5000;

/**
 * Pure, side-effect-free validation shared by the form and the API route.
 * Returns `ok: true` only when there are no field errors.
 */
export function validateContact(data: ContactData): ContactValidation {
  const errors: ContactErrors = {};

  const name = data.name.trim();
  if (!name) {
    errors.name = "Представьтесь, пожалуйста.";
  } else if (name.length > NAME_MAX) {
    errors.name = "Имя слишком длинное.";
  }

  const email = data.email.trim();
  if (!email) {
    errors.email = "Нужен email, чтобы ответить.";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Похоже, email указан неверно.";
  } else if (email.length > EMAIL_MAX) {
    errors.email = "Email слишком длинный.";
  }

  const message = data.message.trim();
  if (!message) {
    errors.message = "Пара слов о проекте, пожалуйста.";
  } else if (message.length < MESSAGE_MIN) {
    errors.message = "Чуть больше деталей - и будет понятнее.";
  } else if (message.length > MESSAGE_MAX) {
    errors.message = "Многовато - сократите немного?";
  }

  return { ok: Object.keys(errors).length === 0, errors };
}
