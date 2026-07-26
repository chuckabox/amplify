// Prefix a public asset path with the configured basePath.
//
// The app is deployed under a basePath (/Tonnage) for GitHub Pages. Next only
// auto-prefixes next/link and next/image — plain <img>/<video> src need this.
const isProd = process.env.NODE_ENV === "production";
export const BASE_PATH = isProd ? "/Tonnage" : "";

export function asset(path: string): string {
  if (/^https?:\/\//.test(path)) return path; // leave absolute URLs alone
  return `${BASE_PATH}${path}`;
}
