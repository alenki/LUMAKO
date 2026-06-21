import { describe, it, expect } from "vitest";
import { formatContactEmail } from "@/components/sections/contact/email";

const full = {
  name: "Jane Doe",
  email: "jane@company.com",
  company: "Acme Inc",
  message: "We are building a fintech product and need help shipping it.",
  budget: "$10k-$20k",
  services: ["Web", "AI"],
};

describe("formatContactEmail", () => {
  it("puts the sender name in the subject", () => {
    expect(formatContactEmail(full).subject).toBe(
      "New project inquiry - Jane Doe",
    );
  });

  it("falls back to a generic subject when the name is empty", () => {
    expect(formatContactEmail({ ...full, name: "" }).subject).toBe(
      "New project inquiry",
    );
  });

  it("includes every field in the text body", () => {
    const { text } = formatContactEmail(full);
    expect(text).toContain("Name: Jane Doe");
    expect(text).toContain("Email: jane@company.com");
    expect(text).toContain("Company: Acme Inc");
    expect(text).toContain("Budget: $10k-$20k");
    expect(text).toContain("Services: Web, AI");
    expect(text).toContain("We are building a fintech product");
  });

  it("shows a dash for omitted optional fields", () => {
    const { text } = formatContactEmail({
      name: "Jane Doe",
      email: "jane@company.com",
      message: "A short but valid project description here.",
    });
    expect(text).toContain("Company: -");
    expect(text).toContain("Budget: -");
    expect(text).toContain("Services: -");
  });

  it("escapes HTML in user input to prevent injection in the email client", () => {
    const { html } = formatContactEmail({
      ...full,
      name: "<script>alert(1)</script>",
      message: "Tags <b>here</b> & there",
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("Tags &lt;b&gt;here&lt;/b&gt; &amp; there");
  });

  it("caps an oversized message so the email stays bounded", () => {
    const { text } = formatContactEmail({
      ...full,
      message: "x".repeat(6000),
    });
    expect(text).toContain("x".repeat(5000));
    expect(text).not.toContain("x".repeat(5001));
  });

  it("trims and drops empty service entries", () => {
    const { text } = formatContactEmail({
      ...full,
      services: ["  Web  ", "", "Apps"],
    });
    expect(text).toContain("Services: Web, Apps");
  });
});
