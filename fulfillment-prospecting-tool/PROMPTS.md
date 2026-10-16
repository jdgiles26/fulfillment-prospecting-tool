# Prospect Finder — Prompt Artifacts

Four prompts that fairly represent how the AI coding tool was driven, including the design work and one case of bad output that was caught and corrected.

---

### Prompt 1 — Architecture and data model (scaffolding)

> "I'm building an internal prospect-finding web app for a mid-market fulfillment company in Arkansas. One persona: a Director of Sales who wants a ranked prospect list with explainable fit scores. Before any code, propose a data model: entities, key fields, and relationships, for companies with firmographics, leadership, financial signals, news, and a per-service fit read across four services (order fulfillment, managed print, kitting & assembly, light warehousing). Flag where you'd expect the model to change when real intelligence data replaces the sample data."

**Why this shape:** I asked for the model before the UI so the screens would be projections of data rather than the data being retrofitted to screens. The tool proposed a clean entity set; I kept its Company/Leadership/News split and rejected its suggestion to embed fit as a company attribute, making FitScore a separate computed record so the reasoning stays inspectable.

---

### Prompt 2 — Fit scoring (the core decision)

> "Write a scoring function, 0–100, for how well a company fits an outsourced fulfillment provider whose strengths are order fulfillment, managed print, kitting & assembly, and light warehousing, serving the mid-market in the Midsouth. Use a transparent weighted model with exactly five criteria: industry/service alignment 35%, scale sweet spot 20% (revenue $10M–$150M, 50–500 employees), Midsouth geography 15%, growth posture 15%, service-intensity signals from news 15%. Each criterion scores 0–100 from company fields. The output must include per-criterion scores and a rationale string per criterion. No machine learning, no external calls."

**Why this shape:** The persona must be able to argue with the system, so the prompt pins the weights, the criteria, and the inspectability requirement in advance. Having the rationale strings generated as part of the same function kept the code and its explanation in one place — which later made the detail view almost free.

---

### Prompt 3 — Design (interface work)

> "Design the interface for this prospecting tool using this brand: navy #003057, green #007A33, neutral gray #6D6E71, light gray #E6E8EA, sky blue #A7D0E8. The user is a Director of Sales: she knows her market, has no patience for hunting for the number she came for, works on a laptop between meetings. Layout guidance: dense, scannable, the results table is a ranked call sheet, fit score visible at a glance, detail opens without losing the list. Give me the results-table column set and the detail-view section order, and iterate twice before writing any CSS."

**Why this shape:** The iteration requirement mattered more than the prompt content. Round one came back with a marketing-style dashboard (hero stats, big cards); pushing it once with "this is an operator console, not a landing page" produced the table-first layout. The lesson: the first design pass from an AI tool regresses to generic defaults unless you name the anti-target.

---

### Prompt 4 — The one that went wrong

> **Original (verbatim):** "Score these six sample companies by how well they fit our fulfillment business so I can rank who to call first."

**What was wrong with the output:** The tool produced a plausible-looking ranking that anchored on company size and revenue — reasonable-sounding, subtly wrong. A stagnant, declining industrial manufacturer (Riverbend Tool & Die, −3% growth, entrenched in-house habits) landed mid-table, above a small but fast-growing kitting-heavy promotions firm, because size correlates with shipping volume in its prior. The ranking optimized "who ships a lot" rather than "who is likely to buy outsourced fulfillment," which are not the same thing. A dead account that will never outsource scored as "worth a call."

**How I caught it:** I had deliberately planted one obviously wrong-fit company (a commercial real-estate services firm with no physical goods) as a canary. Its score was low but not at the floor, and the rationale text was hand-wavy. That told me the scoring wasn't anchored to service need at all.

**How I corrected course:** Two changes. First, the prompt went from "score these companies" to the two-step version in Prompt 2: extract concrete evidence of need from each company's data first, then score criteria with pinned weights and a cap on how much any single criterion can compensate. Second, the process change that stuck: every scoring prompt now has to name the expected wrong answer in advance — "a large stagnant company must score below a small growing one" — so there's a test to fail instead of a ranking to admire. The final model puts Crescent Capital at 41 ("Low priority" — the canary, correctly killed early), Riverbend at 58 ("Worth a look" — nurture, don't chase, exactly its fit note), and BlueSky Promotions at 88 — the small-but-growing account now outranks the stagnant bigger one, which matches the judgment a sales director would actually make.
