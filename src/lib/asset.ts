// Prefix a public asset path with the configured basePath.
//
// The app is deployed under a basePath (/amplify) for GitHub Pages. Next only
// auto-prefixes next/link and next/image — plain <img>/<video> src need this.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (/^https?:\/\//.test(path)) return path; // leave absolute URLs alone
  return `${BASE_PATH}${path}`;
}
