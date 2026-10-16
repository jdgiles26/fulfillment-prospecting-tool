import { getScore, fitRationale, fitBand, FIT_WEIGHTS } from '../lib/engine.js';
import { SERVICE_KEYS, SERVICE_LABELS } from '../data/companies.js';

// Company detail: one company at a time, everything she needs for a first
// conversation — including the full reasoning behind the fit indicator.
export default function CompanyDetail({ company, onClose }) {
  if (!company) return null;
  const score = getScore(company);
  const rationale = fitRationale(company, score);
  const band = fitBand(score.total);

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={company.name}>
        <button className="close-btn" onClick={onClose} aria-label="Close">×</button>

        <header className="detail-header">
          <div>
            <h2>{company.name}</h2>
            <p className="muted">{company.industry} · {company.hq.city}, {company.hq.state} {company.hq.zip}</p>
          </div>
          <div className={`detail-score ${band.className}`}>
            <span className="detail-score-num">{score.total}</span>
            <span className="detail-score-band">{band.label}</span>
          </div>
        </header>

        <section>
          <h3>Identity & firmographics</h3>
          <dl className="facts">
            <div><dt>Ownership</dt><dd>{company.ownership}</dd></div>
            <div><dt>Employees</dt><dd>{company.employees}</dd></div>
            <div><dt>Revenue</dt><dd>${company.revenue}M ({company.growthYoY > 0 ? '+' : ''}{company.growthYoY}% YoY)</dd></div>
            <div><dt>Shipping profile</dt><dd>{company.shippingProfile}</dd></div>
          </dl>
        </section>

        <section>
          <h3>Leadership</h3>
          <ul className="leaders">
            {company.leadership.map((l) => (
              <li key={l.name}>
                <strong>{l.name}</strong> <span className="muted">{l.title}</span>
                <p>{l.note}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3>Financial signals</h3>
          <dl className="facts">
            <div><dt>Funding</dt><dd>{company.funding}</dd></div>
            <div><dt>Filings</dt><dd>{company.filings}</dd></div>
          </dl>
        </section>

        <section>
          <h3>Recent market activity</h3>
          <ul className="news">
            {company.news.map((n) => (
              <li key={n.date}>
                <span className="news-date">{n.date}</span>
                <div>
                  <strong>{n.headline}</strong> <span className="muted">— {n.source}</span>
                  <p>{n.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="fit-section">
          <h3>Why this fit score — {score.total}/100</h3>
          <p className="muted">Weighted model. Weights reflect Meridian's way of doing business; argue with them, not with a black box.</p>
          {FIT_WEIGHTS.map((w) => (
            <div className="fit-row" key={w.key}>
              <div className="fit-row-head">
                <span>{w.label} <span className="muted">({w.weight}%)</span></span>
                <span className="fit-part-num">{score.parts[w.key]}/100</span>
              </div>
              <div className="fit-bar"><div className="fit-bar-fill" style={{ width: `${score.parts[w.key]}%` }} /></div>
              <p className="fit-rationale">{rationale[w.key]}</p>
              <p className="fit-weight-note">{w.note}</p>
            </div>
          ))}
          <h4>Service-by-service read</h4>
          <ul className="service-read">
            {SERVICE_KEYS.map((k) => (
              <li key={k}>
                <span className={`dot ${company.servicesFit[k].rating}`} />
                <strong>{SERVICE_LABELS[k]}</strong> — {company.servicesFit[k].rationale}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
