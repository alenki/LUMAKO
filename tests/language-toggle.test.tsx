import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
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

  it("exposes lang='ar' on the Arabic label", () => {
    const { getByRole } = render(
      <LanguageToggle value="en" onChange={() => {}} />,
    );

    expect(
      getByRole("button", { name: "عربي" }).getAttribute("lang"),
    ).toBe("ar");
  });

  it("is grouped and labeled for assistive tech", () => {
    const { getByRole } = render(
      <LanguageToggle value="en" onChange={() => {}} />,
    );

    expect(getByRole("group", { name: "Language" })).toBeTruthy();
  });
});
