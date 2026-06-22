import { ogImageResponse, ogAlt, ogSize, ogContentType } from "@/lib/seo/og";

// Render the PNG at build time (required under `output: export`).
export const dynamic = "force-static";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default function OpengraphImage() {
  return ogImageResponse();
}
