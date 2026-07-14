import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { WorkSlide } from "@/components/sections/work/WorkSlide";
import type { CaseStudy } from "@/lib/content/types";
import { WorkMarquee } from "@/components/sections/home/WorkMarquee";
import { work } from "@/lib/content/work";
import { SelectedWork } from "@/components/sections/home/SelectedWork";

// next/image needs the Next build runtime; stub it so these stay unit-level.
vi.mock("next/image", () => ({
  default: ({ src, alt = "" }: { src: string; alt?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element -- intentional test stub for next/image
    <img src={src} alt={alt} />
  ),
}));

const ITEM: CaseStudy = {
  slug: "balance-coffee",
  title: "Balance Coffee",
  client: "Specialty coffee & roaster",
  sector: "Concept site",
  year: "2025",
  disciplines: ["Веб", "Бренд"],
  accent: "#a1957e",
  cover: "/work/balance-coffee.webp",
  coverPosition: "center",
  href: "https://balancecoffee.netlify.app/",
  featured: true,
  summary: "A warm, editorial site.",
};

describe("WorkSlide", () => {
  it("links out to the live site in a new tab, with the view cursor", () => {
    const { container } = render(<WorkSlide item={ITEM} />);
    const a = container.querySelector("a")!;
    expect(a.getAttribute("href")).toBe(ITEM.href);
    expect(a.getAttribute("target")).toBe("_blank");
    expect(a.getAttribute("rel")).toContain("noopener");
    expect(a.getAttribute("data-cursor")).toBe("view");
    expect(a.getAttribute("aria-label")).toContain("откроет сайт");
  });

  it("shows the project name and a chip per discipline (no client/sector or year)", () => {
    const { container } = render(<WorkSlide item={ITEM} />);
    expect(container.querySelector("h3")?.textContent).toBe("Balance Coffee");
    const chips = [...container.querySelectorAll("span")].map((s) => s.textContent);
    expect(chips).toContain("Веб");
    expect(chips).toContain("Бренд");
    // sparse: the rich card's metadata must not appear
    expect(container.textContent).not.toContain("Concept site");
    expect(container.textContent).not.toContain("2025");
  });
});

describe("WorkMarquee", () => {
  it("renders every project once in the real (non-clone) track", () => {
    const { container } = render(<WorkMarquee items={work} />);
    const real = container.querySelector(".marquee-track:not([data-marquee-clone])")!;
    const titles = [...real.querySelectorAll("h3")].map((h) => h.textContent);
    expect(titles.length).toBe(work.length);
    work.forEach((item) => expect(titles).toContain(item.title));
  });

  it("links each real card to its live href in document order", () => {
    const { container } = render(<WorkMarquee items={work} />);
    const real = container.querySelector(".marquee-track:not([data-marquee-clone])")!;
    const links = [...real.querySelectorAll("a")];
    expect(links.length).toBe(work.length);
    links.forEach((a, i) => expect(a.getAttribute("href")).toBe(work[i].href));
  });

  it("keeps the clone out of SR + tab order, but hit-testable (aria-hidden + tabindex, NOT inert)", () => {
    const { container } = render(<WorkMarquee items={work} />);
    expect(container.querySelectorAll(".marquee-track").length).toBe(2);
    const clone = container.querySelector("[data-marquee-clone]")!;
    expect(clone.getAttribute("aria-hidden")).toBe("true");
    // NOT inert: inert blocks pointer hit-testing, which kills the hover cursor
    // on clone cards once the rail scrolls them into view.
    expect(clone.hasAttribute("inert")).toBe(false);
    // Clone links are pulled out of the tab order; the real cards stay tabbable.
    clone.querySelectorAll("a").forEach((a) => expect(a.tabIndex).toBe(-1));
    const real = container.querySelector(".marquee-track:not([data-marquee-clone])")!;
    real.querySelectorAll("a").forEach((a) => expect(a.tabIndex).not.toBe(-1));
  });

  it("gives each track an animation-duration inline (the .marquee-track class sets none)", () => {
    const { container } = render(<WorkMarquee items={work} />);
    const tracks = [...container.querySelectorAll<HTMLElement>(".marquee-track")];
    tracks.forEach((t) => expect(t.style.animationDuration).not.toBe(""));
  });
});

describe("WorkMarquee glide-on-hover spotlight", () => {
  // Fine pointer + motion allowed -> the JS glide + re-hit-test path is active.
  function mockHoverMedia() {
    window.matchMedia = vi.fn().mockImplementation((q: string) => ({
      matches: q.includes("hover: hover"), // reduced-motion query -> false
      media: q,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;
  }

  // Drive requestAnimationFrame by hand so we can advance the rail one frame at a
  // time. CoverPanel is static (no rAF of its own), so the only caller is the
  // marquee's own sample loop.
  function manualFrames() {
    let next: FrameRequestCallback | null = null;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      next = cb;
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});
    return () => {
      const cb = next;
      next = null;
      cb?.(0);
    };
  }

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    // jsdom has no elementFromPoint; tests stub it on document - clean up here.
    Reflect.deleteProperty(document, "elementFromPoint");
  });

  it("hands the spotlight to JS (.js-hover-active) when the glide path is live", () => {
    mockHoverMedia();
    manualFrames();
    const { container } = render(<WorkMarquee items={work} />);
    expect(
      container.querySelector(".work-marquee")?.classList.contains("js-hover-active"),
    ).toBe(true);
  });

  it("keeps only the card under a still pointer lit as the rail glides (the bug)", () => {
    mockHoverMedia();
    const step = manualFrames();

    const { container } = render(<WorkMarquee items={work} />);
    const root = container.querySelector<HTMLElement>(".work-marquee")!;
    const cards = [
      ...container.querySelectorAll<HTMLAnchorElement>(
        ".marquee-track:not([data-marquee-clone]) a",
      ),
    ];
    expect(cards.length).toBeGreaterThan(1);

    // Pointer comes to rest over the first card.
    document.elementFromPoint = (() => cards[0]) as typeof document.elementFromPoint;
    fireEvent.pointerEnter(root, { clientX: 120, clientY: 100 });
    step();
    expect(cards[0].classList.contains("is-hovered")).toBe(true);

    // The rail glides a DIFFERENT card under the SAME, unmoved pointer.
    document.elementFromPoint = (() => cards[1]) as typeof document.elementFromPoint;
    step();
    expect(cards[1].classList.contains("is-hovered")).toBe(true);
    // The card that glided away drops its highlight - exactly what was stuck before.
    expect(cards[0].classList.contains("is-hovered")).toBe(false);

    // A gap slides under the pointer: nothing in the rail is lit.
    document.elementFromPoint = (() => document.body) as typeof document.elementFromPoint;
    step();
    expect(cards.some((c) => c.classList.contains("is-hovered"))).toBe(false);

    // Leaving the rail clears the spotlight outright.
    document.elementFromPoint = (() => cards[0]) as typeof document.elementFromPoint;
    step();
    expect(cards[0].classList.contains("is-hovered")).toBe(true);
    fireEvent.pointerLeave(root);
    expect(cards.some((c) => c.classList.contains("is-hovered"))).toBe(false);
  });

  it("pokes the custom cursor to re-hit-test on each glide frame", () => {
    mockHoverMedia();
    const step = manualFrames();
    const recheck = vi.fn();
    window.addEventListener("lumako:hover-recheck", recheck);
    try {
      const { container } = render(<WorkMarquee items={work} />);
      const root = container.querySelector<HTMLElement>(".work-marquee")!;
      document.elementFromPoint = (() =>
        container.querySelector("a")) as typeof document.elementFromPoint;
      fireEvent.pointerEnter(root, { clientX: 40, clientY: 40 });
      step();
      expect(recheck).toHaveBeenCalled();
    } finally {
      window.removeEventListener("lumako:hover-recheck", recheck);
    }
  });
});

describe("WorkMarquee drag / wheel control", () => {
  // Captured before any test overwrites it, so the direct window.matchMedia
  // assignment below (which vi.restoreAllMocks can't undo) never leaks into a
  // later describe block.
  const realMatchMedia = window.matchMedia;

  function mockMedia({ hover = true, reduce = false } = {}) {
    window.matchMedia = vi.fn().mockImplementation((q: string) => ({
      matches: q.includes("hover: hover")
        ? hover
        : q.includes("prefers-reduced-motion")
          ? reduce
          : false,
      media: q,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;
  }

  // Give each track a real width and a scrubbable fake animation - jsdom has
  // neither layout nor Web Animations. 4500px wide against the 45s pass makes
  // the math legible: 1px of pointer travel = 10ms of timeline.
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

  function renderRail() {
    const utils = render(<WorkMarquee items={work} />);
    const root = utils.container.querySelector<HTMLElement>(".work-marquee")!;
    const anims = mockAnimations(utils.container);
    return { ...utils, root, anims };
  }

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    window.matchMedia = realMatchMedia;
  });

  it("drags the rail with the pointer - left drag advances both tracks in lockstep", () => {
    mockMedia();
    const { root, anims } = renderRail();
    fireEvent.pointerDown(root, { clientX: 300, pointerId: 1, isPrimary: true });
    // 9px of travel crosses the drag threshold; the rail catches up to the finger.
    fireEvent.pointerMove(root, { clientX: 291, pointerId: 1 });
    fireEvent.pointerMove(root, { clientX: 281, pointerId: 1 });
    expect(root.classList.contains("is-dragging")).toBe(true);
    // 19px left at 10ms/px = 190ms into the pass, on the real AND clone track.
    expect(anims.map((a) => Math.round(a.currentTime))).toEqual([190, 190]);
  });

  it("wraps a backwards drag into the previous pass (no negative seek)", () => {
    mockMedia();
    const { root, anims } = renderRail();
    fireEvent.pointerDown(root, { clientX: 100, pointerId: 1, isPrimary: true });
    fireEvent.pointerMove(root, { clientX: 150, pointerId: 1 });
    // 50px right from t=0 lands 500ms before the end of the 45s loop.
    expect(Math.round(anims[0].currentTime)).toBe(44500);
  });

  // Real pointer clicks carry detail > 0; keyboard / programmatic activations
  // carry detail 0. The suppression must only ever eat the former.
  const pointerClick = () =>
    new MouseEvent("click", { bubbles: true, cancelable: true, detail: 1 });
  const keyboardClick = () =>
    new MouseEvent("click", { bubbles: true, cancelable: true, detail: 0 });

  it("keeps a sub-threshold wobble a click (does not scrub or suppress)", () => {
    mockMedia();
    const { root, container, anims } = renderRail();
    const card = container.querySelector("a")!;

    // A jittery tap: press then 5px of wobble - under the 8px drag threshold.
    fireEvent.pointerDown(root, { clientX: 300, pointerId: 1, isPrimary: true });
    fireEvent.pointerMove(root, { clientX: 295, pointerId: 1 });
    fireEvent.pointerMove(root, { clientX: 300, pointerId: 1 });
    expect(root.classList.contains("is-dragging")).toBe(false);
    // The rail never moved and the card still opens.
    expect(anims[0].currentTime).toBe(0);
    fireEvent.pointerUp(root, { clientX: 300, pointerId: 1 });
    const click = pointerClick();
    card.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(false);
  });

  it("suppresses the card click after a real drag, but not a plain click", () => {
    mockMedia();
    const { root, container } = renderRail();
    const card = container.querySelector("a")!;

    // A stationary press-release stays a click.
    fireEvent.pointerDown(root, { clientX: 300, pointerId: 1, isPrimary: true });
    fireEvent.pointerUp(root, { clientX: 300, pointerId: 1 });
    const still = pointerClick();
    card.dispatchEvent(still);
    expect(still.defaultPrevented).toBe(false);

    // A real drag must not open the card under the pointer on release...
    fireEvent.pointerDown(root, { clientX: 300, pointerId: 1, isPrimary: true });
    fireEvent.pointerMove(root, { clientX: 280, pointerId: 1 });
    fireEvent.pointerUp(root, { clientX: 280, pointerId: 1 });
    const dragged = pointerClick();
    card.dispatchEvent(dragged);
    expect(dragged.defaultPrevented).toBe(true);

    // ...and the suppression is one-shot: the next plain click goes through.
    const plain = pointerClick();
    card.dispatchEvent(plain);
    expect(plain.defaultPrevented).toBe(false);
  });

  it("never eats a keyboard activation stranded by a click-less touch drag", () => {
    mockMedia({ hover: false });
    const { root, container } = renderRail();
    const card = container.querySelector("a")!;

    // A touch drag scrubs but fires no synthetic click, so the guard stays armed.
    fireEvent.pointerDown(root, { clientX: 300, pointerId: 1, isPrimary: true });
    fireEvent.pointerMove(root, { clientX: 260, pointerId: 1 });
    fireEvent.pointerUp(root, { clientX: 260, pointerId: 1 });

    // A later keyboard Enter on a card (detail 0) must still open it.
    const keyed = keyboardClick();
    card.dispatchEvent(keyed);
    expect(keyed.defaultPrevented).toBe(false);

    // ...and a fresh press re-arms cleanly: a real click after it is not eaten.
    fireEvent.pointerDown(root, { clientX: 100, pointerId: 2, isPrimary: true });
    fireEvent.pointerUp(root, { clientX: 100, pointerId: 2 });
    const clicked = pointerClick();
    card.dispatchEvent(clicked);
    expect(clicked.defaultPrevented).toBe(false);
  });

  it("ignores a second concurrent pointer instead of leaking the drag session", () => {
    mockMedia({ hover: false });
    const { root, anims } = renderRail();

    // First finger drags the rail.
    fireEvent.pointerDown(root, { clientX: 300, pointerId: 1, isPrimary: true });
    fireEvent.pointerMove(root, { clientX: 280, pointerId: 1 });
    const afterFirst = anims[0].currentTime;
    expect(root.classList.contains("is-dragging")).toBe(true);

    // A second finger presses and moves: it must not hijack the rail.
    fireEvent.pointerDown(root, { clientX: 500, pointerId: 2, isPrimary: false });
    fireEvent.pointerMove(root, { clientX: 400, pointerId: 2 });
    expect(anims[0].currentTime).toBe(afterFirst);

    // The first finger keeps control.
    fireEvent.pointerMove(root, { clientX: 260, pointerId: 1 });
    expect(anims[0].currentTime).not.toBe(afterFirst);
  });

  it("cancels the drag cleanly when the browser takes the pointer (vertical scroll)", () => {
    mockMedia({ hover: false });
    const { root, anims } = renderRail();

    fireEvent.pointerDown(root, { clientX: 300, pointerId: 1, isPrimary: true });
    fireEvent.pointerMove(root, { clientX: 260, pointerId: 1 });
    expect(root.classList.contains("is-dragging")).toBe(true);
    const atCancel = anims[0].currentTime;

    // pointercancel (e.g. touch-action pan-y hands the gesture to page scroll).
    fireEvent.pointerCancel(root, { pointerId: 1 });
    expect(root.classList.contains("is-dragging")).toBe(false);
    // No flick coast is launched from a canceled gesture - the rail holds still...
    expect(anims[0].currentTime).toBe(atCancel);
    // ...and the ambient glide is restored (fine-pointer glide is off here).
    expect(anims.every((a) => a.playbackRate === 1)).toBe(true);

    // A canceled gesture leaves no armed click suppression.
    const card = root.querySelector("a")!;
    const click = pointerClick();
    card.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(false);
  });

  it("scales wheel deltas by deltaMode (lines and pages, not just pixels)", () => {
    mockMedia();
    const { root, anims } = renderRail();

    // deltaMode 0 = pixels: 90px -> 900ms on the 4500px / 45s rail.
    const px = new WheelEvent("wheel", {
      deltaX: 90,
      deltaY: 1,
      deltaMode: 0,
      bubbles: true,
      cancelable: true,
    });
    root.dispatchEvent(px);
    expect(Math.round(anims[0].currentTime)).toBe(900);

    // deltaMode 1 = lines: scaled by 16px/line, so 3 lines -> 48px -> 480ms.
    anims.forEach((a) => (a.currentTime = 0));
    const lines = new WheelEvent("wheel", {
      deltaX: 3,
      deltaY: 0,
      deltaMode: 1,
      bubbles: true,
      cancelable: true,
    });
    root.dispatchEvent(lines);
    expect(Math.round(anims[0].currentTime)).toBe(480);
  });

  it("freezes the auto-advance while dragging and restores it after release", () => {
    vi.useFakeTimers({
      toFake: [
        "performance",
        "requestAnimationFrame",
        "cancelAnimationFrame",
        "setTimeout",
        "clearTimeout",
      ],
    });
    mockMedia();
    const { root, anims } = renderRail();
    const tracks = [...root.querySelectorAll<HTMLElement>(".marquee-track")];

    fireEvent.pointerDown(root, { clientX: 300, pointerId: 1, isPrimary: true });
    vi.advanceTimersByTime(16);
    fireEvent.pointerMove(root, { clientX: 290, pointerId: 1 });
    // Scrubbed by hand: rate 0, with the stylesheet's :hover pause overridden so
    // the state is unambiguous.
    expect(anims.every((a) => a.playbackRate === 0)).toBe(true);
    tracks.forEach((t) => expect(t.style.animationPlayState).toBe("running"));

    // Held still past the flick window, then released: no coast, ambient rate back.
    vi.advanceTimersByTime(200);
    fireEvent.pointerUp(root, { clientX: 290, pointerId: 1 });
    expect(root.classList.contains("is-dragging")).toBe(false);
    expect(anims.every((a) => a.playbackRate === 1)).toBe(true);
    tracks.forEach((t) => expect(t.style.animationPlayState).toBe(""));
  });

  it("coasts after a flick, then hands back to the ambient glide", () => {
    vi.useFakeTimers({
      toFake: [
        "performance",
        "requestAnimationFrame",
        "cancelAnimationFrame",
        "setTimeout",
        "clearTimeout",
      ],
    });
    mockMedia();
    const { root, anims } = renderRail();

    // Three fast leftward moves (2px/ms), released mid-motion = a flick.
    fireEvent.pointerDown(root, { clientX: 400, pointerId: 1, isPrimary: true });
    for (const x of [368, 336, 304]) {
      vi.advanceTimersByTime(16);
      fireEvent.pointerMove(root, { clientX: x, pointerId: 1 });
    }
    fireEvent.pointerUp(root, { clientX: 304, pointerId: 1 });
    const atRelease = anims[0].currentTime;
    expect(anims[0].playbackRate).toBe(0); // still user-driven while coasting

    // A few frames on: the rail is still travelling.
    vi.advanceTimersByTime(64);
    expect(anims[0].currentTime).toBeGreaterThan(atRelease);

    // Long after the decay: coast has died out and the animation runs itself again.
    vi.advanceTimersByTime(8000);
    expect(anims[0].playbackRate).toBe(1);
  });

  it("resumes the auto-advance once the coast slows TO the auto-slide speed, not a near-stop", () => {
    vi.useFakeTimers({
      toFake: [
        "performance",
        "requestAnimationFrame",
        "cancelAnimationFrame",
        "setTimeout",
        "clearTimeout",
      ],
    });
    mockMedia();
    // width 4500 over the 45s pass = an auto-slide speed of 0.1px/ms.
    const { root, anims } = renderRail();

    // A hard forward flick (~2px/ms leftward), an order of magnitude above auto.
    fireEvent.pointerDown(root, { clientX: 400, pointerId: 1, isPrimary: true });
    for (const x of [368, 336, 304]) {
      vi.advanceTimersByTime(16);
      fireEvent.pointerMove(root, { clientX: x, pointerId: 1 });
    }
    fireEvent.pointerUp(root, { clientX: 304, pointerId: 1 });

    // Early on the coast still outruns the auto-slide, so the rail stays user-driven.
    vi.advanceTimersByTime(500); // |v| ~0.74px/ms, well above the 0.1 auto speed
    expect(anims[0].playbackRate).toBe(0);

    // By ~1.6s the coast has slowed to the auto-slide speed (~0.08px/ms) and hands
    // back to the animation. The bug kept it user-driven (rate 0), crawling BELOW
    // auto speed, until the coast died out near 0.01px/ms (~2.6s) - so at 1.6s the
    // old code still reads rate 0 here.
    vi.advanceTimersByTime(1100); // ~1.6s total
    expect(anims[0].playbackRate).toBe(1);
  });

  it("claims horizontal wheel/trackpad input; vertical wheel keeps scrolling the page", () => {
    mockMedia();
    const { root, anims } = renderRail();

    const horizontal = new WheelEvent("wheel", {
      deltaX: 50,
      deltaY: 5,
      bubbles: true,
      cancelable: true,
    });
    root.dispatchEvent(horizontal);
    expect(horizontal.defaultPrevented).toBe(true);
    expect(Math.round(anims[0].currentTime)).toBe(500);

    const vertical = new WheelEvent("wheel", {
      deltaX: 0,
      deltaY: 60,
      bubbles: true,
      cancelable: true,
    });
    root.dispatchEvent(vertical);
    expect(vertical.defaultPrevented).toBe(false);
    expect(Math.round(anims[0].currentTime)).toBe(500);
  });

  it("drags on coarse pointers too (touch has no hover glide, but must slide)", () => {
    mockMedia({ hover: false });
    const { root, anims } = renderRail();
    expect(root.classList.contains("js-hover-active")).toBe(false);
    fireEvent.pointerDown(root, { clientX: 200, pointerId: 1, isPrimary: true });
    fireEvent.pointerMove(root, { clientX: 180, pointerId: 1 });
    expect(root.classList.contains("is-dragging")).toBe(true);
    expect(Math.round(anims[0].currentTime)).toBe(200);
  });

  it("marks the rail draggable only when motion is allowed (reduced motion keeps the native scroll row)", () => {
    mockMedia({ hover: false });
    const active = render(<WorkMarquee items={work} />);
    expect(
      active.container
        .querySelector(".work-marquee")!
        .classList.contains("is-draggable"),
    ).toBe(true);
    active.unmount();

    mockMedia({ reduce: true });
    const reduced = render(<WorkMarquee items={work} />);
    expect(
      reduced.container
        .querySelector(".work-marquee")!
        .classList.contains("is-draggable"),
    ).toBe(false);
  });
});

describe("SelectedWork", () => {
  it("drops the section header and the view-all link (marquee only)", () => {
    const { container, queryByRole } = render(<SelectedWork />);
    expect(container.querySelector("h2")).toBeNull();
    expect(queryByRole("link", { name: /view all work/i })).toBeNull();
  });

  it("mounts the marquee with all projects (no static grid)", () => {
    const { container } = render(<SelectedWork />);
    expect(container.querySelector(".work-marquee")).not.toBeNull();
    const real = container.querySelector(".marquee-track:not([data-marquee-clone])")!;
    expect(real.querySelectorAll("h3").length).toBe(work.length);
  });
});
