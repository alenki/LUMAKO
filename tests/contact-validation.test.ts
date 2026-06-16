import { describe, it, expect } from "vitest";
import { validateContact } from "@/components/sections/contact/validation";

const valid = {
  name: "Jane Doe",
  email: "jane@company.com",
  message: "We are building a fintech product and need help.",
};

describe("validateContact", () => {
  it("accepts a complete, valid submission", () => {
    const r = validateContact(valid);
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual({});
  });

  it("requires a name", () => {
    const r = validateContact({ ...valid, name: "   " });
    expect(r.ok).toBe(false);
    expect(r.errors.name).toBeTruthy();
  });

  it("requires a valid email", () => {
    expect(validateContact({ ...valid, email: "" }).errors.email).toBeTruthy();
    expect(validateContact({ ...valid, email: "not-an-email" }).errors.email).toBeTruthy();
    expect(validateContact({ ...valid, email: "a@b.co" }).errors.email).toBeUndefined();
  });

  it("requires a message of at least 10 characters", () => {
    expect(validateContact({ ...valid, message: "" }).ok).toBe(false);
    expect(validateContact({ ...valid, message: "too short" }).ok).toBe(false);
    expect(validateContact({ ...valid, message: "this is long enough" }).ok).toBe(true);
  });
});
