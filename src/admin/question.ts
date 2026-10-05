/**
 * Question: the top questions and the knowledge gaps.
 */
import { transcriptHref, kindBadges } from "./conversation.ts";
import { empty, html, num, rangePicker, table, when, type Raw, type View } from "./page.ts";
import { groupQuestions, listGaps } from "./stats.ts";

export function questionsPage(view: View): Raw {
  const { store, tenant, since, base } = view;
  const groups = groupQuestions(store.listQuestions(tenant.id, since, 5000));
  const gaps = listGaps(store, tenant.id, since);
  const sessionOf = (id: string) => id.slice(tenant.id.length + 1);

  return html`
<div class="head"><div><h1>Questions</h1><p class="sub">Last ${view.days} days</p></div>${rangePicker(view, base + "/questions")}</div>
<section class="card" aria-labelledby="top-h"><h2 id="top-h">Top questions</h2>
  <p class="lead">Questions with the same words are one group. Case and punctuation do not count.</p>
  ${groups.length
    ? table(
        ["Question", "Asked", "Last asked"],
        groups.map((g) => [
          html`<a href="${base + "/c/" + encodeURIComponent(sessionOf(g.conversation))}">${g.text}</a>`,
          num(g.n),
          html`<span class="num small">${when(g.last)}</span>`,
        ]),
        [1],
      )
    : empty("No questions in this range.")}
</section>
<section class="card" aria-labelledby="gap-h"><h2 id="gap-h">Knowledge gaps</h2>
  <p class="lead">These conversations had a handoff or a thumbs down. Read them. Then add the missing facts to the pack.</p>
  ${gaps.length
    ? table(
        ["Time", "Visitor", "Why", "First question"],
        gaps.map((g) => [
          html`<a class="num" href="${transcriptHref(base, g.conversation)}">${when(g.conversation.started)}</a>`,
          kindBadges(g.conversation),
          html`${g.handoff ? html`<span class="badge warn">handoff</span>` : ""}${g.down ? html`<span class="badge bad">${g.down} thumbs down</span>` : ""}`,
          html`<a href="${transcriptHref(base, g.conversation)}"><div class="clip">${g.first || "–"}</div></a>`,
        ]),
      )
    : empty("No knowledge gaps in this range.")}
</section>`;
}
