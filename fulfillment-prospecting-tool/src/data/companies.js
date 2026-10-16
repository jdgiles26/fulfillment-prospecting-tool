// Sample universe for the Prospect Finder exercise.
// Six fictional companies with enough variety to genuinely exercise the
// results list and the fit indicator. Production data would arrive from an
// automated intelligence pipeline; here it is hardcoded per the brief.

export const COMPANIES = [
  {
    id: 'ozark-outdoor',
    name: 'Ozark Outdoor Living Co.',
    industry: 'Consumer Goods — Outdoor Furniture & Patio',
    industryMarkers: ['ships bulky goods', 'catalog / direct mail', 'multi-location shipping'],
    hq: { city: 'Rogers', state: 'AR', zip: '72758' },
    employees: 220,
    revenue: 58, // $M
    growthYoY: 14,
    ownership: 'Private — founder-owned, ESOP transition planned',
    funding: 'Self-funded; $6M equipment credit line (2024)',
    filings: 'None public (private co.); D&B rated 3A2',
    shippingProfile: 'High-SKU catalog (~4,800 SKUs), heavy/bulky parcel and LTL, seasonal peaks',
    leadership: [
      { name: 'Dana Whitfield', title: 'President & CEO', note: 'Founder. Publicly said "we outgrew our own warehouse twice" at the 2025 NWA retail summit.' },
      { name: 'Marcus Tran', title: 'VP, Operations', note: 'Runs a 180k sq ft DC in Rogers; posts about carrier rate pain points on LinkedIn.' },
      { name: 'Elena Brooks', title: 'Director of E-Commerce', note: 'Owns DTC channel, ~40% of revenue; seasonal kitting for patio bundles.' },
    ],
    news: [
      { date: '2026-08-19', headline: 'Ozark Outdoor Living opens second distribution point in Springdale', source: 'Arkansas Business', summary: 'The company leased a 96k sq ft facility to handle fall catalog volume, citing "logistics capacity" as its binding constraint.' },
      { date: '2026-06-30', headline: 'Fall catalog to reach 2.1M households', source: 'Northwest Arkansas Democrat-Gazette', summary: 'Largest print run in company history; marketing lead credits "better kitting of our room bundles." ' },
      { date: '2026-05-12', headline: 'Company posts 14% YoY revenue growth', source: 'Company press release', summary: 'Attributing growth to DTC expansion and two new retail partnerships requiring store-display assembly.' },
    ],
    servicesFit: {
      fulfillment: { rating: 'strong', rationale: 'Catalog + DTC volume with seasonal peaks; already leasing overflow space — classic outsourced-fulfillment trigger.' },
      managedPrint: { rating: 'strong', rationale: '2.1M-piece catalog program plus in-store signage; print is a stated line item in their growth plan.' },
      kitting: { rating: 'strong', rationale: 'Patio "room bundles" are sold as kitted sets; assembly of retail displays is explicitly mentioned in news.' },
      warehousing: { rating: 'moderate', rationale: 'Owns DC space but is leasing overflow; light-warehousing overflow is a wedge, not the whole deal.' },
    },
    fitNotes: 'Squarely Meridian\'s profile: mid-market consumer goods, catalog-driven print volume, bulky-goods fulfillment, and growth outpacing its own logistics.',
  },
  {
    id: 'deltassg',
    name: 'Delta Surgical Supply Group',
    industry: 'Medical Products Distribution',
    industryMarkers: ['regulated labeling', 'multi-location shipping', 'high order volume'],
    hq: { city: 'Memphis', state: 'TN', zip: '38103' },
    employees: 480,
    revenue: 145, // $M
    growthYoY: 4,
    ownership: 'PE-backed (Southgate Capital, 2022)',
    funding: 'Southgate Capital majority investment (2022, undisclosed)',
    filings: 'UCC filings active; no public securities filings',
    shippingProfile: 'Distribution to clinics/hospitals across the Midsouth; lot-tracking and sterile packaging requirements',
    leadership: [
      { name: 'Dr. Alan Reyes', title: 'CEO', note: 'Former hospital-system COO; talks compliance-first supply chain on panels.' },
      { name: 'Karen Stovall', title: 'COO', note: 'Former Cardinal Health ops director; joined 2023, tasked with margin recovery.' },
      { name: 'Priya Raman', title: 'VP, Supply Chain', note: 'Owns the Memphis DC; has complained publicly about label misprints causing rejected shipments.' },
    ],
    news: [
      { date: '2026-07-22', headline: 'Delta Surgical consolidates three regional depots', source: 'Memphis Business Journal', summary: 'Consolidation into a single Midsouth hub; consultants cited "print and label standardization" as a cost target.' },
      { date: '2026-04-08', headline: 'COO outlines margin-recovery plan', source: 'Company town hall (reported)', summary: 'Outsourcing non-core logistics and print operations named as a 2026 initiative.' },
      { date: '2026-02-14', headline: 'Wins five-state GPO contract extension', source: 'Healthcare distribution trade press', summary: 'Extension adds kitting requirements for procedure-packs across 40 clinics.' },
    ],
    servicesFit: {
      fulfillment: { rating: 'strong', rationale: 'Depot consolidation is actively underway; they need overflow fulfillment capacity with compliance discipline.' },
      managedPrint: { rating: 'strong', rationale: 'Lot/batch labeling is compliance-critical and visibly painful for them right now.' },
      kitting: { rating: 'strong', rationale: 'New procedure-pack kitting obligations attached to their GPO contract win.' },
      warehousing: { rating: 'moderate', rationale: 'Sterile storage is specialized, but general overflow and light storage are in play post-consolidation.' },
    },
    fitNotes: 'PE-backed distributor under explicit margin pressure, with named pain in labeling/print and new kitting obligations. Larger than Meridian\'s typical account but within reach.',
  },
  {
    id: 'nutrapack',
    name: 'NutraPack Labs',
    industry: 'Contract Packaging — Supplements & Nutrition',
    industryMarkers: ['kitting needs', 'high order volume', 'regulated labeling'],
    hq: { city: 'Bentonville', state: 'AR', zip: '72712' },
    employees: 340,
    revenue: 96, // $M
    growthYoY: 9,
    ownership: 'Private — second-generation family ownership',
    funding: '$11M equipment financing (2025) for second co-pack line',
    filings: 'State franchise filings current; FDA facility registration public',
    shippingProfile: 'Co-packs and ships for 60+ supplement brands; subscription boxes are the fastest-growing line',
    leadership: [
      { name: 'Tom Okonkwo', title: 'CEO', note: 'Second-generation owner; speaks at contract-packaging conferences about capacity planning.' },
      { name: 'Grace Lin', title: 'VP, Client Services', note: 'Manages 60+ brand accounts; kitting quality is her stated top client complaint area.' },
      { name: 'Ray Delgado', title: 'Plant Manager', note: 'Runs both Bentonville lines; quoted on labor availability challenges in NW Arkansas.' },
    ],
    news: [
      { date: '2026-08-30', headline: 'NutraPack earns NSF certification on line two', source: 'Company press release', summary: 'Certification opens the door to national sport-nutrition brands; capacity is the stated constraint.' },
      { date: '2026-06-11', headline: 'Adds subscription-box co-packing service', source: 'Contract Packaging magazine', summary: 'New service line requires kitting and direct-to-consumer fulfillment they currently outsource piecemeal.' },
      { date: '2026-03-02', headline: 'Announces $11M equipment financing', source: 'Arkansas Business', summary: 'Financing funds a second co-pack line; executives mention "evaluating our fulfillment partners." ' },
    ],
    servicesFit: {
      fulfillment: { rating: 'strong', rationale: 'DTC subscription fulfillment is their newest line and their most operationally awkward one.' },
      managedPrint: { rating: 'strong', rationale: 'Label/packaging print for 60+ brands with regulatory variation — a constant, unglamorous need.' },
      kitting: { rating: 'strong', rationale: 'Subscription boxes are literally kitting; client services VP names quality as the pain point.' },
      warehousing: { rating: 'strong', rationale: 'Ingredient and finished-goods overflow storage needs scale with both new lines.' },
    },
    fitNotes: 'A four-service match 45 minutes from Meridian\'s door. Growth is funded and certification-driven; they are actively re-evaluating fulfillment partners — timing is the story here.',
  },
  {
    id: 'bluesky-promo',
    name: 'BlueSky Promotions LLC',
    industry: 'Branded Merchandise & Promotional Products',
    industryMarkers: ['kitting needs', 'catalog / direct mail', 'event-driven shipping'],
    hq: { city: 'Tulsa', state: 'OK', zip: '74103' },
    employees: 65,
    revenue: 12, // $M
    growthYoY: 22,
    ownership: 'Private — founder-owned',
    funding: 'SBA-backed expansion loan (2025)',
    shippingProfile: 'Project-based: welcome kits, event swag, retail rollouts; extremely spiky shipping calendar',
    leadership: [
      { name: 'Jenna Cole', title: 'Founder & CEO', note: 'Built the firm on client onboarding kits; active on LinkedIn, posts every event rollout.' },
      { name: 'Sam Whitaker', title: 'Operations Director', note: 'Hires 8–12 temps per big project; has said "our garage is not a warehouse" in a local podcast.' },
    ],
    news: [
      { date: '2026-08-05', headline: 'BlueSky lands three Fortune 500 onboarding-kit programs', source: 'Tulsa World', summary: 'Programs require 2,000–5,000 kitted units per wave with strict ship-date windows.' },
      { date: '2026-05-27', headline: 'Firm posts 22% growth, plans first ops hire', source: 'Company blog', summary: 'Growth is entirely project-driven; fulfillment is called out as "where projects go to slip."' },
    ],
    servicesFit: {
      fulfillment: { rating: 'moderate', rationale: 'Spiky project volumes; they need surge capacity more than always-on fulfillment.' },
      managedPrint: { rating: 'strong', rationale: 'Every kit starts with printed materials; brand-color consistency across vendors is a stated frustration.' },
      kitting: { rating: 'strong', rationale: 'Kitting is the core of every engagement; quality control on 2–5k unit waves is their reputation.' },
      warehousing: { rating: 'moderate', rationale: 'Short-term storage between project waves; modest but recurring.' },
    },
    fitNotes: 'Small but fast-growing and service-shaped: kitting and print are the product. Right at the small end of Meridian\'s economic sweet spot — a land-and-expand account.',
  },
  {
    id: 'riverbend',
    name: 'Riverbend Tool & Die',
    industry: 'Industrial Manufacturing — Custom Tooling',
    industryMarkers: ['B2B shipping', 'flat/declining revenue'],
    hq: { city: 'Little Rock', state: 'AR', zip: '72201' },
    employees: 130,
    revenue: 28, // $M
    growthYoY: -3,
    ownership: 'Family-owned (third generation)',
    funding: 'None; conservative balance sheet',
    filings: 'None public (private co.)',
    shippingProfile: 'Low-volume, high-value B2B shipments; raw-material storage on site',
    leadership: [
      { name: 'Walter Hines', title: 'President', note: 'Third-generation owner; famously cost-conscious, slow to outsource anything.' },
      { name: 'Carla Hines', title: 'VP, Finance', note: 'Pushing modernization; authored the 2025 equipment-lease proposal the board tabled.' },
    ],
    news: [
      { date: '2026-06-18', headline: 'Riverbend tables $4M modernization plan', source: 'Arkansas Business', summary: 'Board deferred a CNC upgrade citing cash preservation; flat revenue for a third straight year.' },
      { date: '2026-01-20', headline: 'Company marks 60th year in Little Rock', source: 'Company announcement', summary: 'Anniversary profile notes the firm still prints work orders and travelers in-house.' },
    ],
    servicesFit: {
      fulfillment: { rating: 'weak', rationale: 'Low-volume B2B shipping; little to outsource.' },
      managedPrint: { rating: 'moderate', rationale: 'In-plant print for work orders/travelers is real but tiny and entrenched.' },
      kitting: { rating: 'weak', rationale: 'No kitting operation to speak of.' },
      warehousing: { rating: 'moderate', rationale: 'Some raw-material overflow storage, handled adequately on site.' },
    },
    fitNotes: 'Geographically perfect and personally loyal, but flat revenue, low shipping volume, and a conservative owner make this a nurture-don\'t-chase account.',
  },
  {
    id: 'crescent',
    name: 'Crescent Capital Realty Group',
    industry: 'Commercial Real Estate Services',
    industryMarkers: ['no physical goods', 'service business'],
    hq: { city: 'Dallas', state: 'TX', zip: '75201' },
    employees: 45,
    revenue: 18, // $M
    growthYoY: 6,
    ownership: 'Private — partnership',
    funding: 'None',
    filings: 'None',
    shippingProfile: 'Effectively none — digital document business with occasional marketing collateral',
    leadership: [
      { name: 'Victoria Ashe', title: 'Managing Partner', note: 'Growth through broker recruiting; marketing materials are agency-outsourced.' },
    ],
    news: [
      { date: '2026-07-30', headline: 'Crescent expands broker team to 38 agents', source: 'Dallas Business Journal', summary: 'Growth is headcount-driven; all marketing production is handled by an outside agency.' },
    ],
    servicesFit: {
      fulfillment: { rating: 'none', rationale: 'No goods to fulfill.' },
      managedPrint: { rating: 'weak', rationale: 'Collateral exists but is locked into an agency retainer.' },
      kitting: { rating: 'none', rationale: 'No kitting need.' },
      warehousing: { rating: 'none', rationale: 'Nothing to store.' },
    },
    fitNotes: 'Included to exercise the low end of the fit scale: a service business with an agency relationship in the way. The fit indicator exists precisely to kill these calls early.',
  },
];

export const SERVICE_KEYS = ['fulfillment', 'managedPrint', 'kitting', 'warehousing'];

export const SERVICE_LABELS = {
  fulfillment: 'Order fulfillment',
  managedPrint: 'Managed print',
  kitting: 'Kitting & assembly',
  warehousing: 'Light warehousing',
};
