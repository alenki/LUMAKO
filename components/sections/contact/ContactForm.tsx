"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Field } from "@/components/ui/Field";
import { Tag } from "@/components/ui/Tag";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Button } from "@/components/ui/Button";
import {
  validateContact,
  type ContactErrors,
} from "@/components/sections/contact/validation";
import { copy } from "@/lib/content/copy";
import { site } from "@/lib/content/site";
import { easeOutExpo } from "@/lib/motion";

type Status = "idle" | "submitting" | "success" | "error";

const budgets = copy.contact.budgets;
const serviceOptions = copy.contact.serviceOptions;

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  function toggleService(option: string) {
    setSelectedServices((prev) =>
      prev.includes(option)
        ? prev.filter((s) => s !== option)
        : [...prev, option],
    );
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
        }),
      });
      if (!res.ok) {
        const data: { errors?: ContactErrors } = await res.json();
        setErrors(data.errors ?? {});
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    const s = copy.contact.success;
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: easeOutExpo }}
        className="flex min-h-[24rem] flex-col justify-center rounded-[10px] border border-line bg-card p-10"
      >
        <span className="label-caps !text-accent-deep">
          (✓) Sent
        </span>
        <h2 className="mt-6 font-display text-[length:var(--text-4xl)] font-light leading-tight tracking-tight text-balance">
          {s.title}
        </h2>
        <p className="mt-4 max-w-[44ch] text-[length:var(--text-lg)] text-fg-muted text-pretty">
          {s.body}
        </p>
        <p className="mt-8 text-[length:var(--text-base)] text-fg-dim">
          In the meantime, reach us directly at{" "}
          <a
            href={`mailto:${site.email}`}
            data-cursor
            className="text-fg underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            {site.email}
          </a>
          .
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">
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

      <fieldset className="flex flex-col gap-4">
        <legend className="label-caps">
          Budget
        </legend>
        <div className="flex flex-wrap gap-3">
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

      <fieldset className="flex flex-col gap-4">
        <legend className="label-caps">
          What you need{" "}
          <span className="text-fg-dim">— pick any</span>
        </legend>
        <div className="flex flex-wrap gap-3">
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
        <MagneticButton type="submit" strength={0.4}>
          {status === "submitting" ? "Sending…" : "Send message"}
        </MagneticButton>
        <span className="text-[length:var(--text-base)] text-fg-dim">
          Or email{" "}
          <Button href={`mailto:${site.email}`} variant="link" external>
            {site.email}
          </Button>
        </span>
      </div>

      <AnimatePresence>
        {status === "error" && Object.keys(errors).length > 0 ? (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
            className="label-caps !text-accent-deep"
          >
            Please fix the highlighted fields and try again.
          </motion.p>
        ) : null}
      </AnimatePresence>
    </form>
  );
}
