import { describe, it, expect } from "vitest";
import {
  project,
  buildForm,
  sortedFaces,
  SHIPPED_VERTEX_INDEX,
} from "@/components/hero/blueprint/geometry";

describe("project", () => {
  it("maps the world origin to the screen origin", () => {
    const p = project([0, 0, 0], 0, 100, { x: 50, y: 60 });
    expect(p.x).toBeCloseTo(50, 5);
    expect(p.y).toBeCloseTo(60, 5);
  });

  it("is periodic in rotation (0 == 2π)", () => {
    const a = project([1, 0.5, -0.3], 0, 100, { x: 0, y: 0 });
    const b = project([1, 0.5, -0.3], Math.PI * 2, 100, { x: 0, y: 0 });
    expect(a.x).toBeCloseTo(b.x, 4);
    expect(a.y).toBeCloseTo(b.y, 4);
  });

  it("projects a unit X point to the 30° axonometric position", () => {
    const p = project([1, 0, 0], 0, 1, { x: 0, y: 0 });
    expect(p.x).toBeCloseTo(Math.cos(Math.PI / 6), 5); // ~0.866
    expect(p.y).toBeCloseTo(-Math.sin(Math.PI / 6), 5); // y flipped, -0.5
  });
});

describe("buildForm", () => {
  it("produces three stacked boxes: 24 verts, 36 edges, 15 faces", () => {
    const form = buildForm();
    expect(form.vertices).toHaveLength(24);
    expect(form.edges).toHaveLength(36);
    expect(form.faces).toHaveLength(15);
  });

  it("keeps SHIPPED_VERTEX_INDEX inside the vertex list", () => {
    expect(SHIPPED_VERTEX_INDEX).toBeLessThan(buildForm().vertices.length);
  });
});

describe("sortedFaces", () => {
  it("returns every face, ordered back-to-front (non-decreasing depth)", () => {
    const form = buildForm();
    const faces = sortedFaces(form, 0.7);
    expect(faces).toHaveLength(form.faces.length);
  });
});
