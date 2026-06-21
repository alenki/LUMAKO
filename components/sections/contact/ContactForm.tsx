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
    const result = validateContact({ name, email, message });
    if (!result.ok) {
      setErrors(result.errors);
      setStatus("error");
      return;
    }
    setErrors({});
    setSendFailed(false);
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          message,
          budget,
          services: selectedServices,
          website,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          errors?: ContactErrors;
        };
        const fieldErrors = data.errors ?? {};
        setErrors(fieldErrors);
        // A validation rejection comes back with field errors; anything else
        // (the email failed to send, server error) is a delivery failure.
        setSendFailed(Object.keys(fieldErrors).length === 0);
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
            Send another message
          </Button>
          <Link
            href="/work"
            data-cursor
            className="group inline-flex items-center gap-2 text-[length:var(--text-lg)] font-medium text-fg-muted transition-colors hover:text-fg"
          >
            See the work
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
        <label htmlFor="contact-website">Leave this field empty</label>
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
          label="Your name"
          name="name"
          value={name}
          onChange={setName}
          placeholder="Jane Doe"
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
          placeholder="jane@company.com"
          required
          error={errors.email}
          className="flex-1"
        />
      </div>

      <Field
        label="Company"
        name="company"
        value={company}
        onChange={setCompany}
        placeholder="Optional"
      />

      <fieldset className="flex flex-col">
        <legend className="label-caps">
          Budget
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
          What you need{" "}
          <span className="text-fg-dim">- pick any</span>
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
        label="The project"
        name="message"
        as="textarea"
        value={message}
        onChange={setMessage}
        placeholder="What are you building, and where are you in the process?"
        required
        error={errors.message}
      />

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <Button type="submit">
          {status === "submitting" ? "Sending…" : "Send message"}
        </Button>
        <span className="text-[length:var(--text-base)] text-fg-dim">
          Or email{" "}
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
                Something went wrong on our end. Please email us at{" "}
                <a
                  href={`mailto:${site.email}`}
                  data-cursor
                  className="underline decoration-error/50 underline-offset-4"
                >
                  {site.email}
                </a>{" "}
                or try again in a moment.
              </>
            ) : (
              "Please fix the highlighted fields and try again."
            )}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </form>
  );
}
