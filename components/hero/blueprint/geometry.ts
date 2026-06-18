/** Pure geometry + isometric projection for the hero blueprint. No DOM. */

export type Vec3 = readonly [number, number, number];
export interface Vec2 {
  x: number;
  y: number;
}

export interface Face {
  /** vertex indices, in winding order */
  loop: number[];
  /** 0..1 lightness for the built fill (1 = lightest / top, lit) */
  tone: number;
}

export interface Form {
  vertices: Vec3[];
  edges: [number, number][];
  faces: Face[];
}

const ISO_ANGLE = Math.PI / 6; // 30° axonometric view

/**
 * Project a 3D point to 2D screen space: rotate around Y by `rotY`, apply a
 * fixed 30° axonometric view, then scale and offset to `origin`. Screen Y grows
 * downward, so the axonometric Y is negated.
 */
export function project(p: Vec3, rotY: number, scale: number, origin: Vec2): Vec2 {
  const [x, y, z] = p;
  const cos = Math.cos(rotY);
  const sin = Math.sin(rotY);
  const rx = x * cos - z * sin;
  const rz = x * sin + z * cos;
  const isoX = (rx - rz) * Math.cos(ISO_ANGLE);
  const isoY = (rx + rz) * Math.sin(ISO_ANGLE) - y;
  return { x: origin.x + isoX * scale, y: origin.y - isoY * scale };
}

/**
 * Depth key (larger = nearer the viewer) for painter's-order sorting. The view
 * axis perpendicular to the axonometric screen plane is the iso diagonal (1,1,1)
 * in rotated (rx, rz, y) space, so all three coordinates contribute equally —
 * dropping any term (e.g. using rz alone) mis-orders overlapping faces.
 */
export function faceDepth(face: Face, vertices: Vec3[], rotY: number): number {
  const cos = Math.cos(rotY);
  const sin = Math.sin(rotY);
  let sum = 0;
  for (const i of face.loop) {
    const [x, y, z] = vertices[i];
    const rx = x * cos - z * sin;
    const rz = x * sin + z * cos;
    sum += rx + rz + y;
  }
  return sum / face.loop.length;
}

/** Faces ordered back-to-front for the current rotation. */
export function sortedFaces(form: Form, rotY: number): Face[] {
  return [...form.faces].sort(
    (a, b) => faceDepth(a, form.vertices, rotY) - faceDepth(b, form.vertices, rotY),
  );
}

/** Append one axis-aligned box (8 verts, 12 edges, 6 faces) to the accumulator. */
function addBox(
  acc: Form,
  cx: number, cy: number, cz: number,
  w: number, h: number, d: number,
  topTone: number, sideTone: number,
): void {
  const x0 = cx - w / 2, x1 = cx + w / 2;
  const y0 = cy - h / 2, y1 = cy + h / 2;
  const z0 = cz - d / 2, z1 = cz + d / 2;
  const b = acc.vertices.length;
  acc.vertices.push(
    [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], // bottom 0..3
    [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], // top    4..7
  );
  const e: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];
  for (const [a, c] of e) acc.edges.push([a + b, c + b]);
  acc.faces.push(
    { loop: [4, 5, 6, 7].map((i) => i + b), tone: topTone },          // top (lit)
    { loop: [0, 1, 5, 4].map((i) => i + b), tone: sideTone },         // front
    { loop: [1, 2, 6, 5].map((i) => i + b), tone: sideTone * 0.92 },  // right
    { loop: [3, 2, 6, 7].map((i) => i + b), tone: sideTone },         // back
    { loop: [0, 3, 7, 4].map((i) => i + b), tone: sideTone * 0.92 },  // left
  );
}

/** The hero form: three offset, decreasing slabs - an abstract layered monument. */
export function buildForm(): Form {
  const acc: Form = { vertices: [], edges: [], faces: [] };
  addBox(acc, 0,     -0.9,  0,    2.4, 0.5, 2.4, 0.96, 0.80);
  addBox(acc, 0.25,  -0.25, -0.2, 1.7, 0.5, 1.7, 0.98, 0.84);
  addBox(acc, -0.15, 0.45,  0.25, 1.0, 0.6, 1.0, 1.0,  0.88);
  return acc;
}

/** Vertex for the lume "shipped" dot: top slab (verts 16-23), top-front-right (local 6). */
export const SHIPPED_VERTEX_INDEX = 8 * 2 + 6; // = 22
