# Prospect Finder — Pre-Presentation Questions

**Candidate:** ______________________  **Date submitted:** 2026-09-17

**1. What did you decide about the fit indicator, and why?**

A transparent weighted model scored 0–100, not a machine-learned score. Five criteria weighted to mirror Meridian's way of doing business — industry/service alignment 35, mid-market scale sweet spot 20, Midsouth geography 15, growth posture 15, and service-intensity signals from news 15 — each scored 0–100 from actual company fields. The director has to trust the tool and argue with it, and she can only argue with weights she can see. Every score ships with its per-criterion rationale rendered on the detail view.

**2. Walk us through your data model.**

- **Company**: identity/firmographics (industry, markers, HQ, employees, revenue, growth, ownership, shipping profile)
- **Leadership** (name, title, relevance note), **NewsEvent** (date/source/headline/summary), **FinancialSignal** (funding, filings) — children of Company
- **ServiceFit**: per-service rating + rationale for each of Meridian's four services, child of Company
- **Search**: the criteria entered; produces Companies via matching
- **CriterionAssessment**: verdict + pushback text, attached to a Search
- **FitScore**: total plus per-criterion breakdown, one per Company

**3. What database would you use in production, and why?**

PostgreSQL on Amazon RDS/Aurora, with OpenSearch alongside it. The entity structure is genuinely relational, and auditability matters — she has to trust the scores, so the underlying records need to be queryable and consistent. JSONB columns on Company absorb schema drift from external intelligence sources without migrations, and OpenSearch handles the text-heavy matching on industry markers and news. Intelligence goes stale, so every record carries a collected timestamp and the collector runs as a scheduled job with staleness flagged in the UI.

**4. Show us one prompt that did not work, and what you changed.**

See PROMPTS.md for the verbatim text. The short version: I first asked the AI tool to generate the fit-scoring logic in one shot — "score these companies by how well they fit a fulfillment provider." What came back looked plausible and was quietly wrong: it anchored the score on company *size* and gave a stagnant, declining manufacturer a higher fit than a fast-growing kitting-heavy account, because size correlates with shipping volume in its training prior. I caught it by testing against a deliberately planted bad fit (a real-estate services firm with no physical goods) and finding the score wasn't at the floor. I reframed the prompt to force a two-step process: first list concrete evidence of need from each company's data, then score criteria separately with explicit weights, and refuse to let one criterion compensate past its weight. The lesson that changed my workflow: with scoring logic, "looks plausible" is the failure mode, so every prompt now has to name the expected wrong answer in advance.

**5. What did you deliberately not build, and why?**

The brief's out-of-scope list (auth, model integration, background monitoring, NL querying) stayed untouched — all four would have consumed hours and scored against me. Within scope, I didn't build result pagination, exports, or an editable weighting UI: with a six-company universe, pagination and export solve problems that don't exist yet, and exposing the weights as arguments beats exposing them as sliders before anyone has argued with the defaults.

**6. How would this application work on a phone, and what would you change?**

Same single flow, one column: criteria stack vertically, the results table becomes stacked fit-cards ordered by score, and detail goes full-screen with the fit reasoning first. I'd change three things: move the one-line "why" under the company name (it's the decision-driver on a small screen), make geography entry location-first rather than ZIP-first, and put a call/email action in the detail header, because the phone is where the first conversation actually happens.

**7. What would you do with another week on this?**

First, real data behind one source (secretary-of-state filings plus news) to pressure-test whether the fit rationale survives contact with messy records — the logic is only as good as the evidence. Second, staleness: timestamps, a refresh job, and visible data-age in the UI, since trust is the product. Third, a lightweight feedback loop where she can mark a prospect wrong, capturing which criterion she disputes — that is the training signal for revising the weights, and the argument she was promised. Fourth, saved named searches so her recurring segments persist without rebuilding criteria.

**8. What was this exercise like for you, and is open ended work something you want more of?**

Honestly, it was the good kind of hard. The incomplete brief is the point — the deliverable is a set of defensible decisions, and I enjoyed that the evaluation is about judgment rather than completion. The constraint that an unfinished app with clear reasoning outscores a finished one without it is a healthy frame, and it matches how I already try to work: name the assumption, make the call, show the reasoning. Yes — more of this. Work where the spec has gaps and the gaps are yours to own is exactly where I do my best work.
