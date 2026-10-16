import { fitBand } from '../lib/engine.js';

// Compact fit indicator used in the results table.
export default function FitMeter({ score }) {
  const band = fitBand(score);
  return (
    <span className={`fit-meter ${band.className}`} title={band.label}>
      <span className="fit-num">{score}</span>
      <span className="fit-band">{band.label}</span>
    </span>
  );
}
