import FitMeter from './FitMeter.jsx';
import { getScore } from '../lib/engine.js';

// Results list: only what she needs to decide whether to open a company.
// Leadership depth, financials, news, and fit reasoning are held for detail.
export default function ResultsTable({ results, onOpen }) {
  const matched = results
    .filter((r) => r.matched)
    .sort((a, b) => getScore(b.company).total - getScore(a.company).total);

  if (matched.length === 0) return null;

  return (
    <div className="results">
      <div className="results-head">
        <h2>Matched prospects <span className="muted">— ranked by fit, Meridian's way of calling</span></h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Fit</th>
            <th>Company</th>
            <th>HQ</th>
            <th>Industry</th>
            <th>Employees</th>
            <th>Revenue</th>
            <th>Growth</th>
            <th>Why it's on the list</th>
          </tr>
        </thead>
        <tbody>
          {matched.map(({ company }) => {
            const score = getScore(company);
            return (
              <tr key={company.id} onClick={() => onOpen(company)} tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onOpen(company)}>
                <td><FitMeter score={score.total} /></td>
                <td className="company-name">{company.name}</td>
                <td>{company.hq.city}, {company.hq.state}</td>
                <td>{company.industry}</td>
                <td className="num">{company.employees}</td>
                <td className="num">${company.revenue}M</td>
                <td className={`num ${company.growthYoY < 0 ? 'neg' : 'pos'}`}>{company.growthYoY > 0 ? '+' : ''}{company.growthYoY}%</td>
                <td className="why">{company.fitNotes.length > 110 ? company.fitNotes.slice(0, 107) + '…' : company.fitNotes}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
