/**
 * Chart: one stacked bar chart per day.
 * The bars are an SVG that stretches to the box. The axis labels are HTML, so the text keeps one size on every screen.
 * Each day has a native tooltip.
 */
import type { DayCount } from "../store/store.ts";
import { esc, html, num, raw, type Raw } from "./page.ts";

export interface Series {
  key: string;
  label: string;
  /** CSS color, for example `var(--s1)`. */
  color: string;
}

const DAY_MS = 86_400_000;

/** Every UTC day from `since` to `now`, as `YYYY-MM-DD`. */
export function listDays(since: number, now: number): string[] {
  const out: string[] = [];
  const end = Math.floor(now / DAY_MS);
  for (let d = Math.floor(since / DAY_MS); d <= end; d++) out.push(new Date(d * DAY_MS).toISOString().slice(0, 10));
  return out;
}

/** Stacked bars. Series order is fixed: the first series sits on the baseline. */
export function barChart(days: string[], cells: DayCount[], series: Series[], title: string): Raw {
  const width = 1000;
  const height = 200;
  const value = new Map<string, number>();
  for (const c of cells) value.set(c.day + "|" + c.key, (value.get(c.day + "|" + c.key) ?? 0) + c.n);
  const totals = days.map((d) => series.reduce((s, x) => s + (value.get(d + "|" + x.key) ?? 0), 0));
  const max = niceMax(Math.max(1, ...totals));
  const step = width / Math.max(1, days.length);
  const gap = Math.min(6, step * 0.18);
  const barW = Math.max(1, step - gap);
  const y = (n: number) => height - (n / max) * height;
  const f = (n: number) => n.toFixed(1);

  const grid = [0.5, 1].map(
    (g) => `<line x1="0" x2="${width}" y1="${f(y(max * g))}" y2="${f(y(max * g))}" stroke="var(--line)" vector-effect="non-scaling-stroke"/>`,
  );
  const bars = days.map((d, i) => {
    const x = i * step + gap / 2;
    let base = 0;
    let parts = "";
    for (const s of series) {
      const n = value.get(d + "|" + s.key) ?? 0;
      if (!n) continue;
      const y0 = y(base);
      const y1 = y(base + n);
      // A 2 px gap of surface between two segments of one bar.
      const h = Math.max(1, y0 - y1 - (base ? 2 : 0));
      parts += `<rect x="${f(x)}" y="${f(y0 - h - (base ? 2 : 0))}" width="${f(barW)}" height="${f(h)}" fill="${s.color}"/>`;
      base += n;
    }
    const tip = [d, ...series.map((s) => s.label + ": " + num(value.get(d + "|" + s.key) ?? 0))].join("\n");
    return `<g><title>${esc(tip)}</title><rect x="${f(i * step)}" y="0" width="${f(step)}" height="${height}" fill="transparent"/>${parts}</g>`;
  });
  const labelEvery = Math.max(1, Math.ceil(days.length / 7));
  const ticks = days
    .map((d, i) => (i % labelEvery === 0 ? `<span style="left:${((i + 0.5) / days.length) * 100}%">${esc(d.slice(5))}</span>` : ""))
    .join("");

  return html`<div class="legend">${series.map((s) => html`<span><i style="background:${raw(s.color)}"></i>${s.label}</span>`)}</div>
<div class="plot"><div class="yaxis" aria-hidden="true"><span style="top:0">${num(max)}</span><span style="top:50%">${num(max / 2)}</span><span style="top:100%">0</span></div>
<svg class="chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="${title}">${raw(grid.join("") + bars.join(""))}<line x1="0" x2="${width}" y1="${height}" y2="${height}" stroke="var(--line-strong)" vector-effect="non-scaling-stroke"/></svg>
<div class="xaxis" aria-hidden="true">${raw(ticks)}</div></div>`;
}

function niceMax(n: number): number {
  const mag = 10 ** Math.floor(Math.log10(n));
  for (const m of [1, 2, 5, 10]) if (m * mag >= n) return m * mag;
  return 10 * mag;
}
