/** Imperative Canvas-2D draw routine for the hero blueprint. */
import { clamp, lerp } from "@/lib/utils";
import {
  type Form, type Vec2, project, sortedFaces, SHIPPED_VERTEX_INDEX,
} from "@/components/hero/blueprint/geometry";
import { easeOutExpo, type PhaseState } from "@/components/hero/blueprint/phases";

export interface BlueprintColors {
  line: string; lineStrong: string; dim: string; ink: string;
  muted: string; surface: string; card2: string; lume: string;
}

/** Token-matched defaults (keep in sync with styles/globals.css @theme). */
export const DEFAULT_COLORS: BlueprintColors = {
  line: "#e5e5e5", lineStrong: "#d4d4d4", dim: "#a1a1a1", ink: "#0a0a0a",
  muted: "#737373", surface: "#ffffff", card2: "#f6f6f5", lume: "#d49a2e",
};

export interface Dims { width: number; height: number; }

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
}

/** Linear blend of two hex colors → "rgb(r, g, b)". */
export function blend(a: string, b: string, t: number): string {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  const r = Math.round(lerp(pa[0], pb[0], t));
  const g = Math.round(lerp(pa[1], pb[1], t));
  const bl = Math.round(lerp(pa[2], pb[2], t));
  return `rgb(${r}, ${g}, ${bl})`;
}

/** Face fill tone: lower tone = more shaded (grayer), tone 1 = lit surface. */
function toneColor(tone: number, c: BlueprintColors): string {
  return blend(c.dim, c.surface, clamp(tone, 0, 1));
}

/** Faint dot measure-grid with radial alpha falloff around the form. */
function drawField(ctx: CanvasRenderingContext2D, origin: Vec2, scale: number, alpha: number, c: BlueprintColors): void {
  if (alpha <= 0) return;
  const step = scale * 0.5;
  const maxR = scale * 4;
  ctx.save();
  ctx.fillStyle = c.dim;
  for (let gx = -8; gx <= 8; gx++) {
    for (let gy = -6; gy <= 6; gy++) {
      const x = origin.x + gx * step;
      const y = origin.y + gy * step;
      const d = Math.hypot(x - origin.x, y - origin.y);
      const a = alpha * 0.5 * Math.max(0, 1 - d / maxR);
      if (a <= 0.001) continue;
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/** A single horizontal dimension line with end ticks beneath the form. */
function drawAnnotations(ctx: CanvasRenderingContext2D, origin: Vec2, scale: number, alpha: number, c: BlueprintColors): void {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = c.dim;
  ctx.lineWidth = 1;
  const y = origin.y + scale * 1.7;
  const x0 = origin.x - scale * 1.7;
  const x1 = origin.x + scale * 1.7;
  ctx.beginPath();
  ctx.moveTo(x0, y); ctx.lineTo(x1, y);
  ctx.moveTo(x0, y - 6); ctx.lineTo(x0, y + 6);
  ctx.moveTo(x1, y - 6); ctx.lineTo(x1, y + 6);
  ctx.stroke();
  ctx.restore();
}

/** Draw one frame of the blueprint→built loop. */
export function renderBlueprint(
  ctx: CanvasRenderingContext2D,
  dims: Dims,
  s: PhaseState,
  form: Form,
  pointer: Vec2,
  colors: BlueprintColors,
): void {
  const { width, height } = dims;
  ctx.clearRect(0, 0, width, height);

  const scale = Math.min(width, height) * 0.16;
  const origin: Vec2 = {
    x: width * 0.62 + pointer.x * width * 0.02,
    y: height * 0.54 + pointer.y * height * 0.02,
  };
  const rotY = s.rotationTurns * Math.PI * 2 + pointer.x * 0.25;
  const pts = form.vertices.map((v) => project(v, rotY, scale, origin));

  drawField(ctx, origin, scale, s.gridOpacity, colors);

  // contact shadow
  if (s.shadowOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = s.shadowOpacity * 0.12;
    ctx.fillStyle = colors.ink;
    ctx.beginPath();
    ctx.ellipse(origin.x, origin.y + scale * 1.1, scale * 1.6, scale * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // built faces, back-to-front
  if (s.fillOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = s.fillOpacity;
    for (const face of sortedFaces(form, rotY)) {
      ctx.fillStyle = toneColor(face.tone, colors);
      ctx.beginPath();
      face.loop.forEach((i, k) =>
        k === 0 ? ctx.moveTo(pts[i].x, pts[i].y) : ctx.lineTo(pts[i].x, pts[i].y),
      );
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // self-drawing wireframe edges
  ctx.save();
  ctx.lineCap = "round";
  const n = form.edges.length;
  form.edges.forEach(([a, b], i) => {
    const edgeP = easeOutExpo(clamp(s.drawProgress * n - i, 0, 1));
    if (edgeP <= 0) return;
    const A = pts[a];
    const B = pts[b];
    ctx.globalAlpha = 1;
    ctx.strokeStyle = blend(colors.lineStrong, colors.ink, s.edgeInk);
    ctx.lineWidth = lerp(1, 1.5, s.edgeInk);
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(lerp(A.x, B.x, edgeP), lerp(A.y, B.y, edgeP));
    ctx.stroke();
  });
  ctx.restore();

  drawAnnotations(ctx, origin, scale, s.annotationOpacity, colors);

  // lume "shipped" dot
  if (s.dotOpacity > 0) {
    const d = pts[SHIPPED_VERTEX_INDEX];
    ctx.save();
    ctx.globalAlpha = s.dotOpacity;
    ctx.fillStyle = colors.lume;
    ctx.beginPath();
    ctx.arc(d.x, d.y, Math.max(3, scale * 0.07), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
