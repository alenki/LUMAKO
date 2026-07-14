import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { WorkMarquee } from "@/components/sections/home/WorkMarquee";
import { work } from "@/lib/content/work";

vi.mock("next/image", () => ({
  default: ({ src, alt = "" }: { src: string; alt?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element -- test stub
    <img src={src} alt={alt} />
  ),
}));

function mockMedia() {
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({
    matches: q.includes("hover: hover"),
    media: q,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function mockAnimations(container: HTMLElement, width = 4500) {
  const tracks = [...container.querySelectorAll<HTMLElement>(".marquee-track")];
  return tracks.map((t) => {
    const anim = {
      currentTime: 0 as number,
      playbackRate: 1,
      updatePlaybackRate(rate: number) {
        this.playbackRate = rate;
      },
    };
    Object.defineProperty(t, "offsetWidth", { configurable: true, value: width });
    (t as unknown as { getAnimations: () => (typeof anim)[] }).getAnimations =
      () => [anim];
    return anim;
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("suppressClick re-arm (mutation discriminator)", () => {
  it("a drag whose click never fires must not swallow the NEXT legitimate tap", () => {
    mockMedia();
    const { container } = render(<WorkMarquee items={work} />);
    const root = container.querySelector<HTMLElement>(".work-marquee")!;
    mockAnimations(container);
    const card = container.querySelector("a")!;

    // Real drag: arms suppression. Touch-style - the browser delivers NO click.
    fireEvent.pointerDown(root, { clientX: 300, pointerId: 1, isPrimary: true });
    fireEvent.pointerMove(root, { clientX: 280, pointerId: 1 });
    fireEvent.pointerUp(root, { clientX: 280, pointerId: 1 });
    // (no click dispatched here - that is the whole point)

    // Next press is a stationary tap on a card: it must click through.
    fireEvent.pointerDown(root, { clientX: 300, pointerId: 2, isPrimary: true });
    fireEvent.pointerUp(root, { clientX: 300, pointerId: 2 });
    const tap = new MouseEvent("click", { bubbles: true, cancelable: true });
    card.dispatchEvent(tap);
    expect(tap.defaultPrevented).toBe(false);
  });
});
