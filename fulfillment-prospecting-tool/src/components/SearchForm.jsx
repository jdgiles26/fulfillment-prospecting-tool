import { useState } from 'react';

const EMPTY_GEO = { city: '', state: '', zip: '' };

export default function SearchForm({ onSearch, savedSearches, onRecall }) {
  const [industry, setIndustry] = useState('');
  const [geo, setGeo] = useState([{ ...EMPTY_GEO }]);
  const [empMin, setEmpMin] = useState('');
  const [empMax, setEmpMax] = useState('');
  const [empRough, setEmpRough] = useState(false);
  const [revMin, setRevMin] = useState('');
  const [revMax, setRevMax] = useState('');
  const [revRough, setRevRough] = useState(false);
  const [companyName, setCompanyName] = useState('');

  const setGeoRow = (i, patch) =>
    setGeo(geo.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));

  const submit = (e) => {
    e.preventDefault();
    onSearch({
      industry,
      geo: geo.filter((g) => g.city || g.state || g.zip),
      empMin: empMin === '' ? null : Number(empMin),
      empMax: empMax === '' ? null : Number(empMax),
      empRough,
      revMin: revMin === '' ? null : Number(revMin),
      revMax: revMax === '' ? null : Number(revMax),
      revRough,
      companyName,
    });
  };

  const recall = (s) => {
    setIndustry(s.criteria.industry ?? '');
    setGeo(s.criteria.geo?.length ? s.criteria.geo.map((g) => ({ ...EMPTY_GEO, ...g })) : [{ ...EMPTY_GEO }]);
    setEmpMin(s.criteria.empMin ?? ''); setEmpMax(s.criteria.empMax ?? '');
    setEmpRough(!!s.criteria.empRough);
    setRevMin(s.criteria.revMin ?? ''); setRevMax(s.criteria.revMax ?? '');
    setRevRough(!!s.criteria.revRough);
    setCompanyName(s.criteria.companyName ?? '');
    onRecall(s.criteria);
  };

  return (
    <form className="search-form" onSubmit={submit}>
      <div className="form-grid">
        <label className="field span-2">
          <span>Industry or industry markers <em>(free text — e.g. "supplement packaging", "bulky goods", "kitting")</em></span>
          <input value={industry} onChange={(e) => setIndustry(e.target.value)}
            placeholder="Describe the kind of company…" />
        </label>

        <div className="field span-2 geo-block">
          <span>Geography <em>(add more than one — any location can match)</em></span>
          {geo.map((g, i) => (
            <div className="geo-row" key={i}>
              <input value={g.city} onChange={(e) => setGeoRow(i, { city: e.target.value })} placeholder="City" />
              <input value={g.state} onChange={(e) => setGeoRow(i, { state: e.target.value.toUpperCase().slice(0, 2) })} placeholder="ST" className="state" maxLength={2} />
              <input value={g.zip} onChange={(e) => setGeoRow(i, { zip: e.target.value.replace(/\D/g, '').slice(0, 5) })} placeholder="ZIP" className="zip" maxLength={5} />
              {geo.length > 1 && (
                <button type="button" className="link-btn" onClick={() => setGeo(geo.filter((_, idx) => idx !== i))}>remove</button>
              )}
            </div>
          ))}
          <button type="button" className="link-btn" onClick={() => setGeo([...geo, { ...EMPTY_GEO }])}>+ add another location</button>
        </div>

        <label className="field">
          <span>Employee count range</span>
          <div className="range-row">
            <input type="number" min="0" value={empMin} onChange={(e) => setEmpMin(e.target.value)} placeholder="min" />
            <span className="range-dash">–</span>
            <input type="number" min="0" value={empMax} onChange={(e) => setEmpMax(e.target.value)} placeholder="max" />
          </div>
          <label className="check"><input type="checkbox" checked={empRough} onChange={(e) => setEmpRough(e.target.checked)} /> roughly — I'm guessing</label>
        </label>

        <label className="field">
          <span>Annual revenue range ($M)</span>
          <div className="range-row">
            <input type="number" min="0" value={revMin} onChange={(e) => setRevMin(e.target.value)} placeholder="min" />
            <span className="range-dash">–</span>
            <input type="number" min="0" value={revMax} onChange={(e) => setRevMax(e.target.value)} placeholder="max" />
          </div>
          <label className="check"><input type="checkbox" checked={revRough} onChange={(e) => setRevRough(e.target.checked)} /> roughly — I'm guessing</label>
        </label>

        <label className="field span-2">
          <span>Specific company <em>(optional — if a target is already in mind)</em></span>
          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company name…" />
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="primary-btn">Find prospects</button>
        {savedSearches.length > 0 && (
          <div className="recent">
            <span>Recent searches:</span>
            {savedSearches.slice(0, 5).map((s) => (
              <button type="button" key={s.ts} className="chip" onClick={() => recall(s)} title={s.label}>
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
