// The Prospect Finder decision engine.
// Three pure modules: search matching, fit scoring, criteria assessment.
// Everything is deterministic and inspectable — the user must be able to
// argue with the output, so every score carries its reasoning with it.

// ---------------------------------------------------------------------------
// 1. Search matching
// ---------------------------------------------------------------------------

// ZIP prefix regions: match on first two digits within the same region,
// else fall back to state match. Deliberately simple and explainable.
const ZIP_REGIONS = {
  '71': 'AR-LA-OK region', '72': 'AR region', '73': 'OK region', '74': 'OK region',
  '75': 'TX-N region', '38': 'TN-MS region', '37': 'TN region', '63': 'MO region',
  '64': 'MO region', '65': 'MO region',
};

function zipMatches(queryZip, companyZip) {
  if (!queryZip) return false;
  const q = String(queryZip).trim();
  if (q.length < 3) return false;
  return companyZip.startsWith(q.slice(0, 3));
}

function geoMatches(geoEntries, company) {
  if (!geoEntries || geoEntries.length === 0) return { matched: true, why: 'no geography specified' };
  const hits = geoEntries.filter((g) => {
    if (!g || (!g.city && !g.state && !g.zip)) return false;
    const byZip = g.zip && zipMatches(g.zip, company.hq.zip);
    const byState = g.state && g.state.toUpperCase() === company.hq.state;
    const byCity = g.city && g.city.trim().toLowerCase() === company.hq.city.toLowerCase();
    return byZip || byState || byCity;
  });
  return hits.length > 0
    ? { matched: true, why: `HQ ${company.hq.city}, ${company.hq.state} ${company.hq.zip}` }
    : { matched: false, why: 'outside specified geography' };
}

function inRange(value, min, max) {
  if (min == null && max == null) return true;
  if (min != null && max != null) return value >= min && value <= max;
  if (min != null) return value >= min;
  return value <= max;
}

// "Roughly" widens a bound by 20% in both directions; unknown bounds are open.
function fuzzyBounds(min, max, rough) {
  const widen = (v) => (rough && v != null ? Math.round(v * 0.8) : v);
  const widenUp = (v) => (rough && v != null ? Math.round(v * 1.25) : v);
  return { lo: widen(min), hi: widenUp(max) };
}

const MARKER_KEYWORDS = {
  'ships bulky goods': ['bulky', 'heavy', 'furniture', 'outdoor'],
  'catalog / direct mail': ['catalog', 'direct mail', 'mail'],
  'multi-location shipping': ['multi-location', 'multi location', 'multiple locations', 'locations'],
  'regulated labeling': ['regulated', 'label', 'labeling', 'compliance', 'lot'],
  'high order volume': ['high volume', 'volume', 'orders', 'high-order'],
  'kitting needs': ['kit', 'kitting', 'assembly', 'bundl'],
  'event-driven shipping': ['event', 'promo', 'promotional', 'swag'],
  'B2B shipping': ['b2b', 'industrial', 'tooling'],
  'flat/declining revenue': ['flat', 'declin', 'stagnant'],
  'no physical goods': ['no goods', 'service', 'real estate', 'digital'],
};

function markerMatches(queryText, company) {
  if (!queryText || !queryText.trim()) return { matched: true, why: 'no industry markers given' };
  const q = queryText.toLowerCase();
  const industryHit = company.industry.toLowerCase().includes(q);
  const markerHit = company.industryMarkers.some((m) => m.toLowerCase().includes(q) || q.includes(m.toLowerCase()));
  const keywordHit = Object.entries(MARKER_KEYWORDS).some(([marker, words]) =>
    company.industryMarkers.includes(marker) && words.some((w) => q.includes(w)));
  return industryHit || markerHit || keywordHit
    ? { matched: true, why: `industry/markers align: ${company.industry}` }
    : { matched: false, why: `industry markers don't align with "${queryText}"` };
}

export function runSearch(criteria, companies) {
  const results = companies
    .map((c) => {
      const checks = {
        name: !criteria.companyName ||
          c.name.toLowerCase().includes(criteria.companyName.trim().toLowerCase()),
        industry: markerMatches(criteria.industry, c),
        geo: geoMatches(criteria.geo, c),
        employees: (() => {
          const { lo, hi } = fuzzyBounds(criteria.empMin, criteria.empMax, criteria.empRough);
          return { matched: inRange(c.employees, lo, hi), why: `${c.employees} employees` };
        })(),
        revenue: (() => {
          const { lo, hi } = fuzzyBounds(criteria.revMin, criteria.revMax, criteria.revRough);
          return { matched: inRange(c.revenue, lo, hi), why: `$${c.revenue}M revenue` };
        })(),
      };
      const matched = checks.name && checks.industry.matched && checks.geo.matched &&
        checks.employees.matched && checks.revenue.matched;
      return { company: c, matched, checks };
    });
  return results;
}

// ---------------------------------------------------------------------------
// 2. Fit indicator
// ---------------------------------------------------------------------------
// Weighted additive model, 0–100. Weights are Meridian's way of doing
// business, expressed in code and shown to the user — she can argue with
// the weights, not with a black box.

export const FIT_WEIGHTS = [
  { key: 'industry', label: 'Industry & service alignment', weight: 35,
    note: 'How directly the company\'s business maps to Meridian\'s four services.' },
  { key: 'scale', label: 'Scale sweet spot', weight: 20,
    note: 'Mid-market ($10M–$150M, 50–500 employees) is where outsourced logistics pays off. Too small can\'t afford it; too large has it in-house.' },
  { key: 'geography', label: 'Geographic reach', weight: 15,
    note: 'Arkansas and the Midsouth keep freight simple and account visits cheap.' },
  { key: 'momentum', label: 'Growth posture', weight: 15,
    note: 'Growing companies outrun their own logistics — that\'s exactly when they buy.' },
  { key: 'intensity', label: 'Service intensity signals', weight: 15,
    note: 'Catalog programs, kitting obligations, depot consolidations — concrete evidence of work for Meridian to do.' },
];

const RATING_POINTS = { strong: 1.0, moderate: 0.55, weak: 0.2, none: 0 };

const MID_SOUTH = new Set(['AR', 'TN', 'OK', 'MO', 'MS', 'LA', 'TX']);

function scoreCompany(company) {
  const svc = company.servicesFit;
  const industryScore = (RATING_POINTS[svc.fulfillment.rating] * 0.3 +
    RATING_POINTS[svc.managedPrint.rating] * 0.3 +
    RATING_POINTS[svc.kitting.rating] * 0.25 +
    RATING_POINTS[svc.warehousing.rating] * 0.15) * 100;

  let scaleScore;
  if (company.revenue >= 10 && company.revenue <= 150 && company.employees >= 50 && company.employees <= 500) {
    scaleScore = 100;
  } else if (company.revenue >= 5 && company.revenue <= 300) {
    scaleScore = 55;
  } else {
    scaleScore = 20;
  }

  const geoScore = company.hq.state === 'AR' ? 100 : MID_SOUTH.has(company.hq.state) ? 80 : 25;

  const momentumScore = company.growthYoY >= 10 ? 100 : company.growthYoY >= 4 ? 70 : company.growthYoY >= 0 ? 40 : 10;

  const intensitySignals = company.news.filter((n) =>
    /kit|print|label|catalog|fulfil|warehouse|consolidat|capacity|distribut/i.test(n.headline + ' ' + n.summary)).length;
  const intensityScore = Math.min(100, 35 + intensitySignals * 25);

  const parts = {
    industry: Math.round(industryScore),
    scale: Math.round(scaleScore),
    geography: Math.round(geoScore),
    momentum: Math.round(momentumScore),
    intensity: Math.round(intensityScore),
  };

  const total = FIT_WEIGHTS.reduce((sum, w) => sum + parts[w.key] * (w.weight / 100), 0);
  return { total: Math.round(total), parts };
}

export function fitBand(total) {
  if (total >= 80) return { label: 'Call first', className: 'band-high' };
  if (total >= 55) return { label: 'Worth a look', className: 'band-mid' };
  return { label: 'Low priority', className: 'band-low' };
}

// Score every company once; results re-use these scores.
export const SCORED = new Map();
export function getScore(company) {
  if (!SCORED.has(company.id)) SCORED.set(company.id, scoreCompany(company));
  return SCORED.get(company.id);
}

// Human rationale assembled per criterion from the company record itself,
// so the reasoning on screen traces back to actual data fields.
export function fitRationale(company, score) {
  const svc = company.servicesFit;
  const strongest = Object.entries(svc)
    .sort((a, b) => RATING_POINTS[b[1].rating] - RATING_POINTS[a[1].rating])
    .slice(0, 2)
    .map(([k]) => ({ fulfillment: 'fulfillment', managedPrint: 'managed print', kitting: 'kitting & assembly', warehousing: 'light warehousing' }[k]));
  return {
    industry: svc.fulfillment.rationale,
    scale: company.revenue >= 10 && company.revenue <= 150
      ? `$${company.revenue}M revenue and ${company.employees} employees sit inside Meridian's mid-market sweet spot.`
      : company.revenue < 10
        ? `$${company.revenue}M revenue is below the $10M floor where outsourcing logistics typically pencils out.`
        : `$${company.revenue}M revenue is above the $150M ceiling where most firms bring logistics in-house.`,
    geography: company.hq.state === 'AR'
      ? `Headquartered in ${company.hq.city}, AR — in Meridian's home market.`
      : MID_SOUTH.has(company.hq.state)
        ? `${company.hq.city}, ${company.hq.state} is in the Midsouth service region.`
        : `${company.hq.city}, ${company.hq.state} is outside the core Midsouth footprint.`,
    momentum: company.growthYoY >= 10
      ? `${company.growthYoY}% YoY growth — outgrowing internal logistics is the buying trigger.`
      : company.growthYoY >= 0
        ? `${company.growthYoY}% YoY growth — steady, but not an urgent capacity story.`
        : `${company.growthYoY}% YoY growth — shrinking companies don't buy new logistics.`,
    intensity: `${strongest.join(' and ')} show up as ${svc.fulfillment.rating === 'strong' || svc.kitting.rating === 'strong' ? 'active' : 'limited'} needs in recent news and service signals.`,
  };
}

// ---------------------------------------------------------------------------
// 3. Criteria assessment
// ---------------------------------------------------------------------------
// The system pushes back on the search itself. Rule-based, hardcoded voice,
// per the brief — it is about whether the criteria will produce signal or noise.

export function assessCriteria(criteria, matchCount, universeSize) {
  const specified = [
    criteria.industry?.trim(), criteria.geo?.some((g) => g.city || g.state || g.zip),
    criteria.empMin != null || criteria.empMax != null,
    criteria.revMin != null || criteria.revMax != null,
    criteria.companyName?.trim(),
  ].filter(Boolean).length;

  const share = matchCount / universeSize;

  let verdict; // 'broad' | 'narrow' | 'balanced'
  let headline;
  let advice;

  if (specified <= 1 || share >= 0.85) {
    verdict = 'broad';
    headline = 'These criteria will produce noise.';
    advice = matchCount === universeSize
      ? 'Everything in the known universe matches. Add an industry marker or a geography before spending a call on this list.'
      : `Nearly the whole universe (${matchCount} of ${universeSize}) matches. Narrow at least one criterion — industry markers move the list most.`;
  } else if (matchCount === 0) {
    verdict = 'narrow';
    headline = 'Nothing matches — your net is too tight.';
    advice = 'Zero matches usually means stacked criteria, not a dead market. Widen the revenue band or drop one geography first; check "roughly" if you guessed at ranges.';
  } else if (share <= 0.17) {
    verdict = 'narrow';
    headline = 'Very thin result set — likely excluding good fits.';
    advice = `Only ${matchCount} of ${universeSize} known companies match. If that feels low for the segment you have in mind, loosen the tightest criterion (often revenue) rather than starting over.`;
  } else {
    verdict = 'balanced';
    headline = 'Criteria look workable.';
    advice = `${matchCount} of ${universeSize} known companies match. That's a call-sized list. If the names surprise you, argue with the fit reasoning, not the criteria.`;
  }

  const unknowns = [];
  if (!criteria.industry?.trim()) unknowns.push('industry');
  if (!criteria.geo?.some((g) => g.city || g.state || g.zip)) unknowns.push('geography');
  if (criteria.empMin == null && criteria.empMax == null) unknowns.push('employee range');
  if (criteria.revMin == null && criteria.revMax == null) unknowns.push('revenue range');

  return { verdict, headline, advice, specified, matchCount, universeSize, unknowns };
}
