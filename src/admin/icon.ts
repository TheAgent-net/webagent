/**
 * Icon: small line icons as inline SVG. One stroke width. One 16 px grid.
 */
import { raw, type Raw } from "./page.ts";

const PATHS: Record<string, string> = {
  overview: '<rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/><rect x="9" y="9" width="4.5" height="4.5" rx="1"/>',
  conversations: '<path d="M2.5 4a1.5 1.5 0 0 1 1.5-1.5h8A1.5 1.5 0 0 1 13.5 4v5.5A1.5 1.5 0 0 1 12 11H7l-3 2.5V11A1.5 1.5 0 0 1 2.5 9.5z"/>',
  traffic: '<path d="M1.5 8h3l2-4.5 3 9 2-4.5h3"/>',
  questions: '<circle cx="8" cy="8" r="5.5"/><path d="M6.4 6.4a1.7 1.7 0 0 1 3.2.6c0 1.1-1.6 1.4-1.6 2.4"/><path d="M8 11.4v.1"/>',
  settings: '<path d="M2.5 4.5h6M11.5 4.5h2M2.5 11.5h2M7.5 11.5h6"/><circle cx="10" cy="4.5" r="1.5"/><circle cx="6" cy="11.5" r="1.5"/>',
  signout: '<path d="M6.5 2.5h-3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3"/><path d="M10 5l3 3-3 3M13 8H6"/>',
  done: '<circle cx="8" cy="8" r="5.5"/><path d="M5.6 8.2l1.7 1.7 3.2-3.4"/>',
  pending: '<circle cx="8" cy="8" r="5.5" stroke-dasharray="2.2 2"/>',
  download: '<path d="M8 2.5v7.5M5 7l3 3 3-3M3 12.5h10"/>',
  reload: '<path d="M13 8a5 5 0 1 1-1.5-3.5M13 2.5v3h-3"/>',
  copy: '<rect x="5.5" y="5.5" width="8" height="8" rx="1.5"/><path d="M10.5 5.5V4A1.5 1.5 0 0 0 9 2.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5"/>',
  sort: '<path d="M5.5 6.5L8 4l2.5 2.5M5.5 9.5L8 12l2.5-2.5"/>',
  back: '<path d="M9.5 4L5.5 8l4 4"/>',
  alert: '<path d="M8 2.5l6 10.5H2z"/><path d="M8 6.5v3M8 11.2v.1"/>',
};

/** One icon. It hides from screen readers; the text next to it names the action. */
export function icon(name: keyof typeof PATHS | string): Raw {
  const body = PATHS[name] ?? "";
  return raw(
    `<svg class="icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`,
  );
}
