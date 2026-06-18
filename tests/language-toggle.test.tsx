import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, within } from "@testing-library/react";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

describe("LanguageToggle", () => {
  it("renders EN and عربي and marks the value prop active", () => {
    const { getByRole } = render(
      <LanguageToggle value="en" onChange={() => {}} />,
    );

    const en = getByRole("button", { name: "EN" });
    const ar = getByRole("button", { name: "عربي" });

    expect(en.getAttribute("aria-pressed")).toBe("true");
    expect(ar.getAttribute("aria-pressed")).toBe("false");
  });

  it("marks Arabic active when value is 'ar'", () => {
    const { getByRole } = render(
      <LanguageToggle value="ar" onChange={() => {}} />,
    );

    expect(
      getByRole("button", { name: "EN" }).getAttribute("aria-pressed"),
    ).toBe("false");
    expect(
      getByRole("button", { name: "عربي" }).getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it("calls onChange with the clicked locale", () => {
    const onChange = vi.fn();
    const { getByRole } = render(
      <LanguageToggle value="en" onChange={onChange} />,
    );

    fireEvent.click(getByRole("button", { name: "عربي" }));
    expect(onChange).toHaveBeenCalledWith("ar");
  });

  it("still fires onChange when the already-active language is clicked", () => {
    const onChange = vi.fn();
    const { getByRole } = render(
      <LanguageToggle value="en" onChange={onChange} />,
    );

    fireEvent.click(getByRole("button", { name: "EN" }));
    expect(onChange).toHaveBeenCalledWith("en");
  });

  it("exposes lang='ar' on the Arabic label", () => {
    const { getByRole } = render(
      <LanguageToggle value="en" onChange={() => {}} />,
    );

    expect(
      getByRole("button", { name: "عربي" }).getAttribute("lang"),
    ).toBe("ar");
  });

  it("groups both languages under a labeled 'Language' group", () => {
    const { getByRole } = render(
      <LanguageToggle value="en" onChange={() => {}} />,
    );

    const group = getByRole("group", { name: "Language" });
    expect(within(group).getAllByRole("button")).toHaveLength(2);
  });
});
