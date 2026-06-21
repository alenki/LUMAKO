import { ImageResponse } from "next/og";
import { OG_IMAGE_ALT } from "./config";

/**
 * Shared 1200x630 social-share card, used by both `app/opengraph-image.tsx` and
 * `app/twitter-image.tsx`. It is statically optimized (no request-time data), so
 * Next renders it to a PNG at build time - no edge/runtime font fetch needed, which
 * keeps the OpenNext/Cloudflare build robust. Pure flexbox (satori has no grid),
 * default font, brand tokens copied from styles/globals.css.
 */

export const ogAlt = OG_IMAGE_ALT;
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const BG = "#f3f3f2"; // --color-bg
const INK = "#0a0a0a"; // --color-fg
const BODY = "#3f3f3f"; // --color-fg-body
const MUTED = "#737373"; // --color-fg-muted
const LUME = "#d49a2e"; // --color-lume (the single accent - wordmark dot + one rule)

export function ogImageResponse() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: BG,
          color: INK,
          padding: "96px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: MUTED,
              marginBottom: 36,
            }}
          >
            Web · AI · Apps
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              fontSize: 210,
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 1,
            }}
          >
            Lumako<span style={{ color: LUME }}>.</span>
          </div>

          <div
            style={{
              display: "flex",
              width: 132,
              height: 8,
              backgroundColor: LUME,
              borderRadius: 4,
              marginTop: 44,
              marginBottom: 44,
            }}
          />

          <div
            style={{
              display: "flex",
              fontSize: 42,
              color: BODY,
              maxWidth: 860,
              lineHeight: 1.3,
            }}
          >
            A full-stack studio shipping web, AI, and apps that stay live.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 30,
            color: MUTED,
          }}
        >
          <span style={{ display: "flex" }}>lumako.net</span>
          <span
            style={{
              display: "flex",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Shipped &amp; proven
          </span>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
