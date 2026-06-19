import { readFileSync } from "node:fs";
import zlib from "node:zlib";

const file = process.argv[2] || "subpx-probe.png";
const buf = readFileSync("E:/Desktop/PC/WORK/Web Development/lumako/" + file);
// parse PNG chunks
let p = 8;
let width, height, bitDepth, colorType;
const idat = [];
while (p < buf.length) {
  const len = buf.readUInt32BE(p); const type = buf.toString("ascii", p + 4, p + 8);
  const data = buf.subarray(p + 8, p + 8 + len);
  if (type === "IHDR") {
    width = data.readUInt32BE(0); height = data.readUInt32BE(4);
    bitDepth = data[8]; colorType = data[9];
  } else if (type === "IDAT") idat.push(data);
  else if (type === "IEND") break;
  p += 12 + len;
}
const raw = zlib.inflateSync(Buffer.concat(idat));
const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 1;
const bpp = channels; // 8-bit
const stride = width * bpp;
const img = Buffer.alloc(height * stride);
const paeth = (a, b, c) => { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); return pa <= pb && pa <= pc ? a : pb <= pc ? b : c; };
let pos = 0;
for (let y = 0; y < height; y++) {
  const f = raw[pos++];
  for (let x = 0; x < stride; x++) {
    const rawv = raw[pos++];
    const a = x >= bpp ? img[y * stride + x - bpp] : 0;
    const b = y > 0 ? img[(y - 1) * stride + x] : 0;
    const c = x >= bpp && y > 0 ? img[(y - 1) * stride + x - bpp] : 0;
    let v;
    switch (f) { case 0: v = rawv; break; case 1: v = rawv + a; break; case 2: v = rawv + b; break; case 3: v = rawv + ((a + b) >> 1); break; case 4: v = rawv + paeth(a, b, c); break; }
    img[y * stride + x] = v & 255;
  }
}
const lum = (x, y) => { const i = y * stride + x * bpp; return Math.round(0.299 * img[i] + 0.587 * img[i + 1] + 0.114 * img[i + 2]); };

console.log(`image ${width}x${height} colorType=${colorType}`);
// Find rows that are mostly black in the left region (the bars). Report edge profiles.
// For each band, pick a y in the middle of a black run and print luminance x=38..58 and x=118..130.
function findBands() {
  const bands = []; let inBand = false, start = 0;
  for (let y = 0; y < height; y++) {
    // count dark pixels in x 50..110 (should be inside black bar)
    let dark = 0; for (let x = 50; x < 110; x++) if (lum(x, y) < 60) dark++;
    const isBar = dark > 40;
    if (isBar && !inBand) { inBand = true; start = y; }
    else if (!isBar && inBand) { inBand = false; bands.push([start, y - 1]); }
  }
  if (inBand) bands.push([start, height - 1]);
  return bands;
}
const bands = findBands();
const labels = ["E anim PAUSED @40.5", "F parent-anim @40.5 child-layer", "G static @40.5"];
bands.forEach((band, idx) => {
  const y = Math.floor((band[0] + band[1]) / 2);
  let left = []; for (let x = 38; x <= 52; x++) left.push(lum(x, y).toString().padStart(3));
  console.log(`\nBand ${idx} (${labels[idx] ?? "?"}) y=${y} rows ${band[0]}-${band[1]}`);
  console.log(`  left-edge x=38..52: ${left.join(" ")}`);
  // detect intermediate (gray) pixels in the left edge transition
  let grays = []; for (let x = 30; x <= 60; x++) { const L = lum(x, y); if (L > 40 && L < 215) grays.push(`${x}:${L}`); }
  console.log(`  gray(41..214) cols near left edge: ${grays.join(" ") || "NONE (hard edge)"}`);
});
