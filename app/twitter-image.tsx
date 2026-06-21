import { ogImageResponse, ogAlt, ogSize, ogContentType } from "@/lib/seo/og";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default function TwitterImage() {
  return ogImageResponse();
}
