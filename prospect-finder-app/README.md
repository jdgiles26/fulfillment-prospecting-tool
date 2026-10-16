# Prospect Finder — Candidate Exercise

Internal prospecting tool for Meridian Fulfillment Partners. A sales director describes the kind of company she wants to work with; the system assesses the quality of that description, returns a ranked short list, and shows the reasoning behind every fit score so she can argue with it.

Built with Vite + React. Run with `npm install && npm run dev`. Sample data is six fictional companies hardcoded in `src/data/companies.js` — no model integration, per the brief.

## Data model

- **Company** — identity and firmographics: name, industry, industry markers (structured tags like "ships bulky goods", "regulated labeling"), HQ (city/state/ZIP), employees, revenue, growth, ownership, shipping profile; plus child collections: Leadership (name, title, relevance note), NewsEvent (date, source, headline, summary), FinancialSignal (funding, filings), and a per-service fit read (fulfillment, managed print, kitting, warehousing — each a rating plus rationale).
- **Search** — the criteria she entered: industry text, geography rows (multiple allowed), employee and revenue ranges (with "roughly" flags for guesses), optional company name.
- **CriterionAssessment** — verdict (too broad / too narrow / balanced), matched count against the known universe, and the pushback text shown before results.
- **FitScore** — total (0–100) plus a per-criterion breakdown with weights and rationale.

Relationships: a Search produces Companies; each Company carries one FitScore and its underlying records. In production the Company graph is written by an automated intelligence pipeline (time-sensitive, goes stale — so every intelligence record carries a `collected_at`, and the UI would show data age).

**Production database: PostgreSQL (Amazon RDS/Aurora), with OpenSearch for the text-heavy intelligence records.** Relational fits the entity structure above and the "she has to trust and audit it" requirement; JSONB columns on Company absorb schema drift from external sources without migrations. OpenSearch serves industry-marker and news matching; a nightly job refreshes stale records and flags any company whose data is older than a threshold. Redis only if score caching becomes a real cost.

## Deployment (AWS)

Static front end behind CloudFront/S3; API on ECS Fargate (small, stateless) in front of RDS; the prospect-intelligence collector as a scheduled Fargate task writing through SQS so ingestion never blocks reads. Once real users are on it I'd watch three things: collector failure rate (stale data erodes trust — the one thing this tool sells), search latency at the p95, and the criteria-assessment rule changes, which will be the most-edited code in the repo and deserve a feature flag.

## Testing

The scoring and matching logic is pure functions in `src/lib/engine.js`, so unit tests there are cheap and high-value: golden companies with known expected scores, boundary tests on ranges, geography edge cases (ZIP prefix vs. state). The end-to-end check I actually wrote is `scripts/verify.cjs` — a headless-Chrome script that fills the form, submits, opens a company, and asserts the assessment banner, result count, and fit breakdown render. I chose it over component tests because the riskiest thing in this UI is the search→assessment→results chain, not any single component. In production I'd add contract tests around the collector's external sources, since that's where bad data enters.

## Where the brief was silent — decisions I made

- **"Roughly" over precision.** Ranges she guesses at get a ±20% widen; unknowns are left open and the assessment names what was left open. Forcing false precision felt worse than admitting fuzziness.
- **Fit indicator: transparent weighted model, not ML.** Five weighted criteria (industry alignment 35, scale sweet spot 20, geography 15, momentum 15, service intensity 15), each scoring 0–100 from actual company fields, with per-criterion rationale on screen. She can argue with weights she can see; she can't argue with a black box.
- **Assessment before results, always.** The pushback banner is part of the search response, not a separate feature — bad criteria produce bad prospects, and she should hear it before she scrolls.
- **Results list discipline.** The list carries only decide-or-open fields; leadership, financials, news, and fit reasoning stay in detail. Detail opens as an overlay so the list — her ranked call sheet — never leaves context.
- **Two extras after the required work:** recent searches recalled from local storage, and keyboard shortcuts (`/` to search, `Esc` to close detail).

## On a phone

Same flow, one column: criteria stack vertically, the results table becomes stacked fit-cards sorted by score, and the detail view goes full-screen with the fit breakdown first. What I'd change: the results "why" line moves under the company name (it's the decision-maker on a small screen), geography entry drops ZIP-first in favor of "near me / near Hoboken," and I'd add a call-or-email action on the detail header since a phone is where the first conversation actually starts.
