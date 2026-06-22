"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Field } from "@/components/ui/Field";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import {
  validateContact,
  type ContactErrors,
} from "@/components/sections/contact/validation";
import { copy } from "@/lib/content/copy";
import { site } from "@/lib/content/site";
import { easeOutExpo, fadeUp, stagger } from "@/lib/motion";

type Status = "idle" | "submitting" | "success" | "error";

// Web3Forms relays the contact form without a backend (the static export has no
// server route). The access key is public by design - it only routes mail to
// the address registered at https://web3forms.com. Set it at build time via
// NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY, or replace the placeholder below.
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "YOUR_WEB3FORMS_ACCESS_KEY";

const budgets = copy.contact.budgets;
const serviceOptions = copy.contact.serviceOptions;

type ContactFormProps = {
  /** Lets the parent hide the page headline once the message is sent. */
  onSentChange?: (sent: boolean) => void;
};

export function ContactForm({ onSentChange }: ContactFormProps = {}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  // Honeypot - hidden from people, irresistible to bots. Stays empty for humans.
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [sendFailed, setSendFailed] = useState(false);

  function toggleService(option: string) {
    setSelectedServices((prev) =>
      prev.includes(option)
        ? prev.filter((s) => s !== option)
        : [...prev, option],
    );
  }

  // "Send another message" - clear the slate and return to a fresh form.
  function reset() {
    setName("");
    setEmail("");
    setCompany("");
    setMessage("");
    setBudget("");
    setSelectedServices([]);
    setErrors({});
    setSendFailed(false);
    setStatus("idle");
    onSentChange?.(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Guard against double-submits: a second click while a POST is in flight
    // would fire a duplicate Web3Forms send (there's no server to dedupe now).
    if (status === "submitting") return;

    // Honeypot: a hidden field real users never see. If a bot filled it, report
    // success without sending so it can't tell it was caught. Checked before the
    // validation gate to mirror the old server route exactly - the static export
    // has no server, so this silent-drop now runs client-side.
    if (website.trim() !== "") {
      setStatus("success");
      onSentChange?.(true);
      return;
    }

    const result = validateContact({ name, email, message });
    if (!result.ok) {
      setErrors(result.errors);
      setStatus("error");
      return;
    }
    setErrors({});
    setSendFailed(false);
    if (
      process.env.NODE_ENV !== "production" &&
      WEB3FORMS_ACCESS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY"
    ) {
      console.warn(
        "[contact] NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set - Web3Forms will reject this submission. See .env.example.",
      );
    }
    setStatus("submitting");
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Новая заявка с сайта - ${name.trim() || email.trim()}`,
          from_name: "Форма обратной связи Lumako",
          name,
          email,
          company,
          message,
          budget,
          // The old route took an array; Web3Forms wants flat fields, so join.
          services: selectedServices.join(", "),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
      };
      // Fields are already validated client-side above, so any failure here is
      // a delivery problem, not a validation one.
      if (!res.ok || !data.success) {
        setSendFailed(true);
        setStatus("error");
        return;
      }
      setStatus("success");
      onSentChange?.(true);
    } catch {
      setSendFailed(true);
      setStatus("error");
    }
  }

  if (status === "success") {
    const s = copy.contact.success;
    return (
      <motion.div initial="hidden" animate="show" variants={stagger}>
        <motion.h2
          variants={fadeUp}
          className="font-display text-[length:var(--text-6xl)] font-medium leading-[1.02] tracking-tight text-balance"
        >
          {s.title}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mt-7 max-w-[44ch] text-[length:var(--text-2xl)] text-fg-body leading-relaxed text-pretty"
        >
          {s.body}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-12 flex flex-wrap items-center gap-x-9 gap-y-5"
        >
          <Button
            variant="ghost"
            onClick={reset}
            className="px-9 py-4 text-[length:var(--text-lg)]"
          >
            Отправить ещё одно сообщение
          </Button>
          <Link
            href="/work"
            data-cursor
            className="group inline-flex items-center gap-2 text-[length:var(--text-lg)] font-medium text-fg-muted transition-colors hover:text-fg"
          >
            Смотреть работы
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">
      {/* Honeypot - positioned off-screen, skipped by tab and assistive tech. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <label htmlFor="contact-website">Оставьте это поле пустым</label>
        <input
          type="text"
          id="contact-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-8 sm:flex-row">
        <Field
          label="Ваше имя"
          name="name"
          value={name}
          onChange={setName}
          placeholder="Иван Иванов"
          required
          error={errors.name}
          className="flex-1"
        />
        <Field
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="ivan@company.ru"
          required
          error={errors.email}
          className="flex-1"
        />
      </div>

      <Field
        label="Компания"
        name="company"
        value={company}
        onChange={setCompany}
        placeholder="Необязательно"
      />

      <fieldset className="flex flex-col">
        <legend className="label-caps">
          Бюджет
        </legend>
        <div className="mt-4 flex flex-wrap gap-3">
          {budgets.map((option) => (
            <Tag
              key={option}
              active={budget === option}
              onClick={() => setBudget(budget === option ? "" : option)}
            >
              {option}
            </Tag>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col">
        <legend className="label-caps">
          Что нужно{" "}
          <span className="text-fg-dim">- любое</span>
        </legend>
        <div className="mt-4 flex flex-wrap gap-3">
          {serviceOptions.map((option) => (
            <Tag
              key={option}
              active={selectedServices.includes(option)}
              onClick={() => toggleService(option)}
            >
              {option}
            </Tag>
          ))}
        </div>
      </fieldset>

      <Field
        label="О проекте"
        name="message"
        as="textarea"
        value={message}
        onChange={setMessage}
        placeholder="Что вы создаёте и на каком этапе находитесь?"
        required
        error={errors.message}
      />

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <Button type="submit">
          {status === "submitting" ? "Отправляем…" : "Отправить"}
        </Button>
        <span className="text-[length:var(--text-base)] text-fg-dim">
          Или напишите на{" "}
          <a
            href={`mailto:${site.email}`}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor
            className="font-medium text-fg"
          >
            {site.email}
          </a>
        </span>
      </div>

      <AnimatePresence>
        {status === "error" && (sendFailed || Object.keys(errors).length > 0) ? (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
            className={
              sendFailed
                ? "text-[length:var(--text-base)] text-error"
                : "label-caps !text-error"
            }
          >
            {sendFailed ? (
              <>
                Что-то пошло не так на нашей стороне. Напишите нам на{" "}
                <a
                  href={`mailto:${site.email}`}
                  data-cursor
                  className="underline decoration-error/50 underline-offset-4"
                >
                  {site.email}
                </a>{" "}
                или попробуйте ещё раз через минуту.
              </>
            ) : (
              "Исправьте выделенные поля и попробуйте снова."
            )}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </form>
  );
}
