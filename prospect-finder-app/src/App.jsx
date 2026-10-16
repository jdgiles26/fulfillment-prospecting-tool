import { useEffect, useState } from 'react';
import SearchForm from './components/SearchForm.jsx';
import AssessmentBanner from './components/AssessmentBanner.jsx';
import ResultsTable from './components/ResultsTable.jsx';
import CompanyDetail from './components/CompanyDetail.jsx';
import { COMPANIES } from './data/companies.js';
import { runSearch, assessCriteria } from './lib/engine.js';

const LS_KEY = 'prospect-finder-recent-searches';

function labelFor(c) {
  const bits = [];
  if (c.companyName?.trim()) bits.push(`"${c.companyName.trim()}"`);
  if (c.industry?.trim()) bits.push(c.industry.trim().slice(0, 24));
  const g = c.geo?.find((x) => x.state || x.city || x.zip);
  if (g) bits.push(g.state || g.city || g.zip);
  return bits.length ? bits.join(' · ') : 'Open search';
}

export default function App() {
  const [searchState, setSearchState] = useState(null); // { criteria, results, assessment }
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; }
  });

  const executeSearch = (criteria) => {
    const results = runSearch(criteria, COMPANIES);
    const matchCount = results.filter((r) => r.matched).length;
    const assessment = assessCriteria(criteria, matchCount, COMPANIES.length);
    setSearchState({ criteria, results, assessment });
    setSelected(null);
    setSaved((prev) => {
      const next = [{ criteria, label: labelFor(criteria), ts: Date.now() }, ...prev].slice(0, 10);
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Keyboard: "/" focuses the first input, Escape closes the detail panel.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        document.querySelector('.search-form input')?.focus();
      }
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <img src="/MeridianLogoMark.png" alt="Meridian Fulfillment Partners" className="brand" />
        <div className="header-text">
          <h1>Prospect Finder</h1>
          <p className="tagline">Your partner from print to people — delivering what's next.</p>
        </div>
        <div className="header-meta">
          <span>Sales intelligence · internal</span>
          <span>{COMPANIES.length} companies in sample universe</span>
        </div>
      </header>

      <main>
        <section className="panel">
          <h2 className="panel-title">Describe the company you're looking for</h2>
          <SearchForm onSearch={executeSearch} savedSearches={saved} onRecall={executeSearch} />
        </section>

        {searchState && (
          <>
            <AssessmentBanner assessment={searchState.assessment} />
            <ResultsTable results={searchState.results} onOpen={setSelected} />
          </>
        )}

        {!searchState && (
          <p className="hint">Fill in what you know — leave the rest open. The tool tells you when your
            criteria will produce noise before it spends your time on results. Press <kbd>/</kbd> to jump here.</p>
        )}
      </main>

      <CompanyDetail company={selected} onClose={() => setSelected(null)} />

      <footer className="app-footer">
        <span>Meridian Fulfillment Partners · Hoboken, Arkansas</span>
        <span>Sample data only — six fictional companies for evaluation purposes</span>
      </footer>
    </div>
  );
}
