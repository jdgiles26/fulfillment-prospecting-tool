// The criteria assessment: the one place the product pushes back on the
// user before any results are shown.
export default function AssessmentBanner({ assessment }) {
  if (!assessment) return null;
  const gauge =
    assessment.verdict === 'broad' ? { cls: 'gauge-broad', label: 'Too broad' } :
    assessment.verdict === 'narrow' ? { cls: 'gauge-narrow', label: 'Too narrow' } :
    { cls: 'gauge-balanced', label: 'Balanced' };

  return (
    <div className={`assessment ${gauge.cls}`} role="status">
      <div className="gauge">
        <span className="gauge-label">{gauge.label}</span>
        <span className="gauge-count">{assessment.matchCount} of {assessment.universeSize} in universe</span>
      </div>
      <div className="assessment-text">
        <strong>{assessment.headline}</strong>
        <p>{assessment.advice}</p>
        {assessment.unknowns.length > 0 && (
          <p className="unknowns">Left open (treated as "anything"): {assessment.unknowns.join(', ')}.</p>
        )}
      </div>
    </div>
  );
}
